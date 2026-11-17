import { Product } from "@/src/types/domain";

const CART_SESSION_KEY = "jdd-product-guide-cart";
const CART_EVENT = "jdd-cart-updated";

export interface CartItem {
  productId: string;
  quantity: number;
}

export function loadCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.sessionStorage.getItem(CART_SESSION_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed)
      ? parsed.filter(
          (item) =>
            typeof item.productId === "string" &&
            typeof item.quantity === "number" &&
            item.quantity > 0,
        )
      : [];
  } catch {
    return [];
  }
}

function saveCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CART_SESSION_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function addToCart(productId: string, quantity = 1): void {
  if (!productId || quantity <= 0) return;

  const current = loadCartItems();
  const existing = current.find((item) => item.productId === productId);

  if (existing) {
    saveCartItems(
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      ),
    );
    return;
  }

  saveCartItems([...current, { productId, quantity }]);
}

export function removeFromCart(productId: string): void {
  saveCartItems(loadCartItems().filter((item) => item.productId !== productId));
}

export function updateCartQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCartItems(
    loadCartItems().map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    ),
  );
}

export function clearCart(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(CART_SESSION_KEY);
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function cartCount(): number {
  return loadCartItems().reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(productsById: Map<string, Product>): number {
  return loadCartItems().reduce((sum, item) => {
    const product = productsById.get(item.productId);
    if (!product) return sum;
    return sum + product.priceNok * item.quantity;
  }, 0);
}

export function onCartUpdated(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => listener();
  window.addEventListener(CART_EVENT, handler);
  return () => window.removeEventListener(CART_EVENT, handler);
}
