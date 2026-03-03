import { NextResponse } from "next/server";
import { getServerSupabase } from "../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

const BUCKET = process.env.SUPABASE_FOTO_BUCKET || "foto";

export async function GET() {
  const supabase = getServerSupabase();

  const { data, error } = await supabase.storage.from(BUCKET).list("", { limit: 200 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items =
    (data ?? []).map((f) => {
      const pub = supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl;
      return { name: f.name, url: pub };
    }) ?? [];

  return NextResponse.json({ items });
}