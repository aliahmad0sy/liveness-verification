import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { getSessionFromRequest } from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { PAGE_SIZE } from "@/lib/constants";
import type { NextRequest } from "next/server";

async function authenticate(request: Request) {
  const rawToken = getSessionFromRequest(request);
  if (!rawToken) return null;
  const payload = await verifyToken(rawToken);
  if (!payload?.userId) return null;
  return payload;
}

// GET /api/transactions — paginated transaction list for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? String(PAGE_SIZE), 10) || PAGE_SIZE)
    );
    const skip = (page - 1) * limit;

    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");

    // Build where filter
    const where: Record<string, unknown> = {
      OR: [
        { senderId: payload.userId },
        { receiverId: payload.userId },
      ],
    };

    if (typeParam) {
      const validTypes = [
        "DEPOSIT", "WITHDRAWAL", "TRANSFER_IN", "TRANSFER_OUT",
        "EXCHANGE", "CARD_FUNDING", "CARD_PAYMENT", "MASS_PAYOUT",
        "FEE", "COMMISSION",
      ];
      if (!validTypes.includes(typeParam.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: `Invalid transaction type: ${typeParam}` },
          { status: 400 }
        );
      }
      where.type = typeParam.toUpperCase();
    }

    if (statusParam) {
      const validStatuses = ["PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"];
      if (!validStatuses.includes(statusParam.toUpperCase())) {
        return NextResponse.json(
          { success: false, error: `Invalid status: ${statusParam}` },
          { status: 400 }
        );
      }
      where.status = statusParam.toUpperCase();
    }

    const [transactions, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          receiver: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: transactions,
        total,
        page,
        hasMore: skip + transactions.length < total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[transactions GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve transactions" },
      { status: 500 }
    );
  }
}
