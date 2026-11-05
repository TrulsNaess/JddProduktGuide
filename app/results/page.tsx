"use client";

import Link from "next/link";
import { useState } from "react";
import { AccessoryCard } from "@/src/components/recommendations/accessory-card";
import { RecommendationCard } from "@/src/components/recommendations/recommendation-card";
import { ProductCard } from "@/src/components/products/product-card";
import { Section } from "@/src/components/ui/section";
import { buildPackageSummary, getAccessorySuggestions } from "@/src/services/compatibility/accessories";
import { formatNok } from "@/src/services/format/price";
import { clearGuideAnswers, loadGuideAnswers } from "@/src/services/guide/session";
import { productRepository } from "@/src/services/products/repository";
import { recommendProducts } from "@/src/services/recommendations/engine";
import { GuideAnswers } from "@/src/types/domain";

export default function ResultsPage() {
  const products = productRepository.getMainProducts();
  const accessories = productRepository.getAccessories();
  const [answers, setAnswers] = useState<GuideAnswers>(() => loadGuideAnswers());
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);

  const ranking = recommendProducts(products, answers);
  const bestResult = ranking.bestMatch;
  const bestProduct = bestResult
    ? productRepository.getById(bestResult.productId)
    : undefined;

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

  function restartGuide() {
    clearGuideAnswers();
    setAnswers({});
    setSelectedAccessoryIds([]);
  }

  if (!bestResult || !bestProduct) {
    return (
      <Section
        title="Ingen anbefaling tilgjengelig ennå"
        description="For å få en anbefaling må du svare på noen spørsmål i produktguiden."
      >
        <div className="flex gap-3">
          <Link
            href="/guide"
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
          >
            Start produktguiden
          </Link>
          <Link
            href="/products"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            Se alle demoprodukter
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        <p className="font-semibold">Demodata</p>
        <p>
          Produkter, spesifikasjoner, priser og kompatibilitet på denne siden er
          fiktive eksempeldata for prototypeformål.
        </p>
      </div>

      <RecommendationCard
        title="Vår anbefaling"
        product={bestProduct}
        recommendation={bestResult}
      />

      <Section
        title="Alternative produkter"
        description="Disse valgene kan passe dersom du ønsker en annen balanse mellom pris, kapasitet og fleksibilitet."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ranking.alternatives.length > 0 ? (
            ranking.alternatives.map((alternative, index) => {
              const product = productRepository.getById(alternative.productId);
              if (!product) {
                return null;
              }

              const label =
                index === 0
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
        title="Gjør løsningen komplett"
        description="Tilbehør hentes fra registrerte kompatibilitetsrelasjoner i demodata."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {accessorySuggestions.map((suggestion) => (
            <AccessoryCard
              key={suggestion.product.id}
              suggestion={suggestion}
              selected={selectedAccessoryIds.includes(suggestion.product.id)}
              onToggle={toggleAccessory}
            />
          ))}
        </div>
      </Section>

      {packageSummary ? (
        <Section
          title="Eksempel på pakketilbud"
          description="Totalen oppdateres når du legger til eller fjerner kompatibelt tilbehør."
        >
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
        </Section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/guide"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400"
        >
          Endre svar i guiden
        </Link>
        <Link
          href="/guide"
          onClick={restartGuide}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Start guiden på nytt
        </Link>
      </div>
    </div>
  );
}
