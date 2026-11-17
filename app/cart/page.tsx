"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatNok } from "@/src/services/format/price";
import {
  clearCart,
  loadCartItems,
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Handlekurv</h1>

      {lines.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-slate-700">Handlekurven er tom.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-md bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
          >
            Se produkter
          </Link>
        </div>
      ) : (
        <>
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
                        className="font-semibold text-slate-900 hover:text-orange-700"
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
                className="rounded-md bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800"
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
