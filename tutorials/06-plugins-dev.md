# 06 - 插件开发

> 基于官方文档 (opencode.ai/docs/plugins)

## 使用插件

### 本地文件

将 `.js` 或 `.ts` 文件放入插件目录：

- 项目级：`.opencode/plugins/`
- 全局级：`~/.config/opencode/plugins/`

### npm 包

```json
{
  "plugin": [
    "opencode-helicone-session",
    "opencode-wakatime",
    "@my-org/custom-plugin"
  ]
}
```

npm 插件在启动时自动使用 Bun 安装，缓存于 `~/.cache/opencode/node_modules/`。

### 加载顺序

1. 全局配置 `~/.config/opencode/opencode.json`
2. 项目配置 `opencode.json`
3. 全局插件目录 `~/.config/opencode/plugins/`
4. 项目插件目录 `.opencode/plugins/`

## 插件结构

```javascript
// .opencode/plugins/example.js
export const MyPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("插件初始化！")
  return {
    // Hook 实现
  }
}
```

### Context 参数

| 参数 | 说明 |
|------|------|
| `project` | 当前项目信息 |
| `directory` | 当前工作目录 |
| `worktree` | git worktree 路径 |
| `client` | OpenCode SDK 客户端 |
| `$` | Bun shell API |

## 依赖管理

在配置目录中创建 `package.json`：

```json
// .opencode/package.json
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

```typescript
// .opencode/plugins/my-plugin.ts
import { escape } from "shescape"
export const MyPlugin = async (ctx) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash") {
        output.args.command = escape(output.args.command)
      }
    }
  }
}
```

## 事件列表

| 类别 | 事件 |
|------|------|
| 命令 | `command.executed` |
| 文件 | `file.edited`, `file.watcher.updated` |
| 安装 | `installation.updated` |
| LSP | `lsp.client.diagnostics`, `lsp.updated` |
| 消息 | `message.part.removed`, `message.part.updated`, `message.removed`, `message.updated` |
| 权限 | `permission.asked`, `permission.replied` |
| 服务器 | `server.connected` |
| 会话 | `session.created`, `session.compacted`, `session.deleted`, `session.diff`, `session.error`, `session.idle`, `session.status`, `session.updated` |
| 待办 | `todo.updated` |
| Shell | `shell.env` |
| 工具 | `tool.execute.after`, `tool.execute.before` |
| TUI | `tui.prompt.append`, `tui.command.execute`, `tui.toast.show` |

## 实战示例

### 通知插件

```javascript
// .opencode/plugins/notification.js
export const NotificationPlugin = async ({ project, client, $, directory, worktree }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "会话完成！" with title "OpenCode"'`
      }
    }
  }
}
```

### .env 保护

```javascript
// .opencode/plugins/env-protection.js
export const EnvProtection = async (ctx) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read" && output.args.filePath.includes(".env")) {
        throw new Error("禁止读取 .env 文件")
      }
    }
  }
}
```

### 注入环境变量

```javascript
export const InjectEnvPlugin = async () => {
  return {
    "shell.env": async (input, output) => {
      output.env.MY_API_KEY = "secret"
      output.env.PROJECT_ROOT = input.cwd
    }
  }
}
```

### 自定义工具

```typescript
// .opencode/plugins/custom-tools.ts
import { type Plugin, tool } from "@opencode-ai/plugin"

export const CustomToolsPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      mytool: tool({
        description: "这是一个自定义工具",
        args: {
          foo: tool.schema.string(),
        },
        async execute(args, context) {
          const { directory, worktree } = context
          return `你好 ${args.foo}，来自 ${directory} (worktree: ${worktree})`
        }
      })
    }
  }
}
```

### 结构化日志

```typescript
export const MyPlugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "my-plugin",
      level: "info",
      message: "插件初始化",
      extra: { foo: "bar" }
    }
  })
}
```

### Compaction Hook

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const CompactionPlugin: Plugin = async (ctx) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      output.context.push(`## 自定义上下文
保留以下状态：
- 当前任务状态
- 重要决策
- 正在修改的文件`)
    }
  }
}
```

替换整个 compaction prompt：

```typescript
export const CustomCompactionPlugin: Plugin = async (ctx) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      output.prompt = `你在为多代理协作会话生成续写提示。
摘要：
1. 当前任务及其状态
2. 正在修改的文件和负责人
3. 阻塞项或依赖
4. 完成工作的下一步
以结构化的方式输出，让新代理能继续工作。`
    }
  }
}
```