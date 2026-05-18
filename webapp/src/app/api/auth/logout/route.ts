import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const token = getSessionFromRequest(request);

  if (token) {
    const payload = await verifyToken(token);
    if (payload?.sessionId) {
      await prisma.session.deleteMany({ where: { id: payload.sessionId } });
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("kaza_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
