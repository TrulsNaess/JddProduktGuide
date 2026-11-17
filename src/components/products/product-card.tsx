import Link from "next/link";
import Image from "next/image";
import { Product } from "@/src/types/domain";
import { formatNok } from "@/src/services/format/price";
import { Tag } from "@/src/components/ui/tag";
import { AddToCartButton } from "@/src/components/cart/add-to-cart-button";

interface ProductCardProps {
  product: Product;
  label?: string;
  fullCardLink?: boolean;
  showAddToCart?: boolean;
}

export function ProductCard({
  product,
  label,
  fullCardLink = true,
  showAddToCart = false,
}: ProductCardProps) {
  const content = (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition group-hover:border-orange-300 group-hover:shadow">
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
      <p className="mb-3 text-sm font-semibold text-slate-900">{formatNok(product.priceNok)}</p>
      <ul className="mb-5 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {product.features.slice(0, 2).map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3">
        <Tag text={product.isDemo ? "Demodata" : "JDD Utstyr"} tone="neutral" />
        {fullCardLink ? (
          <span className="text-sm font-semibold text-slate-900 group-hover:text-orange-700">
            Se produkt
          </span>
        ) : (
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-semibold text-slate-900 hover:text-orange-700"
          >
            Se produkt
          </Link>
        )}
      </div>
      {showAddToCart ? (
        <AddToCartButton
          productId={product.id}
          className="mt-3 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        />
      ) : null}
    </article>
  );

  if (!fullCardLink) {
    return (
      <div className="group h-full">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      {content}
    </Link>
  );
}
