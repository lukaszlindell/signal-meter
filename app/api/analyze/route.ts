import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildAnalysisUserPrompt, analysisSystemPrompt } from "@/lib/prompts";
import { normalizeAnalysis } from "@/lib/scoring";
import type { AnalysisResult, AnalyzeRequest } from "@/lib/types";

const MAX_TEXT_LENGTH = 12000;
const MIN_TEXT_LENGTH = 20;

export async function POST(request: Request) {
  let body: AnalyzeRequest;

  try {
    body = (await request.json()) as AnalyzeRequest;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";

  if (text.length < MIN_TEXT_LENGTH) {
    return NextResponse.json(
      { error: "Paste at least 20 characters so there is enough to analyze." },
      { status: 400 }
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: "Post text must be 12,000 characters or fewer." },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: analysisSystemPrompt
        },
        {
          role: "user",
          content: buildAnalysisUserPrompt(text)
        }
      ]
    });

    const content = completion.choices[0]?.message.content;
    if (!content) {
      throw new Error("The model returned an empty response.");
    }

    const parsed = JSON.parse(content) as Partial<AnalysisResult>;
    const result = normalizeAnalysis(parsed);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not analyze the post. Please try again." },
      { status: 500 }
    );
  }
}
