import { AccessorySuggestion } from "@/src/types/domain";
import { formatNok } from "@/src/services/format/price";
import { Tag } from "@/src/components/ui/tag";

interface AccessoryCardProps {
  suggestion: AccessorySuggestion;
  selected: boolean;
  onToggle: (productId: string) => void;
}

function relationLabel(value: AccessorySuggestion["relationship"]) {
  if (value === "required") return "Påkrevd";
  if (value === "recommended") return "Anbefalt";
  return "Valgfritt";
}

function statusLabel(value: AccessorySuggestion["status"]) {
  if (value === "compatible") return "Kompatibel";
  if (value === "incompatible") return "Ikke kompatibel";
  return "Ukjent kompatibilitet";
}

export function AccessoryCard({
  suggestion,
  selected,
  onToggle,
}: AccessoryCardProps) {
  const isDisabled = suggestion.status === "incompatible";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Tag text={relationLabel(suggestion.relationship)} tone="highlight" />
        <Tag
          text={statusLabel(suggestion.status)}
          tone={suggestion.status === "compatible" ? "success" : suggestion.status === "unknown" ? "neutral" : "warn"}
        />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{suggestion.product.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{suggestion.product.shortDescription}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">
        {formatNok(suggestion.product.priceNok)}
      </p>
      <p className="mt-2 text-xs text-slate-500">{suggestion.reason}</p>

      <button
        type="button"
        onClick={() => onToggle(suggestion.product.id)}
        disabled={isDisabled}
        className={`mt-3 rounded-md px-3 py-2 text-sm font-semibold ${
          isDisabled
            ? "cursor-not-allowed bg-slate-200 text-slate-500"
            : selected
              ? "bg-slate-900 text-white hover:bg-slate-700"
              : "bg-amber-500 text-slate-950 hover:bg-amber-400"
        }`}
      >
        {isDisabled ? "Kan ikke velges" : selected ? "Fjern fra pakke" : "Legg til i pakke"}
      </button>
    </article>
  );
}
