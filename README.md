# 108-visual-prompt-studio — Production Edition

[中文说明](./README.zh-CN.md)

This package is a production-ready Claude Code skill plus a hardened TypeScript runner.

## Install in Claude Code

Put this folder in either:

- `.claude/skills/108-visual-prompt-studio/`
- `~/.claude/skills/108-visual-prompt-studio/`

Then invoke it directly with:

```bash
/108-visual-prompt-studio
```

## Build and run

```bash
npm install
npm run build
node dist/scripts/main.js --image ./input.jpg --request "基于这张图生成写真提示词，中文输出" --vision qwen3.5 --lang zh
```

## Production improvements included

- request timeout support
- retry with exponential backoff
- stricter JSON extraction and parsing
- schema validation for all three model stages
- optional output file via `--out`
- verbose logging via `--verbose`
- environment-variable-based endpoint and model overrides
- safe failure messages
- provider abstraction

## CLI flags

- `--image <path>` required
- `--request "<text>"` required
- `--vision qwen3.5|minimax2.7` optional
- `--lang zh|en` optional
- `--out <file>` optional
- `--timeout-ms <number>` optional
- `--retries <number>` optional
- `--verbose` optional

## Environment variables

### Provider keys
- `QWEN_API_KEY`
- `MINIMAX_API_KEY`

### Optional endpoint overrides
- `DASHSCOPE_BASE_URL`
- `MINIMAX_API_HOST`

### Optional model overrides
- `QWEN_MODEL`
- `MINIMAX_MODEL`

### Runtime tuning
- `VISUAL_PROMPT_TIMEOUT_MS`
- `VISUAL_PROMPT_RETRIES`

## Default provider settings

### Qwen
- base URL default: `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- model default: `qwen3-vl-plus`

### MiniMax
- base URL default: `https://api.minimax.io/v1/text/chatcompletion_v2`
- model default: `MiniMax-M2.7`

## Notes on current official docs

Qwen officially supports OpenAI-compatible chat completions for vision requests, including image input in message content. MiniMax officially documents text generation via HTTP plus Anthropic/OpenAI-compatible access, and also provides a Claude Code Token Plan MCP with `understand_image` and `web_search` tools. If your team prefers Claude Code-native integration, the MiniMax MCP path is worth considering alongside this direct API runner.

## Recommended production workflow

1. Start with direct runner mode for portability.
2. Use Qwen for the image-analysis-heavy path when you want a direct multimodal API.
3. Use MiniMax when your environment is already standardized on MiniMax models or MCP tooling.
4. For strict ops environments, pin `QWEN_MODEL`, `MINIMAX_MODEL`, timeout, and retry counts in `.env`.

## Example

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
