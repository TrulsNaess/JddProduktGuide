import Link from "next/link";
import { Product, RecommendationResult } from "@/src/types/domain";
import { formatNok } from "@/src/services/format/price";

interface RecommendationCardProps {
  title: string;
  product: Product;
  recommendation: RecommendationResult;
}

export function RecommendationCard({
  title,
  product,
  recommendation,
}: RecommendationCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{title}</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{product.name}</h2>
      <p className="mt-2 text-sm text-slate-600">{product.shortDescription}</p>
      <p className="mt-3 text-base font-semibold text-slate-900">{formatNok(product.priceNok)}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Hvorfor vi anbefaler dette</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {recommendation.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Forbehold</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {recommendation.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm text-slate-500">Score: {recommendation.score}</span>
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-slate-900 hover:text-amber-600"
        >
          Se produktdetaljer
        </Link>
      </div>
    </section>
  );
}
