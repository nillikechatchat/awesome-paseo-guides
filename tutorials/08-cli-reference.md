# 08 - CLI 命令完整参考

> 基于官方文档 (paseo.sh/docs/cli)

## 快速参考

```bash
paseo run "fix the tests"            # 启动 Agent
paseo ls                             # 列运行中的 Agent
paseo attach <id>                    # 流式输出
paseo send <id> "also fix linting"   # 发送后续任务
paseo logs <id>                      # 查看时间线
paseo stop <id>                      # 停止 Agent
```

## 运行 Agent

```bash
paseo run "实现用户认证"
paseo run --provider codex "重构 API 层"
paseo run --background "运行测试套件"
paseo run --new-workspace worktree --worktree-mode branch-off --new-branch feature/x --base origin/main "实现功能 X"
paseo run --workspace <workspace-id> "审查当前 diff"
paseo run --output-schema schema.json "提取发布说明"
```

### 主要参数

| 参数 | 说明 |
|------|------|
| `--provider` | 指定 Provider |
| `--background` | 后台运行 |
| `--workspace` | 指定工作区 |
| `--new-workspace` | 创建新工作区（local/worktree） |
| `--worktree-mode` | branch-off/checkout-branch/checkout-pr |
| `--new-branch` | 新分支名 |
| `--base` | 基准分支 |
| `--worktree-slug` | worktree 目录名 |
| `--output-schema` | JSON schema 输出格式 |
| `--title` | Agent 标题 |

## 代理管理

```bash
paseo ls                         # 运行中的
paseo ls -a                      # 包含已完成/已停止的
paseo ls -g                      # 所有目录
paseo ls -a -g --json            # JSON 格式完整列表

paseo attach <id>                # 附加流式输出
paseo send <id> "继续工作"        # 发送后续任务
paseo send <id> --image png      # 带图片发送
paseo send <id> --no-wait        # 排队不等待
paseo logs <id>                  # 完整时间线
paseo logs <id> -f               # 跟随
paseo logs <id> --tail 10        # 最后 10 条
paseo logs <id> --filter tools   # 仅工具调用
paseo wait <id>                  # 等待完成
paseo wait <id> --timeout 60     # 超时
paseo stop <id>                  # 停止

paseo agent mode <id> --list     # 可用模式
paseo agent mode <id> bypass     # 设置 bypass
paseo agent mode <id> plan       # 设置 plan
paseo agent detach <id>          # 提升为顶层代理
```

## 项目

```bash
paseo project create             # 注册当前目录
paseo project create /srv/repos/api --host devbox:6767
paseo project ls
paseo project rename <id> "My app"
paseo project rename <id> --reset
paseo project delete <id>
```

## 工作区

```bash
paseo workspace create --isolation local --path ~/dev/my-app --title main
paseo workspace create --isolation worktree --mode branch-off --new-branch feature/auth --base origin/main
paseo workspace ls
paseo workspace rename <id> "Auth rework"
paseo workspace archive <id>
```

## 脚本

```bash
paseo script ls
paseo script start web
paseo script stop web
```

## 插件

```bash
paseo plugin init /path/to/plugin
paseo plugin install /path/to/plugin
paseo plugin add owner/repository
paseo plugin add owner/monorepo:plugins/review
paseo plugin status
paseo plugin update my-plugin
paseo plugin update --all
paseo plugin ls
paseo plugin reload my-plugin
paseo plugin logs my-plugin
paseo plugin disable my-plugin
paseo plugin enable my-plugin
paseo plugin remove my-plugin
```

## Provider 诊断

```bash
paseo provider diagnostic claude
paseo provider diagnostic codex --json
paseo provider diagnostic opencode --host devbox:6767
```

## Schedule

```bash
paseo schedule create --every 30m --cwd ~/dev/my-app "继续重构并留言"
paseo schedule ls
paseo schedule pause <id>
```

## 权限

```bash
paseo permit ls
paseo permit allow <id>
paseo permit deny <id> --all
```

## 守护进程

```bash
paseo daemon start
paseo daemon start --web-ui
paseo daemon status
paseo daemon restart
paseo daemon stop
paseo reload
paseo daemon pair
paseo daemon pair --relay
paseo daemon pair --json
paseo daemon set-password
```

## 远程连接

```bash
paseo --host localhost:6767 ls
paseo --host ssh://user@host ls
paseo --host 'https://app.paseo.sh/#offer=...' run "修复测试"
export PASEO_HOST=devbox:6767
paseo ls
```

## 输出格式

```bash
paseo ls --json
paseo ls --format yaml
paseo ls -q               # 仅 ID
```

## 全局选项

| 选项 | 说明 |
|------|------|
| `--host <target>` | 连接远程 daemon |
| `--json` | JSON 输出 |
| `-q, --quiet` | 最小输出 |
| `--no-color` | 禁用颜色 |

## 环境变量

| 变量 | 说明 |
|------|------|
| `PASEO_HOME` | Paseo 主目录 |
| `PASEO_PASSWORD` | 连接密码 |
| `PASEO_LISTEN` | 覆盖监听地址 |
| `PASEO_RELAY_ENABLED` | 启用/禁用中继 |
| `PASEO_HOSTNAMES` | 覆盖 hostnames |
| `PASEO_WEB_UI_ENABLED` | 启用网页 UI |
| `PASEO_HOST` | 连接目标（替代 --host） |
| `PASEO_VOICE_LLM_PROVIDER` | 语音 LLM Provider |
| `PASEO_LOCAL_MODELS_DIR` | 本地模型目录 |