# 实践心得 02 - 工作区隔离的最佳实践

## 为什么需要隔离

工作区隔离避免了不同任务之间的相互干扰。一开始我用同一个 local workspace 跑所有任务，导致：

- 代理 A 修改了代理 B 正在读的文件
- 构建产物冲突
- 测试环境被污染

## 推荐方案

### 短任务 → worktree + branch-off

```bash
paseo workspace create \
  --isolation worktree \
  --mode branch-off \
  --new-branch task-$(date +%s)
```

每个任务独立分支，互不影响。

### 长期项目 → 独立 git 仓库

对于跨天运行的任务，建议用独立仓库，避免主分支被意外影响。

### PR 审阅 → checkout-pr

```bash
paseo workspace create \
  --isolation worktree \
  --mode checkout-pr \
  --pr-number 42
```

审阅任务直接基于 PR 分支，不需要额外 merge。

## 清理策略

```bash
# 每天清理已归档的工作区
paseo workspace archive <completed-workspace-id>
```

保持工作区数量在合理范围内（建议不超过 10 个活跃工作区）。