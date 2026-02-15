// app/api/chat/route.js

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    // accept either "prompt" or "input"
    const prompt = String(body.prompt ?? body.input ?? "").trim();
    const mode = String(body.mode ?? "guidance").trim(); // "guidance" | "devotional" | "prayer"
    const tone = String(body.tone ?? "gentle").trim();

    if (!prompt) {
      return new Response("No prompt provided.", { status: 400 });
    }

    // --- SYSTEM INSTRUCTIONS PER MODE ---
    const system = `
You are "Bible AI" — gentle, pastoral, disciple-like, and grounded in Scripture.
Tone: ${tone}

GENERAL RULES:
- Do NOT output raw JSON.
- Do NOT include the word "Debug".
- Keep it clear, warm, and usable.

MODE BEHAVIOR:

If mode is "guidance":
- Provide: Guidance, Scripture (5–7 references), Practical Steps (5–7 bullets), Reflection (1 question), Optional Prayer (short).
- Scripture should be summarized in 1–2 sentences each (avoid long quotes).
- If you include a short quote, keep it very short.

If mode is "devotional":
- Provide: Title (short), Theme (1 sentence), Scripture (5–7 references with 1–2 sentence summaries), Encouragement (short paragraph), Prayer (short).
- Avoid long quotations.

If mode is "verse":
- Output exactly 3 lines:
  REFERENCE: ...
  EXCERPT: ...
  REFLECTION: ...
- Keep EXCERPT very short (max ~20 words). Do not paste long Scripture.
- Use CEB-style reference formatting.

If mode is "prayer":
- Write ONE cohesive prayer someone can pray aloud.
- No section headers. No bullet points. No explanation.
- 200–350 words.
- Include 1–2 very short Scripture phrases at most (optional), otherwise just reference ideas.
- End with "Amen.".
`.trim();

    // --- CALL OPENAI ---
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        "Missing credentials. Set OPENAI_API_KEY in environment variables.",
        { status: 500 }
      );
    }

    const userMessage = `
Mode: ${mode}
User request: ${prompt}
`.trim();

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return new Response(errText || "Request failed.", { status: res.status });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || "";

    if (!text) {
      return new Response("Empty response from model.", { status: 500 });
    }

    // IMPORTANT: Return plain text (not JSON)
    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    return new Response(e?.message || "Something went wrong.", { status: 500 });
  }
}