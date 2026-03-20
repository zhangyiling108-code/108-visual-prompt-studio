---
name: 108-visual-prompt-studio
description: Analyze a user-provided image and the user's request, let the user choose prompt type, expert role, and output language before work begins, then return a structured prompt package in table format plus one copy-ready prompt block for portrait photography, UI, posters, promo visuals, or custom tasks.
version: 1.5.1
effort: medium
metadata:
  openclaw: true
homepage: https://github.com/zhangyiling108-code/108-visual-prompt-studio
---

# 108-visual-prompt-studio

Production-ready role-based image-to-prompt orchestration for Claude Code.

## Use this skill when

Use this skill when the user:
- uploads an image and wants a 写真 / portrait prompt
- uploads a screenshot and wants a UI style / color / layout prompt
- uploads a poster, banner, or ad and wants a 海报 / 宣传图 / promo prompt
- wants output in Chinese or English
- wants the image interpreted first, then transformed into a reusable prompt package from an expert perspective

## What this skill does

This skill does **not** generate the final image.

It converts:
- a reference image
- the user's stated goal
- structured image understanding
- an expert role perspective

into a structured prompt package that can be reused in downstream generation workflows.

## Required interaction flow

Before doing analysis or prompt generation, the skill should guide the user through **three selections**.

### Step 0: Show quick examples first

When the skill starts, first show the user a few example requests, such as:
- “基于这张图生成写真提示词，中文输出”
- “分析这张截图，生成 UI 风格和配色提示词，英文输出”
- “参考这张海报，生成更懂 C 端转化的宣传图提示词”
- “根据这张图，按我自定义的风格生成提示词”

### Step 1: Ask the user to choose prompt type

Ask the user to choose one of:
1. 写真
2. UI
3. 海报
4. 宣传图
5. 用户自定义

If the user already clearly specified the type, confirm it briefly and continue.

### Step 2: Ask the user to choose the role

Ask the user to choose one of:
1. 摄影师
2. 前端 UI 设计师
3. 运营专家
4. 增长黑客
5. 用户自定义

If the user already clearly specified the role, confirm it briefly and continue.

### Step 3: Ask the user to choose the output language

Ask the user to choose one of:
1. 中文
2. English

If the user already clearly specified the output language, confirm it briefly and continue.

## Routing model

1. User guidance and examples
2. Prompt type selection
3. Role selection
4. Output language selection
5. Vision analysis
6. Intent parsing
7. Role loading
8. Final prompt composition

## Prompt types supported

- `portrait_prompt`
- `ui_prompt`
- `poster_prompt`
- `promo_prompt`
- `custom_prompt`

## Roles supported

- `photographer`
- `ui_designer`
- `operator`
- `growth_hacker`
- `custom_role`

## Output language supported

- `zh`
- `en`

## Output language hard rule

If the user selects `中文` / `zh`, the final user-facing output must be fully in Chinese, including:
- analysis summary
- table title
- table field names
- all table values
- all explanatory text
- the copy-ready prompt block

If the user selects `English` / `en`, the final user-facing output must be fully in English, including:
- analysis summary
- table title
- table field names
- all table values
- all explanatory text
- the copy-ready prompt block

Do not mix languages in the final user-facing response unless the user explicitly asks for bilingual output.

## Direct-copy rule

The final user-facing response must include **one single copy-ready prompt block**.

Do not force the user to reconstruct the prompt by copying multiple separate table cells.

If the user selects `zh`, that copy-ready prompt block must be fully in Chinese.  
If the user selects `en`, that copy-ready prompt block must be fully in English.

## Output contract

The final answer should be returned as:
- a short analysis summary
- a **Markdown table-based Prompt Package**
- one **single copy-ready prompt block** for direct reuse

The response should contain fields such as:
- `task_type`
- `selected_role`
- `language`
- `analysis_summary`
- `final_prompt`
- `negative_prompt`
- `color_notes`
- `composition_notes`
- `layout_notes`
- `conversion_notes`
- `copy_ready_prompt`

## Output format rule

Do **not** return raw JSON to end users by default.

Return a user-friendly Markdown response, with:
- the main Prompt Package rendered as a table
- one copy-ready block that the user can copy at once

## Operational notes

- Default language is `zh` when unspecified.
- Preserve visual grammar, not exact identity.
- Do not copy exact visible text, logos, or watermarks from the image.
- Choose the user's wording over image-type heuristics when they conflict.
- If request intent is ambiguous, ask the user to choose from the supported options first.
