import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { getSessionFromRequest } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const rawToken = getSessionFromRequest(request);
    if (!rawToken) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(rawToken);
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // Verify session still exists in DB
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      select: { id: true, expiresAt: true },
    });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        kycStatus: true,
        isActive: true,
        isEmailVerified: true,
        twoFactorEnabled: true,
        referralCode: true,
        avatarUrl: true,
        country: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Account has been deactivated" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("[me]", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
