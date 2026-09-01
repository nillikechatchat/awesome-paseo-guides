# 02 · daemon 进程运维(内存 / 进程泄漏 / 日志 / OOM)

## 1. ⚠️ opencode serve 会话泄漏 → 服务器 OOM(最严重) `[事故]`

**日期**:2026-09-01,2C/3.8G 机器。

**现象链**:
```
8 个 opencode serve 进程堆积(合计 2.4GB,最大单进程 1.2GB)
  → 内存耗尽,swap 吞下 4.5GB
  → 每秒 3000~10000 页换入换出,磁盘 IO PSI 90%
  → 进程大量陷入 D 状态(不可中断 IO 等待)
  → load 5.27(2 核机器),期间 kernel OOM 杀掉一个 2.2GB 的 opencode
```

**关键特征**:这 8 个进程**存活十几分钟但 CPU 用量≈0**——纯粹是挂着吃内存的僵尸会话,不是真在干活。

**根因**:opencode 会话结束后 Paseo daemon 不回收 `opencode serve` 子进程;每次新建 agent / worktree 自动命名等操作都会再起一个,逐渐堆积。daemon 内存指标也显示 rss 会从 160MB 瞬时涨到 720MB(结构化生成期间)。

**止血脚本**(保留最新会话,清掉空闲的):
```bash
PIDS=$(pgrep -f "opencode serve")
KEEP=$(for p in $PIDS; do echo "$(ps -o etimes= -p $p) $p"; done | sort -n | head -1 | awk '{print $2}')
echo "$PIDS" | grep -v "^$KEEP$" | xargs -r kill
# 3 秒后对顽固进程补 -9
```

**效果实测**:清 7 个进程后,used 3.4G→1.5G,swap 4.5G→0.7G,IO PSI 90%→3.6%,load 5.27→1.24。

**防复发**:
- 小内存机器(≤4G)控制并发 agent 数,建议 ≤2 个 opencode agent
- 定期巡检:`pgrep -f "opencode serve" | wc -l`,异常堆积即清理
- 该类 agent 运行时单个可涨到 1-2GB,多 agent 并行建议 8G+ 内存

## 2. daemon 非 systemd 托管,重启后手动拉起 `[事故]`

**现象**:Paseo Daemon 是手动进程(非 systemd unit),机器重启或误杀后不会自动恢复,所有 schedule / heartbeat 停摆。

**建议**:为 daemon 写 systemd unit(`Restart=on-failure`),或至少把启动命令放进 rc.local / crontab `@reboot`。

## 3. daemon 日志无限增长,单文件 10MB 轮转 × 多天堆积 `[日志]`

**现象**:`~/.paseo/` 下 4 个 daemon 日志各 10-11MB(每天轮转一个 + 当前 8.4MB),且 `ws_runtime_metrics` 每 30 秒打一条大 JSON(含全量 counters),噪音极大。

**建议**:
- 定期清理:`find ~/.paseo -name "*daemon*.log*" -mtime +7 -delete`
- 排障时先按 msg 聚类再逐类看,不要直接 tail:
  ```bash
  grep '"level":40' ~/.paseo/daemon.log | grep -oE '"msg":"[^"]+"' | sort | uniq -c | sort -rn
  ```

## 4. ws_slow_request / file_explorer 请求 275 秒 `[日志]`(378 次 slow)

**现象**:高负载期间 `file_explorer_request` 单次延迟 264~277 秒(正常 <1s),同时 `ws_slow_request` 大量出现。

**根因**:与 #1 的内存/IO 打满同源——daemon 的 Node 事件循环被 swap 拖慢(eventLoopDelay max 飙到 2106ms)。

**结论**:看到 ws_slow_request 激增先查内存和 swap,不是 daemon 自身 bug。

## 5. "Closing physical WebSocket with expired application lease" `[日志]`(125 次)

**现象**:客户端 WebSocket 频繁被踢。

**根因**:应用层 lease 到期(客户端断连后重连 grace 超时)。偶发无害;若客户端频繁掉线重连,检查网络或 relay 配置。另见 6 次密码错误的告警(03-#2)。

## 6. OOM 被 kernel 杀掉的善后 `[事故]`

**日志特征**:
```
oom-kill: ... task=opencode,pid=xxxx
Out of memory: Killed process xxxx (opencode) total-vm:94GB anon-rss:2.2GB
```

**注意**:被 OOM 杀的是 opencode 进程时,daemon 侧 agent 会停留在 error 状态且可能残留端口占用;处理完内存后应 `paseo ls` 检查 error 状态 agent 并归档,必要时 kill 残留进程。

## 7. 巡检 checklist(经验总结) `[经验]`

```bash
uptime                                  # load 超过核数 2 倍即异常
free -h                                 # available < 500M / swap 大量占用即异常
pgrep -f "opencode serve" | wc -l       # > 2 即堆积
pgrep -f "codex app-server" | wc -l     # 同上
cat /proc/pressure/io                   # some avg10 > 50 即 IO 打满
ps -eo stat --no-headers | grep -c '^D' # D 状态进程 > 0 且 load 高 = IO 等待
grep -c "Out of memory" <(dmesg -T)     # OOM 历史
```
