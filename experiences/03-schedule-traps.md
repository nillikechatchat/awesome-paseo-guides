# 实践心得 03 - 定时任务的使用陷阱

## 常见错误

### 1. 忘记设置 maxRuns

```bash
# ❌ 危险：无限执行
paseo schedule create --cron "*/5 * * * *" "检查状态"

# ✓ 安全：限制次数
paseo schedule create \
  --cron "*/5 * * * *" \
  --maxRuns 100 \
  "检查状态"
```

### 2. 忘记时区

```bash
# ❌ 默认时区可能是 UTC
paseo schedule create --cron "0 9 * * *" "早间检查"

# ✓ 明确指定时区
paseo schedule create \
  --cron "0 9 * * *" \
  --timezone "Asia/Shanghai" \
  "早间检查"
```

### 3. Cron 表达式理解偏差

```
*/5 * * * *  → 每5分钟，不是每天一次
0 */2 * * *  → 每2小时整点，不是每2分钟
```

## 使用心得

- **开发阶段**：设置较短的 cron（如 5 分钟）快速验证
- **生产阶段**：根据实际需要调整间隔
- **临时任务**：用 `run-once` 手动触发，不需要创建 schedule
- **长期任务**：配置 `expiresIn` 自动过期，避免忘记清理