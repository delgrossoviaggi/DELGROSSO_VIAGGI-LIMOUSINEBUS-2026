export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ margin: 0 }}>DELGROSSO VIAGGI & Limousine Bus</h1>
      <p style={{ opacity: 0.8 }}>Sito operativo – Eventi, Foto, Preventivi e Prenotazioni.</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
        <a href="/eventi">🎟️ Eventi</a>
        <a href="/foto">🖼️ Foto</a>
        <a href="/prenotazioni">🧾 Richiedi Preventivo</a>
        <a href="/admin">⚙️ Admin</a>
      </div>
    </main>
  );
}