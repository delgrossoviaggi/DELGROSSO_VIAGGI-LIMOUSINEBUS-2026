"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Item = { name: string; url: string; created_at?: string };

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PhotoCarousel() {
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  const timerRef = useRef<number | null>(null);

  const hasItems = items.length > 0;

  const visible = useMemo(() => {
    if (!hasItems) return [];
    // show up to 8 items in the rotation, shuffled
    const shuffled = shuffle(items);
    return shuffled.slice(0, Math.min(12, shuffled.length));
  }, [items, hasItems]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/foto", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Errore caricamento foto");
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch (e: any) {
        setErr(e?.message ?? "Errore");
      }
    })();
  }, []);

  useEffect(() => {
    if (!visible.length) return;

    // reset index if list changes
    setIdx(0);

    // auto-advance every 3.5s
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIdx((v) => (v + 1) % visible.length);
    }, 3500);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [visible.length]);

  function prev() {
    if (!visible.length) return;
    setIdx((v) => (v - 1 + visible.length) % visible.length);
  }
  function next() {
    if (!visible.length) return;
    setIdx((v) => (v + 1) % visible.length);
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-800 px-5 py-4">
        <div>
          <div className="text-lg font-extrabold">Foto &amp; Locandine</div>
          <div className="text-sm text-neutral-400">
            Scorrono automaticamente e vengono prese dalla pagina “Foto”.
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={prev} className="btn btn-ghost" aria-label="Indietro">
            ‹
          </button>
          <button type="button" onClick={next} className="btn btn-ghost" aria-label="Avanti">
            ›
          </button>
        </div>
      </div>

      {!visible.length && (
        <div className="p-6">
          {err ? (
            <div className="text-red-400 font-semibold">{err}</div>
          ) : (
            <div className="text-neutral-300">
              Nessuna foto disponibile. Caricale da <span className="font-semibold">Admin → Foto</span> ✅
            </div>
          )}
        </div>
      )}

      {visible.length > 0 && (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={visible[idx]?.url}
            src={visible[idx]?.url}
            alt={visible[idx]?.name || "Foto"}
            className="h-[320px] w-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="max-w-[75%]">
                <div className="text-sm text-neutral-200">
                  {visible[idx]?.name}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-neutral-300">
                  {idx + 1}/{visible.length}
                </div>
                <a
                  className="btn btn-primary"
                  href="/foto"
                >
                  Vedi tutte
                </a>
              </div>
            </div>

            <div className="mt-3 flex gap-1">
              {visible.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={
                    "h-1.5 flex-1 rounded-full transition " +
                    (i === idx ? "bg-emerald-400" : "bg-neutral-700 hover:bg-neutral-600")
                  }
                  aria-label={`Vai alla foto ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
