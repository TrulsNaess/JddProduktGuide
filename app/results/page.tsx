"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AddToCartButton } from "@/src/components/cart/add-to-cart-button";
import { AccessoryCard } from "@/src/components/recommendations/accessory-card";
import { RecommendationCard } from "@/src/components/recommendations/recommendation-card";
import { ProductCard } from "@/src/components/products/product-card";
import { Section } from "@/src/components/ui/section";
import { addToCart } from "@/src/services/cart/session";
import { buildPackageSummary, getAccessorySuggestions } from "@/src/services/compatibility/accessories";
import { formatNok } from "@/src/services/format/price";
import { clearGuideAnswers, loadGuideAnswers } from "@/src/services/guide/session";
import { productRepository } from "@/src/services/products/repository";
import { recommendProducts } from "@/src/services/recommendations/engine";
import { GuideAnswers, Priority, RecommendationResult, ValuePreference } from "@/src/types/domain";

interface AiRecommendationResponse {
  recommendedProductId?: string;
  summary: string;
  confidence: "low" | "medium" | "high";
  outOfScope: boolean;
  source: "openai" | "rules";
}

function valuePreferenceLabel(value?: ValuePreference): string {
  if (value === "best") return "Best mulig match";
  if (value === "cheapest") return "Billigste relevante alternativ";
  return "Balansert mellom pris og kvalitet";
}

function priorityLabel(value?: Priority): string {
  if (value === "price") return "Lavest mulig pris";
  if (value === "quality") return "Best mulig kvalitet";
  if (value === "capacity") return "Høy kapasitet";
  if (value === "flexibility") return "Fleksibilitet";
  if (value === "durability") return "Lang levetid";
  return "Ikke spesifisert";
}

