# 02 - 连接与设备配对

> 基于官方文档 (paseo.sh/docs/connectivity)

Paseo 客户端通过以下三种方式连接到守护进程：SSH、Paseo 中继、Tailscale。

## SSH 连接

SSH 通过本地 OpenSSH 客户端连接现有守护进程。不安装、不启动、不配置远程主机上的 Paseo。

### 前提条件

1. 远程主机已启动 Paseo 守护进程
2. `ssh user@host` 可以使用密钥或 SSH agent 认证

### CLI 使用

```bash
paseo ls -a --host ssh://user@host
paseo ls -a --host ssh://user@host:2222    # 自定义 SSH 端口
paseo ls -a --host 'ssh://user@host?daemonPort=7777'  # 自定义 daemon 端口
paseo run --host devbox:6767 --cwd /workspace "运行完整测试套件"
```

> `--host` 位于命令之后。`paseo daemon status` 只检查本地守护进程。

### 桌面端

Settings → Add host → Remote SSH，输入相同的 `ssh://` 地址。

## Paseo 中继

中继无需 Tailscale、端口转发或网络配置，流量端到端加密。

中继默认关闭，需要手动启用。

### 桌面端启用

1. Settings → your host → Pair a device
2. 选择 **Enable relay**
3. 用手机扫码，或复制配对链接粘贴到手机应用

### CLI 启用

```bash
paseo daemon pair          # 启用中继并打印二维码
paseo daemon pair --relay  # 不提示直接启用
paseo daemon pair --json   # JSON 输出
```

## Tailscale

在守护进程机器和手机上安装 Tailscale，登录同一 tailnet。

### 1. 获取守护进程的 Tailscale IP

```bash
tailscale ip -4
# 输出: 100.101.102.103
```

### 2. 配置守护进程

编辑 `~/.paseo/config.json`：

```json
{
  "daemon": {
    "listen": "100.101.102.103:6767"
  }
}
```

重启守护进程：

```bash
paseo daemon restart
```

### 3. 手机连接

1. 手机连接 Tailscale
2. Paseo → Settings → Add host → Direct connection
3. 输入 Tailscale IP 和端口 `6767`
4. 关闭 Use SSL，选择 Connect

## 故障排除

| 问题 | 解决 |
|------|------|
| SSH 认证失败 | 在终端运行 `ssh user@host` 修复密钥/agent |
| SSH 连接但 Paseo 拒绝 | 远程运行 `paseo daemon status` |
| 连接超时 | 检查 Tailscale 连接状态和 IP 地址 |
| 连接被拒 | 确认守护进程在配置 IP 和端口运行 |
| 配置变更无效 | 运行 `paseo reload`，必要时重启 |

## 远程守护进程

`--host` 支持多种地址格式：

```bash
paseo ls --host localhost:6767                            # 本地
paseo ls --host 192.168.1.10:6767                         # 局域网
paseo ls --host ssh://user@host                           # SSH
paseo ls --host 'https://app.paseo.sh/#offer=eyJ2IjoyLC...'  # 中继 offer URL
```

也可以通过 `PASEO_HOST` 环境变量设置：

```bash
export PASEO_HOST=devbox:6767
paseo ls
```