import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const token = getSessionFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "جلسة منتهية" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      kycStatus: true,
      isActive: true,
      isEmailVerified: true,
      twoFactorEnabled: true,
      avatarUrl: true,
      country: true,
      referralCode: true,
      createdAt: true,
    },
  });

  if (!user || !user.isActive) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
}
