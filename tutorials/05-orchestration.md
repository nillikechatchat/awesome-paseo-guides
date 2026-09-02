# 05 - Agent 编排

> 基于官方文档 (paseo.sh/docs/orchestration)

## 编排概述

Paseo 编排让一个编码代理控制 Paseo daemon。Agent 可以：

- 发现所有已配置的 Provider 和模型
- 创建工作区
- 启动其他 Agent
- 发送后续任务
- 创建 Heartbeat 或 Schedule

## 启用编排工具

在 **Settings → your host → Agents** 中打开 **Enable Paseo tools**。开始新 Agent 或重新加载已有 Agent 使其接收工具。

然后自然语言描述工作流：

```
保持为编排者。使用 Paseo 找到可用的 Codex 模型，
创建工作树隔离的工作区，然后在那里启动 GPT-5.6 子代理。
让它实现解析器变更，运行聚焦测试，然后报告回来。
```

## 原生子代理 vs Paseo 子代理

**最关键区别：Paseo 子代理可以跨 Provider 边界。**

```
Claude Code (Fable 5) => Codex (GPT-5.6)
Codex (GPT-5.6) => Grok Build
Cursor => Claude Code (Fable 5)
```

| 对比 | 原生子代理 | Paseo 子代理 |
|------|----------|-------------|
| Provider | 与父代理相同 | 任何已配置的 Provider |
| 工作目录 | 父 Provider 管理 | 当前或显式选择的工作区 |
| 生命周期 | 父 Provider 拥有 | Paseo 管理，可接收后续任务 |
| 查看 | 只读时间线 | 完整的 Agent 会话 |
| 适用场景 | 快速、Provider 原生委派 | 跨 Provider 工作、显式工作区控制 |

## 子代理的工作流

当 Agent A 创建 Agent B 时：

- 默认：B 成为 A 的子代理，在同一工作区
- 传工作区 ID：B 在指定工作区工作，但父关系不变

```bash
# Agent A 在内部执行：
agent_id=$(paseo run --background --quiet --title api-agent "实现 API")
paseo wait "$agent_id"
paseo logs "$agent_id" --tail 5
```

## Heartbeat 保持 Agent 持续工作

Heartbeat 按 cron 节奏向同一个 Agent 发送 prompt：

```
使用 Paseo 创建每 10 分钟一次的 Heartbeat。
持续检查这个 PR，修复任何新的 CI 失败，
直到所有检查通过或两小时后停止。
```

- **Heartbeat** — 适合 Agent 持续重新评估同一任务的场景
- **Schedule** — 适合独立的 cron 式任务（如每日 Triage）

## CLI 中的多 Agent 编排

### 实现 + 验证循环

```bash
# 需要 jq
while true; do
  paseo run --provider codex --background --quiet "修复测试" >/dev/null

  verdict=$(paseo run --provider claude --output-schema \
    '{"type":"object","properties":{"pass":{"type":"boolean"}},"required":["pass"]}' \
    "确保测试全部通过")

  if echo "$verdict" | jq -e '.pass == true' >/dev/null; then
    echo "测试通过"
    break
  fi
done
```

### 层级任务分解

```bash
# 编排者拆分任务
agent_api=$(paseo run --background --provider codex --title "API agent" "实现 API")
agent_ui=$(paseo run --background --provider claude --title "UI agent" "实现前端")
agent_test=$(paseo run --background --provider codex --title "Test agent" "编写测试")

paseo wait "$agent_api"
paseo wait "$agent_ui"
paseo wait "$agent_test"

# 汇总结果
paseo logs "$agent_api" --tail 10
paseo logs "$agent_ui" --tail 10
paseo logs "$agent_test" --tail 10
```

## Skills

安装 Paseo Skills 让 Agent 使用编排能力：

```bash
npx skills add getpaseo/paseo
```

常用 Skills：

- `/paseo-handoff` — Agent 间交接工作
- `/paseo-advisor` — 启动一个 Advisor 获取第二意见
- `/paseo-committee` — 组建两个对比 Agent 的委员会

## 使用建议

1. **规划用 Claude，实现用 Codex，审查用 Claude** — 发挥每个模型的优势
2. **每个 Agent 独立工作区** — 使用 worktree 隔离避免冲突
3. **用 Heartbeat 处理需要持续关注的任务** — 如 CI 监控
4. **用 Schedule 处理周期性任务** — 如每日代码审查
5. **用 Heartbeat 而非 Schedule 处理需要上下文连续的任务**