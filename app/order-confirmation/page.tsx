"use client";

import Link from "next/link";
import { useEffect } from "react";
import { clearCart } from "@/src/services/cart/session";

export default function OrderConfirmationPage() {
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
      <h1 className="text-3xl font-bold text-emerald-900">Takk for bestilling</h1>
      <p className="mt-3 text-emerald-800">
        Bestillingen er registrert. Vi følger opp med neste steg.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Fortsett å handle
        </Link>
        <Link
          href="/"
          className="rounded-md border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
        >
          Til forsiden
        </Link>
      </div>
    </div>
  );
}
