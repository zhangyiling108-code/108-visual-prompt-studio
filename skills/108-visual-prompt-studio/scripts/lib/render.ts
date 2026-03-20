import type { FinalResult } from "./schema.js";

function joinLines(items: string[]): string {
  if (!items.length) return "-";
  return items.map((item) => item.replace(/\|/g, "\\|")).join("<br>");
}

function textCell(value: string): string {
  return value && value.trim() ? value.replace(/\|/g, "\\|").replace(/\n/g, "<br>") : "-";
}

function getLabels(language: "zh" | "en") {
  if (language === "zh") {
    return {
      promptPackage: "提示词包",
      analysisSummary: "分析摘要",
      copyReadyPrompt: "可复制提示词",
      field: "字段",
      content: "内容",
      finalPrompt: "最终提示词",
      negativePrompt: "负面提示词",
      colorNotes: "配色建议",
      compositionNotes: "构图建议",
      layoutNotes: "布局建议",
      conversionNotes: "转化建议",
      includedInCopyBlock: "已整理到下方“可复制提示词”区域",
    };
  }

  return {
    promptPackage: "Prompt Package",
    analysisSummary: "Analysis Summary",
    copyReadyPrompt: "Copy-ready Prompt",
    field: "Field",
    content: "Content",
    finalPrompt: "Final Prompt",
    negativePrompt: "Negative Prompt",
    colorNotes: "Color Notes",
    compositionNotes: "Composition Notes",
    layoutNotes: "Layout Notes",
    conversionNotes: "Conversion Notes",
    includedInCopyBlock: "Included in the copy-ready prompt block below",
  };
}

export function renderPromptPackageTable(result: FinalResult): string {
  const labels = getLabels(result.language);

  const summary = result.analysis_summary.length
    ? result.analysis_summary.map((item) => `- ${item}`).join("\n")
    : "-";

  return [
    `## ${labels.promptPackage}`,
    "",
    `### ${labels.analysisSummary}`,
    summary,
    "",
    `| ${labels.field} | ${labels.content} |`,
    "|---|---|",
    `| ${labels.finalPrompt} | ${labels.includedInCopyBlock} |`,
    `| ${labels.negativePrompt} | ${textCell(result.negative_prompt)} |`,
    `| ${labels.colorNotes} | ${joinLines(result.color_notes)} |`,
    `| ${labels.compositionNotes} | ${joinLines(result.composition_notes)} |`,
    `| ${labels.layoutNotes} | ${joinLines(result.layout_notes)} |`,
    `| ${labels.conversionNotes} | ${joinLines(result.conversion_notes)} |`,
    "",
    `### ${labels.copyReadyPrompt}`,
    "```text",
    result.copy_ready_prompt,
    "```",
    ""
  ].join("\n");
}
