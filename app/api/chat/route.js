import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { userText } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY (add it to Codespaces secrets)" },
        { status: 500 }
      );
    }

    const instructions = `
You are a neutral Christian pastoral assistant.
Be compassionate and non-judgmental.
Provide Bible references (Book Chapter:Verse).
If you are not sure of an exact reference, say so and ask 1 follow-up question.
Do not invent verses.
Return ONLY valid JSON with keys: summary, scripture, practical_steps, optional_prayer.
scripture must be an array of objects with: reference, why_it_applies.
`;

    const response = await client.responses.create({
      model: "gpt-5.2",
      instructions,
      input: userText,
    });

    const text = response.output_text;

    try {
      return Response.json(JSON.parse(text));
    } catch {
      return Response.json({ raw: text });
    }
  } catch (err) {
    return Response.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}