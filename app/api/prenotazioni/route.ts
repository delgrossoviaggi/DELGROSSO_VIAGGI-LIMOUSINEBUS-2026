import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";
import { getServerSupabase } from "../../../../lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = assertAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const supabase = getServerSupabase();

  const { data, error } = await supabase
    .from("prenotazioni")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}