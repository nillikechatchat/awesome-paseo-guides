# 06 - Provider 配置与模型选择策略

## Provider Discovery

在创建代理前，先了解可用的 provider：

```bash
paseo provider ls
paseo model ls <provider>
```

通过 MCP tools 也可以查看：

- `list_providers` — 查看 provider 能力和模式
- `list_models` — 查看某 provider 下的所有模型
- `inspect_provider` — 检查 provider 的 feature 支持

## Agent Profiles

配置 Agent Profile 可以快速复用启动配置：

```bash
# 配置一个 fast-mode profile
paseo profile create fast-coder \
  --provider codex/gpt-5.4 \
  --features fast_mode=true \
  --notes "快速代码生成，用于草稿和小改动"
```

使用 profile 时，将其配置解构后传给 `create_agent`：

```json
{
  "provider": "codex/gpt-5.4",
  "settings": {
    "modeId": "full-access",
    "features": { "fast_mode": true }
  }
}
```

## 模型选择策略

| 场景 | 推荐模型 | 理由 |
|------|----------|------|
| 简单修复 | fast mode | 速度快，成本低 |
| 复杂分析 | 高推理模型 | 需要深度思考 |
| 代码生成 | 通用模型 | 平衡质量和速度 |
| 批量处理 | fast mode | 适合大量重复任务 |

## 模式 (Mode)

- `auto` — 自动选择权限
- `full-access` — 完全访问
- `read-only` — 只读模式

## 关键提示

- Profile 只是一次性启动配置，不会持久记忆
- 每次调用前检查 profile 的 `notes` 确定适用场景
- 不确定的 provider 信息先调用 discovery 工具确认