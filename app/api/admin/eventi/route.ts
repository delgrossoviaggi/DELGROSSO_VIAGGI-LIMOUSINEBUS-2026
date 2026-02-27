import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";
import { getServerSupabase } from "@/lib/supabaseServer";

const BUCKET = "process.env.SUPABASE_EVENTI_BUCKET || "eventi"";

export async function GET(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase non configurato." }, { status: 500 });

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data || [])
    .filter((f) => f.name && !f.name.endsWith("/"))
    .map((f) => {
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
      return { name: f.name, url: pub.publicUrl, created_at: f.created_at };
    });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase non configurato." }, { status: 500 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "File mancante." }, { status: 400 });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const name = `${Date.now()}-${Math.random().toString(16).slice(2)}.${safeExt}`;

  const buf = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BUCKET).upload(name, buf, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, name });
}

export async function DELETE(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase non configurato." }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Parametro 'name' mancante." }, { status: 400 });

  const { error } = await supabase.storage.from(BUCKET).remove([name]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
