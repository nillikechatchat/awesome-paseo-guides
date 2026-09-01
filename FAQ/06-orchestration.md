# 06 · 多 Agent 编排 / 调度 / 跨 provider 交接

## 1. 子 agent briefing 必须自包含 `[经验]`

**症状**:跨 provider 交接时写"接着刚才 Claude 说的那个改一下",子 agent 完全不知道上下文,产出跑偏。

**根因**:子 agent 是全新会话,看不到父 agent 对话历史。

**正确做法**,briefing 四要素:
```text
# 任务      —— 具体做什么
# 背景      —— 项目、关键文件路径、约束
# 验收      —— 可执行的验证命令 + 通过标准
# 不要做的事 —— 防越界(如"不要改 oauth.ts""不要装新依赖")
```

## 2. heartbeat 默认 7 天过期,schedule 需显式 maxRuns `[经验]`

**坑**:定时任务悄悄停了,以为还在跑。

**规则**:
- heartbeat 默认 7 天 TTL,长期任务要显式 `expiresIn` 续期
- schedule 不设 `maxRuns` 也有过期语义,永久任务要检查 `nextRunAt` 是否还在推进

**巡检**:`paseo` 的 `list_schedules` / `inspect_schedule` 看 `nextRunAt` 与 `lastRunAt`。

## 3. schedule 新 agent 每次都是冷启动 `[经验]`

**设计使然**:schedule 每次起新 agent(干净上下文),适合日报/triage;但**依赖累积状态的任务**(长迁移、多轮重构)会丢上下文。

**选型**:
| 场景 | 用 |
|---|---|
| 盯 CI / 继续长迁移(要上下文连续) | heartbeat(同一 agent 续命) |
| 每日报告 / triage(要干净上下文) | schedule |

需要跨次记忆的状态写文件(如 WikiSkill 的 wiki.md),不要指望会话记忆。

## 4. 跨 provider 编排的收益与成本 `[经验]`

**结论来源**:WikiSkill 论文(arxiv 2608.27454)——"skills evolved by other models can outperform self-evolved skills",即跨模型接力优于单模型包干。

**已验证编排骨架**:
```
复杂任务:Claude(plan, thinking=high) → Codex(full-access 实现) → Pi(agnes, review)
简单任务:Codex → Pi 直接交付
中文重推理:GLM(thinking=max) → Codex
```

**成本警告**:每个子 agent 是独立计费会话,briefing 本身消耗 token;简单任务硬拆三段反而更贵。编排收益主要体现在复杂任务的规划/实现/审查分离上。

## 5. 多 agent 并发的资源上限 `[事故]`

**现象**:并行开多个 agent(每个背后是独立的 opencode/claude/codex 子进程),小内存机器迅速打满(详见 02-#1)。

**经验值**(2C/3.8G 机器):
- opencode agent:单个运行时 300MB~2GB,**并发 ≤2**
- claude CLI:~60MB 常驻,较轻
- codex app-server:中等,但有进程残留问题

**建议**:并发上限写入编排逻辑;派发前检查 `free -h` 与存量子进程数;重负载编排放到大内存机器。
