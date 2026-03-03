"use client";

import { useEffect, useState } from "react";

type Item = { name: string; url: string };

function token() {
  return localStorage.getItem("admin_token") || "";
}

export default function AdminFotoPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/foto", { headers: { authorization: `Bearer ${token()}` } });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Errore");
      setItems(Array.isArray(j?.items) ? j.items : []);
    } catch (e: any) {
      setMsg(e?.message || "Errore");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function upload() {
    if (!file) return;
    setMsg(null);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin/foto", { method: "POST", headers: { authorization: `Bearer ${token()}` }, body: fd });
    const j = await r.json();
    if (!r.ok) return setMsg(j?.error || "Errore upload");
    setFile(null);
    await load();
  }

  async function del(name: string) {
    setMsg(null);
    const r = await fetch(`/api/admin/foto?name=${encodeURIComponent(name)}`, { method: "DELETE", headers: { authorization: `Bearer ${token()}` } });
    const j = await r.json();
    if (!r.ok) return setMsg(j?.error || "Errore delete");
    await load();
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin • Foto</h1>

      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={upload} disabled={!file}>
          Carica foto
        </button>
        <button onClick={load}>Ricarica</button>
      </div>

      {msg && <p style={{ color: "crimson" }}>{msg}</p>}

      {loading ? (
        <p>Caricamento…</p>
      ) : (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: 16 }}>
          {items.map((x) => (
            <div key={x.name} style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.url} alt={x.name} style={{ width: "100%", height: 300, objectFit: "cover" }} />
              <div style={{ padding: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontSize: 12 }}>{x.name}</span>
                <button onClick={() => del(x.name)}>Elimina</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}