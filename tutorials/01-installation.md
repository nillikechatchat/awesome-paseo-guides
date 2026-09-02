# 01 - 安装与首次启动

> 基于 OpenCode 官方文档 (opencode.ai/docs)

## 安装方式

### 一键安装脚本（推荐）

```bash
curl -fsSL https://opencode.ai/install | bash
```

### npm 安装

```bash
npm install -g opencode-ai
# 或
bun install -g opencode-ai
pnpm install -g opencode-ai
yarn global add opencode-ai
```

### Homebrew (macOS/Linux)

```bash
brew install anomalyco/tap/opencode
```

### Arch Linux

```bash
sudo pacman -S opencode
paru -S opencode-bin
```

### Docker

```bash
docker run -it --rm ghcr.io/anomalyco/opencode
```

### Windows

推荐使用 WSL：

```bash
# Chocolatey
choco install opencode

# Scoop
scoop install opencode

# npm
npm install -g opencode-ai

# Mise
mise use -g github:anomalyco/opencode
```

## 配置 Provider

使用 `/connect` 命令配置 LLM Provider：

```
/connect
```

### 快速开始：OpenCode Zen

Zen 是 OpenCode 官方验证过的模型集合：

1. 在 `/connect` 中选择 `OpenCode Zen`
2. 前往 https://opencode.ai/auth 注册并获取 API Key
3. 粘贴 API Key
4. 运行 `/models` 查看可用模型

### 快速开始：OpenCode Go

$10/月的订阅方案，提供可靠的开源模型访问：

```
/connect  → 选择 OpenCode Go  →  完成注册
```

## 初始化项目

```bash
cd /path/to/your-project
opencode
/init
```

`/init` 会扫描你的项目并生成 `AGENTS.md`，包含：

- 构建、lint、测试命令
- 项目结构说明
- 代码规范

> 建议将 `AGENTS.md` 提交到 Git。

## 核心 TUI 操作

### 切换 Agent

按 `Tab` 键在 Build 和 Plan 模式间切换：

- **Build 模式** — 完整的开发能力
- **Plan 模式** — 只分析不改代码

### 文件引用

按 `@` 键模糊搜索文件，直接在 prompt 中引用：

```
如何理解 @src/api/auth.ts 中的认证逻辑
```

### 撤销和重做

```
/undo    # 撤销最近的更改
/redo    # 重做撤销的更改
```

### 分享会话

```
/share
```

生成可分享的会话链接。

## 验证安装

```bash
opencode --version
opencode models --verbose
opencode stats --days 7
```

## 进阶配置

### opencode.json 配置

全局配置路径：`~/.config/opencode/opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode/gpt-5.1-codex",
  "theme": "opencode",
  "auto_share": false
}
```

### 环境变量

```bash
export OPENCODE_CONFIG=~/my-custom/opencode.json
export OPENCODE_AUTO_SHARE=true
export OPENCODE_DISABLE_CLAUDE_CODE=1
```

完整环境变量列表见 `opencode --help` 或 [CLI 文档](https://opencode.ai/docs/cli)。