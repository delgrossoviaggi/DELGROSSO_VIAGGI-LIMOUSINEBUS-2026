import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseServer";

function parseSeats(note: string): number[] {
  const m = note.match(/Posti:\s*([0-9,\s]+)/i);
  if (!m) return [];
  return m[1]
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export async function GET(req: Request) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ items: [] });

  const { searchParams } = new URL(req.url);
  const evento_bus_id = searchParams.get("evento_bus_id") || "";
  if (!evento_bus_id) return NextResponse.json({ items: [] });

  const { data, error } = await supabase
    .from("prenotazioni")
    .select("note")
    .eq("evento_bus_id", evento_bus_id)
    .limit(2000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const occupied = new Set<number>();
  for (const r of data || []) {
    const note = (r as any).note as string | null;
    if (!note) continue;
    for (const s of parseSeats(note)) occupied.add(s);
  }

  return NextResponse.json({ items: Array.from(occupied).sort((a, b) => a - b) });
}
