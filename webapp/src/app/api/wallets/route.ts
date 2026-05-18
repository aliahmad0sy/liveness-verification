import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const token = getSessionFromRequest(request);
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "جلسة منتهية" }, { status: 401 });

  const wallets = await prisma.wallet.findMany({
    where: { userId: payload.userId, isActive: true },
    include: { currency: true },
    orderBy: { currency: { sortOrder: "asc" } },
  });

  return NextResponse.json({ success: true, data: wallets });
}

export async function POST(request: Request) {
  const token = getSessionFromRequest(request);
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "جلسة منتهية" }, { status: 401 });

  const { currencyCode } = await request.json();
  if (!currencyCode) return NextResponse.json({ error: "كود العملة مطلوب" }, { status: 400 });

  const currency = await prisma.currency.findUnique({ where: { code: currencyCode } });
  if (!currency || !currency.isActive) {
    return NextResponse.json({ error: "العملة غير مدعومة" }, { status: 400 });
  }

  const existing = await prisma.wallet.findFirst({
    where: { userId: payload.userId, currencyId: currency.id },
  });
  if (existing) {
    return NextResponse.json({ error: "لديك محفظة بهذه العملة بالفعل" }, { status: 409 });
  }

  const wallet = await prisma.wallet.create({
    data: { userId: payload.userId, currencyId: currency.id },
    include: { currency: true },
  });

  return NextResponse.json({ success: true, data: wallet }, { status: 201 });
}
