import Link from "next/link";
import { Wallet } from "lucide-react";

const footerLinks = {
  product: [
    { label: "المحفظة", href: "/#features" },
    { label: "البطاقات الافتراضية", href: "/#cards" },
    { label: "التبادل", href: "/#exchange" },
    { label: "الدفع الجماعي", href: "/#mass-payout" },
  ],
  business: [
    { label: "للتجار", href: "/merchant" },
    { label: "برنامج الوكلاء", href: "/agents" },
    { label: "API للمطورين", href: "/developer" },
    { label: "إضافة WordPress", href: "/wordpress-plugin" },
  ],
  support: [
    { label: "مركز المساعدة", href: "/help" },
    { label: "المدونة", href: "/blog" },
    { label: "الأسئلة الشائعة", href: "/faq" },
    { label: "تواصل معنا", href: "/contact" },
  ],
  legal: [
    { label: "سياسة الخصوصية", href: "/privacy" },
    { label: "الشروط والأحكام", href: "/terms" },
    { label: "سياسة AML", href: "/aml" },
    { label: "سياسة KYC", href: "/kyc-policy" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#060a12] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Kaza<span className="text-blue-400">Wallet</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              محفظتك الرقمية الآمنة لكل العملات. نحن نجعل التمويل الرقمي سهلاً وآمناً للجميع.
            </p>
            <div className="flex gap-3">
              {["𝕏", "TG", "YT", "IG"].map((s) => (
                <div
                  key={s}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer transition-all"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">المنتج</h4>
            <ul className="space-y-2.5">
              {footerLinks.product.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">للأعمال</h4>
            <ul className="space-y-2.5">
              {footerLinks.business.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">الدعم</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">قانوني</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © 2025 KazaWallet. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-600">جميع الأنظمة تعمل بشكل طبيعي</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
