"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/src/components/products/product-card";
import { loadGuideAnswers, saveGuideAnswers } from "@/src/services/guide/session";
import { productRepository } from "@/src/services/products/repository";
import { GuideAnswers, GuideUseCase, Priority, ValuePreference } from "@/src/types/domain";

const products = productRepository.getMainProducts();
const steps = ["Kategori", "Behov", "Kontekst", "Prioritering"];

const field = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2";
const primary =
  "rounded-lg bg-orange-700 px-4 py-2 font-semibold text-white hover:bg-orange-800 disabled:opacity-50";
const secondary =
  "rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-50";

function mainCategory(category: string) {
  return category.split("·")[0].trim();
}

function contextModeForCategory(category: string): "vehicle" | "equipment" | "worksite" {
  const value = category.toLocaleLowerCase("nb");
  if (/(kjøretøy|bil|traktor|tilhenger|kamera|arbeidslys|ryggekamera)/.test(value)) {
    return "vehicle";
  }
  if (/(maskin|verksted|verktøy|hydraul|generator)/.test(value)) {
    return "equipment";
  }
  return "worksite";
}

const categories = [...new Set(products.map((product) => mainCategory(product.category)))].sort((a, b) =>
  a.localeCompare(b, "nb"),
);

const useCases: Array<{ value: GuideUseCase; label: string }> = [
  { value: "maintenance", label: "Vedlikehold og reparasjon" },
  { value: "construction", label: "Bygg og anlegg" },
  { value: "transport", label: "Transport og håndtering" },
  { value: "agriculture", label: "Landbruk og gårdsdrift" },
  { value: "parks", label: "Park og uteområder" },
  { value: "workshop", label: "Verksted og bil" },
  { value: "other", label: "Annet" },
];

const priorities: Array<{ value: Priority; label: string }> = [
  { value: "price", label: "Lavest mulig pris" },
  { value: "quality", label: "Best mulig kvalitet" },
  { value: "capacity", label: "Høy kapasitet og ytelse" },
  { value: "flexibility", label: "Fleksibilitet" },
  { value: "durability", label: "Lang levetid" },
];

const valuePreferences: Array<{ value: ValuePreference; label: string; description: string }> = [
  {
    value: "best",
    label: "Best mulig match",
    description: "Vekter ytelse, robusthet og behovsmatch høyest.",
  },
  {
    value: "cheapest",
    label: "Billigste relevante",
    description: "Prioriterer lavere pris når flere produkter passer.",
  },
  {
    value: "balanced",
    label: "Balansert",
    description: "Kombinerer pris og kvalitet.",
  },
];

interface IntentApiResponse {
  summary: string;
  suggestedUseCase?: GuideUseCase;
  suggestedValuePreference?: ValuePreference;
  keywords: string[];
  confidence: "low" | "medium" | "high";
  source: "heuristic" | "openai";
}

