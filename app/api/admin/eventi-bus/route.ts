import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";
import { getServerSupabase } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase non configurato." }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const evento_id = searchParams.get("evento_id");
  if (!evento_id) return NextResponse.json({ error: "Parametro 'evento_id' mancante." }, { status: 400 });

  const { data, error } = await supabase
    .from("eventi_bus")
    .select("*")
    .eq("evento_id", evento_id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase non configurato." }, { status: 500 });

  const body = await req.json().catch(() => null);
  if (!body?.evento_id || !body?.bus_tipo) {
    return NextResponse.json({ error: "Campi mancanti." }, { status: 400 });
  }

  const payload = {
    evento_id: String(body.evento_id),
    bus_tipo: String(body.bus_tipo),
    capienza: Number.isFinite(Number(body.capienza)) ? Number(body.capienza) : 0,
  };

  const { error } = await supabase.from("eventi_bus").insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase non configurato." }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Parametro 'id' mancante." }, { status: 400 });

  const { error } = await supabase.from("eventi_bus").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
