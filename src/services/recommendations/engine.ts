import {
  GuideAnswers,
  Product,
  RankedRecommendation,
  RecommendationResult,
} from "@/src/types/domain";

interface ScoreWeights {
  useCase: number;
  environment: number;
  usageIntensity: number;
  priority: number;
  budget: number;
  categoryIntent: number;
  textIntent: number;
  preferredProduct: number;
}

const defaultWeights: ScoreWeights = {
  useCase: 30,
  environment: 25,
  usageIntensity: 20,
  priority: 15,
  budget: 10,
  categoryIntent: 10,
  textIntent: 12,
  preferredProduct: 8,
};

function scoreCriterion(
  match: boolean | undefined,
  weight: number,
): { points: number; matched: boolean } {
  if (match === undefined) {
    return { points: 0, matched: false };
  }

  return { points: match ? weight : 0, matched: !!match };
}

function mainCategory(category: string): string {
  return category.split("·")[0].trim().toLocaleLowerCase("nb");
}

function tokenize(text: string): string[] {
  return text
    .toLocaleLowerCase("nb")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 2);
}

export function recommendProducts(
  products: Product[],
  answers: GuideAnswers,
  weights: ScoreWeights = defaultWeights,
): RankedRecommendation {
  const prices = products.map((product) => product.priceNok);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = Math.max(1, maxPrice - minPrice);

  const scored = products
    .map((product): RecommendationResult => {
      const reasons: string[] = [];
      const limitations: string[] = [...product.limitations];
      const unmetAbsoluteRequirements: string[] = [];
      const matchedCriteria: string[] = [];
      let score = 0;

      if (answers.useCase) {
        const useCaseMatch = product.useCases.includes(answers.useCase);
        const useCase = scoreCriterion(useCaseMatch, weights.useCase);
        score += useCase.points;

        if (useCase.matched) {
          reasons.push("Passer bruksområdet du valgte.");
          matchedCriteria.push("Bruksområde");
        } else {
          unmetAbsoluteRequirements.push(
            "Produktet er ikke registrert for valgt bruksområde i produktutvalget.",
          );
        }
      }

      if (answers.environment) {
        const environmentMatch = product.environments.includes(answers.environment);
        const environment = scoreCriterion(environmentMatch, weights.environment);
        score += environment.points;

        if (environment.matched) {
          reasons.push("Egner seg for arbeidsmiljøet du beskrev.");
          matchedCriteria.push("Arbeidsmiljø");
        } else {
          limitations.push(
            "Miljømatch er svak: valgt miljø er ikke tydelig registrert for produktet.",
          );
        }
      }

      if (answers.usageIntensity) {
        const intensityMatch = product.usageIntensity.includes(answers.usageIntensity);
        const usageIntensity = scoreCriterion(intensityMatch, weights.usageIntensity);
        score += usageIntensity.points;

        if (usageIntensity.matched) {
          reasons.push("Støtter ønsket bruksintensitet.");
          matchedCriteria.push("Bruksintensitet");
        } else {
          limitations.push(
            "Bruksintensitet er ikke registrert som en tydelig match for produktet.",
          );
        }
      }

      if (answers.priority) {
        const priorityMatch = product.priorities.includes(answers.priority);
        const priority = scoreCriterion(priorityMatch, weights.priority);
        score += priority.points;

        if (priority.matched) {
          reasons.push("Matcher prioriteten du valgte.");
          matchedCriteria.push("Prioritet");
        } else {
          limitations.push(
            "Prioritert egenskap er ikke blant produktets tydeligste styrker.",
          );
        }
      }

      if (answers.categoryIntent) {
        const categoryMatch =
          mainCategory(product.category) ===
          answers.categoryIntent.toLocaleLowerCase("nb");
        if (categoryMatch) {
          score += weights.categoryIntent;
          reasons.push("Matcher valgt produktkategori.");
          matchedCriteria.push("Kategori");
        }
      }

      if (answers.productIntentText) {
        const intentTokens = tokenize(answers.productIntentText);
        const searchable = `${product.name} ${product.shortDescription} ${product.category} ${product.features.join(" ")}`.toLocaleLowerCase("nb");
        const matchedTokenCount = intentTokens.filter((token) => searchable.includes(token)).length;

        if (matchedTokenCount > 0) {
          const textScore = Math.min(
            weights.textIntent,
            matchedTokenCount * Math.max(2, Math.floor(weights.textIntent / 4)),
          );
          score += textScore;
          reasons.push("Samsvarer med behovsteksten du oppga.");
          matchedCriteria.push("Behovstekst");
        }
      }

      if (answers.preferredProductId && answers.preferredProductId === product.id) {
        score += weights.preferredProduct;
        reasons.push("Ligner produktet du markerte i trefflisten.");
        matchedCriteria.push("Eksempelvalg");
      }

      if (answers.budgetNok && answers.budgetNok > 0) {
        if (product.priceNok <= answers.budgetNok) {
          score += weights.budget;
          reasons.push("Ligger innenfor oppgitt budsjett.");
          matchedCriteria.push("Budsjett");
        } else {
          limitations.push("Ligger over oppgitt budsjett.");
        }
      }

      if (answers.valuePreference === "cheapest") {
        const priceAdvantage = (maxPrice - product.priceNok) / priceRange;
        score += Math.round(priceAdvantage * 12);
        reasons.push("Vektes opp fordi du prioriterte lavere pris.");
      } else if (answers.valuePreference === "best") {
        const performanceSignals = ["quality", "capacity", "durability"].filter((key) =>
          product.priorities.includes(key as Product["priorities"][number]),
        ).length;
        score += performanceSignals * 4;
        reasons.push("Vektes opp fordi du prioriterte best mulig match.");
      } else if (answers.valuePreference === "balanced") {
        const midPriceDistance = Math.abs(
          product.priceNok - (minPrice + maxPrice) / 2,
        );
        const balancedBoost = Math.max(0, 6 - Math.round((midPriceDistance / priceRange) * 10));
        score += balancedBoost;
      }

      if (!reasons.length) {
        reasons.push(
          "Grunnmatch basert på tilgjengelige produktdata. Legg til flere svar for mer presis anbefaling.",
        );
      }

      return {
        productId: product.id,
        score,
        reasons,
        limitations,
        unmetAbsoluteRequirements,
        matchedCriteria,
      };
    })
    .filter((result) => result.unmetAbsoluteRequirements.length === 0)
    .sort((a, b) => b.score - a.score);

  const bestMatch = scored[0] ?? null;
  const alternatives = scored.slice(1, 4);

  return {
    bestMatch,
    alternatives,
    allRanked: scored,
  };
}
