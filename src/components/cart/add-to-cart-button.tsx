"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AddToCartSource, addToCart } from "@/src/services/cart/session";
import { buildPackageSummary, generatePackageSuggestions } from "@/src/services/compatibility/accessories";
import { formatNok } from "@/src/services/format/price";
import { productRepository } from "@/src/services/products/repository";

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
  const [isPackageOfferOpen, setIsPackageOfferOpen] = useState(false);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([]);

  const baseProduct = productRepository.getById(productId);
  const packageSuggestions = useMemo(() => {
    if (!baseProduct || baseProduct.kind !== "main" || baseProduct.isDemo) {
      return [];
    }

    return generatePackageSuggestions(
      baseProduct,
      productRepository.getAccessories(),
    ).slice(0, 4);
  }, [baseProduct]);

  const selectedAccessories = packageSuggestions
    .filter((suggestion) => selectedAccessoryIds.includes(suggestion.product.id))
    .map((suggestion) => suggestion.product);
  const packageSummary = baseProduct
    ? buildPackageSummary(baseProduct, selectedAccessories)
    : null;

  function handleClick() {
    if (source === "guide" || packageSuggestions.length === 0) {
      addToCart(productId, quantity, { source, suppressPackageOffer });
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1300);
      return;
    }

    setSelectedAccessoryIds(packageSuggestions.map((suggestion) => suggestion.product.id));
    setIsPackageOfferOpen(true);
  }

  function toggleAccessory(accessoryId: string) {
    setSelectedAccessoryIds((current) =>
      current.includes(accessoryId)
        ? current.filter((id) => id !== accessoryId)
        : [...current, accessoryId],
    );
  }

  function addProductOnly() {
    addToCart(productId, quantity, { source, suppressPackageOffer: true });
    setIsPackageOfferOpen(false);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

  function addCompletePackage() {
    addToCart(productId, quantity, { source, suppressPackageOffer: true });
    selectedAccessories.forEach((accessory) =>
      addToCart(accessory.id, 1, { source, suppressPackageOffer: true }),
    );
    setIsPackageOfferOpen(false);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

  return (
    <>
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

      {isPackageOfferOpen && baseProduct && packageSummary ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`package-offer-title-${baseProduct.id}`}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <p className="text-sm font-semibold text-emerald-700">Fullfør produktpakken</p>
            <h2
              id={`package-offer-title-${baseProduct.id}`}
              className="mt-1 text-2xl font-bold text-slate-900"
            >
              Velg hvordan du vil kjøpe {baseProduct.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Velg bare hovedproduktet, eller legg til nødvendig kabelsett og festebrakketter.
            </p>

            <div className="mt-5 space-y-3">
              {packageSuggestions.map((suggestion) => (
                <label
                  key={suggestion.product.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <Image
                      src={suggestion.product.image}
                      alt={suggestion.product.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                    />
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAccessoryIds.includes(suggestion.product.id)}
                    onChange={() => toggleAccessory(suggestion.product.id)}
                    className="mt-1"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">
                      {suggestion.product.name}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {suggestion.relationship === "required" ? "Påkrevd" : "Anbefalt"} ·{" "}
                      {suggestion.reason}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-slate-900">
                    {formatNok(suggestion.product.priceNok)}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4 text-sm">
              {selectedAccessories.length > 0 ? (
                <>
                  <p className="flex justify-between text-slate-600">
                    <span>Pakkerabatt</span>
                    <span className="font-semibold text-emerald-700">
                      - {formatNok(packageSummary.packageDiscountNok)}
                    </span>
                  </p>
                  <p className="mt-1 flex justify-between text-lg font-bold text-slate-900">
                    <span>Total for pakken</span>
                    <span>{formatNok(packageSummary.totalNok)}</span>
                  </p>
                </>
              ) : (
                <p className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Kun hovedprodukt</span>
                  <span>{formatNok(baseProduct.priceNok)}</span>
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPackageOfferOpen(false)}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={addProductOnly}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Kun {baseProduct.name}
              </button>
              <button
                type="button"
                onClick={addCompletePackage}
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Legg fullstendig pakke i handlekurven
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
