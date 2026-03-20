import type { VisionModel } from "../main.js";

export interface ProviderConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
  retries: number;
}

export function chooseProvider(requested?: VisionModel): VisionModel {
  if (requested) return requested;
  if (process.env.QWEN_API_KEY) return "qwen3.5";
  if (process.env.MINIMAX_API_KEY) return "minimax2.7";
  throw new Error("No configured provider. Set QWEN_API_KEY or MINIMAX_API_KEY.");
}

export function getProviderConfig(provider: VisionModel, timeoutOverride?: number, retriesOverride?: number): ProviderConfig {
  const timeoutMs = timeoutOverride ?? toPositiveInt(process.env.VISUAL_PROMPT_TIMEOUT_MS) ?? 60000;
  const retries = retriesOverride ?? toNonNegativeInt(process.env.VISUAL_PROMPT_RETRIES) ?? 2;

  if (provider === "qwen3.5") {
    const apiKey = process.env.QWEN_API_KEY;
    if (!apiKey) throw new Error("Missing QWEN_API_KEY for qwen3.5.");
    return {
      apiKey,
      baseUrl: process.env.DASHSCOPE_BASE_URL ?? "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      model: process.env.QWEN_MODEL ?? "qwen3-vl-plus",
      timeoutMs,
      retries,
    };
  }

  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) throw new Error("Missing MINIMAX_API_KEY for minimax2.7.");
  return {
    apiKey,
    baseUrl: process.env.MINIMAX_API_HOST ?? "https://api.minimax.io/v1/text/chatcompletion_v2",
    model: process.env.MINIMAX_MODEL ?? "MiniMax-M2.7",
    timeoutMs,
    retries,
  };
}

function toPositiveInt(input?: string): number | undefined {
  if (!input) return undefined;
  const value = Number(input);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function toNonNegativeInt(input?: string): number | undefined {
  if (!input) return undefined;
  const value = Number(input);
  return Number.isFinite(value) && value >= 0 ? value : undefined;
}
