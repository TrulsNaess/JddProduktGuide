interface TagProps {
  text: string;
  tone?: "neutral" | "highlight" | "success" | "warn";
}

const toneClass = {
  neutral: "bg-slate-200 text-slate-700",
  highlight: "bg-amber-100 text-amber-800",
  success: "bg-emerald-100 text-emerald-800",
  warn: "bg-rose-100 text-rose-800",
};

export function Tag({ text, tone = "neutral" }: TagProps) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${toneClass[tone]}`}>
      {text}
    </span>
  );
}
