# 04 - 多 Provider 配置

> 基于官方文档 (paseo.sh/docs/providers, /docs/supported-providers)

## Paseo 的 Provider 模型

Paseo **不自带 Agent**，它管理你已安装的 Agent CLI。Paseo 通过包装现有 CLI 来调度代理。

支持的 Agent：

- **Claude Code** — Anthropic 的 Claude
- **Codex** — OpenAI 的 Codex
- **GitHub Copilot** — Microsoft 的 Copilot CLI
- **OpenCode** — anomalyco 的 OpenCode
- **Pi** — pi.dev

## Provider 诊断

检查守护进程实际使用的 Provider 环境：

```bash
paseo provider diagnostic claude
paseo provider diagnostic codex --json
paseo provider diagnostic opencode --host devbox:6767
```

诊断包括：配置命令、daemon PATH 和 shell、匹配的二进制文件、解析路径、版本、模型数量、Provider 状态。

## 运行不同 Provider

```bash
# Claude
paseo run --provider claude "实现用户认证"

# Codex
paseo run --provider codex "重构 API 层"

# 指定具体模型
paseo run --provider "claude/opus-4.6" "复杂推理任务"
paseo run --provider "codex/gpt-5.5" "实现功能 X"
```

## 输出模式

```bash
# 等待完成
paseo run --provider codex "运行测试"

# 后台运行
paseo run --background --provider claude "长任务"

# 结构化 JSON 输出
paseo run --output-schema '{"type":"object","properties":{"summary":{"type":"string"}},"required":["summary"]}' \
  --provider claude "总结发布说明"

# 指定工作区和分支
paseo run --provider codex --worktree feature-x "实现功能 X"
```

## 自定义 Provider

对于指向 Claude-compatible 端点的配置（Z.AI、Alibaba/Qwen），多 profile，自定义二进制，ACP Agent 等，见 [Custom Providers](https://github.com/getpaseo/paseo/blob/main/docs/custom-providers.md)。

在 `config.json` 的 `agents.providers` 下添加自定义条目。

## 跨 Provider 对比

| Provider | 强项 | 推荐用途 |
|----------|------|----------|
| Claude Code | 复杂推理、架构设计 | 规划、审查、复杂重构 |
| Codex | 快速编码、代码生成 | 实现功能、写测试 |
| Copilot | 轻量编辑、日常任务 | 快速修改、补全 |
| OpenCode | 终端原生、CLI 友好 | 终端工作流、自动化 |
| Pi | 多步推理 | 复杂分析、研究 |

## 跨 Provider 协作示例

```bash
# Claude 规划 → Codex 实现 → Claude 审查
agent_plan=$(paseo run --background --provider claude --quiet "规划重构方案")
agent_impl=$(paseo run --background --provider codex --quiet --workspace <ws> "实现方案")
paseo wait "$agent_impl"
agent_review=$(paseo run --background --provider claude --quiet --workspace <ws> "审查 diff")
```

更多跨 Provider 编排详见 [05 - 编排](./05-orchestration.md)。