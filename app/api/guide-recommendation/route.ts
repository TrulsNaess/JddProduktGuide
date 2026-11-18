import { NextRequest, NextResponse } from "next/server";
import { GuideAnswers } from "@/src/types/domain";
import { productRepository } from "@/src/services/products/repository";
import { recommendProducts } from "@/src/services/recommendations/engine";

interface GuideRecommendationResponse {
  recommendedProductId?: string;
  summary: string;
  confidence: "low" | "medium" | "high";
  outOfScope: boolean;
  source: "openai" | "rules";
}

function tokenize(text?: string): string[] {
  if (!text) return [];
  return text
    .toLocaleLowerCase("nb")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 2);
}

function rulesFallback(answers: GuideAnswers): GuideRecommendationResponse {
  const ranking = recommendProducts(productRepository.getMainProducts(), answers);
  const best = ranking.bestMatch;

  if (!best) {
    return {
      summary:
        "Vi har ikke et produkt i vårt sortiment som passer det ønskede behovet akkurat nå.",
      confidence: "medium",
      outOfScope: true,
      source: "rules",
    };
  }

  return {
    recommendedProductId: best.productId,
    summary: "Anbefalt produkt er valgt fra vårt sortiment basert på behov, kontekst og prioriteringer.",
    confidence: "medium",
    outOfScope: false,
    source: "rules",
  };
}

function selectCandidates(answers: GuideAnswers) {
  const products = productRepository.getMainProducts();
  const queryTokens = tokenize(answers.productIntentText);

  const scored = products
    .map((product) => {
      const searchable = [
        product.name,
        product.shortDescription,
        product.category,
        ...product.features,
        ...product.specifications.map((spec) => `${spec.name} ${spec.value}`),
      ]
        .join(" ")
        .toLocaleLowerCase("nb");

      const tokenHits = queryTokens.filter((token) => searchable.includes(token)).length;
      const useCaseHit = answers.useCase ? product.useCases.includes(answers.useCase) : false;

      return {
        product,
        score: tokenHits * 2 + (useCaseHit ? 3 : 0),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 35)
    .map((entry) => ({
      id: entry.product.id,
      name: entry.product.name,
      category: entry.product.category,
      priceNok: entry.product.priceNok,
      summary: entry.product.shortDescription,
      features: entry.product.features.slice(0, 4),
    }));

  return scored;
}

export async function POST(request: NextRequest) {
  let payload: { answers?: GuideAnswers } = {};

  try {
    payload = (await request.json()) as { answers?: GuideAnswers };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const answers = payload.answers ?? {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(rulesFallback(answers));
  }

  try {
    const candidates = selectCandidates(answers);
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
              "Du velger kun ett produkt-id fra kandidatlisten dersom behovet passer vårt sortiment. Hvis behovet er utenfor sortimentet, sett outOfScope=true og la recommendedProductId være null. Returner kun JSON med feltene recommendedProductId, summary, confidence, outOfScope. confidence må være low|medium|high.",
          },
          {
            role: "user",
            content: JSON.stringify({
              answers,
              candidates,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(rulesFallback(answers));
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const raw = data.choices?.[0]?.message?.content;
    if (!raw) {
      return NextResponse.json(rulesFallback(answers));
    }

    const parsed = JSON.parse(raw) as {
      recommendedProductId?: string | null;
      summary?: string;
      confidence?: "low" | "medium" | "high";
      outOfScope?: boolean;
    };

    const validProductId =
      typeof parsed.recommendedProductId === "string" &&
      productRepository.getById(parsed.recommendedProductId)
        ? parsed.recommendedProductId
        : undefined;

    const result: GuideRecommendationResponse = {
      recommendedProductId: parsed.outOfScope ? undefined : validProductId,
      summary:
        typeof parsed.summary === "string" && parsed.summary.length > 0
          ? parsed.summary.slice(0, 260)
          : "Anbefaling beregnet fra behov og tilgjengelig sortiment.",
      confidence:
        parsed.confidence === "high" ||
        parsed.confidence === "medium" ||
        parsed.confidence === "low"
          ? parsed.confidence
          : "low",
      outOfScope: parsed.outOfScope === true || (!validProductId && !!answers.productIntentText),
      source: "openai",
    };

    if (result.outOfScope) {
      result.recommendedProductId = undefined;
      result.summary =
        result.summary ||
        "Dette behovet ser ut til å ligge utenfor sortimentet vårt. Vi anbefaler å sjekke en butikk med bredere utvalg.";
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(rulesFallback(answers));
  }
}
