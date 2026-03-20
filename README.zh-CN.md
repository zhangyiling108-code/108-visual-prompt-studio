# 108-visual-prompt-studio

[English README](./README.md)

这个仓库现在以 Claude Code 插件的形式发布，不再是直接放进 `.claude/skills/...` 的单独技能目录。

## 这个插件提供什么

插件当前包含一个 skill：

- `108-visual-prompt-studio`

这个 skill 适用于图生提示词场景。用户上传图片后，可以先选择：

- 提示词类型
- 专家角色
- 输出语言

然后得到：

- 分析摘要
- 表格化的 Prompt Package
- 一段可直接复制的完整提示词

## 仓库结构

```text
.claude-plugin/
  plugin.json
skills/
  108-visual-prompt-studio/
    SKILL.md
    OPENING_TEMPLATE.md
    package.json
    prompts/
    scripts/
```

## 在 Claude Code 中安装

这个仓库主要用于通过 Claude Code 的插件系统安装，也可以通过插件 marketplace 分发。

典型流程：

1. 先添加包含这个插件的 marketplace。
2. 打开 `/plugin`。
3. 找到 `108-visual-prompt-studio`。
4. 安装或启用插件。

## 更新流程

当新版本发布后：

1. 刷新 marketplace 元数据。
2. 打开插件管理。
3. 更新已安装的插件版本。

## 卸载流程

可通过 Claude Code 的插件管理界面，或者 `/plugin` 管理流程进行禁用或卸载。

## 版本说明

插件版本以以下文件为准：

- `.claude-plugin/plugin.json`

skill 的实现代码与运行器位于：

- `skills/108-visual-prompt-studio/`

## Marketplace 发布

这个插件仓库需要由一个单独的 marketplace 仓库来引用，其中会包含：

- `.claude-plugin/marketplace.json`

marketplace 中指向本插件仓库的地址应为：

- `https://github.com/zhangyiling108-code/108-visual-prompt-studio.git`
