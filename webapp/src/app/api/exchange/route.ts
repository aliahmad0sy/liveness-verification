import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where = from && to
    ? { fromCurrency: { code: from }, toCurrency: { code: to } }
    : {};

  const rates = await prisma.exchangeRate.findMany({
    where,
    include: {
      fromCurrency: { select: { code: true, name: true, nameAr: true, symbol: true } },
      toCurrency: { select: { code: true, name: true, nameAr: true, symbol: true } },
    },
  });

  return NextResponse.json({ success: true, data: rates });
}

export async function POST(request: Request) {
  const token = getSessionFromRequest(request);
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "جلسة منتهية" }, { status: 401 });

  const { fromCurrencyCode, toCurrencyCode, fromAmount } = await request.json();

  if (!fromCurrencyCode || !toCurrencyCode || !fromAmount) {
    return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
  }

  const amount = parseFloat(fromAmount);
  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: "المبلغ غير صالح" }, { status: 400 });
  }

  const [fromCurrency, toCurrency] = await Promise.all([
    prisma.currency.findUnique({ where: { code: fromCurrencyCode } }),
    prisma.currency.findUnique({ where: { code: toCurrencyCode } }),
  ]);

  if (!fromCurrency || !toCurrency) {
    return NextResponse.json({ error: "عملة غير مدعومة" }, { status: 400 });
  }

  const rateRecord = await prisma.exchangeRate.findFirst({
    where: { fromCurrencyId: fromCurrency.id, toCurrencyId: toCurrency.id },
  });

  if (!rateRecord) {
    return NextResponse.json({ error: "زوج العملات هذا غير متاح حالياً" }, { status: 400 });
  }

  const rate = Number(rateRecord.rate);
  const fee = amount * Number(rateRecord.fee);
  const toAmount = (amount - fee) * rate;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transaction = await prisma.$transaction(async (tx: any) => {
      const fromWallet = await tx.wallet.findFirst({
        where: { userId: payload.userId, currencyId: fromCurrency.id },
      });

      if (!fromWallet || Number(fromWallet.balance) < amount) {
        throw new Error("رصيد غير كافٍ");
      }

      const toWallet = await tx.wallet.upsert({
        where: { userId_currencyId: { userId: payload.userId, currencyId: toCurrency.id } },
        create: { userId: payload.userId, currencyId: toCurrency.id, balance: 0 },
        update: {},
      });

      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.wallet.update({
        where: { id: toWallet.id },
        data: { balance: { increment: toAmount } },
      });

      return await tx.transaction.create({
        data: {
          senderId: payload.userId,
          type: "EXCHANGE",
          status: "COMPLETED",
          fromCurrencyCode,
          toCurrencyCode,
          fromAmount: amount,
          toAmount,
          fee,
          exchangeRate: rate,
          processedAt: new Date(),
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: { transactionId: transaction.id, toAmount, fee, rate },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
