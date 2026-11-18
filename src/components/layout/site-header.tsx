"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount, onCartUpdated } from "@/src/services/cart/session";

const navItems = [
  { href: "/", label: "Hjem" },
  { href: "/guide", label: "Produktguide" },
  { href: "/products", label: "Produkter" },
  { href: "/about", label: "Om løsningen" },
];

export function SiteHeader() {
  const [itemsInCart, setItemsInCart] = useState(0);

  useEffect(() => {
    const sync = () => setItemsInCart(cartCount());
    sync();
    return onCartUpdated(sync);
  }, []);

  return (
    <header className="border-b border-slate-200 bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight text-white">
          JDD ProduktGuide
        </Link>
        <nav aria-label="Hovednavigasjon" className="flex flex-wrap items-center gap-2 text-base">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-slate-200 transition hover:bg-slate-800 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="rounded-md bg-blue-700 px-3 py-2 font-semibold text-white hover:bg-blue-800"
          >
            Handlekurv ({itemsInCart})
          </Link>
        </nav>
      </div>
    </header>
  );
}
