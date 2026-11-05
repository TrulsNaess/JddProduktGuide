import Link from "next/link";
import { Product } from "@/src/types/domain";
import { formatNok } from "@/src/services/format/price";
import { Tag } from "@/src/components/ui/tag";

interface ProductCardProps {
  product: Product;
  label?: string;
}

export function ProductCard({ product, label }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
        Demobilde
      </div>
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        {label ? <Tag text={label} tone="highlight" /> : null}
      </div>
      <p className="mb-4 text-sm text-slate-600">{product.shortDescription}</p>
      <p className="mb-3 text-sm font-semibold text-slate-900">
        {formatNok(product.priceNok)}
      </p>
      <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {product.features.slice(0, 2).map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between">
        <Tag text="Demodata" tone="neutral" />
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-slate-900 hover:text-amber-600"
        >
          Se produkt
        </Link>
      </div>
    </article>
  );
}
