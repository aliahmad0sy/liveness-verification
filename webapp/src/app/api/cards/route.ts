import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { CARD_ISSUANCE_FEE } from "@/lib/constants";

function generateCardNumber(): string {
  const prefix = "4532";
  const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
  return prefix + digits;
}

function generateCVV(): string {
  return String(Math.floor(100 + Math.random() * 900));
}

export async function GET(request: Request) {
  const token = getSessionFromRequest(request);
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "جلسة منتهية" }, { status: 401 });

  const cards = await prisma.card.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      maskedNumber: true,
      cardHolder: true,
      expiryMonth: true,
      expiryYear: true,
      balance: true,
      status: true,
      network: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ success: true, data: cards });
}

export async function POST(request: Request) {
  const token = getSessionFromRequest(request);
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "جلسة منتهية" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { cards: true },
  });

  if (!user) return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });

  if (user.kycStatus !== "APPROVED") {
    return NextResponse.json(
      { error: "يجب إكمال التحقق من الهوية (KYC) أولاً" },
      { status: 403 }
    );
  }

  const { fundingCurrencyCode } = await request.json();

  const usdCurrency = await prisma.currency.findUnique({ where: { code: "USD" } });
  if (!usdCurrency) return NextResponse.json({ error: "خطأ في النظام" }, { status: 500 });

  try {
    const card = await prisma.$transaction(// eslint-disable-next-line @typescript-eslint/no-explicit-any
async (tx: any) => {
      const fundingWallet = await tx.wallet.findFirst({
        where: { userId: user.id, currency: { code: fundingCurrencyCode || "USD" } },
      });

      if (!fundingWallet || Number(fundingWallet.balance) < CARD_ISSUANCE_FEE) {
        throw new Error(`رصيد غير كافٍ. رسوم الإصدار ${CARD_ISSUANCE_FEE} USD`);
      }

      await tx.wallet.update({
        where: { id: fundingWallet.id },
        data: { balance: { decrement: CARD_ISSUANCE_FEE } },
      });

      const cardNumber = generateCardNumber();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 3);

      return await tx.card.create({
        data: {
          userId: user.id,
          cardNumber,
          maskedNumber: `${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)}`,
          cardHolder: `${user.firstName} ${user.lastName}`.toUpperCase(),
          expiryMonth: expiryDate.getMonth() + 1,
          expiryYear: expiryDate.getFullYear(),
          cvv: generateCVV(),
          issuanceFee: CARD_ISSUANCE_FEE,
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        id: card.id,
        maskedNumber: card.maskedNumber,
        cardHolder: card.cardHolder,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        status: card.status,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
