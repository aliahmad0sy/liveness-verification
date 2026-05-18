"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Wallet, History, Send, Download, ArrowUpDown,
  Users, CreditCard, Building2, Shield, Bell, Settings,
  ChevronLeft, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

const NAV_GROUPS = [
  {
    label: "الرئيسية",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
      { href: "/dashboard/wallets", icon: Wallet, label: "المحافظ" },
      { href: "/dashboard/transactions", icon: History, label: "المعاملات" },
    ],
  },
  {
    label: "العمليات",
    items: [
      { href: "/dashboard/send", icon: Send, label: "إرسال" },
      { href: "/dashboard/receive", icon: Download, label: "استقبال" },
      { href: "/dashboard/exchange", icon: ArrowUpDown, label: "تبادل" },
      { href: "/dashboard/mass-payout", icon: Users, label: "دفع جماعي" },
    ],
  },
  {
    label: "الخدمات",
    items: [
      { href: "/dashboard/cards", icon: CreditCard, label: "البطاقات" },
      { href: "/dashboard/merchant", icon: Building2, label: "التاجر" },
    ],
  },
  {
    label: "الحساب",
    items: [
      { href: "/dashboard/kyc", icon: Shield, label: "التحقق" },
      { href: "/dashboard/notifications", icon: Bell, label: "الإشعارات" },
      { href: "/dashboard/settings", icon: Settings, label: "الإعدادات" },
    ],
  },
];

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#0b1120] border-l border-white/8 transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg truncate">KazaWallet</span>
        )}
      </div>

      {/* Collapse toggle */}
      <div className="flex justify-start px-3 py-2 border-b border-white/8">
        <button
          onClick={() => onCollapse(!collapsed)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-white/8 hover:text-white transition-all"
        >
          <ChevronLeft
            className={cn("w-4 h-4 transition-transform duration-300", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 px-3 mb-1">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 h-10 text-sm font-medium transition-all",
                      isActive(href)
                        ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                        : "text-slate-400 hover:bg-white/6 hover:text-white",
                      collapsed && "justify-center"
                    )}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/8 shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full rounded-xl px-3 h-10 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all",
            collapsed && "justify-center"
          )}
          title={collapsed ? "تسجيل الخروج" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
