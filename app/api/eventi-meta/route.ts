import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ items: [] });

  const bucket = process.env.SUPABASE_EVENTI_BUCKET || "eventi";

  const { data: events, error: eErr } = await supabase
    .from("eventi")
    .select("*")
    .order("data", { ascending: true })
    .limit(300);

  if (eErr) return NextResponse.json({ error: eErr.message }, { status: 500 });

  const ids = (events || []).map((e: any) => e.id);
  const { data: buses, error: bErr } = await supabase
    .from("eventi_bus")
    .select("*")
    .in("evento_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: true });

  if (bErr) return NextResponse.json({ error: bErr.message }, { status: 500 });

  const byEvent = new Map<string, any[]>();
  for (const b of buses || []) {
    const k = (b as any).evento_id as string;
    byEvent.set(k, [...(byEvent.get(k) || []), b]);
  }

  const items = (events || []).map((e: any) => {
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(e.locandina_storage_name);
    return {
      id: e.id,
      titolo: e.titolo,
      data: e.data,
      locandina_name: e.locandina_storage_name,
      url: pub.publicUrl,
      buses: (byEvent.get(e.id) || []).map((b: any) => ({
        id: b.id,
        bus_tipo: b.bus_tipo,
        capienza: b.capienza,
      })),
    };
  });

  return NextResponse.json({ items });
}
