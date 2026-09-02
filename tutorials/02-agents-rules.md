# 02 - 使用 AGENTS.md 规则

> 基于官方文档 (opencode.ai/docs/rules)

## AGENTS.md 是什么

AGENTS.md 是给 AI 代理的"项目规则"文件。类似 Cursor 的 rules，包含的指令会被自动加入 LLM 上下文。

## 自动初始化

```
/init
```

`/init` 会：

1. 扫描仓库重要文件
2. 必要时提问以获取项目信息
3. 生成或更新 AGENTS.md

如果已存在 AGENTS.md，`/init` 会就地改进而不是盲目替换。

## 手写 AGENTS.md

```markdown
# 项目名称
这是一个 SST v3 Monorepo 项目，使用 TypeScript 和 bun workspaces。

## 项目结构
- `packages/` — 工作区包（functions, core, web 等）
- `infra/` — 基础设施定义，按服务拆分
- `sst.config.ts` — 主 SST 配置，使用动态导入

## 代码规范
- 使用 strict mode TypeScript
- 共享代码放入 `packages/core/`
- 函数放入 `packages/functions/`

## 构建命令
- 开发：`bun run dev`
- 测试：`bun run test`
- 构建：`bun run build`
```

## 规则文件类型

### 项目级规则

放在项目根目录的 `AGENTS.md`，仅在当前项目生效。

### 全局规则

```
~/.config/opencode/AGENTS.md
```

对所有 OpenCode 会话生效，适合个人通用规则。

### Claude Code 兼容

从 Claude Code 迁移的用户：

| 用途 | Claude Code | OpenCode |
|------|------------|----------|
| 项目规则 | `CLAUDE.md` | `AGENTS.md` |
| 全局规则 | `~/.claude/CLAUDE.md` | `~/.config/opencode/AGENTS.md` |
| 技能 | `~/.claude/skills/` | `~/.claude/skills/` (兼容) |

禁用兼容模式：

```bash
export OPENCODE_DISABLE_CLAUDE_CODE=1
export OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1
export OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1
```

## 优先级

1. 当前目录向上查找 `AGENTS.md`（最先匹配）
2. `~/.config/opencode/AGENTS.md`
3. `~/.claude/CLAUDE.md`（除非禁用）

## 外部文件引用

### 方式一：opencode.json 的 instructions

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "CONTRIBUTING.md",
    "docs/guidelines.md",
    ".cursor/rules/*.md",
    "https://raw.githubusercontent.com/my-org/shared-rules/main/style.md"
  ]
}
```

支持 glob 模式和远程 URL（5 秒超时）。

### 方式二：在 AGENTS.md 中手写引用

```markdown
## 外部文件加载
遇到文件引用时，使用 Read 工具按需加载。

## 开发规范
TypeScript 代码风格: @docs/typescript-guidelines.md
React 组件架构: @docs/react-patterns.md
API 设计: @docs/api-standards.md
```

## 最佳实践

- 保持 AGENTS.md 简洁，详细规则放到外部文件
- 用 `instructions` 字段引用多个规则文件
- 对 monorepo 使用 glob 模式：`packages/*/AGENTS.md`
- 提交 AGENTS.md 到版本控制