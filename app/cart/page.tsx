"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buildPackageSummary, getAccessorySuggestions } from "@/src/services/compatibility/accessories";
import { formatNok } from "@/src/services/format/price";
import {
  addToCart,
  clearCart,
  clearPendingPackageOffer,
  loadCartItems,
  loadPendingPackageOffer,
  onCartUpdated,
  removeFromCart,
  updateCartQuantity,
} from "@/src/services/cart/session";
import { productRepository } from "@/src/services/products/repository";

export default function CartPage() {
  const [items, setItems] = useState(loadCartItems());

  useEffect(() => {
    const sync = () => setItems(loadCartItems());
    sync();
    return onCartUpdated(sync);
  }, []);

  const products = useMemo(() => productRepository.getAll(), []);
  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const lines = items
    .map((item) => {
      const product = productsById.get(item.productId);
      if (!product) return null;
      return {
        ...item,
        product,
        lineTotal: product.priceNok * item.quantity,
      };
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  const packageOffer = useMemo(() => {
    const pendingOffer = loadPendingPackageOffer();
    if (!pendingOffer || pendingOffer.source !== "catalog") {
      return null;
    }

    const baseProduct = productsById.get(pendingOffer.baseProductId);
    if (!baseProduct || baseProduct.kind !== "main" || baseProduct.isDemo) {
      return null;
    }

    const baseInCart = items.some((item) => item.productId === baseProduct.id);
    if (!baseInCart) {
      return null;
    }

    const offeredAccessories = getAccessorySuggestions(
      baseProduct,
      productRepository.getAccessories().filter((item) => !item.isDemo),
    )
      .filter((suggestion) => suggestion.status === "compatible")
      .map((suggestion) => suggestion.product)
      .filter((product) => !items.some((item) => item.productId === product.id))
      .slice(0, 2);

    if (offeredAccessories.length === 0) {
      return null;
    }

    return {
      baseProduct,
      offeredAccessories,
      summary: buildPackageSummary(baseProduct, offeredAccessories),
    };
  }, [items, productsById]);

  useEffect(() => {
    const pendingOffer = loadPendingPackageOffer();
    if (pendingOffer && !packageOffer) {
      clearPendingPackageOffer();
    }
  }, [items, packageOffer]);

  function addOfferedPackageToCart() {
    if (!packageOffer) return;

    packageOffer.offeredAccessories.forEach((product) =>
      addToCart(product.id, 1, { source: "catalog", suppressPackageOffer: true }),
    );
    clearPendingPackageOffer();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Handlekurv</h1>

      {lines.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-slate-700">Handlekurven er tom.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Se produkter
          </Link>
        </div>
      ) : (
        <>
          {packageOffer ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">Pakketilbud tilgjengelig</p>
              <p className="mt-1 text-sm text-emerald-800">
                Legg til kompatibelt tilbehør for {packageOffer.baseProduct.name} med en liten
                pakkerabatt.
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                {packageOffer.offeredAccessories.map((product) => (
                  <div key={product.id} className="flex items-center justify-between gap-3">
                    <span>{product.name}</span>
                    <span className="font-semibold text-slate-900">{formatNok(product.priceNok)}</span>
                  </div>
                ))}
                <div className="mt-2 border-t border-emerald-200 pt-2">
                  <p className="flex items-center justify-between">
                    <span>Pakkerabatt</span>
                    <span className="font-semibold text-emerald-700">
                      - {formatNok(packageOffer.summary.packageDiscountNok)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={addOfferedPackageToCart}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Legg til pakketilbud
                </button>
                <button
                  type="button"
                  onClick={clearPendingPackageOffer}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Nei takk
                </button>
              </div>
            </div>
          ) : null}

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="py-2">Produkt</th>
                  <th className="py-2 text-right">Pris</th>
                  <th className="py-2 text-right">Antall</th>
                  <th className="py-2 text-right">Linjesum</th>
                  <th className="py-2 text-right">Fjern</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.productId} className="border-b border-slate-100">
                    <td className="py-3">
                      <Link
                        href={`/products/${line.product.slug}`}
                        className="font-semibold text-slate-900 hover:text-slate-700"
                      >
                        {line.product.name}
                      </Link>
                    </td>
                    <td className="py-3 text-right">{formatNok(line.product.priceNok)}</td>
                    <td className="py-3 text-right">
                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(event) =>
                          updateCartQuantity(
                            line.productId,
                            Number.parseInt(event.target.value || "1", 10),
                          )
                        }
                        className="w-16 rounded-md border border-slate-300 px-2 py-1 text-right"
                      />
                    </td>
                    <td className="py-3 text-right font-semibold">{formatNok(line.lineTotal)}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeFromCart(line.productId)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Fjern
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-lg font-semibold text-slate-900">Total: {formatNok(total)}</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearCart}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Tøm handlekurv
              </button>
              <Link
                href="/order-confirmation"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Bekreft bestilling
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
