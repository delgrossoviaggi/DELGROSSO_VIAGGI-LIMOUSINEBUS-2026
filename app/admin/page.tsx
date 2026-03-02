"use client";

export default function AdminPage() {
  return (
    <div className="max-w-6xl p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Admin</h1>
          <p className="mt-2 text-white/70">Gestione Eventi, Foto e Prenotazioni.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a className="btn btn-ghost justify-center" href="/admin/eventi">
          🎟️ Gestione Eventi
        </a>
        <a className="btn btn-ghost justify-center" href="/admin/foto">
          🖼️ Gestione Foto
        </a>
        <a className="btn btn-ghost justify-center" href="/admin/prenotazioni">
          🧾 Gestione Prenotazioni
        </a>
      </div>
    </div>
  );
}
