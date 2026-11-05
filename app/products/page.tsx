import { ProductCard } from "@/src/components/products/product-card";
import { Section } from "@/src/components/ui/section";
import { productRepository } from "@/src/services/products/repository";

export default function ProductsPage() {
  const products = productRepository.getMainProducts();

  return (
    <div className="space-y-6">
      <Section
        eyebrow="Produktoversikt"
        title="Demoprodukter for ProduktGuiden"
        description="Alle produkter på denne siden er fiktive demodata laget for å demonstrere anbefalingslogikk, kompatibilitet og pakketilbud."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Section>
    </div>
  );
}
