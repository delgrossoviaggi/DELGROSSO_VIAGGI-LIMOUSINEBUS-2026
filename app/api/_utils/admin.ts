import { NextRequest } from "next/server";

export function assertAdmin(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  const got = req.headers.get("x-admin-password") || "";
  if (!expected || got !== expected) return { ok: false as const, error: "Non autorizzato" };
  return { ok: true as const };
}
