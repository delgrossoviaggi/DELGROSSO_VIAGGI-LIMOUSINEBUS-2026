import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin"; // IMPORT SINGOLO
import { getServerSupabase } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    assertAdmin(req);
    const supabase = getServerSupabase();
    const { data, error } = await supabase.from("prenotazioni").select("*");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}