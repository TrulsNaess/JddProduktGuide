import { ProductCatalog } from "@/src/components/products/product-catalog";
import { Section } from "@/src/components/ui/section";
import { productRepository } from "@/src/services/products/repository";
import { Product } from "@/src/types/domain";

const categoryOrder = [
  "Arbeidslys",
  "Baklykter",
  "Bil- og maskinpleie",
  "Ekstralys",
  "Hodelykter",
  "Installasjonsmateriell",
  "Landbruk",
  "Lastsikring",
  "Lommelykter",
  "Ryggekamera",
  "Tilhenger",
  "Varsellys",
  "Verktøy",
];

function getDisplayCategory(product: Product): string {
  const category = product.category.split(" · ")[0];

  if (category === "Bilpleie") {
    return "Bil- og maskinpleie";
  }

  if (category === "Lommelykter" && /hodelykt/i.test(product.name)) {
    return "Hodelykter";
  }

  return category;
}

export default function ProductsPage() {
  const productsByCategory = new Map<string, Product[]>();
  for (const product of productRepository.getAll()) {
    const category = getDisplayCategory(product);
    const categoryProducts = productsByCategory.get(category) ?? [];
    categoryProducts.push(product);
    productsByCategory.set(category, categoryProducts);
  }

  const categories = [...productsByCategory.entries()].sort(([a], [b]) => {
    const aOrder = categoryOrder.indexOf(a);
    const bOrder = categoryOrder.indexOf(b);
    return (
      (aOrder < 0 ? Number.MAX_SAFE_INTEGER : aOrder) -
        (bOrder < 0 ? Number.MAX_SAFE_INTEGER : bOrder) ||
      a.localeCompare(b, "nb")
    );
  });
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
        <ProductCatalog
          categories={categories.map(([name, products]) => ({ name, products }))}
        />
      </Section>
    </div>
  );
}
