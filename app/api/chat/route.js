// app/api/chat/route.js
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = (body?.prompt || "").trim();

    if (!prompt) {
      return Response.json(
        { error: "Please type a question before clicking Seek Wisdom." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Server missing OPENAI_API_KEY environment variable." },
        { status: 500 }
      );
    }

    // You can change this anytime (example models shown in OpenAI docs).  [oai_citation:1‡OpenAI Developers](https://developers.openai.com/api/reference/resources/responses/methods/create)
    const model = process.env.OPENAI_MODEL || "gpt-4.1";

    const discipleStyle = `
You are "Bible AI" — gentle, disciple-like, but willing to lovingly challenge when needed.
Use clear, pastoral language. Avoid condemnation. Be truthful and compassionate.

Return STRICT JSON ONLY with this shape:
{
  "guidance": "string",
  "scriptures": [
    { "reference": "Book X:Y–Z", "why_it_applies": "string" }
  ],
  "practical_steps": ["string", "string", "string"],
  "reflection": "string",
  "optional_prayer": "string"
}

Rules:
- Provide 6 scriptures (not 2-3).
- Each scripture: reference + 1–2 sentences why it applies.
- Include 4–6 practical steps.
- Reflection appears ONLY in the "reflection" field (do NOT repeat it in the prayer).
- Optional prayer should NOT contain the reflection question.
- Do not include any "debug" fields or extra keys.
- If user asks about self-harm or immediate danger, urge them to seek immediate help.
`.trim();

    const payload = {
      model,
      // "input" is required by the Responses API.  [oai_citation:2‡OpenAI Developers](https://developers.openai.com/api/reference/resources/responses/methods/create)
      input: [
        {
          role: "developer",
          content: [{ type: "input_text", text: discipleStyle }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }],
        },
      ],
    };

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();

    if (!r.ok) {
      const msg =
        data?.error?.message ||
        data?.message ||
        "OpenAI request failed. Check your model name and API key.";
      return Response.json({ error: msg }, { status: r.status });
    }

    // In SDKs there is output_text; with raw HTTP we safely extract text from output items.
    // If your response comes back as JSON text, we parse it.
    let text = "";
    if (Array.isArray(data?.output)) {
      for (const item of data.output) {
        if (Array.isArray(item?.content)) {
          for (const c of item.content) {
            if (c?.type === "output_text" && typeof c?.text === "string") {
              text += c.text;
            }
          }
        }
      }
    }

    // Fallback if text wasn’t found (rare)
    if (!text && typeof data?.output_text === "string") text = data.output_text;

    text = (text || "").trim();

    // Parse STRICT JSON (as instructed)
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "Model did not return valid JSON. Try again.", raw: text },
        { status: 502 }
      );
    }

    return Response.json({ reply: json });
  } catch (err) {
    return Response.json(
      { error: err?.message || "Server error." },
      { status: 500 }
    );
  }
}