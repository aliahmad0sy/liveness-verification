import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] p-12 text-center">
          {/* Grid pattern overlay */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Blue glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,130,246,0.14) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
              ابدأ الآن مجاناً
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              ابدأ رحلتك المالية اليوم
            </h2>

            <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
              انضم لأكثر من 500,000 مستخدم موثوق. مجاناً تماماً، لا رسوم
              خفية.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center mt-2">
              <Button size="xl" variant="gold" asChild>
                <Link href="/register">أنشئ حسابك الآن</Link>
              </Button>
              <Button size="xl" variant="secondary" asChild>
                <Link href="#features">تعرّف على المزيد</Link>
              </Button>
            </div>

            <p className="text-slate-600 text-sm">
              لا يلزم بطاقة ائتمانية · إلغاء في أي وقت
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
