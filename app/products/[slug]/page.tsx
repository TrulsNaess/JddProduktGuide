import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/src/components/ui/section";
import { Tag } from "@/src/components/ui/tag";
import { formatNok } from "@/src/services/format/price";
import { productRepository } from "@/src/services/products/repository";

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = productRepository.getBySlug(slug);

  if (!product) {
    notFound();
  }

  const compatibilityProducts = product.compatibility
    .map((item) => {
      const linkedProduct = productRepository.getById(item.productId);
      if (!linkedProduct) {
        return null;
      }

      return {
        ...item,
        name: linkedProduct.name,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        <p className="font-semibold">Demodata</p>
        <p>{product.demoNotice}</p>
      </div>

      <Section
        title={product.name}
        description={product.description}
        eyebrow={product.category}
      >
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Demobilde
          </div>
          <div className="space-y-3 lg:col-span-2">
            <p className="text-lg font-semibold text-slate-900">{formatNok(product.priceNok)}</p>
            <p className="text-sm text-slate-600">{product.shortDescription}</p>
            <div className="flex flex-wrap gap-2">
              {product.features.map((feature) => (
                <Tag key={feature} text={feature} tone="neutral" />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Tekniske demospesifikasjoner">
          <ul className="space-y-2 text-sm text-slate-700">
            {product.specifications.map((spec) => (
              <li key={spec.name} className="flex items-center justify-between gap-3">
                <span className="font-medium">{spec.name}</span>
                <span>
                  {spec.value}
                  {spec.unit ? ` ${spec.unit}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Begrensninger og forbehold">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
            {product.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      </div>

      <Section
        title="Kompatibelt tilbehør og relasjoner"
        description="Relasjonene under kommer fra registrert kompatibilitet i demodataene."
      >
        {compatibilityProducts.length > 0 ? (
          <div className="space-y-2 text-sm text-slate-700">
            {compatibilityProducts.map((item) => (
              <div
                key={item.productId}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1">
                  Relasjon: <span className="font-medium">{item.relationship}</span> ·
                  Kompatibilitet: <span className="font-medium">{item.status}</span>
                </p>
                {item.note ? <p className="mt-1 text-slate-600">{item.note}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Ingen registrerte kompatibilitetsrelasjoner for dette produktet.
          </p>
        )}
      </Section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/results"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400"
        >
          Tilbake til anbefalinger
        </Link>
        <Link
          href="/products"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Se alle produkter
        </Link>
      </div>
    </div>
  );
}