export default function GuidePage() {
  const router = useRouter();
  const stored = loadGuideAnswers();

  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(stored.categoryIntent ?? "");
  const [searchText, setSearchText] = useState(stored.productIntentText ?? "");
  const [selectedProductId, setSelectedProductId] = useState(stored.preferredProductId ?? "");
  const [useCase, setUseCase] = useState<GuideUseCase | "">(stored.useCase ?? "");
  const [contextDetails, setContextDetails] = useState(stored.contextDetails ?? "");
  const [valuePreference, setValuePreference] = useState<ValuePreference>(
    stored.valuePreference ?? "balanced",
  );
  const [priority, setPriority] = useState<Priority | "">(stored.priority ?? "");
  const [budgetNok, setBudgetNok] = useState<string>(
    stored.budgetNok ? String(stored.budgetNok) : "",
  );
  const [specialRequirements, setSpecialRequirements] = useState(stored.specialRequirements ?? "");
  const [intentSuggestion, setIntentSuggestion] = useState<IntentApiResponse | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const contextMode = category ? contextModeForCategory(category) : "worksite";

  const candidates = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase("nb");

    return products
      .filter((product) => (category ? mainCategory(product.category) === category : true))
      .filter((product) => {
        if (!query) return true;

        return `${product.name} ${product.sku} ${product.shortDescription} ${product.category}`
          .toLocaleLowerCase("nb")
          .includes(query);
      })
      .slice(0, 12);
  }, [category, searchText]);

  const selectedProduct = products.find((product) => product.id === selectedProductId);

  const canNext =
    (step === 0 && !!category) ||
    (step === 1 && searchText.trim().length >= 2) ||
    (step === 2 && !!useCase) ||
    step === 3;

  function persistAndGoToResults() {
    const answers: GuideAnswers = {
      categoryIntent: category,
      productIntentText: searchText.trim(),
      preferredProductId: selectedProductId || undefined,
      contextMode,
      contextDetails: contextDetails.trim() || undefined,
      useCase: useCase || undefined,
      valuePreference,
      priority: priority || undefined,
      budgetNok: budgetNok ? Number(budgetNok) : undefined,
      specialRequirements: specialRequirements.trim() || undefined,
    };

    saveGuideAnswers(answers);
    router.push("/results");
  }

  async function analyseWithAi() {
    if (!searchText.trim()) return;

    setIsAnalysing(true);
    try {
      const response = await fetch("/api/guide-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: searchText.trim() }),
      });

      if (!response.ok) return;
      const data = (await response.json()) as IntentApiResponse;
      setIntentSuggestion(data);

      if (data.suggestedUseCase) {
        setUseCase(data.suggestedUseCase);
      }
      if (data.suggestedValuePreference) {
        setValuePreference(data.suggestedValuePreference);
      }
    } finally {
      setIsAnalysing(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl text-slate-900">
      <p className="mb-1 text-sm font-semibold text-orange-800">Produktguide</p>
      <h1 className="text-3xl font-bold tracking-tight">Finn riktig produkt når du er usikker</h1>
      <p className="mt-2 text-slate-600">
        Guiden hjelper deg med å beskrive behovet ditt, og rangerer relevante produkter i stedet
        for at du må velge eksakt modell med en gang.
      </p>

      <ol
        aria-label="Fremdrift"
        className="my-6 grid grid-cols-4 rounded-xl bg-slate-200 p-4 text-center text-xs sm:text-sm"
      >
        {steps.map((label, index) => (
          <li key={label} aria-current={step === index ? "step" : undefined}>
            <span
              className={`mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full font-bold ${
                step === index ? "bg-orange-700 text-white" : "bg-white"
              }`}
            >
              {index < step ? "✓" : index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="p-5 sm:p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Hvilken produktkategori passer best?</h2>
              <p className="text-sm text-slate-600">
                Velg overordnet type. Du velger ikke endelig produkt enda.
              </p>
              <select
                className={field}
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setSelectedProductId("");
                }}
              >
                <option value="">Velg kategori</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Hvilken type produkt ser du etter?</h2>
              <p className="text-sm text-slate-600">
                Beskriv behovet med egne ord. Resultatlisten oppdateres fortløpende.
              </p>

              <input
                type="search"
                className={field}
                placeholder="F.eks. arbeidslys for mørkt vinterarbeid"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className={secondary}
                  onClick={analyseWithAi}
                  disabled={isAnalysing || !searchText.trim()}
                >
                  {isAnalysing ? "Analyserer…" : "Foreslå med AI (valgfritt)"}
                </button>
                <p className="text-xs text-slate-500">
                  Bruker rimelig modell og fungerer også uten API-nøkkel.
                </p>
              </div>

              {intentSuggestion ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                  <p className="font-semibold">Tolket behov</p>
                  <p className="mt-1 text-slate-700">{intentSuggestion.summary}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Kilde: {intentSuggestion.source} · Sikkerhet: {intentSuggestion.confidence}
                  </p>
                </div>
              ) : null}

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-800">Forslag fra produktlisten</h3>
                {candidates.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {candidates.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setSelectedProductId(product.id)}
                        className={`rounded-lg border p-3 text-left transition ${
                          selectedProductId === product.id
                            ? "border-orange-700 bg-orange-50"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.sku}</p>
                        <p className="mt-1 text-sm text-slate-600">{product.shortDescription}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">Ingen treff ennå. Prøv et bredere søk.</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Hvordan skal produktet brukes?</h2>

              <label className="block text-sm font-medium">
                Bruksområde
                <select
                  className={field}
                  value={useCase}
                  onChange={(event) => setUseCase(event.target.value as GuideUseCase)}
                >
                  <option value="">Velg bruksområde</option>
                  {useCases.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                {contextMode === "vehicle"
                  ? "Kjøretøy / modell (valgfritt)"
                  : contextMode === "equipment"
                    ? "Maskin / utstyr (valgfritt)"
                    : "Arbeidsmiljø / sted (valgfritt)"}
                <input
                  className={field}
                  placeholder={
                    contextMode === "vehicle"
                      ? "F.eks. Traktor John Deere 6155R"
                      : contextMode === "equipment"
                        ? "F.eks. verkstedbenk med 12V strøm"
                        : "F.eks. kystnært uteområde med mye fukt"
                  }
                  value={contextDetails}
                  onChange={(event) => setContextDetails(event.target.value)}
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Prioritering og budsjett</h2>

              <div className="grid gap-3 sm:grid-cols-3">
                {valuePreferences.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValuePreference(option.value)}
                    className={`rounded-lg border p-3 text-left ${
                      valuePreference === option.value
                        ? "border-orange-700 bg-orange-50"
                        : "border-slate-200"
                    }`}
                  >
                    <p className="font-semibold">{option.label}</p>
                    <p className="text-xs text-slate-600">{option.description}</p>
                  </button>
                ))}
              </div>

              <label className="block text-sm font-medium">
                Viktigste egenskap (valgfritt)
                <select
                  className={field}
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as Priority)}
                >
                  <option value="">Ingen valgt</option>
                  {priorities.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium">
                Budsjett (valgfritt)
                <input
                  className={field}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  placeholder="F.eks. 5000"
                  value={budgetNok}
                  onChange={(event) => setBudgetNok(event.target.value)}
                />
              </label>

              <label className="block text-sm font-medium">
                Andre krav (valgfritt)
                <textarea
                  className={`${field} min-h-24`}
                  placeholder="F.eks. kontaktstandard, dimensjoner, monteringsbehov"
                  value={specialRequirements}
                  onChange={(event) => setSpecialRequirements(event.target.value)}
                />
              </label>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {step > 0 ? (
              <button type="button" className={secondary} onClick={() => setStep((value) => value - 1)}>
                Tilbake
              </button>
            ) : null}

            {step < steps.length - 1 ? (
              <button
                type="button"
                className={`${primary} ml-auto`}
                disabled={!canNext}
                onClick={() => setStep((value) => value + 1)}
              >
                Neste
              </button>
            ) : (
              <button type="button" className={`${primary} ml-auto`} onClick={persistAndGoToResults}>
                Se anbefaling
              </button>
            )}
          </div>
        </div>

        <aside className="min-w-0 border-t border-slate-200 bg-slate-50 p-5 sm:p-8 md:border-l md:border-t-0">
          <h2 className="text-lg font-bold">Oppsummert behov</h2>
          <dl className="mt-3 space-y-3 break-words text-sm">
            <div>
              <dt className="font-semibold">Kategori</dt>
              <dd>{category || "–"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Produkttype</dt>
              <dd>{searchText || "–"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Eksempelprodukt</dt>
              <dd>{selectedProduct?.name || "Ingen valgt"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Bruksområde</dt>
              <dd>{useCases.find((item) => item.value === useCase)?.label ?? "–"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Valg</dt>
              <dd>{valuePreferences.find((item) => item.value === valuePreference)?.label ?? "–"}</dd>
            </div>
          </dl>

          {selectedProduct ? (
            <div className="mt-6 border-t border-slate-200 pt-5">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
                Eksempel fra trefflisten
              </h3>
              <ProductCard product={selectedProduct} />
            </div>
          ) : null}

          <div className="mt-6 border-t border-slate-200 pt-5 text-xs text-slate-500">
            AI-forslag brukes kun til å tolke behovstekst. Endelig rangering og kompatibilitet
            beregnes fra registrerte produktdata.
          </div>
        </aside>
      </div>

      <div className="mt-4">
        <Link href="/products" className="text-sm font-semibold text-slate-700 underline">
          Utforsk alle produkter manuelt
        </Link>
      </div>
    </section>
  );
}
