import type { FinalResult } from "./schema.js";

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function joinLines(items: string[], emptyText: string): string {
  if (!items.length) return emptyText;
  return items.map((item) => escapeTableCell(item)).join("<br>");
}

function getLabels(language: "zh" | "en") {
  if (language === "zh") {
    return {
      title: "提示词包",
      summary: "分析摘要",
      copyBlock: "可直接复制提示词",
      field: "字段",
      content: "内容",
      finalPrompt: "最终提示词",
      negativePrompt: "负面提示词",
      colorNotes: "配色说明",
      compositionNotes: "构图说明",
      layoutNotes: "布局说明",
      conversionNotes: "转化说明",
      inCopyBlock: "已整理到下方“可直接复制提示词”",
      na: "不适用",
    };
  }

  return {
    title: "Prompt Package",
    summary: "Analysis Summary",
    copyBlock: "Copy-ready Prompt",
    field: "Field",
    content: "Content",
    finalPrompt: "Final Prompt",
    negativePrompt: "Negative Prompt",
    colorNotes: "Color Notes",
    compositionNotes: "Composition Notes",
    layoutNotes: "Layout Notes",
    conversionNotes: "Conversion Notes",
    inCopyBlock: "Included in the copy-ready block below",
    na: "N/A",
  };
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
    `| ${labels.finalPrompt} | ${labels.inCopyBlock} |`,
    `| ${labels.negativePrompt} | ${labels.inCopyBlock} |`,
    `| ${labels.colorNotes} | ${joinLines(result.color_notes, labels.na)} |`,
    `| ${labels.compositionNotes} | ${joinLines(result.composition_notes, labels.na)} |`,
    `| ${labels.layoutNotes} | ${joinLines(result.layout_notes, labels.na)} |`,
    `| ${labels.conversionNotes} | ${joinLines(result.conversion_notes, labels.na)} |`,
    "",
    `### ${labels.copyBlock}`,
    "```text",
    result.copy_ready_prompt,
    "```",
    "",
  ].join("\n");
}