export default function ResultsPage() {
  const products = productRepository.getMainProducts();
  const accessories = productRepository.getAccessories().filter((item) => !item.isDemo);
  const [answers, setAnswers] = useState<GuideAnswers>({});
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AiRecommendationResponse | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswers(loadGuideAnswers());
    setIsHydrated(true);
  }, []);

  const combinedNeedText = useMemo(
    () => `${answers.needText ?? ""} ${answers.productIntentText ?? ""}`.trim() || undefined,
    [answers.needText, answers.productIntentText],
  );

  const answersForRecommendation: GuideAnswers = useMemo(
    () => ({
      ...answers,
      productIntentText: combinedNeedText,
    }),
    [answers, combinedNeedText],
  );

  useEffect(() => {
    if (!isHydrated) return;

    const hasInput = !!answersForRecommendation.productIntentText?.trim();

    if (!hasInput) {
      return;
    }

    let cancelled = false;

    async function runAiRecommendation() {
      setIsAnalysing(true);

      try {
        const response = await fetch("/api/guide-recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: answersForRecommendation }),
        });

        if (!response.ok || cancelled) {
          return;
        }

        const data = (await response.json()) as AiRecommendationResponse;
        if (!cancelled) {
          setAiRecommendation(data);
        }
      } finally {
        if (!cancelled) {
          setIsAnalysing(false);
        }
      }
    }

    void runAiRecommendation();

    return () => {
      cancelled = true;
    };
  }, [answersForRecommendation, isHydrated]);

  const ranking = recommendProducts(products, answersForRecommendation);
  const fallbackResult = ranking.bestMatch;

  const bestProduct = useMemo(() => {
    if (aiRecommendation?.outOfScope) return undefined;
    if (aiRecommendation?.recommendedProductId) {
      const aiProduct = productRepository.getById(aiRecommendation.recommendedProductId);
      if (aiProduct) {
        return aiProduct;
      }
    }

    return fallbackResult ? productRepository.getById(fallbackResult.productId) : undefined;
  }, [aiRecommendation, fallbackResult]);

  const bestResult: RecommendationResult | undefined = useMemo(() => {
    if (!bestProduct) return undefined;

    const fromRanking = ranking.allRanked.find((item) => item.productId === bestProduct.id);
    if (fromRanking) return fromRanking;

    return {
      productId: bestProduct.id,
      score: 0,
      reasons: ["Valgt som beste tilgjengelige match for beskrevet behov."],
      limitations: [],
      unmetAbsoluteRequirements: [],
      matchedCriteria: [],
    };
  }, [bestProduct, ranking.allRanked]);

  const accessorySuggestions = bestProduct
    ? getAccessorySuggestions(bestProduct, accessories)
    : [];

  const selectedAccessories = accessories.filter((item) =>
    selectedAccessoryIds.includes(item.id),
  );

  const packageSummary = bestProduct
    ? buildPackageSummary(bestProduct, selectedAccessories)
    : null;

  function toggleAccessory(productId: string) {
    setSelectedAccessoryIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }

      return [...prev, productId];
    });
  }

  function addPackageToCart() {
    if (!bestProduct) return;

    addToCart(bestProduct.id, 1, { source: "guide", suppressPackageOffer: true });
    selectedAccessories.forEach((item) =>
      addToCart(item.id, 1, { source: "guide", suppressPackageOffer: true }),
    );
  }

  function restartGuide() {
    clearGuideAnswers();
    setAnswers({});
    setSelectedAccessoryIds([]);
    setAiRecommendation(null);
  }

  if (!isHydrated) {
    return (
      <Section
        title="Laster anbefaling"
        description="Henter svarene dine fra produktguiden."
      >
        <p className="text-sm text-slate-600">Vennligst vent…</p>
      </Section>
    );
  }

  if (!fallbackResult && !aiRecommendation) {
    return (
      <Section
        title="Ingen anbefaling tilgjengelig ennå"
        description="For å få en anbefaling må du svare på noen spørsmål i produktguiden."
      >
        <div className="flex gap-3">
          <Link
            href="/guide"
            className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Start produktguiden
          </Link>
          <Link
            href="/products"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            Se alle produkter
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        <p className="font-semibold">Et utvalg ekte JDD-produkter</p>
        <p>
          Priser og spesifikasjoner er hentet fra JDD Utstyr og kan endres.
          Anbefalingen kombinerer AI-tolkning og registrerte produktdata.
        </p>
      </div>

      <Section
        title="Oppsummert behov"
        description="Dette er grunnlaget for anbefalingen."
      >
        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-semibold">Behov:</span>{" "}
            {answers.productIntentText || "Ikke oppgitt"}
          </p>
          <p>
            <span className="font-semibold">Hva trenger du:</span>{" "}
            {answers.needText || "Ikke oppgitt"}
          </p>
          <p>
            <span className="font-semibold">Hvor/hvordan brukes det:</span>{" "}
            {answers.contextDetails || "Ikke oppgitt"}
          </p>
          <p>
            <span className="font-semibold">Skal brukes med noe annet:</span>{" "}
            {answers.specialRequirements || "Ikke oppgitt"}
          </p>
          <p>
            <span className="font-semibold">Prioritering:</span>{" "}
            {valuePreferenceLabel(answers.valuePreference)}
          </p>
          <p>
            <span className="font-semibold">Viktigste egenskap:</span>{" "}
            {priorityLabel(answers.priority)}
          </p>
          <p>
            <span className="font-semibold">Budsjett:</span>{" "}
            {answers.budgetNok ? formatNok(answers.budgetNok) : "Ikke oppgitt"}
          </p>
        </div>
        {isAnalysing ? (
          <p className="mt-3 text-sm text-slate-500">AI analyserer behovet ditt…</p>
        ) : aiRecommendation ? (
          <p className="mt-3 text-sm text-slate-600">
            <span className="font-semibold">AI-vurdering:</span> {aiRecommendation.summary}
          </p>
        ) : null}
      </Section>

      {aiRecommendation?.outOfScope ? (
        <Section
          title="Behovet ser ut til å ligge utenfor sortimentet"
          description="Vi har ikke et produkt som passer det ønskede behovet akkurat nå."
        >
          <p className="text-sm text-slate-700">
            For denne typen forespørsel selger vi ikke et produkt som matcher godt nok.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/guide?resume=1"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Juster behov i guiden
            </Link>
            <Link
              href="/products"
              className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Se vårt sortiment
            </Link>
          </div>
        </Section>
      ) : bestProduct && bestResult ? (
        <>
          <RecommendationCard
            title="Vår anbefaling"
            product={bestProduct}
            recommendation={bestResult}
          />

          <div className="flex flex-wrap gap-3">
            <AddToCartButton
              productId={bestProduct.id}
              source="guide"
              label="Legg anbefaling i handlekurv"
            />
            <Link
              href="/cart"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Gå til handlekurv
            </Link>
          </div>

          <Section
            title="Alternative produkter"
            description="Hele kortet er klikkbart for å se detaljer."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ranking.alternatives.length > 0 ? (
                ranking.alternatives.map((alternative, index) => {
                  const product = productRepository.getById(alternative.productId);
                  if (!product) {
                    return null;
                  }

                  const label =
                    answers.valuePreference === "cheapest"
                      ? index === 0
                        ? "Alternativ: nest billigste match"
                        : index === 1
                          ? "Alternativ: bedre kapasitet"
                          : "Alternativ: mer robust"
                      : answers.valuePreference === "best"
                        ? index === 0
                          ? "Alternativ: høy ytelse"
                          : index === 1
                            ? "Alternativ: lavere pris"
                            : "Alternativ: fleksibelt valg"
                        : index === 0
                          ? "Alternativ: beste totalvalg"
                          : index === 1
                            ? "Alternativ: budsjettfokus"
                            : "Alternativ: intensiv bruk";

                  return <ProductCard key={product.id} product={product} label={label} />;
                })
              ) : (
                <p className="text-sm text-slate-600">Ingen alternativer tilgjengelig.</p>
              )}
            </div>
          </Section>

          <Section
            title="Pakketilbud"
            description="Velg tilbehør som passer anbefalingen, og legg hele pakken i handlekurven."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {accessorySuggestions.length > 0 ? (
                accessorySuggestions.map((suggestion) => (
                  <AccessoryCard
                    key={suggestion.product.id}
                    suggestion={suggestion}
                    selected={selectedAccessoryIds.includes(suggestion.product.id)}
                    onToggle={toggleAccessory}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-600">
                  Ingen registrerte tilbehørsforslag for dette produktet.
                </p>
              )}
            </div>

            {packageSummary && selectedAccessories.length > 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[340px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-700">
                        <th className="py-2 pr-4">Produkt</th>
                        <th className="py-2 text-right">Pris</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packageSummary.lines.map((line) => (
                        <tr key={line.productId} className="border-b border-slate-100">
                          <td className="py-2 pr-4 text-slate-700">{line.name}</td>
                          <td className="py-2 text-right text-slate-900">
                            {formatNok(line.priceNok)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="pt-3 pr-4 font-semibold text-slate-700">Samlet pris</td>
                        <td className="pt-3 text-right font-semibold text-slate-900">
                          {formatNok(packageSummary.subtotalNok)}
                        </td>
                      </tr>
                      <tr>
                        <td className="pt-1 pr-4 font-semibold text-slate-700">Pakkerabatt</td>
                        <td className="pt-1 text-right font-semibold text-emerald-700">
                          - {formatNok(packageSummary.packageDiscountNok)}
                        </td>
                      </tr>
                      <tr>
                        <td className="pt-1 pr-4 text-lg font-semibold text-slate-900">Total</td>
                        <td className="pt-1 text-right text-lg font-semibold text-slate-900">
                          {formatNok(packageSummary.totalNok)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={addPackageToCart}
                  className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Legg pakketilbud i handlekurv
                </button>
              </div>
            ) : null}
          </Section>
        </>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/guide?resume=1"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Endre svar i guiden
        </Link>
        <Link
          href="/guide"
          onClick={restartGuide}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Start guiden på nytt
        </Link>
      </div>
    </div>
  );
}
