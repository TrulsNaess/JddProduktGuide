"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  clearGuideAnswers,
  loadGuideAnswers,
  saveGuideAnswers,
} from "@/src/services/guide/session";
import { GuideAnswers, Priority, ValuePreference } from "@/src/types/domain";

const steps = ["Hva trenger du?", "Behov", "Kontekst", "Prioritering"];

const field = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2";
const primary =
  "rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-50";
const secondary =
  "rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold !text-slate-900 hover:bg-slate-50";

function contextModeForNeedText(text: string): "vehicle" | "equipment" | "worksite" {
  const value = text.toLocaleLowerCase("nb");
  if (/(kjøretøy|bil|traktor|tilhenger|kamera|arbeidslys|ryggekamera)/.test(value)) {
    return "vehicle";
  }
  if (/(maskin|verksted|verktøy|hydraul|generator)/.test(value)) {
    return "equipment";
  }
  return "worksite";
}

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
  suggestedValuePreference?: ValuePreference;
  keywords: string[];
  confidence: "low" | "medium" | "high";
  source: "heuristic" | "openai";
}

export default function GuidePage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [needText, setNeedText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [contextDetails, setContextDetails] = useState("");
  const [valuePreference, setValuePreference] = useState<ValuePreference>("balanced");
  const [priority, setPriority] = useState<Priority | "">("");
  const [budgetNok, setBudgetNok] = useState<string>("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [intentSuggestion, setIntentSuggestion] = useState<IntentApiResponse | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  function resetGuideState() {
    setStep(0);
    setNeedText("");
    setSearchText("");
    setContextDetails("");
    setValuePreference("balanced");
    setPriority("");
    setBudgetNok("");
    setSpecialRequirements("");
    setIntentSuggestion(null);
  }

  useEffect(() => {
    const shouldResume = new URLSearchParams(window.location.search).get("resume") === "1";

    if (!shouldResume) {
      clearGuideAnswers();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetGuideState();
      return;
    }

    const stored = loadGuideAnswers();
    setStep(0);
    setNeedText(stored.needText ?? stored.categoryIntent ?? "");
    setSearchText(stored.productIntentText ?? "");
    setContextDetails(stored.contextDetails ?? "");
    setValuePreference(stored.valuePreference ?? "balanced");
    setPriority(stored.priority ?? "");
    setBudgetNok(stored.budgetNok ? String(stored.budgetNok) : "");
    setSpecialRequirements(stored.specialRequirements ?? "");
    setIntentSuggestion(null);
  }, []);

  const contextMode = `${needText} ${searchText}`.trim()
    ? contextModeForNeedText(`${needText} ${searchText}`)
    : "worksite";

  const hasNeedType = needText.trim().length >= 2;
  const hasNeedInput = searchText.trim().length >= 2;
  const hasContextInput = contextDetails.trim().length >= 2;

  const canNext =
    (step === 0 && hasNeedType) ||
    (step === 1 && hasNeedInput) ||
    (step === 2 && hasContextInput) ||
    step === 3;

  function canJumpToStep(index: number) {
    if (index <= step) return true;
    if (index === 0) return true;
    if (index === 1) return hasNeedType;
    if (index === 2) return hasNeedType && hasNeedInput;
    if (index === 3) return hasNeedType && hasNeedInput && hasContextInput;
    return false;
  }

  function persistAndGoToResults() {
    const answers: GuideAnswers = {
      needText: needText.trim() || undefined,
      productIntentText: searchText.trim() || undefined,
      contextMode,
      contextDetails: contextDetails.trim() || undefined,
      valuePreference,
      priority: priority || undefined,
      budgetNok: budgetNok ? Number(budgetNok) : undefined,
      specialRequirements: specialRequirements.trim() || undefined,
    };

    saveGuideAnswers(answers);
    router.push("/results");
  }

  async function analyseWithAi() {
    const intentText = `${needText.trim()} ${searchText.trim()}`.trim();
    if (!intentText) return;

    setIsAnalysing(true);
    try {
      const response = await fetch("/api/guide-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: intentText }),
      });

      if (!response.ok) return;
      const data = (await response.json()) as IntentApiResponse;
      setIntentSuggestion(data);

      if (data.suggestedValuePreference) {
        setValuePreference(data.suggestedValuePreference);
      }
    } finally {
      setIsAnalysing(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl text-slate-900">
      <p className="mb-1 text-sm font-semibold text-slate-800">Produktguide</p>
      <h1 className="text-3xl font-bold tracking-tight">Finn riktig produkt når du er usikker</h1>
      <p className="mt-2 text-slate-600">
        Guiden hjelper deg med å beskrive behovet ditt, og rangerer relevante produkter i stedet
        for at du må velge eksakt modell med en gang.
      </p>

      <ol
        aria-label="Fremdrift"
        className="my-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-200 p-2 text-center text-xs sm:grid-cols-4 sm:text-sm"
      >
        {steps.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              aria-current={step === index ? "step" : undefined}
              disabled={!canJumpToStep(index)}
              onClick={() => setStep(index)}
              className={`w-full rounded-lg px-2 py-2 text-center transition ${
                step === index
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              }`}
            >
              <span className="mx-auto mb-1 block text-base font-bold">{index < step ? "✓" : index + 1}</span>
              <span className="font-semibold">{label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="p-5 sm:p-8">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Hva trenger du?</h2>
              <p className="text-sm text-slate-600">
                Skriv kort hva du ser etter, for eksempel: «ser etter nye lys til bilen».
              </p>

              <input
                type="search"
                className={field}
                placeholder="F.eks. ser etter nye lys til bilen"
                value={needText}
                onChange={(event) => setNeedText(event.target.value)}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Hvilket behov prøver du å løse?</h2>
              <p className="text-sm text-slate-600">
                Beskriv behovet med egne ord. Deretter velger du kontekst og prioriteringer.
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
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={analyseWithAi}
                  disabled={isAnalysing || (!needText.trim() && !searchText.trim())}
                >
                  {isAnalysing ? "Analyserer…" : "Foreslå med AI"}
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Kontekst</h2>

              <label className="block text-sm font-medium">
                Hvor/hvordan skal det brukes?
                <textarea
                  className={`${field} min-h-24`}
                  placeholder={
                    contextMode === "vehicle"
                      ? "F.eks. på en Toyota Hilux 2016 i mørk landeveiskjøring"
                      : contextMode === "equipment"
                        ? "F.eks. på verksted med støv og vibrasjon"
                        : "F.eks. utendørs i fuktig miljø"
                  }
                  value={contextDetails}
                  onChange={(event) => setContextDetails(event.target.value)}
                />
              </label>

              <label className="block text-sm font-medium">
                Skal det brukes med noe annet? I så fall hva? (Valgfritt)
                <textarea
                  className={`${field} min-h-20`}
                  placeholder="F.eks. sammen med eksisterende kabelsett eller styreenhet"
                  value={specialRequirements}
                  onChange={(event) => setSpecialRequirements(event.target.value)}
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
                        ? "border-slate-900 bg-slate-100"
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
              <dt className="font-semibold">Hva trenger du?</dt>
              <dd>{needText || "–"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Behovstekst</dt>
              <dd>{searchText || "–"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Hvor/hvordan skal det brukes?</dt>
              <dd>{contextDetails || "–"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Skal brukes med noe annet?</dt>
              <dd>{specialRequirements || "–"}</dd>
            </div>
            <div>
              <dt className="font-semibold">Prioritering</dt>
              <dd>{valuePreferences.find((item) => item.value === valuePreference)?.label ?? "–"}</dd>
            </div>
          </dl>

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
