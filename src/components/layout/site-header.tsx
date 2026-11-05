import Link from "next/link";

const navItems = [
  { href: "/", label: "Hjem" },
  { href: "/guide", label: "Produktguide" },
  { href: "/products", label: "Produkter" },
  { href: "/about", label: "Om løsningen" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          JDD ProduktGuide
        </Link>
        <nav aria-label="Hovednavigasjon" className="flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1 text-slate-200 transition hover:bg-slate-800 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
