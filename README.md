# 108-visual-prompt-studio — Production Edition v5

[中文说明](./README.zh-CN.md)

This version improves the end-user experience in five ways:

1. It tells the user how to use the skill with examples first.
2. It requires choosing **prompt type** before work begins.
3. It requires choosing **expert role** before work begins.
4. It requires choosing **output language** before work begins.
5. It renders the final Prompt Package as a **Markdown table** plus one **copy-ready prompt block**.
6. If the user chooses Chinese, all user-facing content is rendered in Chinese, including table headers and labels.

## Install in Claude Code

Put this folder in either:
- `.claude/skills/108-visual-prompt-studio/`
- `~/.claude/skills/108-visual-prompt-studio/`

Then invoke it directly with:

```bash
/108-visual-prompt-studio
```

## Recommended user flow

### First show examples
- 基于这张图生成写真提示词，中文输出
- 分析这张截图，生成 UI 风格和配色提示词，英文输出
- 参考这张海报，生成更懂 C 端转化的宣传图提示词，中文输出
- 根据这张图，按我自定义的风格生成提示词，英文输出

### Then ask three choices

#### 1. 选择要生成的提示词类型
1. 写真
2. UI
3. 海报
4. 宣传图
5. 用户自定义

#### 2. 选择用什么角色帮你生成提示词
1. 摄影师
2. 前端 UI 设计师
3. 运营专家
4. 增长黑客
5. 用户自定义

#### 3. 选择提示词输出语言
1. 中文
2. English

## Claude Code 开场白模板

见 `OPENING_TEMPLATE.md`。

## CLI

Default output is a Markdown table plus one copy-ready prompt block.
Use `--json` when you need machine-readable JSON instead.

```bash
npm install
npm run build
node dist/scripts/main.js --image ./input.jpg --request "类型：宣传图；角色：增长黑客；输出语言：中文；基于这张图生成提示词"
```

## Output example

The default output will look like:
- 分析摘要
- 提示词包表格
- 可复制提示词
