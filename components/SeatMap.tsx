"use client";

import { useMemo } from "react";

type Cell =
  | { type: "seat"; seatNo: number }
  | { type: "aisle" }
  | { type: "empty" }
  | { type: "door" };

type Props = {
  variant: "GT53" | "GT63";
  selected: number[];
  occupied: number[];
  onToggle: (seatNo: number) => void;
};

function buildLayout(variant: "GT53" | "GT63"): Cell[][] {
  let rows: ("S" | "A" | "E" | "D")[][] = [];

  if (variant === "GT53") {
    // 53 POSTI - PORTA CENTRALE (come disegno reale)
    for (let i = 0; i < 6; i++)
      rows.push(["S","S","A","S","S","E"]);

    // Porta centrale
    rows.push(["E","E","A","D","D","E"]);

    for (let i = 0; i < 5; i++)
      rows.push(["S","S","A","S","S","E"]);

    // Ultima fila 5 posti = totale 53
    rows.push(["S","S","A","S","S","S"]);
  } else {
    // 63 POSTI - PORTA CENTRALE
    for (let i = 0; i < 7; i++)
      rows.push(["S","S","A","S","S","E"]);

    rows.push(["E","E","A","D","D","E"]);

    for (let i = 0; i < 8; i++)
      rows.push(["S","S","A","S","S","E"]);

    rows.push(["E","E","A","S","S","S"]);
  }

  let seat = 1;
  return rows.map(r =>
    r.map(t => {
      if (t === "S") return { type: "seat", seatNo: seat++ } as Cell;
      if (t === "A") return { type: "aisle" } as Cell;
      if (t === "D") return { type: "door" } as Cell;
      return { type: "empty" } as Cell;
    })
  );
}

function seatLabel(n: number) {
  return String(n).padStart(2, "0");
}

export function SeatMap({ variant, selected, occupied, onToggle }: Props) {
  const grid = useMemo(() => buildLayout(variant), [variant]);

  return (
    <div className="card p-6">
      <div className="font-extrabold mb-4">
        Bus: {variant === "GT53" ? "GT 53 posti (porta centrale)" : "GT 63 posti (porta centrale)"}
      </div>

      <div className="grid gap-2">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="grid grid-cols-6 gap-2">
            {row.map((cell, cIdx) => {
              if (cell.type === "aisle" || cell.type === "empty")
                return <div key={cIdx} />;

              if (cell.type === "door")
                return (
                  <div key={cIdx} className="col-span-2 flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900/60 text-xs font-bold">
                    PORTA
                  </div>
                );

              const n = cell.seatNo;
              const isOcc = occupied.includes(n);
              const isSel = selected.includes(n);

              const cls =
                "rounded-xl border px-2 py-2 text-sm font-bold transition " +
                (isOcc
                  ? "cursor-not-allowed border-red-400 bg-red-500/40"
                  : isSel
                  ? "border-sky-400 bg-sky-400/60 text-black"
                  : "border-neutral-700 bg-neutral-950/40 hover:border-neutral-500");

              return (
                <button
                  key={cIdx}
                  type="button"
                  disabled={isOcc}
                  onClick={() => onToggle(n)}
                  className={cls}
                >
                  {seatLabel(n)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
