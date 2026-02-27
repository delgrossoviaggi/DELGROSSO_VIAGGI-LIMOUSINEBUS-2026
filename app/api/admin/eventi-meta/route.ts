import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";
import { getServerSupabase } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase non configurato." }, { status: 500 });

  const { data, error } = await supabase.from("eventi").select("*").order("data", { ascending: true }).limit(300);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase non configurato." }, { status: 500 });

  const body = await req.json().catch(() => null);
  if (!body?.titolo || !body?.data || !body?.locandina_storage_name) {
    return NextResponse.json({ error: "Campi mancanti." }, { status: 400 });
  }

  const payload = {
    titolo: String(body.titolo),
    data: String(body.data),
    locandina_storage_name: String(body.locandina_storage_name),
  };

  const { error } = await supabase.from("eventi").insert(payload);
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

  // buses will cascade delete if FK is set as in README
  const { error } = await supabase.from("eventi").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
