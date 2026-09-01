# Paseo Guides

社区驱动的 Paseo 智能代理编排平台使用指南、教程、插件与实践心得集合。

## 目录结构

```
awesome-paseo-guides/
├── site/              # 静态展示站点（可直接打开 index.html 浏览）
│   └── index.html     # 单页应用，包含完整介绍
├── plugins/           # 插件示例
│   ├── hello-world/   # 基础问候插件模板
│   └── logger/        # 日志记录插件
├── tutorials/         # 教程系列
│   ├── 01-quick-start.md
│   ├── 02-workspaces.md
│   ├── 03-agents.md
│   ├── 04-schedules.md
│   ├── 05-plugins.md
│   └── 06-providers.md
├── experiences/       # 实践心得
│   ├── 01-async-workflow.md
│   ├── 02-workspace-isolation.md
│   ├── 03-schedule-traps.md
│   └── 04-prompt-engineering.md
├── scripts/           # 工具脚本
│   └── publish-gist.js    # Gist 发布脚本
└── docs/              # 文档
```

## 快速使用

1. 在浏览器中打开 `site/index.html` 查看完整介绍站点
2. 按 `tutorials/` 顺序阅读教程
3. 参考 `plugins/` 中的示例开发自己的插件
4. 阅读 `experiences/` 中的实践心得

## 发布 Gist

确保 `GITHUB_TOKEN` 环境变量已设置（需要 `gist` 权限），然后运行：

```bash
GITHUB_TOKEN=your-token node scripts/publish-gist.js
```

## 贡献

欢迎贡献教程、插件和实践心得！