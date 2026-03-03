import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";
import { getServerSupabase } from "../../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

const BUCKET = process.env.SUPABASE_FOTO_BUCKET || "foto";

export async function GET(req: NextRequest) {
  const check = assertAdmin(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 401 });

  const supabase = getServerSupabase();
  const { data, error } = await supabase.storage.from(BUCKET).list("", { limit: 200 });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function DELETE(req: NextRequest) {
  const check = assertAdmin(req);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Nome mancante" }, { status: 400 });

  const supabase = getServerSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([name]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}