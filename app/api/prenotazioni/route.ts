import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabase();
    const body = await req.json();

    const nome = String(body?.nome || "").trim();
    const telefono = String(body?.telefono || "").trim();
    const messaggio = String(body?.messaggio || "").trim();

    if (!nome || !telefono) {
      return NextResponse.json({ error: "Nome e telefono obbligatori." }, { status: 400 });
    }

    const { error } = await supabase.from("prenotazioni").insert([{ nome, telefono, messaggio }]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Errore" }, { status: 500 });
  }
}