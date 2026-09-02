# 03 - Agent 配置与多 Agent 协作

> 基于官方文档 (opencode.ai/docs/agents)

## Agent 类型

### Primary Agents（主代理）

直接用 Tab 键切换：

| Agent | 模式 | 权限 | 用途 |
|-------|------|------|------|
| Build | primary | 全部工具 | 开发默认代理 |
| Plan | primary | 只读 | 分析和规划，不改代码 |

**Plan 模式** 的默认权限：

```json
{
  "permission": {
    "edit": "deny",
    "bash": "deny"
  }
}
```

### Subagents（子代理）

| Agent | 权限 | 用途 |
|-------|------|------|
| General | 全部工具（除 todo） | 复杂多步任务 |
| Explore | 只读 | 快速代码探索 |
| Scout | 只读 | 外部文档和依赖调研 |

### 隐藏系统 Agent

- **Compaction** — 自动压缩上下文
- **Title** — 自动生成会话标题
- **Summary** — 自动创建会话摘要

## 切换与调用

### 主代理切换

```
<Tab>  在 Build 和 Plan 间切换
```

### 调用子代理

在消息中 `@` 提及：

```
@general 帮我搜索这个函数
@explore 查看 src/api/ 目录结构
```

### 子会话导航

- `Leader + Down` — 进入第一个子会话
- `Right` — 循环到下一个子会话
- `Left` — 循环到上一个子会话
- `Up` — 返回父会话

## JSON 配置

在 `opencode.json` 中配置：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "{file:./prompts/build.txt}",
      "permission": { "edit": "allow", "bash": "allow" }
    },
    "plan": {
      "mode": "primary",
      "model": "anthropic/claude-haiku-4-20250514",
      "permission": { "edit": "deny", "bash": "deny" }
    },
    "code-reviewer": {
      "description": "审查代码最佳实践和潜在问题",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "你是一个代码审查员，关注安全、性能、可维护性。",
      "permission": { "edit": "deny" }
    }
  }
}
```

## Markdown 配置

全局：`~/.config/opencode/agents/`
项目：`.opencode/agents/`

```markdown
---
description: 审查代码质量和最佳实践
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
permission:
  edit: deny
  bash: deny
---
你在代码审查模式中。关注：
- 代码质量和最佳实践
- 潜在 bug 和边界情况
- 性能影响
- 安全考虑
仅提供建设性反馈，不直接修改代码。
```

文件名即为 Agent 名称（`review.md` → `review`）。

## 配置选项详解

| 选项 | 说明 |
|------|------|
| `description` | 必需，Agent 的简短描述 |
| `temperature` | 0-1，0.0-0.2 适合分析，0.3-0.5 通用，0.6+ 创意 |
| `steps` | 最大迭代步数（已废弃：`maxSteps`） |
| `model` | 覆盖此 Agent 的模型 |
| `permission` | 细粒度权限控制 |
| `color` | UI 颜色（hex 或主题色） |
| `top_p` | 0-1，控制响应多样性 |
| `hidden` | 从 @ 自动补全中隐藏 |
| `disable` | 禁用 Agent |

### 额外选项透传

```json
{
  "agent": {
    "deep-thinker": {
      "model": "openai/gpt-5",
      "reasoningEffort": "high",
      "textVerbosity": "low"
    }
  }
}
```

## 创建 Agent

交互式创建：

```bash
opencode agent create
```

非交互式创建：

```bash
opencode agent create \
  --description "安全审计代理" \
  --mode subagent \
  --permissions bash,read,grep \
  --model anthropic/claude-sonnet-4-20250514
```

## 场景示例

### 文档代理

```markdown
---
description: 编写和维护项目文档
mode: subagent
permission:
  bash: deny
---
你是技术写手，创建清晰、全面的文档。
关注：清晰的解释、正确的结构、代码示例、用户友好的语言。
```

### 安全审计代理

```markdown
---
description: 执行安全审计和识别漏洞
mode: subagent
permission:
  edit: deny
---
你是安全专家。关注：
- 输入验证漏洞
- 认证和授权缺陷
- 数据暴露风险
- 依赖漏洞
- 配置安全问题
```