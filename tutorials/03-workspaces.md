# 03 - 工作区与工作树

> 基于官方文档 (paseo.sh/docs/workspaces, /docs/worktrees)

## 核心模型

Paseo 以**工作区**为核心，而非聊天记录。

```
Project（项目）
├── Workspace（工作区）
│   ├── Session 1（Agent 会话）
│   ├── Session 2（另一个 Agent）
│   ├── Terminal
│   └── Browser
├── Workspace
│   └── Session 1
```

### Projects 包含 Workspaces

一个项目可以是一个 git 仓库、GitHub 项目或守护进程机器上的任何目录。

```bash
cd ~/dev/my-app
paseo project create         # 注册当前目录为项目
paseo project ls             # 列出所有项目
paseo project rename <id> "My App"
paseo project delete <id>    # 归档工作区但不删除目录
```

### Workspaces 包含 Sessions

Agent 在工作区内作为 Session 运行。一个工作区可以同时有多个 Agent Session、终端、浏览器窗口。

## 创建工作区

### Local 模式

使用已有目录，适合会话共享同一文件系统。

```bash
paseo workspace create \
  --isolation local \
  --path ~/dev/my-app \
  --title main
```

### Worktree 模式

创建独立的 git worktree，适合任务需要独立目录和分支。

```bash
# Branch-off 模式
paseo workspace create \
  --isolation worktree \
  --mode branch-off \
  --new-branch feature/auth \
  --worktree-slug feature-auth \
  --base origin/main

# Checkout 已有分支
paseo workspace create \
  --isolation worktree \
  --mode checkout-branch \
  --branch feature/existing \
  --worktree-slug existing-copy

# 打开 PR
paseo workspace create \
  --isolation worktree \
  --mode checkout-pr \
  --pr-number 2186
```

### 在运行 Agent 时创建

```bash
paseo run \
  --new-workspace worktree \
  --worktree-mode branch-off \
  --new-branch feature/auth \
  --base origin/main \
  "实现用户认证"
```

## 工作区管理

```bash
paseo workspace ls                               # 列出
paseo run --workspace <workspace-id> "实现功能"  # 指定工作区运行
paseo workspace rename <id> "Auth rework"       # 重命名
paseo workspace archive <id>                     # 归档
```

## paseo.json 配置

在仓库根目录放置 `paseo.json`，Paseo 从你选择的 base 分支的已提交版本读取：

```json
{
  "worktree": {
    "setup": "npm ci\ncp \"$PASEO_SOURCE_CHECKOUT_PATH/.env\" .env",
    "teardown": "rm -rf .cache"
  },
  "scripts": {
    "test": { "command": "npm test" },
    "web": {
      "type": "service",
      "command": "npm run dev -- --port $PASEO_PORT",
      "port": 3000
    }
  },
  "worktree": {
    "terminals": [
      { "name": "logs", "command": "tail -f dev.log" }
    ]
  }
}
```

## Setup 和 Teardown

`setup` 在工作树创建后运行一次。`teardown` 在归档时运行：

```json
{
  "worktree": {
    "setup": "npm ci\ncp \"$PASEO_SOURCE_CHECKOUT_PATH/.env\" .env\nnpm run db:migrate",
    "teardown": "npm run db:drop || true"
  }
}
```

命令在工作树作为 `cwd` 运行。`$PASEO_SOURCE_CHECKOUT_PATH` 可访问原始检查出的文件。

## Scripts 和 Services

### Plain Scripts

```json
{
  "scripts": {
    "test": { "command": "npm test" },
    "lint": { "command": "npm run lint" }
  }
}
```

```bash
paseo script ls
paseo script start web
paseo script stop web
```

### Services

标记为 `type: "service"` 的脚本由 Paseo 作为长驻进程管理：

```json
{
  "scripts": {
    "web": {
      "type": "service",
      "command": "npm run dev -- --port $PASEO_PORT",
      "port": 3000
    }
  }
}
```

Paseo 自动分配端口并反向代理 HTTP 流量：

```
http://web--my-app.localhost:6767
```

### 服务间通信

同一工作区的服务通过环境变量互相发现：

```
PASEO_PORT=3000
PASEO_URL=http://web--my-app.localhost:6767
PASEO_SERVICE_API_PORT=51732
PASEO_SERVICE_API_URL=http://api--my-app.localhost:6767
```

## 端口分配

```json
// ~/.paseo/config.json
{
  "worktrees": {
    "servicePorts": { "range": "3000-4000" }
  }
}
```

或使用外部分配器：

```json
{
  "worktree": {
    "servicePorts": { "portScript": "/usr/bin/portmake" }
  }
}
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `$PASEO_SOURCE_CHECKOUT_PATH` | 原始仓库根目录 |
| `$PASEO_WORKTREE_PATH` | 工作树目录 |
| `$PASEO_BRANCH_NAME` | 工作树分支名 |
| `$PASEO_PORT` | 服务分配的端口 |
| `$PASEO_URL` | 服务的代理 URL |
| `$PASEO_SERVICE_<NAME>_PORT` | 同工作区其他服务的端口 |
| `$PASEO_SERVICE_<NAME>_URL` | 同工作区其他服务的代理 URL |