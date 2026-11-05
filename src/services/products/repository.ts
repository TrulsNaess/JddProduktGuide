import { demoProducts } from "@/src/data/products";
import { Product } from "@/src/types/domain";

export interface ProductRepository {
  getAll(): Product[];
  getMainProducts(): Product[];
  getAccessories(): Product[];
  getById(id: string): Product | undefined;
  getBySlug(slug: string): Product | undefined;
}

class DemoProductRepository implements ProductRepository {
  getAll(): Product[] {
    return demoProducts;
  }

  getMainProducts(): Product[] {
    return demoProducts.filter((product) => product.kind === "main");
  }

  getAccessories(): Product[] {
    return demoProducts.filter((product) => product.kind === "accessory");
  }

  getById(id: string): Product | undefined {
    return demoProducts.find((product) => product.id === id);
  }

  getBySlug(slug: string): Product | undefined {
    return demoProducts.find((product) => product.slug === slug);
  }
}

export const productRepository: ProductRepository = new DemoProductRepository();
