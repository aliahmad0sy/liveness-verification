import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { PAGINATION_LIMIT } from "@/lib/constants";

export async function GET(request: Request) {
  const token = getSessionFromRequest(request);
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "جلسة منتهية" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || String(PAGINATION_LIMIT));
  const type = searchParams.get("type") || undefined;
  const status = searchParams.get("status") || undefined;

  const skip = (page - 1) * limit;

  const where = {
    OR: [{ senderId: payload.userId }, { receiverId: payload.userId }],
    ...(type && { type: type as never }),
    ...(status && { status: status as never }),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, email: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: transactions,
    total,
    page,
    limit,
    hasMore: skip + limit < total,
  });
}
