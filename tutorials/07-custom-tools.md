# 07 - 自定义工具

> 基于官方文档 (opencode.ai/docs/custom-tools)

## 概述

自定义工具是 LLM 可以在对话中调用的函数。它们与内置工具（read、write、bash 等）一起工作。

## 工具定义

工具定义为 TypeScript 或 JavaScript 文件，但可以被调用的脚本可以是**任何语言**。

### 位置

- 项目级：`.opencode/tools/`
- 全局级：`~/.config/opencode/tools/`

### 基本结构

```typescript
// .opencode/tools/database.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "查询项目数据库",
  args: {
    query: tool.schema.string().describe("要执行的 SQL 查询")
  },
  async execute(args) {
    // 数据库逻辑
    return `已执行查询: ${args.query}`
  }
})
```

**文件名 = 工具名**（`database.ts` → `database` 工具）。

### 单文件多工具

```typescript
// .opencode/tools/math.ts
import { tool } from "@opencode-ai/plugin"

export const add = tool({
  description: "两个数相加",
  args: {
    a: tool.schema.number().describe("第一个数"),
    b: tool.schema.number().describe("第二个数")
  },
  async execute(args) {
    return (args.a + args.b).toString()
  }
})

export const multiply = tool({
  description: "两个数相乘",
  args: {
    a: tool.schema.number().describe("第一个数"),
    b: tool.schema.number().describe("第二个数")
  },
  async execute(args) {
    return (args.a * args.b).toString()
  }
})
```

创建两个工具：`math_add` 和 `math_multiply`。

### 覆盖内置工具

如果自定义工具与内置工具同名，自定义工具优先：

```typescript
// .opencode/tools/bash.ts — 替换内置 bash
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "受限的 bash 包装器",
  args: {
    command: tool.schema.string()
  },
  async execute(args) {
    return `已阻止: ${args.command}`
  }
})
```

> 如果想禁用但不覆盖内置工具，使用 [权限](./04-permissions.md) 配置。

## 使用上下文

```typescript
// .opencode/tools/project.ts
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "获取项目信息",
  args: {},
  async execute(args, context) {
    const { agent, sessionID, messageID, directory, worktree } = context
    return `Agent: ${agent}, Session: ${sessionID}, Message: ${messageID}, Dir: ${directory}, WT: ${worktree}`
  }
})
```

## 使用 Python 编写工具

```python
# .opencode/tools/add.py
import sys
a = int(sys.argv[1])
b = int(sys.argv[2])
print(a + b)
```

```typescript
// .opencode/tools/python-add.ts
import { tool } from "@opencode-ai/plugin"
import path from "path"

export default tool({
  description: "使用 Python 做加法",
  args: {
    a: tool.schema.number().describe("第一个数"),
    b: tool.schema.number().describe("第二个数")
  },
  async execute(args, context) {
    const script = path.join(context.worktree, ".opencode/tools/add.py")
    const result = await Bun.$`python3 ${script} ${args.a} ${args.b}`.text()
    return result.trim()
  }
})
```