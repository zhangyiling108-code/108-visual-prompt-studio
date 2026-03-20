# 108-visual-prompt-studio｜生产版 v5

[English README](./README.md)

这是一个可用于生产环境的 Claude Code Skill，并附带一套更稳健的 TypeScript 命令行运行器。v5 主要强化了交互引导、角色选择和最终输出格式。

## v5 更新点

1. 先向用户展示示例请求，降低上手成本。
2. 正式开始前，先选择提示词类型。
3. 正式开始前，先选择专家角色。
4. 正式开始前，先选择输出语言。
5. 默认输出改为 Markdown 表格形式的 Prompt Package，加一个可直接复制的 prompt 块。
6. 如果用户选择中文，所有面向用户的输出都必须保持中文。

## 在 Claude Code 中安装

将整个目录放到以下任一位置：

- `.claude/skills/108-visual-prompt-studio/`
- `~/.claude/skills/108-visual-prompt-studio/`

然后直接调用：

```bash
/108-visual-prompt-studio
```

## 推荐用户流程

### 先展示示例

- 基于这张图生成写真提示词，中文输出
- 分析这张截图，生成 UI 风格和配色提示词，英文输出
- 参考这张海报，生成更懂 C 端转化的宣传图提示词，中文输出
- 根据这张图，按我自定义的风格生成提示词，英文输出

### 再让用户完成三项选择

#### 1. 选择要生成的提示词类型

1. 写真
2. UI
3. 海报
4. 宣传图
5. 用户自定义

#### 2. 选择使用哪个角色

1. 摄影师
2. 前端 UI 设计师
3. 运营专家
4. 增长黑客
5. 用户自定义

#### 3. 选择输出语言

1. 中文
2. English

## Claude Code 开场白模板

见 `OPENING_TEMPLATE.md`。

## 构建与运行

```bash
npm install
npm run build
node dist/scripts/main.js --image ./input.jpg --request "类型：宣传图；角色：增长黑客；输出语言：中文；基于这张图生成提示词"
```

## CLI 说明

默认输出是 Markdown 表格形式的 Prompt Package，加一个可直接复制的 prompt 块。

如果你需要机器可读 JSON，可使用 `--json`。

## CLI 参数

- `--image <path>` 必填
- `--request "<text>"` 必填
- `--vision qwen3.5|minimax2.7` 可选
- `--lang zh|en` 可选
- `--json` 可选
- `--out <file>` 可选
- `--timeout-ms <number>` 可选
- `--retries <number>` 可选
- `--verbose` 可选

## 环境变量

### Provider 密钥

- `QWEN_API_KEY`
- `MINIMAX_API_KEY`

### 可选接口地址覆盖

- `DASHSCOPE_BASE_URL`
- `MINIMAX_API_HOST`

### 可选模型名覆盖

- `QWEN_MODEL`
- `MINIMAX_MODEL`

### 运行时调优

- `VISUAL_PROMPT_TIMEOUT_MS`
- `VISUAL_PROMPT_RETRIES`

## 默认 Provider 配置

### Qwen

- 默认 base URL：`https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- 默认 model：`qwen3-vl-plus`

### MiniMax

- 默认 base URL：`https://api.minimax.io/v1/text/chatcompletion_v2`
- 默认 model：`MiniMax-M2.7`

## 输出示例

默认输出会包含：

- 分析摘要
- 提示词包表格
- 可复制提示词
