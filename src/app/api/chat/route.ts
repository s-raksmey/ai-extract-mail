import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { message: "Please send a valid message." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Demo mode: works even when you do not have API key yet.
    if (!apiKey) {
      return Response.json({
        message: "Demo response only",
      });
    }

    const client = new GoogleGenAI({ apiKey });

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    return Response.json({
      message: response.text ?? "No response text returned.",
    });
  } catch {
    return Response.json(
      { message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
