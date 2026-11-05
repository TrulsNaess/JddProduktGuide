import { ReactNode } from "react";

interface SectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Section({ eyebrow, title, description, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h2>
      {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}
