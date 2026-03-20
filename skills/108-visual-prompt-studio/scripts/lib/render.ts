import type { FinalResult } from "./schema.js";

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function joinLines(items: string[], emptyText: string): string {
  if (!items.length) return emptyText;
  return items.map((item) => escapeTableCell(item)).join("<br>");
}

function optionalText(value: string, emptyText: string): string {
  const trimmed = value.trim();
  return trimmed ? escapeTableCell(trimmed) : emptyText;
}

function getLabels(language: "zh" | "en") {
  if (language === "zh") {
    return {
      title: "提示词包",
      summary: "分析摘要",
      copyBlock: "可直接复制提示词",
      field: "字段",
      content: "内容",
      taskType: "提示词类型",
      selectedRole: "角色",
      language: "输出语言",
      analysisSummary: "分析摘要",
      finalPrompt: "最终提示词",
      negativePrompt: "负面提示词",
      colorNotes: "配色说明",
      compositionNotes: "构图说明",
      layoutNotes: "布局说明",
      conversionNotes: "转化说明",
      copyReadyPrompt: "可复制完整提示词",
      na: "不适用",
    };
  }

  return {
    title: "Prompt Package",
    summary: "Analysis Summary",
    copyBlock: "Copy-ready Prompt",
    field: "Field",
    content: "Content",
    taskType: "Task Type",
    selectedRole: "Selected Role",
    language: "Language",
    analysisSummary: "Analysis Summary",
    finalPrompt: "Final Prompt",
    negativePrompt: "Negative Prompt",
    colorNotes: "Color Notes",
    compositionNotes: "Composition Notes",
    layoutNotes: "Layout Notes",
    conversionNotes: "Conversion Notes",
    copyReadyPrompt: "Copy-ready Prompt",
    na: "N/A",
  };
}

function localizeTaskType(value: string, language: "zh" | "en"): string {
  if (language === "zh") {
    if (value === "portrait_prompt") return "写真";
    if (value === "ui_prompt") return "UI";
    if (value === "poster_prompt") return "海报";
    if (value === "promo_prompt") return "宣传图";
    if (value === "custom_prompt") return "用户自定义";
    return value;
  }

  if (value === "portrait_prompt") return "Portrait";
  if (value === "ui_prompt") return "UI";
  if (value === "poster_prompt") return "Poster";
  if (value === "promo_prompt") return "Promo Visual";
  if (value === "custom_prompt") return "Custom";
  return value;
}

function localizeRole(value: string, language: "zh" | "en"): string {
  if (language === "zh") {
    if (value === "photographer") return "摄影师";
    if (value === "ui_designer") return "前端 UI 设计师";
    if (value === "operator") return "运营专家";
    if (value === "growth_hacker") return "增长黑客";
    if (value === "custom_role") return "用户自定义";
    return value;
  }

  if (value === "photographer") return "Photographer";
  if (value === "ui_designer") return "UI Designer";
  if (value === "operator") return "Operator";
  if (value === "growth_hacker") return "Growth Hacker";
  if (value === "custom_role") return "Custom";
  return value;
}

function localizeLanguage(value: "zh" | "en", language: "zh" | "en"): string {
  if (language === "zh") {
    if (value === "zh") return "中文";
    if (value === "en") return "英文";
  }

  if (value === "zh") return "Chinese";
  return "English";
}

export function renderPromptPackageTable(result: FinalResult): string {
  const labels = getLabels(result.language);

  const summary = result.analysis_summary.length
    ? result.analysis_summary.map((item) => `- ${item}`).join("\n")
    : `- ${labels.na}`;

  return [
    `## ${labels.title}`,
    "",
    `### ${labels.summary}`,
    summary,
    "",
    `| ${labels.field} | ${labels.content} |`,
    "|---|---|",
    `| ${labels.taskType} | ${escapeTableCell(localizeTaskType(result.task_type, result.language))} |`,
    `| ${labels.selectedRole} | ${escapeTableCell(localizeRole(result.selected_role, result.language))} |`,
    `| ${labels.language} | ${escapeTableCell(localizeLanguage(result.language, result.language))} |`,
    `| ${labels.analysisSummary} | ${joinLines(result.analysis_summary, labels.na)} |`,
    `| ${labels.finalPrompt} | ${optionalText(result.final_prompt, labels.na)} |`,
    `| ${labels.negativePrompt} | ${optionalText(result.negative_prompt, labels.na)} |`,
    `| ${labels.colorNotes} | ${joinLines(result.color_notes, labels.na)} |`,
    `| ${labels.compositionNotes} | ${joinLines(result.composition_notes, labels.na)} |`,
    `| ${labels.layoutNotes} | ${joinLines(result.layout_notes, labels.na)} |`,
    `| ${labels.conversionNotes} | ${joinLines(result.conversion_notes, labels.na)} |`,
    `| ${labels.copyReadyPrompt} | ${optionalText(result.copy_ready_prompt, labels.na)} |`,
    "",
    `### ${labels.copyBlock}`,
    "```text",
    result.copy_ready_prompt,
    "```",
    "",
  ].join("\n");
}
