# 108-visual-prompt-studio

[中文说明](./README.zh-CN.md)

This repository is distributed as a Claude Code plugin rather than a standalone `.claude/skills/...` drop-in folder.

## What this plugin provides

This plugin includes one skill:

- `108-visual-prompt-studio`

The skill is designed for image-to-prompt workflows where the user uploads an image, chooses:

- prompt type
- expert role
- output language

and then receives:

- an analysis summary
- a table-based Prompt Package
- one copy-ready prompt block

## Repository layout

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

## Install through Claude Code

This plugin is intended to be installed through Claude Code's plugin system and, optionally, through a plugin marketplace.

Typical flow:

1. Add the marketplace that contains this plugin.
2. Open `/plugin`.
3. Find `108-visual-prompt-studio`.
4. Install or enable the plugin.

## Update flow

When a new version is published:

1. Refresh the marketplace metadata.
2. Open plugin management.
3. Update the installed plugin version.

## Uninstall flow

Use Claude Code's plugin management UI or `/plugin` management flow to disable or uninstall the plugin.

## Versioning

The canonical plugin version is defined in:

- `.claude-plugin/plugin.json`

The skill implementation and runner live in:

- `skills/108-visual-prompt-studio/`

## Marketplace publishing

This repository is meant to be referenced by a separate marketplace repository containing:

- `.claude-plugin/marketplace.json`

That marketplace file should point to this repository as the plugin source:

- `https://github.com/zhangyiling108-code/108-visual-prompt-studio.git`
