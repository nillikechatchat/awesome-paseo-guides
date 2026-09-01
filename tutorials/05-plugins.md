# 05 - Workspace 脚本与插件开发

## paseo.json 脚本配置

在 workspace 的根目录创建 `paseo.json`：

```json
{
  "scripts": {
    "dev-server": {
      "command": "npm run dev",
      "port": 3000
    },
    "lint": {
      "command": "npm run lint"
    }
  }
}
```

### 脚本管理

```bash
paseo script ls --cwd /path/to/project
paseo script start dev-server --cwd /path/to/project
paseo script stop dev-server --cwd /path/to/project
```

脚本通过 supervised terminal 管理生命周期，带有健康检查。

## 插件开发

### 基础插件结构

```
plugin-name/
├── paseo.json          # 插件配置
├── index.js            # 主入口
├── package.json        # Node.js 依赖
└── README.md           # 说明文档
```

### paseo.json 示例

```json
{
  "name": "hello-world",
  "description": "基础问候插件",
  "rpc": ["hello"],
  "version": "1.0.0",
  "scripts": {
    "hello": "node index.js --greet"
  }
}
```

### RPC 方法

插件可以暴露 RPC 方法供 agent 调用：

```javascript
// index.js
async function hello(params) {
  const name = params?.name || 'World';
  return { message: `Hello, ${name}!` };
}

module.exports = { hello };
```

## Workspace 脚本生命周期

```
启动 → 健康检查 → 运行中 → (可选: 代理调用) → 停止
```

- **启动时**：自动分配 terminal 并执行 command
- **运行中**：可通过代理发送指令
- **停止时**：通过 supervised terminal 优雅终止

## 最佳实践

- 脚本设置健康检查端口，Paseo 自动检测
- 使用 workspace 隔离运行脚本，不影响其他任务
- 插件配置放在 `.paseo/` 目录下管理

## 下一步

- 继续学习：[06 - Provider 配置与模型选择策略](./06-providers.md)