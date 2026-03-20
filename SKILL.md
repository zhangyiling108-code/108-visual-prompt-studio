---
name: 108-visual-prompt-studio
description: Analyze a user-provided image and the user's request, route to the right expert role, and return a structured prompt package for portrait photography, UI style, or promo visuals. Use when the user uploads an image and wants prompt generation rather than direct image generation.
version: 1.0.0
effort: medium
metadata:
  openclaw: true
homepage: https://github.com/zhangyiling108-code/108-visual-prompt-studio
---

# 108-visual-prompt-studio

Production-ready role-based image-to-prompt orchestration for Claude Code.

Use this skill when the user:
- uploads an image and wants a 写真 / portrait prompt
- uploads a screenshot and wants a UI style / color / layout prompt
- uploads a poster, banner, or ad and wants a promo / campaign prompt
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

## Routing model

1. Vision analysis
2. Intent parsing
3. Role loading
4. Final prompt composition

## Direct invocation

`/108-visual-prompt-studio`

## Output contract

Return JSON with:
- `task_type`
- `selected_role`
- `analysis_summary`
- `final_prompt`
- `negative_prompt`
- `color_notes`
- `composition_notes`
- `layout_notes`
- `conversion_notes`

## Operational notes

- Default language is `zh` when unspecified.
- Preserve visual grammar, not exact identity.
- Do not copy exact visible text, logos, or watermarks from the image.
- Choose the user's wording over image-type heuristics when they conflict.
- If request intent is ambiguous, make the best grounded assumption and continue.
