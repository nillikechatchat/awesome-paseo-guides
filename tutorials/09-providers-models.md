# 09 - Provider 与模型配置

> 基于官方文档 (opencode.ai/docs/providers)

## 概览

OpenCode 通过 AI SDK 和 Models.dev 支持 **75+ 个 LLM Provider**。

### 配置流程

1. 用 `/connect` 命令添加 Provider 的 API Key
2. 在配置中自定义 Provider

API Key 存储在 `~/.local/share/opencode/auth.json`。

## 配置 Provider

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://api.anthropic.com/v1"
      }
    }
  }
}
```

### 隐藏模型

```json
{
  "provider": {
    "anthropic": {
      "blacklist": ["claude-opus-4-20250514"]
    }
  }
}
```

### 白名单

```json
{
  "provider": {
    "anthropic": {
      "whitelist": ["claude-sonnet-4-20250514"]
    }
  }
}
```

## 主流 Provider 配置

### OpenAI

```
/connect → 选择 OpenAI → ChatGPT Plus/Pro（OAuth）或手动输入 API Key
```

### Anthropic

```
/connect → 选择 Anthropic → 手动输入 API Key
```

### DeepSeek

```
/connect → 搜索 DeepSeek → 输入 API Key
```

### Google Vertex AI

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
export GOOGLE_CLOUD_PROJECT=my-project
export VERTEX_LOCATION=us-central1
opencode
```

```json
{
  "provider": {
    "google-vertex-ai": {
      "options": {
        "project": "my-project",
        "location": "us-central1"
      }
    }
  }
}
```

### Amazon Bedrock

```bash
# 环境变量方式
export AWS_ACCESS_KEY_ID=XXX
export AWS_SECRET_ACCESS_KEY=YYY
export AWS_REGION=us-east-1
opencode

# 或配置命名 profile
export AWS_PROFILE=my-profile
opencode
```

```json
{
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-profile"
      }
    }
  }
}
```

### Azure OpenAI

```bash
export AZURE_RESOURCE_NAME=my-resource
opencode
```

```json
{
  "provider": {
    "azure": {
      "models": {
        "gpt-5-mini": {
          "id": "gpt-production"
        }
      }
    }
  }
}
```

## 本地模型

### Ollama

```json
{
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "llama2": { "name": "Llama 2" }
      }
    }
  }
}
```

### LM Studio

```json
{
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": {
        "baseURL": "http://127.0.0.1:1234/v1"
      },
      "models": {
        "google/gemma-3n-e4b": { "name": "Gemma 3n-e4b (local)" }
      }
    }
  }
}
```

### llama.cpp

```json
{
  "provider": {
    "llama.cpp": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "llama-server (local)",
      "options": {
        "baseURL": "http://127.0.0.1:8080/v1"
      },
      "models": {
        "qwen3-coder:a3b": {
          "name": "Qwen3-Coder (local)",
          "limit": { "context": 128000, "output": 65536 }
        }
      }
    }
  }
}
```

## 查看可用模型

```bash
opencode models              # 列出所有模型
opencode models anthropic    # 按 provider 过滤
opencode models --refresh    # 刷新缓存
opencode models --verbose    # 显示元数据和价格
```

## 云 API 网关

### OpenRouter

```
/connect → 搜索 OpenRouter → 输入 API Key
```

### Helicone

```
/connect → 搜索 Helicone → 输入 API Key
```

配置自定义头：

```json
{
  "provider": {
    "helicone": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Helicone",
      "options": {
        "baseURL": "https://ai-gateway.helicone.ai",
        "headers": {
          "Helicone-Cache-Enabled": "true",
          "Helicone-User-Id": "opencode"
        }
      }
    }
  }
}
```

### Cloudflare AI Gateway

```
/connect → 搜索 Cloudflare AI Gateway
→ 输入 Account ID → Gateway ID → API Token
```

### Cloudflare Workers AI

```
/connect → 搜索 Cloudflare Workers AI
→ 输入 Account ID → API Token
```

## 自定义 Provider

```json
{
  "provider": {
    "my-custom": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My Custom Provider",
      "options": {
        "baseURL": "https://api.example.com/v1"
      },
      "models": {
        "my-model": { "name": "My Model" }
      }
    }
  }
}
```