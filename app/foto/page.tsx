"use client";

import { useEffect, useState } from "react";

type Item = { name: string; url: string };

export default function FotoPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/foto", { cache: "no-store" });
        const j = await r.json();
        if (!alive) return;
        setItems(Array.isArray(j?.items) ? j.items : []);
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
    <main style={{ padding: 24 }}>
      <h1>Foto</h1>
      {loading ? (
        <p>Caricamento…</p>
      ) : items.length === 0 ? (
        <p>Nessuna foto disponibile.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {items.map((x) => (
            <a key={x.name} href={x.url} target="_blank" rel="noreferrer" style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.url} alt={x.name} style={{ width: "100%", height: 300, objectFit: "cover" }} />
              <div style={{ padding: 10, fontSize: 13 }}>{x.name}</div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}