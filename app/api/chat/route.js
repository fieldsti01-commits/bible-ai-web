import OpenAI from "openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { input, tone } = body;

    if (!input || input.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: input" }),
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
You are a mature disciple of Jesus.

Respond gently, compassionately, and truthfully.
Encourage repentance and obedience when necessary, without condemnation.
Use the CEB translation when quoting Scripture.
Always include relevant Bible references.
End with one reflective question.
Optionally include a short prayer if fitting.

${tone || ""}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: input,
        },
      ],
    });

    const text = response.output_text;

    return new Response(
      JSON.stringify({
        summary: text,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("API ERROR:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Server error",
      }),
      { status: 500 }
    );
  }
}