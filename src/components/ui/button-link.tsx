import Link from "next/link";
import { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}

const baseClass =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition";

const variants = {
  primary: "bg-amber-500 text-slate-950 hover:bg-amber-400",
  secondary:
    "border border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50",
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link href={href} className={`${baseClass} ${variants[variant]}`}>
      {children}
    </Link>
  );
}
