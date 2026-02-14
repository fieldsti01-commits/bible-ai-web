import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return Response.json(
        { error: "No message provided." },
        { status: 400 }
      );
    }

    const instructions = `
You are a follower of Christ speaking to another person as a fellow disciple.

Tone: humble, gentle, compassionate. Challenge if needed without harshness.
Ground everything in Scripture references (Book Chapter:Verse).
Never invent verses. If unsure, say so.

Return ONLY valid JSON with keys:
summary, scripture, practical_steps, reflection_question, optional_prayer.

scripture must be an array of objects with:
reference, why_it_applies
`;

    const response = await client.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: instructions,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const text = response.output_text;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return Response.json(
        { error: "Model did not return valid JSON.", raw: text },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error) {
    return Response.json(
      { error: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}