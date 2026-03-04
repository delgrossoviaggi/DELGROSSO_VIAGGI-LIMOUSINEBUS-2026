import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";
import { getServerSupabase } from "@/lib/supabaseServer";

const BUCKET = process.env.SUPABASE_EVENTI_BUCKET || "eventi";

export async function GET(req: NextRequest) {
  try {
    assertAdmin(req);
    const supabase = getServerSupabase();
    const { data, error } = await supabase.storage.from(BUCKET).list();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}