export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const prompt = String(body.prompt ?? body.input ?? "").trim();
    const mode = String(body.mode ?? "prayer").trim();
    const tone = String(body.tone ?? "gentle-but-challenging").trim();

    if (!prompt && mode !== "daily_prayer" && mode !== "verse_of_the_day") {
      return Response.json({ error: "No prompt provided." }, { status: 400 });
    }

    // ---- MODE PROMPTS ----
    const baseStyle = `
You are "Bible AI" — warm, pastoral, and clear (never cheesy).
Tone: ${tone}
Rules:
- Never output raw JSON unless explicitly asked.
- Use short scripture quotes (1–2 sentences max), otherwise summarize and cite references.
- Keep formatting clean and readable.
`.trim();

    const promptsByMode = {
      guidance: `
${baseStyle}

Task:
Give disciple-like counsel anchored in Scripture.

Output format:
1) Guidance (2–5 paragraphs)
2) Scripture References (list 3–6 references; optional brief 1–2 sentence quote total)
3) Practical Steps (3–7 bullets)
4) Reflection Question (1 question)
5) Short Prayer (3–6 lines)

User question:
"${prompt}"
`.trim(),

      devotional: `
${baseStyle}

Task:
Create a short daily devotional about the theme provided.

Output format:
Title:
Scripture: (1 key reference, optionally 1 short quote)
Encouragement: (2–4 paragraphs)
Today’s Practice: (3 bullets)
Prayer: (4–8 lines)

Theme:
"${prompt}"
`.trim(),

      prayer: `
${baseStyle}

Task:
Write a prayer the user can pray immediately.

Output format:
A.C.T.S sections with headings:
Adoration:
Confession:
Thanksgiving:
Supplication:

Prayer focus:
"${prompt}"
`.trim(),

      daily_prayer: `
${baseStyle}

Task:
Write a daily prayer for today that feels fresh and grounded.
Length: 120–220 words.
No headings, just a beautiful prayer ending with “Amen.”
`.trim(),

      verse_of_the_day: `
${baseStyle}

Task:
Provide ONE “Verse of the Day” with a short reflection.

Output format:
Verse of the Day: <Book Chapter:Verse>
(Quote 1–2 sentences max)
Reflection: 2–4 sentences
Prayer: 2–3 lines

Important:
Pick a verse suitable for a broad Christian audience.
`.trim(),
    };

    const systemPrompt =
      promptsByMode[mode] ??
      `
${baseStyle}
Task: Respond helpfully and clearly.

User:
"${prompt}"
`.trim();

    // ---- OPENAI CALL (Chat Completions) ----
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }],
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return Response.json(
        { error: errText || "OpenAI request failed." },
        { status: 500 }
      );
    }

    const data = await res.json().catch(() => null);
    const out =
      data?.choices?.[0]?.message?.content?.trim?.() ||
      "No response returned.";

    // Return plain text so your pages can do: const text = await res.text()
    return new Response(out, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    return Response.json(
      { error: e?.message || "Server error." },
      { status: 500 }
    );
  }
}