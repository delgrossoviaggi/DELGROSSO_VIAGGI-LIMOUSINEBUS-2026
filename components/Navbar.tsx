"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Logo } from "./Logo";

const WHATSAPP_GENERIC = "https://wa.me/393205730466";

const nav = [
  { href: "/", label: "Home" },
  { href: "/prenotazioni", label: "Prenotazioni" },
  { href: "/eventi", label: "Eventi & Foto" },
  { href: "/contatti", label: "Contatti" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = useMemo(() => nav.find(n => n.href === pathname)?.href ?? "/", [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900 bg-neutral-950/70 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.slice(1).map((item) => {
            const active = current === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "text-neutral-50 font-semibold" : "text-neutral-300 hover:text-neutral-50"}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/prenotazioni" className="btn btn-primary">✅ Prenota ora</Link>
        </nav>

        <button className="md:hidden btn btn-ghost" aria-label="Apri menu" onClick={() => setOpen(v => !v)}>
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-900 md:hidden">
          <div className="container flex flex-col gap-3 py-4">
            {nav.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-neutral-900 bg-neutral-950/40 px-4 py-3 text-neutral-100"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/prenotazioni" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              ✅ Prenota ora
            </Link>
            <a className="btn btn-ghost w-full" href={WHATSAPP_GENERIC} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
