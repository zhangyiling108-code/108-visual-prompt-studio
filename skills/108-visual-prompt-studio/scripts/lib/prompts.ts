import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const promptsDir = path.resolve(__dirname, "../../prompts");

export async function loadPrompt(fileName: string): Promise<string> {
  return fs.readFile(path.join(promptsDir, fileName), "utf-8");
}

export async function loadRolePrompt(role: string): Promise<string> {
  if (role === "photographer") return loadPrompt("role-photographer.md");
  if (role === "ui_designer") return loadPrompt("role-ui-designer.md");
  if (role === "operator") return loadPrompt("role-growth-operator.md");
  if (role === "growth_hacker") return loadPrompt("role-growth-hacker.md");
  if (role === "custom_role") return loadPrompt("role-custom.md");
  throw new Error(`Unknown role: ${role}`);
}
