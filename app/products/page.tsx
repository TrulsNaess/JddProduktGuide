import { ProductCard } from "@/src/components/products/product-card";
import { Section } from "@/src/components/ui/section";
import { productRepository } from "@/src/services/products/repository";
import { Product } from "@/src/types/domain";

export default function ProductsPage() {
  const productsByCategory = new Map<string, Product[]>();
  for (const product of productRepository.getAll()) {
    const categoryProducts = productsByCategory.get(product.category) ?? [];
    categoryProducts.push(product);
    productsByCategory.set(product.category, categoryProducts);
  }

  const categories = [...productsByCategory.entries()].sort(([a], [b]) =>
    a.localeCompare(b, "nb"),
  );
  const productCount = categories.reduce(
    (total, [, products]) => total + products.length,
    0,
  );

  return (
    <div className="space-y-6">
      <Section
        eyebrow="Produktutvalg fra JDD Utstyr"
        title="Produkter"
        description={`${productCount} produkter fordelt på ${categories.length} kategorier. Tilbehør vises sammen med resten av katalogen.`}
      >
        <div className="space-y-8">
          {categories.map(([category, products]) => (
            <section
              key={category}
              aria-labelledby={`category-${category}`}
              className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0"
            >
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <h3
                  id={`category-${category}`}
                  className="text-xl font-semibold text-slate-900"
                >
                  {category}
                </h3>
                <p className="text-sm text-slate-500">
                  {products.length} {products.length === 1 ? "produkt" : "produkter"}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    label={product.kind === "accessory" ? "Tilbehør" : undefined}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
    </div>
  );
}
