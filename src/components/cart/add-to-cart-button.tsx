"use client";

import { useState } from "react";
import { addToCart } from "@/src/services/cart/session";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  label?: string;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  label = "Legg i handlekurv",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(productId, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "rounded-md bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
      }
    >
      {added ? "Lagt til" : label}
    </button>
  );
}
