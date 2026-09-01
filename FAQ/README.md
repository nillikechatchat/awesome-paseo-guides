# Paseo 踩坑 FAQ

> 来源:生产环境(Ubuntu 24.04 / 2C4G / daemon 0.7.0-beta.2)真实运维记录。
> 每条坑均来自实际日志、事故复盘或已验证的经验库(`<wiki-dir>/`),
> 标注了证据来源与验证状态,未经证实的推测单独归类。

## 目录

| 文件 | 主题 | 条目数 |
|---|---|---|
| [01-providers.md](01-providers.md) | Provider / 模型选用与报错 | 8 |
| [02-daemon-ops.md](02-daemon-ops.md) | daemon 进程运维(内存/进程泄漏/日志/OOM) | 7 |
| [03-config.md](03-config.md) | 配置文件陷阱(双配置/监听/MCP 注入回退) | 5 |
| [04-workspace-git.md](04-workspace-git.md) | workspace / worktree / git 集成 | 6 |
| [05-plugins.md](05-plugins.md) | 插件与 RPC 开发 | 2 |
| [06-orchestration.md](06-orchestration.md) | 多 Agent 编排 / 调度 / 跨 provider 交接 | 5 |

## 高频坑速查(TOP 5)

1. **opencode serve 进程泄漏 → 服务器 OOM**(最严重,见 02-#1)
2. **配置修复会被覆盖回退**(injectIntoAgents 修复丢失,见 03-#1)
3. **daemon 监听 0.0.0.0 暴露公网 + 弱口令告警**(见 03-#2)
4. **Codex 二次启动 MCP namespace 冲突**(见 01-#1)
5. **大仓库触发 5000 目录监听上限,文件监控降级轮询**(见 04-#4)

## 证据等级说明

- `[日志]` — 来自 `~/.paseo/daemon.log` 实际错误记录(附出现次数)
- `[事故]` — 真实故障复盘,有完整处理过程
- `[经验]` — 来自 WikiSkill experience 库,已至少复现一次
- `[推测]` — 未完全定因,处理方法已验证有效但根因存疑
