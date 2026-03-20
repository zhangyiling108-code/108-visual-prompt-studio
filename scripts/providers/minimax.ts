import { fetchJsonWithTimeout } from "../lib/http.js";

export async function callMiniMax(input: {
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
          name: "User",
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
      temperature: 0.2,
      max_completion_tokens: 2048
    }),
  }, input.timeoutMs);

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;

  const reply = data?.reply;
  if (typeof reply === "string") return reply;

  throw new Error("MiniMax response did not contain assistant text content.");
}
