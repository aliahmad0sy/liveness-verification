import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { signToken } from "@/lib/auth/jwt";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaTx = any;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "جميع الحقول المطلوبة يجب ملؤها" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "صيغة البريد الإلكتروني غير صحيحة" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    const referralCode = `KW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const user = await prisma.$transaction(async (tx: PrismaTx) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
          phone: phone || null,
          passwordHash,
          referralCode,
        },
      });

      const usdCurrency = await tx.currency.findFirst({ where: { code: "USD" } });
      const usdtCurrency = await tx.currency.findFirst({ where: { code: "USDT" } });

      if (usdCurrency) {
        await tx.wallet.create({
          data: { userId: newUser.id, currencyId: usdCurrency.id, balance: 0 },
        });
      }
      if (usdtCurrency) {
        await tx.wallet.create({
          data: { userId: newUser.id, currencyId: usdtCurrency.id, balance: 0 },
        });
      }

      return newUser;
    });

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: Math.random().toString(36).substring(2) + Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
        userAgent: request.headers.get("user-agent") || undefined,
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    response.cookies.set("kaza_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "حدث خطأ داخلي. حاول مرة أخرى." }, { status: 500 });
  }
}
