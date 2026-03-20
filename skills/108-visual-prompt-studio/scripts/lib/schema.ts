type JsonRecord = Record<string, unknown>;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function assertObject(value: unknown, name: string): JsonRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${name} must be a JSON object.`);
  }
  return value as JsonRecord;
}

function requireString(obj: JsonRecord, key: string, ctx: string): string {
  const value = obj[key];
  if (typeof value !== "string") {
    throw new Error(`${ctx}.${key} must be a string.`);
  }
  return value;
}

function requireStringArray(obj: JsonRecord, key: string, ctx: string): string[] {
  const value = obj[key];
  if (!isStringArray(value)) {
    throw new Error(`${ctx}.${key} must be a string array.`);
  }
  return value;
}

export interface VisionResult {
  image_type_guess: string;
  subjects: string[];
  scene: string;
  composition: string;
  framing: string;
  lighting: string;
  palette: string[];
  mood: string[];
  materials: string[];
  information_hierarchy: string;
  focal_point: string;
  text_safe_area: string;
  layout_density: string;
  component_density: string;
  style_signals: string[];
  text_elements: string[];
  objects: string[];
  commercial_cues: string[];
  do_not_copy: string[];
}

export interface IntentResult {
  task_type: "portrait_prompt" | "ui_prompt" | "poster_prompt" | "promo_prompt" | "custom_prompt";
  selected_role: "photographer" | "ui_designer" | "operator" | "growth_hacker" | "custom_role";
  language: "zh" | "en";
  focus: string[];
  user_goal_summary: string;
  assumptions: string[];
  custom_type_notes: string;
  custom_role_notes: string;
}

export interface FinalResult {
  task_type: string;
  selected_role: string;
  language: "zh" | "en";
  analysis_summary: string[];
  final_prompt: string;
  negative_prompt: string;
  color_notes: string[];
  composition_notes: string[];
  layout_notes: string[];
  conversion_notes: string[];
  copy_ready_prompt: string;
}

export function validateVisionResult(input: unknown): VisionResult {
  const obj = assertObject(input, "vision_result");
  return {
    image_type_guess: requireString(obj, "image_type_guess", "vision_result"),
    subjects: requireStringArray(obj, "subjects", "vision_result"),
    scene: requireString(obj, "scene", "vision_result"),
    composition: requireString(obj, "composition", "vision_result"),
    framing: requireString(obj, "framing", "vision_result"),
    lighting: requireString(obj, "lighting", "vision_result"),
    palette: requireStringArray(obj, "palette", "vision_result"),
    mood: requireStringArray(obj, "mood", "vision_result"),
    materials: requireStringArray(obj, "materials", "vision_result"),
    information_hierarchy: requireString(obj, "information_hierarchy", "vision_result"),
    focal_point: requireString(obj, "focal_point", "vision_result"),
    text_safe_area: requireString(obj, "text_safe_area", "vision_result"),
    layout_density: requireString(obj, "layout_density", "vision_result"),
    component_density: requireString(obj, "component_density", "vision_result"),
    style_signals: requireStringArray(obj, "style_signals", "vision_result"),
    text_elements: requireStringArray(obj, "text_elements", "vision_result"),
    objects: requireStringArray(obj, "objects", "vision_result"),
    commercial_cues: requireStringArray(obj, "commercial_cues", "vision_result"),
    do_not_copy: requireStringArray(obj, "do_not_copy", "vision_result"),
  };
}

export function validateIntentResult(input: unknown): IntentResult {
  const obj = assertObject(input, "intent_result");
  const taskType = requireString(obj, "task_type", "intent_result");
  const selectedRole = requireString(obj, "selected_role", "intent_result");
  const language = requireString(obj, "language", "intent_result");

  if (!["portrait_prompt", "ui_prompt", "poster_prompt", "promo_prompt", "custom_prompt"].includes(taskType)) {
    throw new Error("intent_result.task_type is invalid.");
  }

  if (!["photographer", "ui_designer", "operator", "growth_hacker", "custom_role"].includes(selectedRole)) {
    throw new Error("intent_result.selected_role is invalid.");
  }

  if (!["zh", "en"].includes(language)) {
    throw new Error("intent_result.language is invalid.");
  }

  return {
    task_type: taskType as IntentResult["task_type"],
    selected_role: selectedRole as IntentResult["selected_role"],
    language: language as IntentResult["language"],
    focus: requireStringArray(obj, "focus", "intent_result"),
    user_goal_summary: requireString(obj, "user_goal_summary", "intent_result"),
    assumptions: requireStringArray(obj, "assumptions", "intent_result"),
    custom_type_notes: typeof obj["custom_type_notes"] === "string" ? (obj["custom_type_notes"] as string) : "",
    custom_role_notes: typeof obj["custom_role_notes"] === "string" ? (obj["custom_role_notes"] as string) : "",
  };
}

export function validateFinalResult(input: unknown): FinalResult {
  const obj = assertObject(input, "final_result");
  const language = requireString(obj, "language", "final_result");

  if (!["zh", "en"].includes(language)) {
    throw new Error("final_result.language is invalid.");
  }

  return {
    task_type: requireString(obj, "task_type", "final_result"),
    selected_role: requireString(obj, "selected_role", "final_result"),
    language: language as FinalResult["language"],
    analysis_summary: requireStringArray(obj, "analysis_summary", "final_result"),
    final_prompt: requireString(obj, "final_prompt", "final_result"),
    negative_prompt: typeof obj["negative_prompt"] === "string" ? (obj["negative_prompt"] as string) : "",
    color_notes: isStringArray(obj["color_notes"]) ? (obj["color_notes"] as string[]) : [],
    composition_notes: isStringArray(obj["composition_notes"]) ? (obj["composition_notes"] as string[]) : [],
    layout_notes: isStringArray(obj["layout_notes"]) ? (obj["layout_notes"] as string[]) : [],
    conversion_notes: isStringArray(obj["conversion_notes"]) ? (obj["conversion_notes"] as string[]) : [],
    copy_ready_prompt: requireString(obj, "copy_ready_prompt", "final_result"),
  };
}
