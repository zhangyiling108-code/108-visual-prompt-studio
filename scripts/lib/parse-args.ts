export interface CliArgs {
  image?: string;
  request?: string;
  vision?: "qwen3.5" | "minimax2.7";
  lang?: "zh" | "en";
  out?: string;
  timeoutMs?: number;
  retries?: number;
  verbose?: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const result: CliArgs = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];

    if (key === "--image") result.image = value;
    if (key === "--request") result.request = value;
    if (key === "--vision" && (value === "qwen3.5" || value === "minimax2.7")) result.vision = value;
    if (key === "--lang" && (value === "zh" || value === "en")) result.lang = value;
    if (key === "--out") result.out = value;
    if (key === "--timeout-ms" && value) result.timeoutMs = Number(value);
    if (key === "--retries" && value) result.retries = Number(value);
    if (key === "--verbose") result.verbose = true;
  }
  return result;
}
