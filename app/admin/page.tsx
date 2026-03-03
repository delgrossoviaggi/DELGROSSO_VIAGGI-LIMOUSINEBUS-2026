"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t) setSaved(true);
  }, []);

  function save() {
    localStorage.setItem("admin_token", pass.trim());
    setSaved(true);
    setPass("");
  }

  function logout() {
    localStorage.removeItem("admin_token");
    setSaved(false);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin</h1>

      {!saved ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input placeholder="Password admin" value={pass} onChange={(e) => setPass(e.target.value)} type="password" />
          <button onClick={save} disabled={!pass.trim()}>
            Entra
          </button>
        </div>
      ) : (
        <>
          <p>Sei autenticato ✅</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/admin/eventi">🎟️ Gestione Eventi</a>
            <a href="/admin/foto">🖼️ Gestione Foto</a>
            <a href="/admin/prenotazioni">🧾 Prenotazioni</a>
            <button onClick={logout}>Esci</button>
          </div>
        </>
      )}
    </main>
  );
}