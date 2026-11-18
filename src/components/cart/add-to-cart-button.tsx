"use client";

import { useState } from "react";
import { AddToCartSource, addToCart } from "@/src/services/cart/session";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  label?: string;
  source?: AddToCartSource;
  suppressPackageOffer?: boolean;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  label = "Legg i handlekurv",
  source,
  suppressPackageOffer = false,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(productId, quantity, { source, suppressPackageOffer });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      }
    >
      {added ? "Lagt til" : label}
    </button>
  );
}
