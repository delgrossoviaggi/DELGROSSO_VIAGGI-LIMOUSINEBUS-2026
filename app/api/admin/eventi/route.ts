import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";
import { getServerSupabase } from "../../../../lib/supabaseServer";

export const dynamic = "force-dynamic";
const BUCKET = process.env.SUPABASE_EVENTI_BUCKET || "eventi";

export async function GET(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  const { data, error } = await supabase.storage.from(BUCKET).list("", { limit: 200 });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data ?? []).map((f) => {
    const url = supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl;
    return { name: f.name, url };
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  const fd = await req.formData();
  const file = fd.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File mancante." }, { status: 400 });
  }

  const safeName = `${Date.now()}-${file.name}`.replace(/\s+/g, "_");
  const ab = await file.arrayBuffer();

  const { error } = await supabase.storage.from(BUCKET).upload(safeName, ab, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Parametro name mancante." }, { status: 400 });

  const supabase = getServerSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([name]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}