import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../_utils/admin";
import { getServerSupabase } from "@/lib/supabaseServer";

const BUCKET = process.env.SUPABASE_EVENTI_BUCKET || "eventi";

export async function GET(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();

  const { data, error } = await supabase.storage.from(BUCKET).list("", {
    limit: 200,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data ?? [], bucket: BUCKET });
}

export async function DELETE(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Parametro 'name' mancante." }, { status: 400 });

  const supabase = getServerSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([name]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
