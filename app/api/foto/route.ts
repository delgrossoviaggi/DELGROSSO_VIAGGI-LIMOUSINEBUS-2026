import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ items: [] });

  const bucket = process.env.SUPABASE_FOTO_BUCKET || "foto";

  const { data, error } = await supabase.storage
    .from(bucket)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data || [])
    .filter((f) => f.name && !f.name.endsWith("/"))
    .map((f) => {
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(f.name);
      return { name: f.name, url: pub.publicUrl, created_at: f.created_at };
    });

  return NextResponse.json({ items });
}
