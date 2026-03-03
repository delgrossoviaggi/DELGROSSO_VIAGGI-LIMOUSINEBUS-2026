"use client";

import { useState } from "react";

export default function PrenotazioniPage() {
  const [nome, setNome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setOk(null);
    setLoading(true);
    try {
      const r = await fetch("/api/prenotazioni", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nome, telefono, messaggio }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Errore invio");
      setOk("Richiesta inviata ✅");
      setNome("");
      setTelefono("");
      setMessaggio("");
    } catch (e: any) {
      setOk(e?.message || "Errore");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>Richiedi Preventivo</h1>

      <div style={{ display: "grid", gap: 10 }}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <textarea placeholder="Messaggio" value={messaggio} onChange={(e) => setMessaggio(e.target.value)} rows={5} />
        <button onClick={submit} disabled={loading || !nome || !telefono}>
          {loading ? "Invio…" : "Invia"}
        </button>
        {ok && <p>{ok}</p>}
      </div>
    </main>
  );
}