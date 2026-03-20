import fs from "node:fs/promises";
import path from "node:path";
import { callQwen } from "./providers/qwen.js";
import { callMiniMax } from "./providers/minimax.js";
import { parseArgs } from "./lib/parse-args.js";
import { extractJsonObject, parseJson } from "./lib/parse-json.js";
import { chooseProvider, getProviderConfig } from "./lib/provider.js";
import { loadPrompt, loadRolePrompt } from "./lib/prompts.js";
import { renderPromptPackageTable } from "./lib/render.js";
import { validateFinalResult, validateIntentResult, validateVisionResult } from "./lib/schema.js";
import { sleep } from "./lib/sleep.js";

export type VisionModel = "qwen3.5" | "minimax2.7";

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.image) throw new Error("Missing --image");
  if (!args.request) throw new Error("Missing --request");

  const provider = chooseProvider(args.vision);
  const config = getProviderConfig(provider, args.timeoutMs, args.retries);
  const imageBuffer = await fs.readFile(args.image);
  const imageBase64 = imageBuffer.toString("base64");
  const mimeType = guessMimeType(args.image);

  const visionPrompt = await loadPrompt("vision-analysis.md");
  const intentPrompt = await loadPrompt("intent-parser.md");
  const finalComposerPrompt = await loadPrompt("final-prompt-composer.md");

  const visionRaw = await callWithRetry(
    () =>
      callProvider({
        provider,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        model: config.model,
        timeoutMs: config.timeoutMs,
        prompt: [visionPrompt, "", "Analyze the provided image and return valid JSON only."].join("\n"),
        imageBase64,
        mimeType,
      }),
    config.retries,
    args.verbose === true,
    "vision-analysis"
  );

  const visionJson = validateVisionResult(parseJson(extractJsonObject(visionRaw)));

  const intentRaw = await callWithRetry(
    () =>
      callProvider({
        provider,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        model: config.model,
        timeoutMs: config.timeoutMs,
        prompt: [
          intentPrompt,
          "",
          "User request:",
          args.request,
          "",
          "Vision analysis JSON:",
          JSON.stringify(visionJson, null, 2),
          "",
          `Preferred language override: ${args.lang ?? "not provided"}`,
          "",
          "Return valid JSON only."
        ].join("\n"),
        imageBase64,
        mimeType,
      }),
    config.retries,
    args.verbose === true,
    "intent-parser"
  );

  const intentJson = validateIntentResult(parseJson(extractJsonObject(intentRaw)));
  const rolePrompt = await loadRolePrompt(intentJson.selected_role);

  const finalRaw = await callWithRetry(
    () =>
      callProvider({
        provider,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
        model: config.model,
        timeoutMs: config.timeoutMs,
        prompt: [
          finalComposerPrompt,
          "",
          "Vision analysis JSON:",
          JSON.stringify(visionJson, null, 2),
          "",
          "Intent parser JSON:",
          JSON.stringify(intentJson, null, 2),
          "",
          "Selected role prompt:",
          rolePrompt,
          "",
          "Return valid JSON only."
        ].join("\n"),
        imageBase64,
        mimeType,
      }),
    config.retries,
    args.verbose === true,
    "final-prompt-composer"
  );

  const finalJson = validateFinalResult(parseJson(extractJsonObject(finalRaw)));

  // Enforce routed language if the model accidentally drifts.
  if (finalJson.language !== intentJson.language) {
    finalJson.language = intentJson.language;
  }

  const output = args.json
    ? JSON.stringify(finalJson, null, 2)
    : renderPromptPackageTable(finalJson);

  if (args.out) {
    await fs.mkdir(path.dirname(args.out), { recursive: true });
    await fs.writeFile(args.out, output + "\n", "utf-8");
    if (args.verbose) {
      console.error(`[108-visual-prompt-studio] Wrote output to ${args.out}`);
    }
  } else {
    process.stdout.write(output + "\n");
  }
}

async function callProvider(input: {
  provider: VisionModel;
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
  prompt: string;
  imageBase64: string;
  mimeType: string;
}): Promise<string> {
  if (input.provider === "qwen3.5") {
    return callQwen(input);
  }
  return callMiniMax(input);
}

async function callWithRetry<T>(
  fn: () => Promise<T>,
  retries: number,
  verbose: boolean,
  stage: string
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      if (verbose) {
        console.error(`[108-visual-prompt-studio] ${stage} attempt ${attempt + 1}/${retries + 1}`);
      }
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;

      const delayMs = Math.min(1000 * (2 ** attempt), 4000);
      if (verbose) {
        console.error(
          `[108-visual-prompt-studio] ${stage} retrying in ${delayMs}ms: ${stringifyError(error)}`
        );
      }
      await sleep(delayMs);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function guessMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function stringifyError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

main().catch((error) => {
  console.error(
    "[108-visual-prompt-studio] Failed:",
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
