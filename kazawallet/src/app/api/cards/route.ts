import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { getSessionFromRequest } from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { CARD_ISSUANCE_FEE } from "@/lib/constants";
import { Decimal } from "@prisma/client-runtime-utils";

async function authenticate(request: Request) {
  const rawToken = getSessionFromRequest(request);
  if (!rawToken) return null;
  const payload = await verifyToken(rawToken);
  if (!payload?.userId) return null;
  return payload;
}

function generateNumericString(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

// GET /api/cards — list all cards for the authenticated user (no sensitive data)
export async function GET(request: Request) {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const cards = await prisma.card.findMany({
      where: { userId: payload.userId },
      select: {
        id: true,
        maskedNumber: true,
        cardHolder: true,
        expiryMonth: true,
        expiryYear: true,
        balance: true,
        status: true,
        is3DSEnabled: true,
        network: true,
        issuanceFee: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, cards }, { status: 200 });
  } catch (error) {
    console.error("[cards GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve cards" },
      { status: 500 }
    );
  }
}

// POST /api/cards — issue a new virtual card
export async function POST(request: Request) {
  try {
    const payload = await authenticate(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Load user to check KYC status
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, firstName: true, lastName: true, kycStatus: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "User account not found or inactive" },
        { status: 403 }
      );
    }

    if (user.kycStatus !== "APPROVED") {
      return NextResponse.json(
        {
          success: false,
          error: "KYC verification is required before issuing a card. Please complete identity verification.",
        },
        { status: 403 }
      );
    }

    // Find USD wallet and verify sufficient balance for issuance fee
    const usdCurrency = await prisma.currency.findUnique({
      where: { code: "USD" },
      select: { id: true },
    });

    if (!usdCurrency) {
      return NextResponse.json(
        { success: false, error: "USD currency is not configured" },
        { status: 500 }
      );
    }

    const card = await prisma.$transaction(async (tx: any) => {
      const usdWallet = await tx.wallet.findUnique({
        where: { userId_currencyId: { userId: payload.userId, currencyId: usdCurrency.id } },
      });

      if (!usdWallet) {
        throw new Error("You do not have a USD wallet. Please create one first.");
      }

      const walletBalance = new Decimal(usdWallet.balance.toString());
      const issuanceFee = new Decimal(CARD_ISSUANCE_FEE.toString());

      if (walletBalance.lt(issuanceFee)) {
        throw new Error(
          `Insufficient USD balance. A minimum of $${CARD_ISSUANCE_FEE.toFixed(2)} is required for card issuance.`
        );
      }

      // Deduct issuance fee from USD wallet
      await tx.wallet.update({
        where: { id: usdWallet.id },
        data: { balance: { decrement: issuanceFee } },
      });

      // Record the fee transaction
      await tx.transaction.create({
        data: {
          senderId: payload.userId,
          type: "CARD_FUNDING",
          status: "COMPLETED",
          fromCurrencyCode: "USD",
          fromAmount: issuanceFee,
          fee: 0,
          processedAt: new Date(),
          description: "Card issuance fee",
        },
      });

      // Generate card details
      const last12 = generateNumericString(12);
      const fullCardNumber = `4532${last12}`;
      const last4 = last12.slice(-4);
      const maskedNumber = `4532 **** **** ${last4}`;

      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setFullYear(expiryDate.getFullYear() + 3);
      const expiryMonth = expiryDate.getMonth() + 1; // 1-12
      const expiryYear = expiryDate.getFullYear();

      const cardHolder = `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`;

      const newCard = await tx.card.create({
        data: {
          userId: payload.userId,
          maskedNumber,
          cardHolder,
          expiryMonth,
          expiryYear,
          status: "ACTIVE",
          network: "VISA",
          issuanceFee,
        },
        select: {
          id: true,
          maskedNumber: true,
          cardHolder: true,
          expiryMonth: true,
          expiryYear: true,
          balance: true,
          status: true,
          is3DSEnabled: true,
          network: true,
          issuanceFee: true,
          createdAt: true,
        },
      });

      // Intentionally discard fullCardNumber and cvv — never stored, never returned
      void fullCardNumber;

      return newCard;
    });

    return NextResponse.json({ success: true, card }, { status: 201 });
  } catch (error: any) {
    console.error("[cards POST]", error);

    const isClientError =
      error?.message?.startsWith("Insufficient USD balance") ||
      error?.message?.startsWith("You do not have a USD wallet");

    if (isClientError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Card issuance failed. Please try again." },
      { status: 500 }
    );
  }
}
