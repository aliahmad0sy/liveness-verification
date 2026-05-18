import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { getSessionFromRequest, makeSessionCookie } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawToken = getSessionFromRequest(request);

    if (rawToken) {
      const payload = await verifyToken(rawToken);
      if (payload?.sessionId) {
        // Delete session from DB; ignore if already gone
        await prisma.session
          .delete({ where: { id: payload.sessionId } })
          .catch(() => null);
      }
    }

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: { "Set-Cookie": makeSessionCookie("", true) },
      }
    );
  } catch (error) {
    console.error("[logout]", error);
    // Always clear the cookie even on unexpected errors
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: { "Set-Cookie": makeSessionCookie("", true) },
      }
    );
  }
}
