# 03 - 多代理协作与任务委派

## 创建子代理

在已有 workspace 中创建子代理：

```bash
paseo run \
  --provider codex/gpt-5.4 \
  --workspace <workspace-id> \
  "分析 src/ 目录下的组件结构"
```

## 发送后续指令

任务执行过程中或完成后，可以向代理发送 follow-up：

```bash
paseo send <agent-id> "同时检查这些组件是否有未处理的 TODO"
```

## 并行多代理

将一个复杂任务拆成多个子代理并行执行：

```bash
# 代理 1：分析代码结构
paseo run --provider codex/gpt-5.4 --workspace <ws1> "分析 src/ 目录"

# 代理 2：检查测试覆盖率
paseo run --provider codex/gpt-5.4 --workspace <ws2> "检查 test/ 目录的覆盖率"

# 代理 3：审查文档
paseo run --provider codex/gpt-5.4 --workspace <ws3> "审查 docs/ 文档是否过时"
```

## 异步工作流要点

1. **不要轮询状态** — 设置 `notifyOnFinish: true`，完成后自动收到通知
2. **使用标签** — `labels` 字段标记代理用途，方便筛选
3. **分步骤分解** — 将大任务拆为多个小任务并行处理

## 代理配置选项

```bash
paseo run \
  --provider claude/opus \
  --workspace <workspace-id> \
  --settings '{"features":{"fast_mode":true}}' \
  "快速生成代码片段"
```

## 下一步

- 继续学习：[04 - 定时任务与心跳配置](./04-schedules.md)