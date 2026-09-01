# 02 - 工作区编排：管理代码执行环境

## 工作区模式对比

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `branch-off` | 基于主分支创建新分支 | 新功能开发 |
| `checkout-branch` | 检出已有分支 | 修复合并任务 |
| `checkout-pr` | 检出 PR/变更请求 | PR 审阅 |

## 常用命令

### 创建 branch-off 工作区

```bash
paseo workspace create \
  --isolation worktree \
  --mode branch-off \
  --new-branch feat-x \
  --base main
```

### 创建 checkout-branch 工作区

```bash
paseo workspace create \
  --isolation worktree \
  --mode checkout-branch \
  --branch existing-work
```

### 创建 checkout-pr 工作区

```bash
paseo workspace create \
  --isolation worktree \
  --mode checkout-pr \
  --pr-number 42
```

### 列出工作区

```bash
paseo workspace ls
```

### 归档工作区

```bash
paseo workspace archive <workspace-id>
```

归档后 agent 和 terminal 一并归档，但本地目录保留。

## 最佳实践

- 每个任务使用独立工作区，避免相互干扰
- 完成后归档不用的工作区，保持整洁
- 对于长期任务使用 `worktree` 模式，支持并行开发

## 下一步

- 继续学习：[03 - 多代理协作与任务委派](./03-agents.md)