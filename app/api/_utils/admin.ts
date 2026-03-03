import type { NextRequest } from "next/server";

export function assertAdmin(req: NextRequest): { ok: true } | { ok: false; error: string } {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return { ok: false, error: "ADMIN_PASSWORD non configurata su Vercel." };

  const hdr = req.headers.get("authorization") || "";
  const token = hdr.replace("Bearer ", "").trim();

  if (!token) return { ok: false, error: "Non autorizzato." };
  if (token !== pass) return { ok: false, error: "Password admin errata." };

  return { ok: true };
}
