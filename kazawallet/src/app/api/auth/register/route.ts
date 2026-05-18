import { prisma } from "@/lib/db/prisma";
import { signToken } from "@/lib/auth/jwt";
import { makeSessionCookie } from "@/lib/auth/session";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body ?? {};

    // Validation
    if (!firstName || typeof firstName !== "string" || firstName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "First name is required" },
        { status: 400 }
      );
    }
    if (!lastName || typeof lastName !== "string" || lastName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Last name is required" },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Duplicate email check
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hash(password, 12);

    const { user, session } = await prisma.$transaction(async (tx: any) => {
      // Create the user
      const newUser = await tx.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normalizedEmail,
          passwordHash,
        },
      });

      // Find or create USD wallet
      const usdCurrency = await tx.currency.findUnique({
        where: { code: "USD" },
      });
      if (usdCurrency) {
        await tx.wallet.upsert({
          where: { userId_currencyId: { userId: newUser.id, currencyId: usdCurrency.id } },
          create: { userId: newUser.id, currencyId: usdCurrency.id },
          update: {},
        });
      }

      // Find or create USDT wallet
      const usdtCurrency = await tx.currency.findUnique({
        where: { code: "USDT" },
      });
      if (usdtCurrency) {
        await tx.wallet.upsert({
          where: { userId_currencyId: { userId: newUser.id, currencyId: usdtCurrency.id } },
          create: { userId: newUser.id, currencyId: usdtCurrency.id },
          update: {},
        });
      }

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const newSession = await tx.session.create({
        data: {
          userId: newUser.id,
          token: crypto.randomUUID(),
          expiresAt,
          userAgent: request.headers.get("user-agent") ?? undefined,
        },
      });

      return { user: newUser, session: newSession };
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    const cookie = makeSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      {
        status: 201,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
