# 01 · Provider / 模型选用与报错

## 1. Codex 二次启动 MCP namespace 冲突 `[经验]`

**症状**:Codex agent 第一次启动正常,第二次 `send_agent_prompt` 后报 MCP namespace 冲突,且进程残留。

**日志特征**:
```
MCP namespace conflict detected, refusing to inject
codex app-server (pid 12345) still running
```

**根因**:Paseo daemon 把自己的 MCP server 注入到子 agent,与 Codex 已有的 MCP 配置命名空间冲突;且 Codex app-server 退出后进程不被回收。

**解法**:
```bash
pkill -f "codex app-server"
# ~/.paseo/config.json
#   daemon.mcp.injectIntoAgents = false
paseo reload
```

**关联坑**:见 03-#1 —— 该配置修复可能被 daemon 重新写回 `true`,需复查。

## 2. Codex 0.149+ 报 wire_api 错误 `[经验]`

**症状**:Codex 升级到 0.149 后启动即报 wire_api 不匹配。

**根因**:新版默认 wire_api 变更,`~/.codex/config.toml` 需要显式指定。

**解法**:`~/.codex/config.toml` 写入 `wire_api = "responses"` 后 `paseo reload`。

## 3. OpenCode(mimo-v2.5-free)整体不可用 `[经验]`

**症状**:模型启动后立即 error,任务无法执行。

**结论**:2026-08-29 实测不可用,**不要用于生产任务**。若见 `OpenCode event stream connection failed; retrying` 持续刷屏(日志 181 次),即为该 provider 或其上游 API 失联。

## 4. Pi + gpt-4o / gpt-4o-mini 启动即 error `[经验][推测]`

**症状**:`pi/openai/gpt-4o` 与 `gpt-4o-mini` 都立即进 error 状态。

**推测根因**:Pi 的 OpenAI 兼容层对 image/多模态字段处理有问题,或 API key 未配置。

**绕过**:多模态任务改用其他 provider;日常用 `pi/agnes-2.5-flash`(已验证稳定)。

## 5. OpenCode 请求打到 api.openai.com 失败 `[日志]`

**日志**(结构化生成分支命名时):
```
Cannot connect to API: Unable to connect.
url: https://api.openai.com/v1/responses
```
daemon 会自动 fallback 到 claude provider 完成(`Structured generation: succeeded after fallback`),任务不中断,但若 OpenCode 是主力 provider 会持续产生此错误。

**根因**:OpenCode 未配置国内可达的 API 端点,默认走 openai.com。

## 6. Claude agent 关闭时报 "ProcessTransport is not ready for writing" `[日志]`(29 次)

**症状**:关闭 Claude 会话时 daemon 日志刷 `Claude query operation did not settle cleanly`。

**影响**:仅噪音,会话数据已落盘,不影响功能;但伴随的 `Claude runtime exited unexpectedly`(10 次)如果出现在任务中途,说明 Claude CLI 崩了,需重发任务。

## 7. Codex / Pi RPC 进程 SIGTERM 后不退出 `[日志]`

```
Codex app-server did not exit after SIGTERM; sending SIGKILL   (13 次)
OMP RPC process did not exit after SIGTERM; sending SIGKILL    (11 次)
Pi RPC process did not exit after SIGTERM; sending SIGKILL     (6 次)
```

**影响**:daemon 会补 SIGKILL,通常自愈;但频繁出现说明子进程退出路径有问题,残留进程会累积内存(见 02-#1 同类问题)。

## 8. Provider 选型速查(已验证) `[经验]`

| 任务 | Provider/模型 | 备注 |
|---|---|---|
| 深度规划/根因分析 | minimax-claude/MiniMax-M3 + plan 模式 | thinking=high |
| 日常编码 | codex/Minimax-m3 | 速度/质量平衡 |
| 跑腿/翻译/grep | pi/agnes-2.5-flash | 最便宜稳定 |
| 中文重推理 | glm-acp-agent/glm-5.2 | thinking 计费贵,慎用 |
| ~~OpenCode~~ | ~~mimo-v2.5-free~~ | 不可用,见 #3 |
| ~~Pi + gpt-4o~~ | — | error 高,见 #4 |

**教训**:新 provider 接入先发单轮冒烟测试,不要直接上多轮生产任务。
