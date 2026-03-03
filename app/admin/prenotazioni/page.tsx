"use client";

import { useEffect, useState } from "react";

type P = { id: string; nome: string; telefono: string; messaggio: string; created_at?: string };

function token() {
  return localStorage.getItem("admin_token") || "";
}

export default function AdminPrenotazioniPage() {
  const [items, setItems] = useState<P[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setMsg(null);
    const r = await fetch("/api/admin/prenotazioni", { headers: { authorization: `Bearer ${token()}` } });
    const j = await r.json();
    if (!r.ok) return setMsg(j?.error || "Errore");
    setItems(Array.isArray(j?.items) ? j.items : []);
  }

  async function del(id: string) {
    setMsg(null);
    const r = await fetch(`/api/admin/prenotazioni?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token()}` },
    });
    const j = await r.json();
    if (!r.ok) return setMsg(j?.error || "Errore delete");
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin • Prenotazioni</h1>
      <button onClick={load}>Ricarica</button>
      {msg && <p style={{ color: "crimson" }}>{msg}</p>}

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {items.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <strong>{p.nome}</strong>
              <button onClick={() => del(p.id)}>Elimina</button>
            </div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>Tel: {p.telefono}</div>
            <div style={{ marginTop: 8 }}>{p.messaggio}</div>
            {p.created_at && <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>{p.created_at}</div>}
          </div>
        ))}
      </div>
    </main>
  );
}