import { jddProducts } from "@/src/data/products";
import { Product } from "@/src/types/domain";

export interface ProductRepository {
  getAll(): Product[];
  getMainProducts(): Product[];
  getAccessories(): Product[];
  getById(id: string): Product | undefined;
  getBySlug(slug: string): Product | undefined;
}

class JddProductRepository implements ProductRepository {
  getAll(): Product[] {
    return jddProducts;
  }

  getMainProducts(): Product[] {
    return jddProducts.filter((product) => product.kind === "main");
  }

  getAccessories(): Product[] {
    return jddProducts.filter((product) => product.kind === "accessory");
  }

  getById(id: string): Product | undefined {
    return jddProducts.find((product) => product.id === id);
  }

  getBySlug(slug: string): Product | undefined {
    return jddProducts.find((product) => product.slug === slug);
  }
}

export const productRepository: ProductRepository = new JddProductRepository();
