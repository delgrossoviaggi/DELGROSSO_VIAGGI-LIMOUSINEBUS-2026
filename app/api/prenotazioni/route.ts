import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../_utils/admin";
import { getServerSupabase } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("prenotazioni")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data ?? [] });
}

export async function DELETE(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Parametro 'id' mancante." }, { status: 400 });

  const supabase = getServerSupabase();
  const { error } = await supabase.from("prenotazioni").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
