# 04 - 权限管理

> 基于官方文档 (opencode.ai/docs/permissions)

## 权限动作

| 动作 | 说明 |
|------|------|
| `"allow"` | 无需审批直接执行 |
| `"ask"` | 执行前提示审批 |
| `"deny"` | 阻止执行 |

## 全局配置

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "*": "ask",
    "bash": "allow",
    "edit": "deny"
  }
}
```

或一刀切：

```json
{ "permission": "allow" }
```

## 细粒度规则

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm *": "deny",
      "grep *": "allow"
    },
    "edit": {
      "*": "deny",
      "packages/web/src/content/docs/*.mdx": "allow"
    }
  }
}
```

**规则评估顺序**：最后匹配的规则获胜。将 `"*"` 通配放在最前面，具体规则放在后面。

## 通配符语法

| 模式 | 说明 |
|------|------|
| `*` | 匹配零个或多个任意字符 |
| `?` | 匹配恰好一个字符 |

## 外部目录

```json
{
  "permission": {
    "external_directory": {
      "~/projects/personal/**": "allow"
    }
  }
}
```

### 同时限制编辑

```json
{
  "permission": {
    "external_directory": {
      "~/projects/personal/**": "allow"
    },
    "edit": {
      "~/projects/personal/**": "deny"
    }
  }
}
```

## Auto Mode

```bash
opencode --auto
# 或
opencode run --auto "重构这个模块"
```

Auto 模式下，未被明确 `deny` 的权限会自动通过。TUI 中可通过命令面板切换。

## 可用权限键

| 键 | 控制内容 |
|----|----------|
| `read` | 读取文件 |
| `edit` | 所有文件修改（write/edit/patch） |
| `glob` | 文件 glob |
| `grep` | 内容搜索 |
| `bash` | 运行 shell 命令 |
| `task` | 启动子代理 |
| `skill` | 加载技能 |
| `lsp` | LSP 查询 |
| `question` | 向用户提问 |
| `webfetch` | 抓取 URL |
| `websearch` | 网络搜索 |
| `external_directory` | 触及工作目录外路径 |
| `doom_loop` | 同工具调用重复 3 次相同输入 |

## 默认值

- 大多数权限默认为 `"allow"`
- `doom_loop` 和 `external_directory` 默认为 `"ask"`
- `.env` 文件默认 `deny`，`.env.example` 默认 `allow`

## "Ask" 的三种回应

当 OpenCode 提示审批时：

- **once** — 仅批准本次请求
- **always** — 批准匹配模式的后续请求（本次会话内）
- **reject** — 拒绝请求

## Agent 级覆盖

Agent 权限与全局配置合并，Agent 规则优先：

```json
{
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "git commit *": "deny",
      "git push *": "deny",
      "grep *": "allow"
    }
  },
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "*": "ask",
          "git *": "allow",
          "git commit *": "ask",
          "git push *": "deny",
          "grep *": "allow"
        }
      }
    }
  }
}
```

Markdown Agent 中配置：

```markdown
---
description: 代码审查
mode: subagent
permission:
  edit: deny
  bash: ask
  webfetch: deny
---
只分析代码，建议修改，不直接更改。
```