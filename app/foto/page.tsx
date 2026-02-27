"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Foto = { name: string; url: string; created_at?: string };

export const metadata = { title: "Foto — Del Grosso Viaggi & Limousine Bus" };

export default function FotoPage() {
  const [items, setItems] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/foto");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Errore caricamento foto");
        setItems(data.items || []);
      } catch (e: any) {
        setErr(e?.message ?? "Errore");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Foto</h1>
      <p className="mt-3 text-neutral-300">
        Gallery foto aggiornata. (Upload disponibile in Admin.)
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn btn-primary" href="/prenotazioni">✅ Prenota un evento</Link>
        <Link className="btn btn-ghost" href="/admin">🔒 Admin (upload)</Link>
      </div>

      <div className="mt-8">
        {loading && <div className="text-neutral-300">Caricamento...</div>}
        {err && <div className="text-red-400 font-semibold">{err}</div>}

        {!loading && !err && items.length === 0 && (
          <div className="card p-6">
            <div className="font-semibold">Nessuna foto disponibile</div>
            <p className="mt-2 text-neutral-300">Caricale da Admin → “Foto”.</p>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((it) => (
            <a key={it.name} href={it.url} target="_blank" rel="noreferrer" className="card overflow-hidden hover:border-emerald-500 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.url} alt={it.name} className="h-64 w-full object-cover" />
              <div className="p-4">
                <div className="font-semibold line-clamp-1">{it.name}</div>
                <div className="mt-1 text-xs text-neutral-400">Apri</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
