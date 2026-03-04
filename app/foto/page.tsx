"use client";

import { useEffect, useState } from "react";

type Foto = {
  name: string;
  url: string;
  created_at?: string;
};

export default function FotoPage() {
  const [items, setItems] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
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
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Foto</h1>

      {loading ? (
        <p>Caricamento...</p>
      ) : items.length === 0 ? (
        <p>Nessuna foto disponibile.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
          {items.map((f) => (
            <div key={f.name} style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
              <img src={f.url} alt={f.name} style={{ width: "100%", height: 250, objectFit: "cover" }} />
              <div style={{ padding: 10 }}>{f.name}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}