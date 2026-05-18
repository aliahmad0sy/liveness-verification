"use client";

import Link from "next/link";
import { Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const currencyPills = [
  { label: "USDT", emoji: "💰" },
  { label: "BTC", emoji: "₿" },
  { label: "ETH", emoji: "Ξ" },
  { label: "USD", emoji: "🇺🇸" },
  { label: "EUR", emoji: "🇪🇺" },
  { label: "SAR", emoji: "🇸🇦" },
  { label: "AED", emoji: "🇦🇪" },
  { label: "PayPal", emoji: "🅿️" },
  { label: "Payeer", emoji: "💳" },
];

const trustBadges = [
  { icon: Shield, label: "أمان بنكي", color: "text-blue-400" },
  { icon: Zap, label: "معاملات فورية", color: "text-yellow-400" },
  { icon: Globe, label: "+180 دولة", color: "text-emerald-400" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-8">
        {/* Animated badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          محفظة رقمية موثوقة لأكثر من 500,000 مستخدم
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight">
          محفظتك الرقمية
          <br />
          لكل{" "}
          <span className="bg-gradient-to-l from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            العملات
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          أرسل، استقبل، وبادل العملات الرقمية والمشفرة بسرعة وأمان. أكثر من 30
          عملة، بطاقة فيزا افتراضية، ونظام دفع جماعي.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button size="xl" asChild>
            <Link href="/register">ابدأ مجاناً الآن</Link>
          </Button>
          <Button size="xl" variant="secondary" asChild>
            <Link href="#features">اكتشف المميزات</Link>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {trustBadges.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 text-slate-400 text-sm">
              <Icon className={`w-4 h-4 ${color}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Currency pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
          {currencyPills.map(({ label, emoji }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm hover:border-blue-500/30 hover:text-blue-300 hover:bg-blue-500/5 transition-all duration-200 cursor-default"
            >
              <span className="text-base leading-none">{emoji}</span>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
