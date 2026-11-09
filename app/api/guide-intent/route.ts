import { NextRequest, NextResponse } from "next/server";
import { GuideUseCase, ValuePreference } from "@/src/types/domain";

interface IntentResponse {
  summary: string;
  suggestedUseCase?: GuideUseCase;
  suggestedValuePreference?: ValuePreference;
  keywords: string[];
  confidence: "low" | "medium" | "high";
  source: "heuristic" | "openai";
}

function heuristicIntent(text: string): IntentResponse {
  const normalized = text.toLocaleLowerCase("nb");

  let suggestedUseCase: GuideUseCase | undefined;
  if (/(traktor|gård|landbruk|fjøs)/.test(normalized)) suggestedUseCase = "agriculture";
  else if (/(anlegg|bygg|entrepren)/.test(normalized)) suggestedUseCase = "construction";
  else if (/(transport|henger|løft|håndtering)/.test(normalized)) suggestedUseCase = "transport";
  else if (/(verksted|bil|motor)/.test(normalized)) suggestedUseCase = "workshop";
  else if (/(park|kommune|uteområde)/.test(normalized)) suggestedUseCase = "parks";
  else if (/(service|vedlikehold|reparasjon)/.test(normalized)) suggestedUseCase = "maintenance";

  let suggestedValuePreference: ValuePreference | undefined;
  if (/(billig|rimelig|lav pris|budsjett)/.test(normalized)) {
    suggestedValuePreference = "cheapest";
  } else if (/(best|kvalitet|ytelse|driftssikker)/.test(normalized)) {
    suggestedValuePreference = "best";
  } else if (normalized.length > 0) {
    suggestedValuePreference = "balanced";
  }

  const keywords = normalized
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 2)
    .slice(0, 8);

  return {
    summary:
      text.trim().length > 0
        ? `Tolket behov: ${text.trim().slice(0, 140)}`
        : "Ingen fritekst oppgitt.",
    suggestedUseCase,
    suggestedValuePreference,
    keywords,
    confidence: suggestedUseCase || suggestedValuePreference ? "medium" : "low",
    source: "heuristic",
  };
}

export async function POST(request: NextRequest) {
  let payload: { text?: string } = {};

  try {
    payload = (await request.json()) as { text?: string };
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const text = payload.text?.trim() ?? "";

  if (!text) {
    return NextResponse.json(heuristicIntent(""));
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(heuristicIntent(text));
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Du er en assistent som kun tolker brukerbehov til strukturert JSON. Ikke oppgi produkter, spesifikasjoner eller kompatibilitet. Returner kun JSON med feltene: summary, suggestedUseCase, suggestedValuePreference, keywords, confidence. suggestedUseCase må være en av maintenance|construction|transport|agriculture|parks|workshop|other eller null. suggestedValuePreference må være best|cheapest|balanced eller null. confidence må være low|medium|high.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(heuristicIntent(text));
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const raw = data.choices?.[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(heuristicIntent(text));
    }

    const parsed = JSON.parse(raw) as Omit<IntentResponse, "source">;

    const safe: IntentResponse = {
      summary:
        typeof parsed.summary === "string"
          ? parsed.summary.slice(0, 200)
          : "Behov tolket fra fritekst.",
      suggestedUseCase: parsed.suggestedUseCase,
      suggestedValuePreference: parsed.suggestedValuePreference,
      keywords: Array.isArray(parsed.keywords)
        ? parsed.keywords.filter((item) => typeof item === "string").slice(0, 8)
        : [],
      confidence:
        parsed.confidence === "high" ||
        parsed.confidence === "medium" ||
        parsed.confidence === "low"
          ? parsed.confidence
          : "low",
      source: "openai",
    };

    return NextResponse.json(safe);
  } catch {
    return NextResponse.json(heuristicIntent(text));
  }
}
