import Link from "next/link";
import { Wallet } from "lucide-react";

const productLinks = [
  { label: "المحفظة الرقمية", href: "/wallet" },
  { label: "تبادل العملات", href: "/exchange" },
  { label: "بطاقة فيزا افتراضية", href: "/card" },
  { label: "الدفع الجماعي", href: "/mass-payout" },
  { label: "الأسعار", href: "/pricing" },
];

const businessLinks = [
  { label: "نظام التجار", href: "/merchant" },
  { label: "برنامج الوكلاء", href: "/agents" },
  { label: "API للمطورين", href: "/developers" },
  { label: "الشراكات", href: "/partnerships" },
];

const supportLinks = [
  { label: "مركز المساعدة", href: "/help" },
  { label: "تواصل معنا", href: "/contact" },
  { label: "حالة النظام", href: "/status" },
  { label: "المدونة", href: "/blog" },
];

const legalLinks = [
  { label: "سياسة الخصوصية", href: "/privacy" },
  { label: "شروط الاستخدام", href: "/terms" },
  { label: "سياسة مكافحة غسيل الأموال", href: "/aml" },
  { label: "سياسة الاسترداد", href: "/refund" },
];

// Social icons as inline SVGs to avoid additional deps
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M11.944 0A12 12 0 1 0 24 12 12.017 12.017 0 0 0 11.944 0zm5.976 7.737-2.01 9.472c-.144.641-.531.796-1.076.497l-2.98-2.197-1.437 1.38a.744.744 0 0 1-.597.291l.214-3.022 5.508-4.975c.239-.214-.052-.332-.371-.118L7.04 13.988l-2.937-.917c-.64-.2-.651-.64.133-.948l11.475-4.424c.532-.193 1.001.129.829.94z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

const socials = [
  { icon: XIcon, label: "X", href: "https://x.com/kazawallet" },
  { icon: TelegramIcon, label: "Telegram", href: "https://t.me/kazawallet" },
  { icon: YouTubeIcon, label: "YouTube", href: "https://youtube.com/@kazawallet" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com/kazawallet" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#070c15]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Kaza<span className="text-blue-400">Wallet</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              منصة شاملة لإدارة العملات الرقمية والمشفرة بأمان وسهولة تامة.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm">المنتج</h4>
            <ul className="flex flex-col gap-2">
              {productLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-500 text-sm hover:text-slate-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm">الأعمال</h4>
            <ul className="flex flex-col gap-2">
              {businessLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-500 text-sm hover:text-slate-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm">الدعم</h4>
            <ul className="flex flex-col gap-2">
              {supportLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-500 text-sm hover:text-slate-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm">القانونية</h4>
            <ul className="flex flex-col gap-2">
              {legalLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-500 text-sm hover:text-slate-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {year} KazaWallet. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            جميع الأنظمة تعمل
          </div>
        </div>
      </div>
    </footer>
  );
}
