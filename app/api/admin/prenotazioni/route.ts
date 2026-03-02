import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";
import { getServerSupabase } from "@/lib/supabaseServer";

/**
 * GET → lista prenotazioni (solo admin)
 */
export async function GET(req: NextRequest) {
  try {
    await assertAdmin(req);

    const supabase = getServerSupabase();

    const { data, error } = await supabase
      .from("prenotazioni")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unauthorized" },
      { status: 401 }
    );
  }
}

/**
 * DELETE → elimina prenotazione (solo admin)
 */
export async function DELETE(req: NextRequest) {
  try {
    await assertAdmin(req);

    const supabase = getServerSupabase();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("prenotazioni")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unauthorized" },
      { status: 401 }
    );
  }
}