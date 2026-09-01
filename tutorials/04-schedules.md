# 04 - 定时任务与心跳配置

## Schedule：定时启动代理

适合需要周期性执行的任务，每次启动全新的代理。

```bash
# 每 15 分钟检查一次构建状态
paseo schedule create \
  --cron "*/15 * * * *" \
  --name "build-checker" \
  --provider codex/gpt-5.4 \
  "检查 main 分支的 CI 状态，如果有失败请生成报告"
```

### Schedule 管理

```bash
paseo schedule ls          # 列出所有 schedule
paseo schedule inspect <id> # 查看详情和运行历史
paseo schedule pause <id>   # 暂停
paseo schedule resume <id>  # 恢复
paseo schedule run-once <id> # 立即执行一次
paseo schedule delete <id>  # 删除
```

## Heartbeat：定时提醒

适合需要回到当前对话的提醒类任务。

```bash
# 每 30 分钟检查一次构建
paseo heartbeat create \
  --cron "*/30 * * * *" \
  --name "build-watch" \
  "检查构建状态并汇报"
```

> Heartbeat 只能删除和重新创建，不支持直接更新。

## Cron 表达式速查

| 表达式 | 含义 |
|--------|------|
| `*/5 * * * *` | 每 5 分钟 |
| `0 * * * *` | 每小时整点 |
| `0 9 * * *` | 每天早上 9 点 |
| `0 9 * * 1-5` | 工作日每天早上 9 点 |
| `0 0 * * 0` | 每周日凌晨 |

## 注意事项

- 配置 `maxRuns` 限制最大执行次数，避免意外
- 配置 `expiresIn` 设置自动过期时间
- 使用 `timezone` 指定时区

## 下一步

- 继续学习：[05 - Workspace 脚本与插件开发](./05-plugins.md)