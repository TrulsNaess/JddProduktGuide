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
}

const defaultWeights: ScoreWeights = {
  useCase: 30,
  environment: 25,
  usageIntensity: 20,
  priority: 15,
  budget: 10,
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

export function recommendProducts(
  products: Product[],
  answers: GuideAnswers,
  weights: ScoreWeights = defaultWeights,
): RankedRecommendation {
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
        const usageIntensity = scoreCriterion(
          intensityMatch,
          weights.usageIntensity,
        );
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

      if (answers.budgetNok && answers.budgetNok > 0) {
        if (product.priceNok <= answers.budgetNok) {
          score += weights.budget;
          reasons.push("Ligger innenfor oppgitt budsjett.");
          matchedCriteria.push("Budsjett");
        } else {
          limitations.push("Ligger over oppgitt budsjett.");
        }
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
