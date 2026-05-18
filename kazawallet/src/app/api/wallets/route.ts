import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { getSessionFromRequest } from "@/lib/auth/session";
import { NextResponse } from "next/server";

async function authenticate(request: Request) {
  const rawToken = getSessionFromRequest(request);
  if (!rawToken) return null;
  const payload = await verifyToken(rawToken);
  if (!payload?.userId) return null;
  return payload;
}

// GET /api/wallets — list all wallets for the authenticated user
export async function GET(request: Request) {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: payload.userId },
      include: {
        currency: {
          select: {
            code: true,
            name: true,
            nameAr: true,
            symbol: true,
            type: true,
            decimals: true,
            logoUrl: true,
            network: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, wallets }, { status: 200 });
  } catch (error) {
    console.error("[wallets GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve wallets" },
      { status: 500 }
    );
  }
}

// POST /api/wallets — add a new wallet for the authenticated user
export async function POST(request: Request) {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currencyCode } = body ?? {};

    if (!currencyCode || typeof currencyCode !== "string" || currencyCode.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "currencyCode is required" },
        { status: 400 }
      );
    }

    const currency = await prisma.currency.findUnique({
      where: { code: currencyCode.trim().toUpperCase() },
    });
    if (!currency) {
      return NextResponse.json(
        { success: false, error: `Currency "${currencyCode}" is not supported` },
        { status: 404 }
      );
    }
    if (!currency.isActive) {
      return NextResponse.json(
        { success: false, error: `Currency "${currencyCode}" is currently unavailable` },
        { status: 400 }
      );
    }

    // Check for duplicate wallet
    const existing = await prisma.wallet.findUnique({
      where: { userId_currencyId: { userId: payload.userId, currencyId: currency.id } },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `You already have a ${currency.code} wallet` },
        { status: 409 }
      );
    }

    const wallet = await prisma.wallet.create({
      data: { userId: payload.userId, currencyId: currency.id },
      include: {
        currency: {
          select: {
            code: true,
            name: true,
            nameAr: true,
            symbol: true,
            type: true,
            decimals: true,
            logoUrl: true,
            network: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, wallet }, { status: 201 });
  } catch (error) {
    console.error("[wallets POST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}
