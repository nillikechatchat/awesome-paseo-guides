# 03 · 配置文件陷阱

## 1. ⚠️ 手改的配置会被 daemon 覆盖回退 `[事故]`

**现象**:2026-08-30 为修 Codex MCP 冲突,把 `~/.paseo/config.json` 的 `daemon.mcp.injectIntoAgents` 改成 `false`(经验库有记录)。2026-09-01 复查发现**又变回了 `true`**——期间 daemon/UI 操作重写了 config.json。

**证据**:
```
config.json      mcp: {'injectIntoAgents': True}    ← 现状(修复丢失)
config.json.bak  2026-08-30 01:00 备份               ← 修复时的现场
config.yml       injectIntoAgents: false            ← 旧格式残留,已不生效
```

**教训**:
- 改完配置立即 `paseo reload` 并**复查文件是否被改回**
- 关键配置改动做备份:`cp config.json config.json.$(date +%m%d)`
- UI/daemon 的某些操作(如保存设置、升级)会整体重写 config.json

## 2. daemon 监听 0.0.0.0 暴露公网 `[事故]`

**现象**:`listen: "0.0.0.0:<port>"`,daemon 端口直接对公网开放;日志中有 6 次 `Rejected WebSocket connection with invalid daemon password`——**已被外部扫描器碰撞**。

**风险**:daemon 持有全部 agent 控制权 + 文件系统访问,弱口令被爆破即整机沦陷(本机部署的自研防火墙服务上线 5 小时已拦截 1.7 万次 SSH 爆破,公网环境极其恶劣)。

**解法**:
```jsonc
// ~/.paseo/config.json
"daemon": { "listen": "127.0.0.1:<port>" }
```
远程访问走 SSH 隧道而非直接暴露;若必须远程,套反代 + 强认证。改完 `paseo reload` 并用 `ss -tlnp | grep <port>` 验证。

## 3. 双配置文件并存,config.yml 是僵尸文件 `[事故]`

**现象**:`~/.paseo/` 同时存在 `config.json`(生效,8-31 起使用)与 `config.yml`(8-24 的旧文件,内含同样的 0.0.0.0 修改注释)。

**风险**:排查配置问题时容易改错文件——改 yml 完全不生效,浪费大量时间。

**解法**:确认当前版本只读 `config.json` 后,归档 yml:`mv ~/.paseo/config.yml ~/.paseo/config.yml.deprecated`。

## 4. relay.enabled 与公网监听叠加放大暴露面 `[日志]`

**现象**:config 中 `relay.enabled: true` 且监听 0.0.0.0,日志显示 `relayExternalSocketAttached` 有外部流量接入。

**建议**:不需要 app.paseo.sh 远程接入时关掉 relay;需要时确保 daemon 只听 127.0.0.1,由 relay 侧出站连接。

## 5. 配置热加载不覆盖运行态 `[经验]`

**现象**:改 config.json 后部分设置(如 terminalProfiles、providers)要 `paseo daemon restart` 才生效,`paseo reload` 只对部分配置有效。

**建议**:改完配置先 reload 观察;不生效再 restart;restart 前确认没有跑一半的 agent(会中断任务)。
