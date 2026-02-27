"use client";

import { useEffect, useMemo, useState } from "react";

type Booking = {
  id: string;
  created_at: string;
  nome: string;
  telefono: string;
  servizio: string;
  data: string | null;
  persone: string | null;
  partenza: string | null;
  destinazione: string | null;
  note: string | null;
  evento_id?: string | null;
  posti?: string | null;
};

type MediaItem = { name: string; url: string; created_at?: string };

type EventMeta = {
  id: string;
  created_at: string;
  titolo: string;
  data: string;
  locandina_storage_name: string;
};

type EventBus = {
  id: string;
  created_at: string;
  evento_id: string;
  bus_tipo: "GT53" | "GT63" | "LIMOBUS";
  capienza: number;
};

export const metadata = { title: "Admin — Del Grosso Viaggi & Limousine Bus" };

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventi, setEventi] = useState<MediaItem[]>([]);
  const [foto, setFoto] = useState<MediaItem[]>([]);
  const [eventMeta, setEventMeta] = useState<EventMeta[]>([]);
  const [eventBuses, setEventBuses] = useState<Record<string, EventBus[]>>({});

  const [newTitolo, setNewTitolo] = useState("");
  const [newData, setNewData] = useState("");
  const [newLocandinaName, setNewLocandinaName] = useState("");

  const [busEventoId, setBusEventoId] = useState<string>("");
  const [busTipo, setBusTipo] = useState<"GT53" | "GT63" | "LIMOBUS">("GT53");
  const [busCapienza, setBusCapienza] = useState<string>("");

