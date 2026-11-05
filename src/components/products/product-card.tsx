import Link from "next/link";
import Image from "next/image";
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
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-contain p-3"
        />
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
        <Tag text={product.isDemo ? "Demodata" : "JDD Utstyr"} tone="neutral" />
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
