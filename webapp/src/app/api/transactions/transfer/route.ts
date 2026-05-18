import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";
import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";

const TRANSFER_FEE_RATE = 0.001; // 0.1%

export async function POST(request: Request) {
  const token = getSessionFromRequest(request);
  if (!token) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "جلسة منتهية" }, { status: 401 });

  const { recipient, currencyCode, amount, description } = await request.json();

  if (!recipient || !currencyCode || !amount) {
    return NextResponse.json({ error: "جميع الحقول المطلوبة يجب ملؤها" }, { status: 400 });
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return NextResponse.json({ error: "المبلغ غير صالح" }, { status: 400 });
  }

  const receiver = await prisma.user.findFirst({
    where: {
      OR: [{ email: recipient.toLowerCase() }, { referralCode: recipient.toUpperCase() }],
      isActive: true,
    },
  });

  if (!receiver) {
    return NextResponse.json({ error: "المستلم غير موجود" }, { status: 404 });
  }

  if (receiver.id === payload.userId) {
    return NextResponse.json({ error: "لا يمكنك إرسال أموال لنفسك" }, { status: 400 });
  }

  const currency = await prisma.currency.findUnique({ where: { code: currencyCode } });
  if (!currency) return NextResponse.json({ error: "العملة غير مدعومة" }, { status: 400 });

  const fee = amountNum * TRANSFER_FEE_RATE;
  const totalDeducted = amountNum + fee;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transaction = await prisma.$transaction(async (tx: any) => {
      const senderWallet = await tx.wallet.findFirst({
        where: { userId: payload.userId, currencyId: currency.id },
      });

      if (!senderWallet || Number(senderWallet.balance) < totalDeducted) {
        throw new Error("رصيد غير كافٍ");
      }

      const receiverWallet = await tx.wallet.upsert({
        where: { userId_currencyId: { userId: receiver.id, currencyId: currency.id } },
        create: { userId: receiver.id, currencyId: currency.id, balance: 0 },
        update: {},
      });

      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: totalDeducted } },
      });

      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: { increment: amountNum } },
      });

      const newTx = await tx.transaction.create({
        data: {
          senderId: payload.userId,
          receiverId: receiver.id,
          type: "TRANSFER_OUT",
          status: "COMPLETED",
          fromCurrencyCode: currencyCode,
          toCurrencyCode: currencyCode,
          fromAmount: totalDeducted,
          toAmount: amountNum,
          fee,
          description: description || undefined,
          processedAt: new Date(),
        },
      });

      await tx.ledgerEntry.create({
        data: {
          walletId: senderWallet.id,
          transactionId: newTx.id,
          amount: -totalDeducted,
          balanceBefore: Number(senderWallet.balance),
          balanceAfter: Number(senderWallet.balance) - totalDeducted,
          type: "TRANSFER_OUT",
          description: `تحويل إلى ${receiver.email}`,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          walletId: receiverWallet.id,
          transactionId: newTx.id,
          amount: amountNum,
          balanceBefore: Number(receiverWallet.balance),
          balanceAfter: Number(receiverWallet.balance) + amountNum,
          type: "TRANSFER_IN",
          description: `استلام من ${payload.email}`,
        },
      });

      return newTx;
    });

    return NextResponse.json({
      success: true,
      data: { transactionId: transaction.id, reference: transaction.reference },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
