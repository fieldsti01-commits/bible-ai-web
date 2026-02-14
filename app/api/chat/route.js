// app/api/chat/route.js
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const responseSchema = {
  name: "bible_ai_response",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      guidance: { type: "string" },
      scripture: {
        type: "array",
        minItems: 5,
        maxItems: 10,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            reference: { type: "string" },
            summary: { type: "string" },
            disciple_application: { type: "string" },
            short_excerpt: {
              type: "string",
              description:
                "Optional: a very short excerpt (keep it brief). If unsure, leave empty string.",
            },
          },
          required: ["reference", "summary", "disciple_application", "short_excerpt"],
        },
      },
      practical_steps: {
        type: "array",
        minItems: 3,
        maxItems: 7,
        items: { type: "string" },
      },
      reflection: { type: "string" },
      optional_prayer: { type: "string" },
    },
    required: ["guidance", "scripture", "practical_steps", "reflection", "optional_prayer"],
  },
};

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = (body?.prompt || "").trim();

    if (!prompt) {
      return Response.json({ error: "No prompt provided." }, { status: 400 });
    }

    const system = `
You are "Bible AI" — a gentle but appropriately challenging disciple-maker.
Tone: warm, humble, direct, hope-filled. Not harsh or shaming.
Goal: deep discipleship. Encourage repentance, faith, wisdom, community, and next steps.

IMPORTANT OUTPUT RULES:
- Return ONLY valid JSON that matches the provided schema.
- Provide 5–10 scripture items (reference + brief summary + disciple_application).
- DO NOT paste long Scripture passages (summaries are preferred).
- Reflection must appear ONLY in the "reflection" field (do NOT repeat inside the prayer).
- Optional prayer must NOT include the reflection question.
- Assume the user wants CEB-style plain language, but summarize (don’t quote long text).
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system.trim() },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: responseSchema,
        strict: true,
      },
    });

    const content = completion?.choices?.[0]?.message?.content || "";
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return Response.json(
        { error: "Model returned non-JSON output.", raw: content },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json(
      { error: err?.message || "Unknown server error." },
      { status: 500 }
    );
  }
}