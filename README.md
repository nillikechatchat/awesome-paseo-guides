# Paseo Guides

社区驱动的 **Paseo** 使用指南、教程、插件与实践心得集合。

Paseo 是一个本地守护进程，在你自己的机器上运行和编排多个编码代理（Claude Code、Codex、Copilot、OpenCode、Pi）。支持桌面端、移动端、网页和 CLI。

基于 Paseo 官方文档 (paseo.sh/docs) 和 GitHub 仓库 (getpaseo/paseo) 整理。

## 目录结构

```
awesome-paseo-guides/
├── site/
│   └── index.html         # 单页展示站点
├── tutorials/             # 10 篇教程（基于官方文档）
│   ├── 01-installation.md        安装与首次启动
│   ├── 02-connectivity.md        连接与设备配对
│   ├── 03-workspaces.md          工作区与工作树
│   ├── 04-providers.md           多 Provider 配置
│   ├── 05-orchestration.md       Agent 编排
│   ├── 06-schedules.md           定时任务与心跳
│   ├── 07-plugins.md             插件开发
│   ├── 08-cli-reference.md       CLI 命令完整参考
│   ├── 09-sdk.md                 TypeScript SDK
│   └── 10-browser-voice.md       浏览器与语音控制
├── experiences/           # 实践心得
├── scripts/
│   └── publish-gist.mjs    Gist 发布脚本
└── .gitignore
```

## 快速使用

1. 浏览器打开 `site/index.html` 查看完整介绍
2. 按 `tutorials/` 顺序阅读教程
3. 推荐阅读顺序：01 → 02 → 03 → 04 → 08 → 05 → 06 → 07 → 09

## Gist 已发布

📎 https://gist.github.com/nillikechatchat/5abb127cc63cd96907503ff00686fd3a