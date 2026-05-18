"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "مستخدم نشط", value: "+500K" },
  { label: "عملة مدعومة", value: "+30" },
  { label: "دولة", value: "+180" },
  { label: "معاملة يومياً", value: "+2M" },
];

const badges = [
  { icon: Shield, label: "أمان بنكي" },
  { icon: Zap, label: "سرعة فائقة" },
  { icon: Globe, label: "عالمي 100%" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-[#070b14]">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-800/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-indigo-800/8 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-blue-300 font-medium">
            محفظة رقمية متكاملة وآمنة للعالم العربي
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
          محفظتك الرقمية
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
            لكل العملات
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          أرسل، استقبل، وبادل العملات الرقمية والمشفرة بسرعة وأمان.
          أكثر من 30 عملة، بطاقة فيزا افتراضية، ونظام دفع جماعي.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="xl" asChild>
            <Link href="/register">
              ابدأ مجاناً الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <Button size="xl" variant="secondary" asChild>
            <Link href="/#features">
              اكتشف المميزات
            </Link>
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 mb-16">
          {badges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-slate-400">
              <badge.icon className="w-4 h-4 text-blue-400" />
              <span className="text-sm">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/8 transition-colors"
            >
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Floating currency pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
          {["USDT", "BTC", "ETH", "USD", "EUR", "SAR", "AED", "PayPal", "Payeer"].map((c) => (
            <div
              key={c}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 hover:border-blue-500/30 hover:text-blue-300 transition-all cursor-default"
            >
              {c}
            </div>
          ))}
          <span className="text-xs text-slate-600">+المزيد</span>
        </div>
      </div>
    </section>
  );
}
