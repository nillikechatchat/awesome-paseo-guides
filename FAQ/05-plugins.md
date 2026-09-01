# 05 · 插件与 RPC 开发

## 1. ⚠️ 插件 RPC 方法名禁止 camelCase `[经验]`

**症状**:第一个 Paseo 插件(token-tracker)注册 RPC 时持续报:
```
Invalid plugin RPC method: getStats requestType=plugin.reload.request code=handler_error
```
试了 camelCase(`getStats`)、带命名空间(`token-tracker.getStats`)都失败,只有全小写(`ping`)成功。

**根因**:`@getpaseo/server` 内部对 RPC 名有正则校验:
```javascript
const n = /^[a-z][a-z0-9._-]*$/;
if (!n.test(name)) throw new Error(`Invalid plugin RPC method: ${name}`);
```

**规则**:以小写字母开头,后续仅小写字母/数字/`.`/`_`/`-`。
- ❌ `getStats`(camelCase)
- ❌ `GetStats`(PascalCase)
- ✅ `get-stats`、`stats`、`token_tracker.list`

**规范**:统一 kebab-case 全小写,如 `get-stats`、`list-records`、`model-pricing`。

## 2. token 统计:各 provider 日志格式互不兼容 `[经验]`

**现象**:自建 token-tracker 插件对账时,agnes / glm / minimax 数据缺失或归为 unknown。

**已确认的三个坑**:
1. **Codex 事件字段路径**:thread_settings_applied 的 model 在 `payload.thread_settings.model`,不是 `payload.settings.model`——读错路径拿到 null
2. **事件乱序**:部分 session 的 `token_count` 比 `thread_settings_applied` 先 emit,单遍扫描 model 永远是 unknown → 必须**两遍扫描**(先全量收集 settings 再关联 token_count)
3. **GLM ACP 不写标准 JSONL**:session 在 `~/.local/state/glm-acp-agent/sessions/*.json`,messages 无 usage 字段,只能按 turn 数粗估(3K input + 500 output/turn)并标 `isEstimate: true`

**结论**:完美对账需要每个 provider 自己 hook 写 usage,任何第三方统计都只是近似;跨 provider 插件必须按 provider 分别写 parser。

**遗留**:2026-08-25 前的旧 codex session 有 29 条永远无法归因(SQLite 也没存 model);Agnes 大部分 session 不返回 token_count,天然缺数。
