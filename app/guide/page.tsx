"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "@/src/components/guide/question-card";
import { guideQuestions } from "@/src/data/questions";
import { clearGuideAnswers, loadGuideAnswers, saveGuideAnswers } from "@/src/services/guide/session";
import { GuideAnswers } from "@/src/types/domain";

function getQuestionValue(answers: GuideAnswers, key: keyof GuideAnswers) {
  return answers[key] as string | number | undefined;
}

export default function GuidePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<GuideAnswers>(() => loadGuideAnswers());
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    saveGuideAnswers(answers);
  }, [answers]);

  const totalSteps = guideQuestions.length;
  const currentQuestion = guideQuestions[step];

  const completion = useMemo(() => {
    return Math.round(((step + 1) / totalSteps) * 100);
  }, [step, totalSteps]);

  const currentValue = getQuestionValue(answers, currentQuestion.id);

  const isCurrentValid = currentQuestion.optional
    ? true
    : currentValue !== undefined && currentValue !== "";

  function updateAnswer(value: string | number | undefined) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    setShowValidation(false);
  }

  function nextStep() {
    if (!isCurrentValid) {
      setShowValidation(true);
      return;
    }

    if (step === totalSteps - 1) {
      router.push("/results");
      return;
    }

    setStep((prev) => prev + 1);
  }

  function previousStep() {
    setShowValidation(false);
    setStep((prev) => Math.max(0, prev - 1));
  }

  function resetGuide() {
    clearGuideAnswers();
    setAnswers({});
    setStep(0);
    setShowValidation(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Produktguide</p>
          <p className="text-sm text-slate-500">
            Spørsmål {step + 1} av {totalSteps}
          </p>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-amber-500 transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <QuestionCard
        question={currentQuestion}
        currentValue={currentValue}
        onSelectOption={(value) => updateAnswer(value)}
        onTextChange={(value) => updateAnswer(value)}
        onNumberChange={(value) => updateAnswer(value)}
      />

      {showValidation ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Dette spørsmålet må besvares før du går videre.
        </p>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Dine svar så langt</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {guideQuestions.map((question) => {
            const answer = getQuestionValue(answers, question.id);
            const optionLabel = question.options?.find((option) => option.value === answer)?.label;
            return (
              <li key={question.id}>
                <span className="font-medium text-slate-800">{question.title}: </span>
                {optionLabel ?? (answer ? String(answer) : "Ikke besvart")}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={previousStep}
            disabled={step === 0}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              step === 0
                ? "cursor-not-allowed bg-slate-200 text-slate-500"
                : "border border-slate-300 bg-white text-slate-800 hover:border-slate-400"
            }`}
          >
            Tilbake
          </button>
          <button
            type="button"
            onClick={resetGuide}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            Start på nytt
          </button>
        </div>

        <div className="flex items-center gap-2">
          {currentQuestion.optional ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Hopp over
            </button>
          ) : null}
          <button
            type="button"
            onClick={nextStep}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
          >
            {step === totalSteps - 1 ? "Se anbefaling" : "Neste"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
        Prototypen bruker et kuratert utvalg ekte JDD-produkter. Anbefalingsmerkingen er foreløpig.
      </p>
    </div>
  );
}
