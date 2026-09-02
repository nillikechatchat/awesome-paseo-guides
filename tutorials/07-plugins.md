# 07 - 插件开发

> 基于官方文档 (paseo.sh/docs/plugins)

## 插件概述

Paseo 插件为每个连接的客户端添加原生功能：

- 工作区面板
- Composer pills（快捷操作）
- Command Center 项
- 全局 surface
- 应用主题
- Daemon 行为
- Composer 附件源

插件在桌面端、浏览器、iOS 和 Android 上运行。

> **信任警告：** `paseo plugin add` 和 `paseo plugin install` 表示"我信任这个代码库"。服务端代码和 Git 准备命令在 daemon 上以守护进程用户权限无沙箱运行。

## 启用插件

在目标主机上打开 **Settings → Plugins**，开启 **Enable plugins**。

或通过 `config.json`：

```json
{ "pluginsEnabled": true }
```

```bash
paseo reload --json
```

## 创建插件

```bash
paseo plugin init /absolute/path/to/workspace-plugin
cd /absolute/path/to/workspace-plugin
npm install
```

`init` 创建严格的 TypeScript 项目。Paseo 在运行时提供插件 SDK、React、React Native、TanStack Query 和 Zod。

### 实现工作区面板

替换 `main.client.tsx`：

```tsx
import { type PluginWorkspacePanelProps, useWorkspace } from "@getpaseo/plugin";
import { useMemo } from "react";
import { Text, View } from "react-native";

export function WorkspaceOverview({ theme, layout, workspaceId }: PluginWorkspacePanelProps) {
  const workspace = useWorkspace(workspaceId, ({ name, directory }) => ({
    name,
    directory,
  }));
  const styles = useMemo(
    () => ({
      screen: {
        flex: 1,
        padding: layout.compact ? 16 : 24,
        gap: layout.compact ? 8 : 12,
        backgroundColor: theme.colors.surface0,
      },
      title: { color: theme.colors.foreground, fontSize: layout.compact ? 20 : 24 },
      label: { color: theme.colors.foregroundMuted },
      detail: { color: theme.colors.foreground },
    }),
    [theme, layout.compact],
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{workspace?.name}</Text>
      <Text style={styles.label}>Directory</Text>
      <Text style={styles.detail}>{workspace?.directory}</Text>
    </View>
  );
}
```

替换 `index.ts`：

```ts
import type { PluginContext } from "@getpaseo/plugin";
import { WorkspaceOverview } from "./main.client";

export default function contribute(plugin: PluginContext) {
  plugin.addWorkspacePanel({
    id: "overview",
    title: "Workspace overview",
    icon: "PanelsTopLeft",
    context: "workspace",
    locations: ["workspace", "explorer"],
    Component: WorkspaceOverview,
  });
  plugin.addCommandCenterItem({
    id: "open-overview",
    title: "Open workspace overview",
    icon: "PanelsTopLeft",
    context: "workspace",
    onSelect({ openPanel }) {
      openPanel("overview");
    },
  });
  return () => {};
}
```

图标使用 [Lucide](https://lucide.dev/icons/) 图标名。

## 安装和验证

```bash
npm run typecheck
paseo plugin install /absolute/path/to/workspace-plugin
paseo plugin ls
```

打开工作区，按 **⌘K**（macOS）或 **Ctrl+K**（Windows/Linux），选择 **Open workspace overview**。

## 从 Git 安装

```bash
paseo plugin add owner/repository
paseo plugin add https://gitlab.com/group/repository.git
paseo plugin add owner/monorepo:plugins/workspace   # monorepo 子路径
paseo plugin add owner/repository --ref main         # 指定 ref
```

## 生命周期管理

```bash
paseo plugin status
paseo plugin update workspace-plugin
paseo plugin update --all
paseo plugin reload workspace-plugin
paseo plugin logs workspace-plugin
paseo plugin logs workspace-plugin --json
paseo plugin disable workspace-plugin
paseo plugin enable workspace-plugin
paseo plugin remove workspace-plugin
```

## Build 配置

大多数插件应省略 `build`。Paseo 编译 TypeScript 和 TSX 并提供运行时模块。

需要构建步骤时：

```json
{
  "id": "workspace-plugin",
  "build": [
    ["npm", "ci"],
    ["npm", "run", "build"]
  ]
}
```

每个 `build` 条目是非空的 argv 数组，直接从 staged 插件目录执行，不使用 shell。

## 主题和布局

从 `theme.colors.foreground` 或 `theme.colors.foregroundMuted` 获取颜色，从 `layout.compact` 获取布局尺寸。硬编码黑色文字在暗色主题下会失败。

## 后端调试

```ts
console.log("刷新 issues");
console.error("Issue 刷新失败", error);
```

查看日志：Settings → Plugins → Logs 或 CLI：

```bash
paseo plugin logs workspace-plugin
```

## 插件 API 能力

| 贡献类型 | 方法 | 说明 |
|----------|------|------|
| 工作区面板 | `addWorkspacePanel` | 原生工作区标签页 |
| Command Center 项 | `addCommandCenterItem` | ⌘K 菜单项 |
| Composer pill | `addComposerPill` | 快捷操作 |
| 全局 surface | `addGlobalSurface` | 全局面板 |
| 主题 | `addTheme` | 自定义主题 |
| 附件源 | `addComposerAttachmentSource` | 文件/内容附加 |
| Daemon 行为 | 服务端 handler | 守护进程端逻辑 |