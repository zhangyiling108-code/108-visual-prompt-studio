# 108-visual-prompt-studio｜生产版

[English README](./README.md)

这是一个可用于生产环境的 Claude Code Skill，并附带一套更稳健的 TypeScript 命令行运行器。

## 在 Claude Code 中安装

将整个目录放到以下任一位置：

- `.claude/skills/108-visual-prompt-studio/`
- `~/.claude/skills/108-visual-prompt-studio/`

然后直接调用：

```bash
/108-visual-prompt-studio
```

## 构建与运行

```bash
npm install
npm run build
node dist/scripts/main.js --image ./input.jpg --request "基于这张图生成写真提示词，中文输出" --vision qwen3.5 --lang zh
```

## 生产增强能力

- 支持请求超时控制
- 支持指数退避重试
- 更严格的 JSON 提取与解析
- 对三个模型阶段的输出都进行 schema 校验
- 支持通过 `--out` 输出到文件
- 支持通过 `--verbose` 打印详细日志
- 支持通过环境变量覆盖接口地址与模型名
- 提供更安全的失败提示
- 抽象了 provider 层，便于切换不同模型服务

## CLI 参数

- `--image <path>` 必填
- `--request "<text>"` 必填
- `--vision qwen3.5|minimax2.7` 可选
- `--lang zh|en` 可选
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

## 关于当前官方文档的说明

Qwen 官方支持兼容 OpenAI Chat Completions 的视觉请求形式，允许在消息内容中传入图片。MiniMax 官方则提供基于 HTTP 的文本生成能力、兼容 Anthropic/OpenAI 的访问方式，以及带有 `understand_image` 和 `web_search` 工具的 Claude Code Token Plan MCP。

如果你的团队更偏向 Claude Code 原生工作流，也可以在这套直接 API Runner 之外，同时评估 MiniMax 的 MCP 集成方案。

## 推荐的生产使用方式

1. 先使用直接 Runner 模式，部署和迁移会更轻便。
2. 如果你的核心需求更偏图像理解，优先使用 Qwen。
3. 如果你们团队已经在 MiniMax 生态或 MCP 工具链中，优先考虑 MiniMax。
4. 如果运行环境要求严格，建议把 `QWEN_MODEL`、`MINIMAX_MODEL`、超时和重试参数固定在 `.env` 中。

## 示例

```bash
node dist/scripts/main.js \
  --image ./poster.jpg \
  --request "参考这张图生成更懂 C 端转化的宣传图 prompt，中文输出" \
  --vision minimax2.7 \
  --lang zh \
  --out ./result.json \
  --timeout-ms 60000 \
  --retries 2
```
