# 10 - 浏览器自动化与语音控制

> 基于官方文档 (paseo.sh/docs/browser, /docs/voice)

## 浏览器工具

Paseo 的浏览器工具让 Agent 可以控制网页，适合：

- Web 应用测试
- UI 自动化
- 端到端验证
- 网页交互

### 何时使用

```
使用浏览器检查 localhost:3000 的登录页面
```

### 主要工具

| 工具 | 说明 |
|------|------|
| `browser_navigate` | 导航到 URL |
| `browser_screenshot` | 截图 |
| `browser_snapshot` | 获取页面快照 |
| `browser_click` | 点击元素 |
| `browser_fill` | 填写输入 |
| `browser_type` | 输入文字 |
| `browser_select` | 选择下拉项 |
| `browser_wait` | 等待文本或 URL |
| `browser_evaluate` | 执行 JS |
| `browser_scroll` | 滚动 |
| `browser_keypress` | 按键 |
| `browser_drag` | 拖拽 |
| `browser_hover` | 悬停 |

### 示例：登录验证

```
1. 打开 http://localhost:3000/login
2. 截图确认页面加载
3. 填写邮箱和密码
4. 点击登录按钮
5. 等待跳转到仪表盘
6. 截图确认登录成功
```

## 语音控制

Paseo 支持两种语音模式：

### Dictation（语音输入）

将语音转换为文本输入到 prompt：

```
按住麦克风 → 说出任务 → 自动转为文字
```

配置：

```json
{
  "features": {
    "dictation": { "enabled": true }
  }
}
```

支持 OpenAI STT 和本地 STT：

```bash
export OPENAI_STT_API_KEY=sk-xxx
export OPENAI_STT_BASE_URL=https://api.openai.com/v1
```

### Voice Mode（语音对话）

完整的语音对话模式，Agent 回答也通过 TTS 朗读：

```json
{
  "features": {
    "voiceMode": { "enabled": true }
  }
}
```

```bash
export OPENAI_TTS_API_KEY=sk-xxx
export OPENAI_TTS_BASE_URL=https://api.openai.com/v1
```

### 语音 Provider 选择

```bash
export PASEO_VOICE_LLM_PROVIDER=claude  # claude/codex/opencode
export PASEO_DICTATION_STT_PROVIDER=openai  # local/openai
```

## 最佳实践

### 浏览器自动化

1. **设置服务端口** — 在 paseo.json 中配置 `type: "service"`
2. **等待页面加载** — 使用 `browser_wait` 等待关键元素
3. **截图验证** — 每一步截图确认状态
4. **处理加载态** — 设置合适的超时时间

### 语音使用

1. **Dictation 适合** — 快速输入任务描述
2. **Voice Mode 适合** — 复杂问题的语音讨论
3. **本地 STT** — 隐私敏感场景使用本地模型
4. **OpenAI STT** — 高精度识别