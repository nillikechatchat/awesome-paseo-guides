# 01 - 安装与首次启动

> 基于 Paseo 官方文档 (paseo.sh/docs)

## Paseo 是什么

Paseo 是一个**本地守护进程（daemon）**，在你自己的机器上运行和编排多个编码代理（Claude Code、Codex、Copilot、OpenCode、Pi）。通过桌面端、移动端、网页和 CLI 统一管理。

核心特点：

- **Self-hosted** — 代理在你的机器上运行，使用你的完整开发环境
- **Multi-provider** — 通过统一界面管理 Claude Code、Codex、Copilot、OpenCode、Pi
- **Voice control** — 语音输入任务和对话
- **Cross-device** — iOS、Android、Desktop、Web、CLI
- **Privacy-first** — 无遥测、无跟踪、无强制登录

## 前提条件

你需要至少安装一个 Agent CLI：

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Codex](https://github.com/openai/codex)
- [GitHub Copilot](https://github.com/features/copilot/cli/)
- [OpenCode](https://github.com/anomalyco/opencode)
- [Pi](https://pi.dev)

建议同时安装 [GitHub CLI](https://cli.github.com/) (`gh`) 并登录。

## 安装方式

### 桌面应用（推荐）

从 [paseo.sh/download](https://paseo.sh/download) 或 [GitHub Releases](https://github.com/getpaseo/paseo/releases) 下载。打开即可，守护进程自动启动，无需额外安装。

首次启动后，用手机扫码配对：Settings → your host → Pair Device。

### CLI / 无头模式

```bash
npm install -g @getpaseo/cli
paseo
```

Paseo 启动守护进程，然后询问是否启用端到端加密中继用于设备配对。如果拒绝，可通过 TCP、Tailscale 或 VPN 直接连接。适合服务器和远程机器。

### Docker

```bash
docker run -d --name paseo \
  -p 6767:6767 \
  -e PASEO_PASSWORD=change-me \
  -v "$PWD/paseo-home:/home/paseo" \
  -v "$PWD:/workspace" \
  ghcr.io/getpaseo/paseo:latest
```

访问 `http://localhost:6767`。镜像包含守护进程和网页 UI，不包含 Agent CLI，需自行扩展。

## 守护进程管理

```bash
paseo daemon start             # 启动守护进程
paseo daemon start --web-ui    # 启动并服务网页 UI
paseo daemon status            # 检查状态
paseo daemon restart           # 重启
paseo daemon stop              # 停止
paseo reload                   # 重载配置（无需重启）
```

## 配置文件

配置位于 `~/.paseo/config.json`，可通过 `PASEO_HOME` 环境变量修改：

```json
{
  "$schema": "https://paseo.sh/schemas/paseo.config.v1.json",
  "version": 1,
  "daemon": {
    "listen": "127.0.0.1:6767",
    "hostnames": ["localhost", ".localhost"],
    "mcp": { "enabled": true }
  }
}
```

修改后执行 `paseo reload` 应用。部分配置需要重启（如监听地址、密码、中继设置）。

## 首次运行 Agent

```bash
# 运行默认 Agent
paseo run "分析这个项目的结构"

# 指定 Provider
paseo run --provider claude "实现用户认证"
paseo run --provider codex "重构 API 层"

# 后台运行
paseo run --background "运行测试套件"

# 列表和附加
paseo ls                         # 列运行中的 Agent
paseo attach abc123              # 流式输出
paseo send abc123 "再加测试"    # 发送后续任务
paseo stop abc123                # 停止 Agent
```