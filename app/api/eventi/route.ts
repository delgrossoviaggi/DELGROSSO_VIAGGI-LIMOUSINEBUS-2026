import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";
import { getServerSupabase } from "@/lib/supabaseServer";

// CORRETTO: Rimosse le virgolette esterne che rendevano tutto una stringa
const BUCKET = process.env.SUPABASE_EVENTI_BUCKET || "eventi";

export async function GET(req: NextRequest) {
  try {
    // Verifica se l'utente è admin
    assertAdmin(req);
    
    const supabase = getServerSupabase();
    const { data, error } = await supabase.storage.from(BUCKET).list();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    assertAdmin(req);
    // Aggiungi qui la tua logica di caricamento (upload) se necessaria
    return NextResponse.json({ message: "Post logic here" });
  } catch (err: any) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}