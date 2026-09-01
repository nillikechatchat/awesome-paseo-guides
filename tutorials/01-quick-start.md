# 01 - 快速开始：创建你的第一个代理

## 前置条件

- 已安装 Paseo CLI（`paseo --version` 验证）
- 已配置至少一个 LLM Provider

## 步骤

### 1. 创建项目

```bash
paseo project create /path/to/your/code
```

这会告诉 Paseo daemon 管理哪个代码仓库。

### 2. 创建工作区

Paseo 支持两种隔离模式：

- **local** — 直接使用本机目录
- **worktree** — 基于 git worktree 创建隔离分支

```bash
paseo workspace create \
  --isolation worktree \
  --mode branch-off \
  --new-branch feat-my-task \
  --base main
```

返回的 `workspaceId` 后面会用到。

### 3. 运行第一个代理

```bash
paseo run \
  --provider codex/gpt-5.4 \
  --mode full-access \
  --workspace <workspace-id> \
  "阅读 README.md 并总结项目结构"
```

### 4. 查看代理状态

```bash
paseo ls
```

### 关键概念

- 代理运行是**异步**的，10-30 分钟是正常等待时间
- 任务完成后会通过通知告知结果，不需要轮询
- `notifyOnFinish` 默认开启，收到通知后再查看结果

## 下一步

- 继续学习：[02 - 工作区编排](./02-workspaces.md)