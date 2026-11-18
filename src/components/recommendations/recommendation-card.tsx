import Link from "next/link";
import Image from "next/image";
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
  const highlightedSpecifications = product.specifications.slice(0, 4);

  return (
    <section className="rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">{title}</p>
      <div className="mt-3 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-contain p-4"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{product.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{product.shortDescription}</p>
          <p className="mt-3 text-lg font-semibold text-slate-900">{formatNok(product.priceNok)}</p>

          {highlightedSpecifications.length > 0 ? (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <h3 className="text-sm font-semibold text-slate-900">Nøkkelspesifikasjoner</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {highlightedSpecifications.map((spec) => (
                  <li key={spec.name} className="flex items-center justify-between gap-3">
                    <span className="font-medium">{spec.name}</span>
                    <span>
                      {spec.value}
                      {spec.unit ? ` ${spec.unit}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

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

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-slate-500">Score: {recommendation.score}</span>
        <Link
          href={`/products/${product.slug}`}
          className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Se produktdetaljer
        </Link>
      </div>
    </section>
  );
}
