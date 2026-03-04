"use client";

export default function AdminPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Admin</h1>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <a href="/admin/eventi">Gestione Eventi</a>
        <a href="/admin/foto">Gestione Foto</a>
        <a href="/admin/prenotazioni">Gestione Prenotazioni</a>
      </div>
    </main>
  );
}