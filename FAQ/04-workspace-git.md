# 04 · workspace / worktree / git 集成

## 1. worktree base 必须用 `origin/main` 而不是 `main` `[经验]`

**症状**:branch-off 模式用了本地 `main`,新 worktree 基于过时历史,后续 merge 冲突离奇。

**解法**:`create_workspace` 的 `baseBranch` 显式写 `origin/main`。

## 2. forge PR 状态自愈刷屏:gh CLI 未安装 `[日志]`(453 次,最高频错误)

```
Failed to run forge PR status self-heal refresh
GitHub CLI (gh) is not installed or not in PATH
```

**根因**:daemon 周期性尝试刷新 PR 状态,但没装 `gh`。

**解法**:不用 GitHub 集成可忽略(纯噪音);要用则 `apt install gh && gh auth login`。

## 3. 后台 git fetch 超时 `[日志]`(218 次)

```
Background git fetch completed with errors after changing refs
Git command timed out after 120000ms: git fetch origin --prune
```

**根因**:仓库大 / 网络慢 / remote 在境外,2 分钟超时不够;弱网环境下尤其频繁。

**影响**:PR 状态、分支列表可能滞后;不影响本地工作区。

**缓解**:给大仓库 remote 配代理或镜像;daemon 侧 git 并发限制 8、64 次/秒,一般不会是瓶颈。

## 4. 大仓库触发 5000 目录监听上限,监控降级为轮询 `[日志]`(97+97 次)

```
Failed to start working tree watcher; using degraded polling
Recursive file observation exceeded 5000 directories under <repo-dir>
```

**根因**:Paseo 文件观察器对单仓库递归监听有 5000 目录硬上限(非系统 inotify 限制——本机 max_user_watches=524288 足够)。

**影响**:降级为有界轮询,文件变更感知变慢,agent 对工作区的实时视图滞后。

**缓解**:超大仓库(node_modules 等)配好 ignore;或把 agent 的 cwd 指向仓库子目录,缩小观察范围。

## 5. worktree 残留堆积 `[事故]`

**现象**:`~/.paseo/worktrees/` 与 `~/.paseo/agents/` 留有已结束任务的 worktree(如 `root-.paseo-worktrees-<instance-id>-*` 6 个),agents 目录 12 个项目。

**影响**:占磁盘(每 worktree 是完整检出)、拖慢文件观察器、干扰 agent 列表。

**解法**:任务结束及时 `archive_workspace`;批量清理:
```bash
paseo ls --json | jq -r '.[] | select(.status=="idle") | .id' | xargs -r -n1 paseo archive
```

## 6. autoArchiveAfterMerge 行为差异 `[经验]`

**现象**:config 里 `autoArchiveAfterMerge: true`(旧)/`false`(新),行为不一致导致有人以为 merge 后 workspace 会自动归档,结果没有。

**建议**:显式在 paseo.json 中写明预期;归档动作不要依赖默认值,merge 后手动确认。
