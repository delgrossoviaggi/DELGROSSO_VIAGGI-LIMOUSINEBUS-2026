import { NextRequest, NextResponse } from "next/server";
import { assertAdmin } from "../../_utils/admin";

export async function GET(req: NextRequest) {
  const a = assertAdmin(req);
  if (!a.ok) return NextResponse.json({ error: a.error }, { status: 401 });
  return NextResponse.json({ ok: true });
}
