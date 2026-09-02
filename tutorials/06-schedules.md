# 06 - 定时任务与心跳

> 基于官方文档 (paseo.sh/docs/schedules)

## Schedules 与 Heartbeats 的区别

| | Schedule | Heartbeat |
|---|----------|-----------|
| 启动 | 全新 Agent | 同一 Agent |
| 上下文 | 无 | 继承 |
| 适用场景 | 独立定时任务 | 持续监控、重试 |

## 从 CLI 创建 Schedule

```bash
# 简单时间表达
paseo schedule create --every 30m --cwd ~/dev/my-app "继续重构并留言"

# Cron 表达式
paseo schedule create --cron "0 9 * * 1-5" --cwd ~/dev/my-app "每日早间检查构建状态"

# 列表和暂停
paseo schedule ls
paseo schedule pause <id>
```

### 时间预设

CLI 支持简单时间预设并编译为 cron：

| 预设 | 等效 Cron |
|------|-----------|
| `--every 5m` | `*/5 * * * *` |
| `--every 30m` | `*/30 * * * *` |
| `--every 1h` | `0 * * * *` |
| `--every day` | `0 0 * * *` |
| `--every 15m` | `*/15 * * * *` |

## 在 Agent 中创建 Heartbeat

在编排开启的 Agent 中自然语言描述：

```
使用 Paseo 创建每 10 分钟一次的 Heartbeat。
持续检查 PR #123，修复任何 CI 失败，
直到所有检查通过或两小时后停止。
```

Heartbeat 会复用当前会话上下文，适合持续监控。

## 在 Agent 中创建 Schedule

```
使用 Paseo 创建一个 Schedule，每天早上 9 点（Asia/Shanghai）
在 my-app 项目中运行代码审查。
```

Schedule 每次启动全新的 Agent，适合独立任务。

## 权限管理

Agent 可能请求执行权限：

```bash
paseo permit ls                # 列待审批请求
paseo permit allow <id>        # 批准该 Agent 的所有待审批
paseo permit deny <id> --all   # 拒绝该 Agent 的所有待审批
```

## Agent 模式

```bash
paseo agent mode <id> --list   # 查看可用模式
paseo agent mode <id> bypass   # 设置 bypass 模式
paseo agent mode <id> plan     # 设置 plan 模式
paseo agent detach <id>        # 将子代理提升为顶层代理
```

> Detach 是生命周期操作，不是创建标志。Agent 继续运行，只是与父级的关系改变。

## 配置 Heartbeat 超时

```
使用 Paseo 创建 Heartbeat，每 5 分钟检查一次构建状态，
最多运行 12 次（一小时），使用 codex 作为 Provider。
```

## 典型场景

### CI 监控

```
创建 Heartbeat，每 2 分钟检查 CI 状态，
如果有失败自动修复，最多 30 分钟。
```

### 每日 Triage

```
创建 Schedule，每天早上 9 点 triage issues，
标记 P0/P1 并分配给团队成员。
```

### 部署后观察

```
创建 Heartbeat，每 1 分钟检查一次部署状态，
10 分钟后停止。
```