// Filtri prenotazioni
const [filterEventId, setFilterEventId] = useState<string>("ALL");
const [filterBus, setFilterBus] = useState<"ALL" | "GT53" | "GT63" | "LIMOBUS">("ALL");
const [searchText, setSearchText] = useState<string>("");

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const headers = useMemo(() => ({ "x-admin-password": pw }), [pw]);

  async function login() {
    setMsg(null); setErr(null);
    try {
      const res = await fetch("/api/admin/ping", { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Password errata");
      setAuthed(true);
    } catch (e: any) {
      setErr(e?.message ?? "Errore");
    }
  }

  async function refresh() {
  setMsg(null);
  setErr(null);
  try {
    const [bRes, eRes, fRes, mRes] = await Promise.all([
      fetch("/api/admin/prenotazioni", { headers }),
      fetch("/api/admin/eventi", { headers }),
      fetch("/api/admin/foto", { headers }),
        fetch("/api/admin/eventi-meta", { headers }),
    ]);

    const b = await bRes.json();
    const e = await eRes.json();
    const f = await fRes.json();
      const m = await mRes.json();

    if (!bRes.ok) throw new Error(b?.error || "Errore prenotazioni");
    if (!eRes.ok) throw new Error(e?.error || "Errore eventi");
    if (!fRes.ok) throw new Error(f?.error || "Errore foto");
      if (!mRes.ok) throw new Error(m?.error || "Errore eventi (metadati)");

    setBookings(b.items || []);
    setEventi(e.items || []);
    setFoto(f.items || []);
      setEventMeta(m.items || []);

      // carica bus per ogni evento
      const map: Record<string, any[]> = {};
      for (const ev of (m.items || [])) {
        const r = await fetch(`/api/admin/eventi-bus?evento_id=${encodeURIComponent(ev.id)}`, { headers });
        const d = await r.json();
        if (r.ok) map[ev.id] = d.items || [];
        else map[ev.id] = [];
      }
      setEventBuses(map);
  } catch (e: any) {
    setErr(e?.message ?? "Errore");
  }
}

useEffect(() => {
  if (authed) refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [authed]);

  useEffect(() => { if (authed) refresh(); }, [authed]);

  async function upload(endpoint: "eventi" | "foto", file: File) {
  setMsg(null);
  setErr(null);
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/admin/${endpoint}`, { method: "POST", headers, body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Upload fallito");
    setMsg(endpoint === "foto" ? "Foto caricata ✅" : "Locandina evento caricata ✅");
    await refresh();
  } catch (e: any) {
    setErr(e?.message ?? "Errore");
  }
}

 {
    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-extrabold">Admin</h1>
        <p className="mt-3 text-neutral-300">Inserisci la password admin (Vercel: ADMIN_PASSWORD).</p>

        <div className="mt-6 card p-6">
          <div className="label">Password</div>
          <input className="input mt-2" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <button className="btn btn-primary mt-4 w-full" onClick={login}>🔒 Entra</button>
          {err && <div className="mt-3 text-red-400 font-semibold">{err}</div>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Admin</h1>
          <p className="mt-2 text-neutral-300">Gestisci locandine e visualizza prenotazioni.</p>
        </div>
        <button className="btn btn-ghost" onClick={refresh}>↻ Aggiorna</button>
      </div>

      {msg && <div className="mt-4 text-emerald-400 font-semibold">{msg}</div>}
      {err && <div className="mt-4 text-red-400 font-semibold">{err}</div>}

      <section className="mt-10">
  <h2 className="text-2xl font-extrabold">Eventi (Locandine)</h2>
  <div className="mt-4 card p-6">
    <div className="label">Carica locandina evento (JPG/PNG/WebP)</div>
    <input
      className="mt-2"
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) upload("eventi", file);
        e.currentTarget.value = "";
      }}
    />
    <p className="mt-2 text-sm text-neutral-500">
      Salvate su Supabase Storage (bucket: <span className="font-semibold">eventi</span>).
    </p>
  </div>

  <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
    {eventi.map((it) => (
      <div key={it.name} className="relative">
            <div key={it.name} className="relative">
            <div key={it.name} className="relative">
            <a href={it.url} target="_blank" rel="noreferrer" className="card overflow-hidden hover:border-emerald-500 transition">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={it.url} alt={it.name} className="h-64 w-full object-cover" />
        <div className="p-4">
          <div className="font-semibold line-clamp-1">{it.name}</div>
                <div className="mt-1 text-xs text-neutral-500">Nome file: <span className="font-mono">{it.name}</span></div>
          <div className="mt-1 text-xs text-neutral-400">Apri</div>
        </div>
      </a>
    ))}
  </div>
</section>

<section className="mt-12">
  <h2 className="text-2xl font-extrabold">Foto</h2>
  <div className="mt-4 card p-6">
    <div className="label">Carica foto (JPG/PNG/WebP)</div>
    <input
      className="mt-2"
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) upload("foto", file);
        e.currentTarget.value = "";
      }}
    />
    <p className="mt-2 text-sm text-neutral-500">
      Salvate su Supabase Storage (bucket: <span className="font-semibold">foto</span>).
    </p>
  </div>

  <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
    {foto.map((it) => (
      <div key={it.name} className="relative">
            <div key={it.name} className="relative">
            <a href={it.url} target="_blank" rel="noreferrer" className="card overflow-hidden hover:border-emerald-500 transition">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={it.url} alt={it.name} className="h-64 w-full object-cover" />
        <div className="p-4">
          <div className="font-semibold line-clamp-1">{it.name}</div>
                <div className="mt-1 text-xs text-neutral-500">Nome file: <span className="font-mono">{it.name}</span></div>
          <div className="mt-1 text-xs text-neutral-400">Apri</div>
        </div>
      </a>
    ))}
  </div>
</section>

<section className="mt-12">

        <h2 className="text-2xl font-extrabold">Prenotazioni</h2>
        <div className="mt-4 card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-900/40 text-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left">Data invio</th>
                  <th className="px-4 py-3 text-left">Evento</th>
                  <th className="px-4 py-3 text-left">Data evento</th>
                                    <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Telefono</th>
                  <th className="px-4 py-3 text-left">Persone</th>
                  <th className="px-4 py-3 text-left">Posti</th>
                  <th className="px-4 py-3 text-left">Partenza</th>
                  <th className="px-4 py-3 text-left">Note</th>
                  <th className="px-4 py-3 text-left">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="border-t border-neutral-900">
                    <td className="px-4 py-3 whitespace-nowrap text-neutral-300">
                      {new Date(b.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {eventMap.get((b as any).evento_id || "")?.titolo || b.destinazione || "-"}
                    </td>
                    <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">
                      {eventMap.get((b as any).evento_id || "")?.data || b.data || "-"}
                    </td>
                    <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">
                      {(b as any).bus_tipo || parseBusFromNote(b.note)}
                    </td>
                    <td className="px-4 py-3 font-semibold">{b.nome}</td>
                    <td className="px-4 py-3">
                      <a className="underline" href={`tel:${b.telefono}`}>{b.telefono}</a>
                    </td>
                    <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{b.persone || "-"}</td>
                    <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{(b as any).posti || "-"}</td>
                    <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{b.partenza || "-"}</td>
                    <td className="px-4 py-3 text-neutral-300 whitespace-nowrap">{b.servizio}</td>
                    <td className="px-4 py-3 text-neutral-300">{b.note || "-"}</td>
                    <td className="px-4 py-3">
                      <button className="btn btn-ghost" onClick={() => removeBooking(b.id)}>Elimina</button>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr className="border-t border-neutral-900">
                    <td className="px-4 py-4 text-neutral-400" colSpan={11}>Nessuna prenotazione.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
async function removeMedia(endpoint: "eventi" | "foto", name: string) {
  setMsg(null);
  setErr(null);
  try {
    const q = new URLSearchParams({ name });
    const res = await fetch(`/api/admin/${endpoint}?${q.toString()}`, { method: "DELETE", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Cancellazione fallita");
    setMsg(endpoint === "foto" ? "Foto eliminata ✅" : "Locandina eliminata ✅");
    await refresh();
  } catch (e: any) {
    setErr(e?.message ?? "Errore");
  }
}

async function createEventMeta() {
  setMsg(null);
  setErr(null);
  try {
    if (!newTitolo || !newData || !newBus || !newLocandinaName) {
      throw new Error("Compila Titolo, Data, Bus e Nome file locandina.");
    }
    const res = await fetch("/api/admin/eventi-meta", {
      method: "POST",
      headers: { ...headers, "content-type": "application/json" },
      body: JSON.stringify({
        titolo: newTitolo,
        data: newData,
        bus_tipo: newBus,
        locandina_storage_name: newLocandinaName,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Creazione evento fallita");
    setMsg("Evento creato ✅");
    setNewTitolo("");
    setNewData("");
    setNewLocandinaName("");
    await refresh();
  } catch (e: any) {
    setErr(e?.message ?? "Errore");
  }
}

async function removeEventMeta(id: string) {
  setMsg(null);
  setErr(null);
  try {
    const res = await fetch(`/api/admin/eventi-meta?id=${encodeURIComponent(id)}`, { method: "DELETE", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Cancellazione evento fallita");
    setMsg("Evento eliminato ✅");
    await refresh();
  } catch (e: any) {
    setErr(e?.message ?? "Errore");
  }
}

async function removeBooking(id: string) {
  setMsg(null);
  setErr(null);
  try {
    const res = await fetch(`/api/admin/prenotazioni?id=${encodeURIComponent(id)}`, { method: "DELETE", headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Cancellazione fallita");
    setMsg("Prenotazione eliminata ✅");
    await refresh();
  } catch (e: any) {
    setErr(e?.message ?? "Errore");
  }

function parseBusFromNote(note?: string | null): "GT53" | "GT63" | "LIMOBUS" | "ALTRO" {
  const m = (note || "").match(/Bus:\s*(GT53|GT63|LIMOBUS)/i);
  const v = (m?.[1] || "").toUpperCase();
  if (v === "GT53" || v === "GT63" || v === "LIMOBUS") return v;
  return "ALTRO";
}

const eventMap = useMemo(() => {
  const map = new Map<string, EventMeta>();
  for (const e of eventMeta) map.set(e.id, e);
  return map;
}, [eventMeta]);

const filteredBookings = useMemo(() => {
  const q = searchText.trim().toLowerCase();
  return bookings.filter((b) => {
    const evId = (b as any).evento_id as string | null | undefined;
    const bus = (b as any).bus_tipo || parseBusFromNote(b.note);

    if (filterEventId !== "ALL" && evId !== filterEventId) return false;
    if (filterBus !== "ALL" && bus !== filterBus) return false;

    if (q) {
      const hay = [
        b.nome,
        b.telefono,
        b.destinazione,
        b.partenza,
        b.note,
        eventMap.get(evId || "")?.titolo,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });
}, [bookings, filterBus, filterEventId, searchText, eventMap]);

function downloadCSV() {
  const rows = filteredBookings.map((b) => {
    const evId = (b as any).evento_id as string | null | undefined;
    const ev = evId ? eventMap.get(evId) : undefined;
    const bus = (b as any).bus_tipo || parseBusFromNote(b.note);
    return {
      created_at: b.created_at,
      evento: ev?.titolo || b.destinazione || "",
      data_evento: ev?.data || b.data || "",
      bus,
      nome: b.nome,
      telefono: b.telefono,
      persone: b.persone || "",
      posti: (b as any).posti || "",
      partenza: b.partenza || "",
      note: b.note || "",
    };
  });

  const header = Object.keys(rows[0] || { created_at: "", evento: "", data_evento: "", bus: "", nome: "", telefono: "", persone: "", posti: "", partenza: "", note: "" });
  const escape = (v: any) => {
    const s = String(v ?? "");
    const needs = /[",\n;]/.test(s);
    const out = s.replace(/"/g, '""');
    return needs ? `"${out}"` : out;
  };

  const csv = [header.join(";"), ...rows.map((r) => header.map((h) => escape((r as any)[h])).join(";"))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `prenotazioni-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
}

