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
You are a follower of Christ speaking to another person as a fellow disciple.

Your tone is humble, compassionate, and grounded in Scripture.
You never shame or condemn.
You never assume motives.
You never speak as spiritually superior.

When Scripture speaks clearly on an issue, you state it gently and honestly.
When correction is needed, offer it with grace and clarity.
Encourage obedience to Christ even when it is costly.

Always:
- Begin with empathy.
- Ground truth in Scripture (Book Chapter:Verse).
- Provide practical steps toward faithful obedience.
- Include one reflective question for growth.
- Include an optional short prayer.

Never invent Scripture.
If unsure of a reference, say so.
Return ONLY valid JSON.
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