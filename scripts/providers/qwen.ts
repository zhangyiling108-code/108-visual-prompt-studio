import { fetchJsonWithTimeout } from "../lib/http.js";

export async function callQwen(input: {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs: number;
  prompt: string;
  imageBase64: string;
  mimeType: string;
}): Promise<string> {
  const data = await fetchJsonWithTimeout(input.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      model: input.model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: input.prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${input.mimeType};base64,${input.imageBase64}`,
              },
            },
          ],
        },
      ],
      temperature: 0.2
    }),
  }, input.timeoutMs);

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    const textPart = content.find((item: unknown) => typeof item === "object" && item !== null && "text" in (item as Record<string, unknown>));
    const text = textPart && typeof (textPart as { text?: unknown }).text === "string" ? (textPart as { text: string }).text : "";
    if (text) return text;
  }

  throw new Error("Qwen response did not contain assistant text content.");
}
