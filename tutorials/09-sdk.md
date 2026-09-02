# 09 - TypeScript SDK

> 基于官方文档 (paseo.sh/docs/sdk)

## 概述

通过 `@getpaseo/client` 构建 Issue 集成、仪表盘和编排服务。

```bash
npm install @getpaseo/client
```

## 快速开始

```typescript
import { createPaseoClient } from "@getpaseo/client";

const client = createPaseoClient({ url: "ws://127.0.0.1:6767/ws" });
await client.connect();

const agent = await client.agents.create({
  config: { provider: "codex/gpt-5.5" },
  cwd: "/Users/me/dev/storefront",
  prompt: "Review the current diff and name the riskiest change.",
});

const result = await agent.waitForFinish();
console.log(result.lastMessage);

await client.close();
```

## 创建 Agent

```typescript
const agent = await client.agents.create({
  config: { provider: "claude/opus-4.6" },
  cwd: "/Users/me/dev/my-app",
  prompt: "实现用户认证功能",
  title: "Auth implementation",
});

// 等待完成
const result = await agent.waitForFinish();
console.log(result.lastMessage);

// 发送后续任务
await agent.send("再加单元测试");
```

## 管理工作区

```typescript
// 创建 worktree 工作区
const workspace = await client.workspaces.create({
  isolation: "worktree",
  path: "/Users/me/dev/my-app",
  mode: "branch-off",
  newBranch: "feature/auth",
  base: "origin/main",
  worktreeSlug: "feature-auth",
});

// 在该工作区启动 Agent
const agent = await client.agents.create({
  config: { provider: "codex/gpt-5.5" },
  workspaceId: workspace.id,
  prompt: "实现功能",
});
```

## 发现 Provider 和模型

```typescript
const providers = await client.providers.list();
for (const provider of providers) {
  console.log(`${provider.id}: ${provider.displayName}`);
  const models = await client.providers.models(provider.id);
  for (const model of models) {
    console.log(`  - ${model.id}`);
  }
}
```

## 监听事件

```typescript
client.on("agent:finish", (event) => {
  console.log(`Agent ${event.agentId} 完成:`, event.lastMessage);
});

client.on("agent:error", (event) => {
  console.error(`Agent ${event.agentId} 错误:`, event.error);
});

client.on("workspace:created", (event) => {
  console.log(`工作区创建:`, event.workspace);
});
```

## 编排示例：实现 + 验证循环

```typescript
import { createPaseoClient } from "@getpaseo/client";

const client = createPaseoClient({ url: "ws://127.0.0.1:6767/ws" });
await client.connect();

const workspace = await client.workspaces.create({
  isolation: "worktree",
  path: "/Users/me/dev/my-app",
  mode: "branch-off",
  newBranch: "auto-fix",
  base: "origin/main",
});

let iterations = 0;
const maxIterations = 5;

while (iterations < maxIterations) {
  iterations++;
  console.log(`第 ${iterations} 轮...`);

  // Codex 修复
  const fixer = await client.agents.create({
    config: { provider: "codex/gpt-5.5" },
    workspaceId: workspace.id,
    prompt: "修复失败的测试",
  });
  await fixer.waitForFinish();

  // Claude 验证
  const reviewer = await client.agents.create({
    config: { provider: "claude/opus-4.6" },
    workspaceId: workspace.id,
    prompt: "所有测试都通过吗？返回 JSON: {"criteria_met": true/false}",
  });
  const review = await reviewer.waitForFinish();

  if (review.lastMessage.includes("criteria_met\": true")) {
    console.log("所有标准满足！");
    break;
  }
}

await client.close();
```

## Hub 集成

```typescript
// Hub 提供 GitHub 等触发器
// 详见 https://paseo.sh/docs/hub
```

## 最佳实践

1. **始终调用 `client.close()`** — 释放 WebSocket 连接
2. **使用 `waitForFinish()` 同步等待** — 适合需要结果的任务
3. **使用事件监听处理异步结果** — 适合后台任务
4. **工作区隔离** — 不同任务使用不同 worktree
5. **Provider 选择** — 根据任务复杂度选择不同模型