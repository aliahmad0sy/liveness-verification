import { prisma } from "@/lib/db/prisma";
import { verifyToken } from "@/lib/auth/jwt";
import { getSessionFromRequest } from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { EXCHANGE_FEE_RATE } from "@/lib/constants";
import { Decimal } from "@prisma/client-runtime-utils";

// Fallback mock rates (from → to). Values are approximate mid-market rates.
const MOCK_RATES: Record<string, Record<string, number>> = {
  USD:  { EUR: 0.92, AED: 3.67, SAR: 3.75, USDT: 1.0, BTC: 0.000016, ETH: 0.00026, TRX: 10.8, SOL: 0.0065 },
  EUR:  { USD: 1.087, AED: 3.99, SAR: 4.08, USDT: 1.087 },
  AED:  { USD: 0.272, EUR: 0.251, USDT: 0.272 },
  SAR:  { USD: 0.267, EUR: 0.245, USDT: 0.267 },
  USDT: { USD: 1.0, EUR: 0.92, BTC: 0.000016, ETH: 0.00026, TRX: 10.8, SOL: 0.0065 },
  BTC:  { USD: 62500, USDT: 62500, ETH: 20.0 },
  ETH:  { USD: 3800, USDT: 3800, BTC: 0.05 },
  TRX:  { USD: 0.0925, USDT: 0.0925 },
  SOL:  { USD: 153, USDT: 153 },
};

async function authenticate(request: Request) {
  const rawToken = getSessionFromRequest(request);
  if (!rawToken) return null;
  const payload = await verifyToken(rawToken);
  if (!payload?.userId) return null;
  return payload;
}

// POST /api/exchange — currency exchange between two user wallets
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
    const { fromCurrencyCode, toCurrencyCode, fromAmount } = body ?? {};

    // Validate inputs
    if (!fromCurrencyCode || typeof fromCurrencyCode !== "string") {
      return NextResponse.json(
        { success: false, error: "fromCurrencyCode is required" },
        { status: 400 }
      );
    }
    if (!toCurrencyCode || typeof toCurrencyCode !== "string") {
      return NextResponse.json(
        { success: false, error: "toCurrencyCode is required" },
        { status: 400 }
      );
    }
    const parsedAmount = parseFloat(fromAmount);
    if (!fromAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "fromAmount must be a positive number" },
        { status: 400 }
      );
    }

    const fromCode = fromCurrencyCode.trim().toUpperCase();
    const toCode = toCurrencyCode.trim().toUpperCase();

    if (fromCode === toCode) {
      return NextResponse.json(
        { success: false, error: "Source and destination currencies must be different" },
        { status: 400 }
      );
    }

    // Resolve currencies
    const [fromCurrency, toCurrency] = await Promise.all([
      prisma.currency.findUnique({ where: { code: fromCode } }),
      prisma.currency.findUnique({ where: { code: toCode } }),
    ]);

    if (!fromCurrency || !fromCurrency.isActive) {
      return NextResponse.json(
        { success: false, error: `Source currency "${fromCode}" is not available` },
        { status: 404 }
      );
    }
    if (!toCurrency || !toCurrency.isActive) {
      return NextResponse.json(
        { success: false, error: `Destination currency "${toCode}" is not available` },
        { status: 404 }
      );
    }

    // Look up exchange rate
    let rateValue: Decimal;
    const dbRate = await prisma.exchangeRate.findFirst({
      where: {
        fromCurrency: { code: fromCode },
        toCurrency: { code: toCode },
      },
    });

    if (dbRate) {
      rateValue = new Decimal(dbRate.rate.toString());
    } else {
      // Fallback to mock rates
      const mockRate = MOCK_RATES[fromCode]?.[toCode];
      if (!mockRate) {
        return NextResponse.json(
          { success: false, error: `Exchange rate for ${fromCode} → ${toCode} is not available` },
          { status: 404 }
        );
      }
      rateValue = new Decimal(mockRate.toString());
    }

    const inputAmount = new Decimal(parsedAmount.toString());
    const fee = inputAmount.mul(EXCHANGE_FEE_RATE);
    const netFromAmount = inputAmount.sub(fee);
    const toAmount = netFromAmount.mul(rateValue);

    const result = await prisma.$transaction(async (tx: any) => {
      // Verify sender has a from-currency wallet with sufficient balance
      const fromWallet = await tx.wallet.findUnique({
        where: { userId_currencyId: { userId: payload.userId, currencyId: fromCurrency.id } },
      });

      if (!fromWallet) {
        throw new Error(`You do not have a ${fromCode} wallet`);
      }

      const fromBalance = new Decimal(fromWallet.balance.toString());
      if (fromBalance.lt(inputAmount)) {
        throw new Error(
          `Insufficient balance. Required: ${inputAmount.toFixed(fromCurrency.decimals)} ${fromCode}, Available: ${fromBalance.toFixed(fromCurrency.decimals)} ${fromCode}`
        );
      }

      // Upsert the to-currency wallet
      await tx.wallet.upsert({
        where: { userId_currencyId: { userId: payload.userId, currencyId: toCurrency.id } },
        create: { userId: payload.userId, currencyId: toCurrency.id, balance: 0 },
        update: {},
      });

      // Decrement from balance
      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: { balance: { decrement: inputAmount } },
      });

      // Increment to balance
      await tx.wallet.update({
        where: { userId_currencyId: { userId: payload.userId, currencyId: toCurrency.id } },
        data: { balance: { increment: toAmount } },
      });

      // Create exchange transaction record
      const transaction = await tx.transaction.create({
        data: {
          senderId: payload.userId,
          receiverId: payload.userId,
          type: "EXCHANGE",
          status: "COMPLETED",
          fromCurrencyCode: fromCode,
          toCurrencyCode: toCode,
          fromAmount: inputAmount,
          toAmount,
          fee,
          exchangeRate: rateValue,
          processedAt: new Date(),
          description: `Exchange ${fromCode} to ${toCode}`,
        },
      });

      return {
        transactionId: transaction.id,
        reference: transaction.reference,
      };
    });

    return NextResponse.json(
      {
        success: true,
        transactionId: result.transactionId,
        reference: result.reference,
        fromAmount: parsedAmount,
        toAmount: toAmount.toNumber(),
        fee: fee.toNumber(),
        rate: rateValue.toNumber(),
        fromCurrency: fromCode,
        toCurrency: toCode,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[exchange POST]", error);

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
      { success: false, error: "Exchange failed. Please try again." },
      { status: 500 }
    );
  }
}
