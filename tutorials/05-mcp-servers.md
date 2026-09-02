# 05 - MCP 服务器

> 基于官方文档 (opencode.ai/docs/mcp-servers)

## 概述

MCP (Model Context Protocol) 让 OpenCode 使用外部工具。**注意**：MCP 服务器会添加到上下文，大量工具会消耗大量 token。

## 启用 MCP

在 `opencode.json` 中配置：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-server": {
      "type": "local",
      "command": ["npx", "-y", "my-mcp-command"],
      "enabled": true
    }
  }
}
```

临时禁用：`"enabled": false`

## 本地 MCP

```json
{
  "mcp": {
    "mcp_everything": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
      "environment": {
        "MY_ENV_VAR": "value"
      },
      "timeout": 5000
    }
  }
}
```

### 本地配置选项

| 选项 | 类型 | 说明 |
|------|------|------|
| `type` | `"local"` | 连接类型 |
| `command` | Array | 启动命令和参数 |
| `cwd` | String | 工作目录 |
| `environment` | Object | 环境变量 |
| `enabled` | Boolean | 是否启用 |
| `timeout` | Number | 超时 (ms)，默认 5000 |

## 远程 MCP

```json
{
  "mcp": {
    "my-remote": {
      "type": "remote",
      "url": "https://my-mcp-server.com",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer MY_API_KEY"
      }
    }
  }
}
```

### 远程配置选项

| 选项 | 类型 | 说明 |
|------|------|------|
| `type` | `"remote"` | 连接类型 |
| `url` | String | 服务器 URL |
| `enabled` | Boolean | 是否启用 |
| `headers` | Object | 请求头 |
| `oauth` | Object | OAuth 配置 |
| `timeout` | Number | 超时 (ms) |

## OAuth 认证

### 自动 OAuth（推荐）

```json
{
  "mcp": {
    "my-oauth": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp"
    }
  }
}
```

首次使用时会自动触发 OAuth 流程。

### 预注册客户端

```json
{
  "mcp": {
    "my-oauth": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "{env:MY_MCP_CLIENT_ID}",
        "clientSecret": "{env:MY_MCP_CLIENT_SECRET}",
        "scope": "tools:read tools:execute"
      }
    }
  }
}
```

### 禁用 OAuth

```json
{
  "mcp": {
    "my-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

### 管理 OAuth

```bash
opencode mcp auth my-server     # 手动认证
opencode mcp auth list          # 查看 OAuth 状态
opencode mcp logout my-server   # 移除凭据
opencode mcp debug my-server    # 调试连接问题
```

## 管理 MCP 工具

### 全局禁用

```json
{
  "mcp": {
    "my-mcp-foo": { "type": "local", "command": ["bun", "x", "cmd"] }
  },
  "tools": {
    "my-mcp-foo": false
  }
}
```

### Glob 禁用全部

```json
{ "tools": { "my-mcp*": false } }
```

### 按 Agent 启用

```json
{
  "mcp": { "my-mcp": { "type": "local", "command": ["bun", "x", "cmd"], "enabled": true } },
  "tools": { "my-mcp*": false },
  "agent": {
    "my-agent": {
      "tools": { "my-mcp*": true }
    }
  }
}
```

MCP 工具以服务器名为前缀注册，所以 `"mymcp_*": false` 可禁用单个服务器的所有工具。

## 实战示例

### Sentry MCP

```json
{
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

```bash
opencode mcp auth sentry
```

```
查看我项目中的最新未解决问题，使用 sentry
```

### Context7 (文档搜索)

```json
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

### Grep by Vercel (GitHub 代码搜索)

```json
{
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

在 AGENTS.md 中配置：

```markdown
如果你不确定怎么做某事，使用 `gh_grep` 搜索 GitHub 上的代码示例。
```