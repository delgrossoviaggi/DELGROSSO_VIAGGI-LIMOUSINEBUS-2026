
"use client";

import { useEffect, useState } from "react";

type Foto = { name: string; url: string; created_at?: string };

export default function FotoPage() {
  const [items, setItems] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/api/foto", { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        setItems(Array.isArray(json?.items) ? json.items : []);
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-extrabold text-white">Foto</h1>
      <p className="mt-2 text-white/70">Galleria foto caricata dal pannello admin.</p>

      {loading ? (
        <div className="mt-8 text-white/70">Caricamento…</div>
      ) : items.length === 0 ? (
        <div className="mt-8 text-white/70">Nessuna foto disponibile.</div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((f) => (
            <a
              key={f.name}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt={f.name} className="h-64 w-full object-cover" />
              <div className="p-3 text-sm text-white/80">{f.name}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}



