import { GuideQuestion } from "@/src/types/domain";

interface QuestionCardProps {
  question: GuideQuestion;
  currentValue: string | number | undefined;
  onSelectOption: (value: string) => void;
  onTextChange: (value: string) => void;
  onNumberChange: (value: number | undefined) => void;
}

export function QuestionCard({
  question,
  currentValue,
  onSelectOption,
  onTextChange,
  onNumberChange,
}: QuestionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">{question.title}</h2>
        {question.description ? (
          <p className="mt-2 text-sm text-slate-600">{question.description}</p>
        ) : null}
      </div>

      {question.type === "single-choice" && question.options ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => {
            const selected = currentValue === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelectOption(option.value)}
                className={`rounded-lg border p-4 text-left transition ${
                  selected
                    ? "border-amber-500 bg-amber-50 text-slate-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                <p className="font-medium">{option.label}</p>
                {option.hint ? (
                  <p className="mt-1 text-xs text-slate-500">{option.hint}</p>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {question.type === "text" ? (
        <textarea
          className="h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-amber-400 focus:ring"
          placeholder={question.placeholder}
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={(event) => onTextChange(event.target.value)}
        />
      ) : null}

      {question.type === "number" ? (
        <input
          type="number"
          min={0}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-amber-400 focus:ring"
          placeholder={question.placeholder}
          value={typeof currentValue === "number" ? currentValue : ""}
          onChange={(event) => {
            const value = event.target.value.trim();
            onNumberChange(value ? Number(value) : undefined);
          }}
        />
      ) : null}
    </section>
  );
}
