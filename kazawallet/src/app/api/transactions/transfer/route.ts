import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { getSessionFromRequest } from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { TRANSFER_FEE_RATE } from "@/lib/constants";
import { Decimal } from "@prisma/client-runtime-utils";

async function authenticate(request: Request) {
  const rawToken = getSessionFromRequest(request);
  if (!rawToken) return null;
  const payload = await verifyToken(rawToken);
  if (!payload?.userId) return null;
  return payload;
}

// POST /api/transactions/transfer — double-entry ledger peer-to-peer transfer
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
    const { recipient, currencyCode, amount } = body ?? {};

    // Validate inputs
    if (!recipient || typeof recipient !== "string" || recipient.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Recipient (email or referral code) is required" },
        { status: 400 }
      );
    }
    if (!currencyCode || typeof currencyCode !== "string" || currencyCode.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "currencyCode is required" },
        { status: 400 }
      );
    }
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const recipientTrimmed = recipient.trim();

    // Find receiver by email or referral code
    const receiverUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: recipientTrimmed.toLowerCase() },
          { referralCode: recipientTrimmed },
        ],
      },
      select: { id: true, email: true, firstName: true, lastName: true, isActive: true },
    });

    if (!receiverUser) {
      return NextResponse.json(
        { success: false, error: "Recipient not found" },
        { status: 404 }
      );
    }

    if (receiverUser.id === payload.userId) {
      return NextResponse.json(
        { success: false, error: "You cannot transfer funds to yourself" },
        { status: 400 }
      );
    }

    if (!receiverUser.isActive) {
      return NextResponse.json(
        { success: false, error: "Recipient account is not active" },
        { status: 400 }
      );
    }

    // Resolve currency
    const currency = await prisma.currency.findUnique({
      where: { code: currencyCode.trim().toUpperCase() },
    });
    if (!currency || !currency.isActive) {
      return NextResponse.json(
        { success: false, error: `Currency "${currencyCode}" is not available` },
        { status: 404 }
      );
    }

    const sendAmount = new Decimal(parsedAmount.toString());
    const fee = sendAmount.mul(TRANSFER_FEE_RATE);
    const totalDebit = sendAmount.add(fee);

    const result = await prisma.$transaction(async (tx: any) => {
      // Lock and verify sender wallet
      const senderWallet = await tx.wallet.findUnique({
        where: { userId_currencyId: { userId: payload.userId, currencyId: currency.id } },
      });

      if (!senderWallet) {
        throw new Error(`You do not have a ${currency.code} wallet`);
      }

      const senderBalance = new Decimal(senderWallet.balance.toString());
      if (senderBalance.lt(totalDebit)) {
        throw new Error(
          `Insufficient balance. Required: ${totalDebit.toFixed(currency.decimals)} ${currency.code}, Available: ${senderBalance.toFixed(currency.decimals)} ${currency.code}`
        );
      }

      // Upsert receiver wallet
      const receiverWallet = await tx.wallet.upsert({
        where: { userId_currencyId: { userId: receiverUser.id, currencyId: currency.id } },
        create: { userId: receiverUser.id, currencyId: currency.id, balance: 0 },
        update: {},
      });

      // Decrement sender balance
      const updatedSenderWallet = await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: totalDebit } },
      });

      // Increment receiver balance
      const updatedReceiverWallet = await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: { increment: sendAmount } },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          senderId: payload.userId,
          receiverId: receiverUser.id,
          type: "TRANSFER_OUT",
          status: "COMPLETED",
          fromCurrencyCode: currency.code,
          toCurrencyCode: currency.code,
          fromAmount: sendAmount,
          toAmount: sendAmount,
          fee,
          processedAt: new Date(),
          description: `Transfer to ${receiverUser.firstName} ${receiverUser.lastName}`,
        },
      });

      // Sender debit ledger entry
      await tx.ledgerEntry.create({
        data: {
          walletId: senderWallet.id,
          transactionId: transaction.id,
          amount: totalDebit.negated(),
          balanceBefore: senderBalance,
          balanceAfter: new Decimal(updatedSenderWallet.balance.toString()),
          type: "DEBIT",
          description: `Transfer out to ${receiverUser.email}`,
        },
      });

      // Receiver credit ledger entry
      const receiverBalanceBefore = new Decimal(receiverWallet.balance.toString());
      await tx.ledgerEntry.create({
        data: {
          walletId: receiverWallet.id,
          transactionId: transaction.id,
          amount: sendAmount,
          balanceBefore: receiverBalanceBefore,
          balanceAfter: new Decimal(updatedReceiverWallet.balance.toString()),
          type: "CREDIT",
          description: `Transfer in from ${payload.email}`,
        },
      });

      return { transactionId: transaction.id, reference: transaction.reference };
    });

    return NextResponse.json(
      {
        success: true,
        transactionId: result.transactionId,
        reference: result.reference,
        amount: parsedAmount,
        fee: fee.toNumber(),
        currency: currency.code,
        recipient: {
          firstName: receiverUser.firstName,
          lastName: receiverUser.lastName,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[transfer POST]", error);

    const isBalanceError =
      error?.message?.startsWith("Insufficient balance") ||
      error?.message?.startsWith("You do not have a");

    if (isBalanceError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Transfer failed. Please try again." },
      { status: 500 }
    );
  }
}
