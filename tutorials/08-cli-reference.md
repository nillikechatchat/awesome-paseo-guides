# 08 - CLI 命令参考

> 基于官方文档 (opencode.ai/docs/cli)

## 快速参考

| 命令 | 说明 |
|------|------|
| `opencode` | 启动 TUI |
| `opencode run <prompt>` | 非交互运行 |
| `opencode agent create` | 创建 Agent |
| `opencode agent list` | 列出 Agent |
| `opencode models` | 列出可用模型 |
| `opencode auth login` | 登录 Provider |
| `opencode stats` | 使用统计 |
| `opencode session list` | 列出会话 |
| `opencode export [id]` | 导出会话 |
| `opencode import <file>` | 导入会话 |
| `opencode serve` | 启动 HTTP 服务器 |
| `opencode web` | 启动 Web 界面 |
| `opencode pr <number>` | 检出 PR 并运行 |
| `opencode plugin <module>` | 安装插件 |
| `opencode upgrade` | 升级 |
| `opencode uninstall` | 卸载 |

## opencode run（非交互模式）

```bash
# 基本用法
opencode run "解释 JavaScript 闭包的工作原理"

# 指定模型
opencode run --model anthropic/claude-sonnet-4-20250514 "解释 async/await"

# 附加文件
opencode run --file ./src/index.ts "审查这个文件"

# JSON 输出
opencode run --format json "解释 React hooks"

# 连接已有服务器（避免 MCP 冷启动）
opencode serve &
opencode run --attach http://localhost:4096 "Explain closures"

# 自动批准权限
opencode run --auto "重构这个模块"

# 指定 Agent
opencode run --agent plan "分析这个架构"
```

### 主要参数

| 参数 | 简写 | 说明 |
|------|------|------|
| `--command` | | 使用 message 作为参数 |
| `--continue` | `-c` | 继续上次会话 |
| `--session` | `-s` | 继续指定会话 |
| `--fork` | | Fork 会话 |
| `--share` | | 分享会话 |
| `--model` | `-m` | 使用 `provider/model` 格式 |
| `--agent` | | 使用指定 Agent |
| `--file` | `-f` | 附加文件 |
| `--format` | | default 或 json |
| `--title` | | 会话标题 |
| `--attach` | | 连接已有服务器 |
| `--port` | | 本地服务器端口 |
| `--variant` | | 模型变体 |
| `--thinking` | | 显示思考过程 |
| `--auto` | | 自动批准权限 |

## opencode serve / web

```bash
# 启动 HTTP API 服务器
opencode serve --port 4096

# 启动 Web 界面
opencode web --port 4096 --hostname 0.0.0.0

# 启用基本认证
export OPENCODE_SERVER_PASSWORD=secret
export OPENCODE_SERVER_USERNAME=admin
opencode web

# 启用 mDNS 发现
opencode web --mdns --mdns-domain myapp

# 附加 TUI 到已有服务器
opencode attach http://10.20.30.40:4096
```

## opencode agent

```bash
# 交互式创建
opencode agent create

# 非交互式创建
opencode agent create \
  --description "安全审计" \
  --mode subagent \
  --permissions bash,read,grep \
  --model anthropic/claude-sonnet-4-20250514

# 列出
opencode agent list
```

## opencode mcp

```bash
opencode mcp add           # 添加 MCP 服务器
opencode mcp list          # 列出已配置的 MCP
opencode mcp auth <name>   # 认证
opencode mcp auth list     # 查看 OAuth 状态
opencode mcp logout <name> # 移除凭据
opencode mcp debug <name>  # 调试
```

## opencode session

```bash
opencode session list --max-count 10   # 最近 10 个会话
opencode session list --format json    # JSON 格式
opencode session delete <sessionID>    # 删除会话
```

## opencode stats

```bash
opencode stats                    # 全部统计
opencode stats --days 7           # 最近 7 天
opencode stats --models           # 显示模型使用分解
opencode stats --tools 10         # 前 10 个工具使用
```

## opencode export / import

```bash
opencode export [sessionID]        # 导出为 JSON
opencode export --sanitize         # 脱敏导出

# 导入
opencode import session.json
opencode import https://opncd.ai/s/abc123
```

## opencode github

```bash
opencode github install    # 安装 GitHub Agent
opencode github run        # 运行（通常在 GitHub Actions 中）
opencode github run --event <type> --token <PAT>
```

## 全局参数

```bash
opencode --help                 # 帮助
opencode --version              # 版本
opencode --print-logs           # 打印日志到 stderr
opencode --log-level DEBUG      # 日志级别
opencode --pure                 # 禁用外部插件
```

## 重要环境变量

| 变量 | 说明 |
|------|------|
| `OPENCODE_CONFIG` | 配置文件路径 |
| `OPENCODE_AUTO_SHARE` | 自动分享会话 |
| `OPENCODE_SERVER_PASSWORD` | HTTP 基本认证密码 |
| `OPENCODE_DISABLE_PRUNE` | 禁用自动清理旧数据 |
| `OPENCODE_DISABLE_AUTOCOMPACT` | 禁用自动上下文压缩 |
| `OPENCODE_DISABLE_CLAUDE_CODE` | 禁用 Claude Code 兼容 |
| `OPENCODE_ENABLE_EXA` | 启用 Exa 搜索 |
| `OPENCODE_EXPERIMENTAL_WORKSPACES` | 启用工作区支持 |