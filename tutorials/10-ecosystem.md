# 10 - 社区生态与实战工具

> 基于官方文档 (opencode.ai/docs/ecosystem)

## 社区插件

### 会话与观测

| 插件 | 说明 | 推荐度 |
|------|------|--------|
| `opencode-helicone-session` | 自动注入 Helicone 会话头，分组请求 | ⭐⭐⭐ |
| `opencode-wakatime` | 用 Wakatime 跟踪使用时间 | ⭐⭐⭐ |
| `opencode-sentry-monitor` | 用 Sentry 追踪 AI Agent | ⭐⭐⭐ |

```bash
npm install -g opencode-helicone-session
```

```json
{ "plugin": ["opencode-helicone-session"] }
```

### 认证与订阅

| 插件 | 说明 |
|------|------|
| `opencode-openai-codex-auth` | 使用 ChatGPT Plus/Pro 订阅 |
| `opencode-gemini-auth` | 使用已有 Gemini 计划 |
| `opencode-antigravity-auth` | 使用 Antigravity 免费模型 |

### 工作区与 Git

| 插件 | 说明 |
|------|------|
| `opencode-worktree` | 零摩擦 git worktrees |
| `opencode-devcontainers` | 多分支 devcontainer 隔离 |

### 搜索与联网

| 插件 | 说明 |
|------|------|
| `opencode-firecrawl` | 网页抓取、爬取、搜索 |
| `opencode-tavily` | 深度研究、网页搜索 |
| `opencode-websearch-cited` | 原生引用搜索 |

### 编辑加速

| 插件 | 说明 |
|------|------|
| `opencode-morph-plugin` | 10x 更快的代码编辑 |
| `opencode-morph-fast-apply` | 快速 Apply 和 WarpGrep |
| `opencode-type-inject` | 自动注入 TS/Svelte 类型 |

### 工作流编排

| 插件 | 说明 |
|------|------|
| `opencode-conductor` | Context→Spec→Plan→Implement 协议 |
| `opencode-background-agents` | 后台代理，异步委派 |
| `opencode-workspace` | 16 组件多代理编排框架 |
| `opencode-scheduler` | cron 定时任务（launchd/systemd） |
| `opencode-goal-plugin` | 目标驱动工作流 |

### 通知

| 插件 | 说明 |
|------|------|
| `opencode-notificator` | 桌面通知和声音提醒 |
| `opencode-notifier` | 权限/完成/错误事件通知 |
| `opencode-notify` | 原生 OS 通知 |

## 社区项目

| 项目 | 说明 |
|------|------|
| [kimaki](https://github.com/remorses/kimaki) | Discord 机器人控制 OpenCode |
| [opencode.nvim](https://github.com/NickvanDyke/opencode.nvim) | Neovim 插件 |
| [portal](https://github.com/hosenur/portal) | 移动端 Web UI（通过 Tailscale/VPN） |
| [OpenChamber](https://github.com/btriapitsyn/openchamber) | Web/Desktop + VS Code 扩展 |
| [OpenWork](https://github.com/different-ai/openwork) | Claude Cowork 的开源替代 |
| [CodeNomad](https://github.com/NeuralNomadsAI/CodeNomad) | 桌面/Web/移动端 |
| [ocx](https://github.com/kdcokenny/ocx) | 扩展管理器，可移植隔离 profile |
| [OpenCode-Obsidian](https://github.com/mtymek/opencode-obsidian) | Obsidian 插件 |
| [ai-sdk-provider-opencode-sdk](https://github.com/ben-varges/ai-sdk-provider-opencode-sdk) | Vercel AI SDK Provider |

## 社区索引

| 资源 | 说明 |
|------|------|
| [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) | 精选工具、插件和资源列表 |
| [opencode.cafe](https://opencode.cafe) | 社区聚合生态 |
| [Discord](https://opencode.ai/discord) | 实时社区支持 |

## 实战场景组合

### 场景一：安全审计工作流

```json
{
  "agent": {
    "security-audit": {
      "description": "全面安全审计",
      "mode": "subagent",
      "permission": { "edit": "deny" }
    }
  },
  "plugin": ["opencode-vibeguard"],
  "mcp": {
    "sentry": { "type": "remote", "url": "https://mcp.sentry.dev/mcp", "oauth": {} }
  }
}
```

### 场景二：高效开发环境

```json
{
  "plugin": [
    "opencode-morph-plugin",
    "opencode-wakatime",
    "opencode-helicone-session"
  ],
  "agent": {
    "build": {
      "model": "opencode/gpt-5.1-codex",
      "permission": { "edit": "allow", "bash": "allow" }
    },
    "plan": {
      "model": "anthropic/claude-haiku-4-20250514"
    }
  }
}
```

### 场景三：后台自动化

```bash
# 安装调度插件
npm install -g opencode-scheduler

# 使用后台代理
npm install -g opencode-background-agents
```

```json
{
  "plugin": ["opencode-scheduler", "opencode-background-agents"],
  "permission": {
    "task": { "orchestrator-*": "allow" }
  }
}
```