import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase non configurato. Imposta NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY su Vercel." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.nome || !body?.telefono || !body?.servizio) {
    return NextResponse.json({ error: "Campi obbligatori mancanti." }, { status: 400 });
  }

  const payload: any = {
    nome: String(body.nome),
    telefono: String(body.telefono),
    servizio: String(body.servizio),
    data: body.data ? String(body.data) : null,
    persone: body.persone ? String(body.persone) : null,
    partenza: body.partenza ? String(body.partenza) : null,
    destinazione: body.destinazione ? String(body.destinazione) : null,
    note: body.note ? String(body.note) : null,
    evento_id: body.evento_id ? String(body.evento_id) : null,
    evento_bus_id: body.evento_bus_id ? String(body.evento_bus_id) : null,
    bus_tipo: body.bus_tipo ? String(body.bus_tipo) : null,
    posti: body.posti ? String(body.posti) : null,
  };

  const { error } = await supabase.from("prenotazioni").insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
