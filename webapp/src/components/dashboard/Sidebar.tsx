"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  LayoutDashboard,
  ArrowUpDown,
  CreditCard,
  History,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Send,
  Download,
  Building2,
  Shield,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  {
    group: "الرئيسية",
    items: [
      { label: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
      { label: "محافظي", href: "/dashboard/wallets", icon: Wallet },
      { label: "سجل المعاملات", href: "/dashboard/transactions", icon: History },
    ],
  },
  {
    group: "العمليات",
    items: [
      { label: "إرسال", href: "/dashboard/send", icon: Send },
      { label: "استقبال", href: "/dashboard/receive", icon: Download },
      { label: "تبادل العملات", href: "/dashboard/exchange", icon: ArrowUpDown },
      { label: "الدفع الجماعي", href: "/dashboard/mass-payout", icon: Users },
    ],
  },
  {
    group: "الخدمات",
    items: [
      { label: "بطاقاتي", href: "/dashboard/cards", icon: CreditCard },
      { label: "نظام التجار", href: "/dashboard/merchant", icon: Building2 },
    ],
  },
  {
    group: "الحساب",
    items: [
      { label: "التحقق (KYC)", href: "/dashboard/kyc", icon: Shield },
      { label: "الإشعارات", href: "/dashboard/notifications", icon: Bell },
      { label: "الإعدادات", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (v: boolean) => void;
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#0a0e1a] border-l border-white/8 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-white/8">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">
              Kaza<span className="text-blue-400">Wallet</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto">
            <Wallet className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => onCollapse?.(!collapsed)}
          className={cn(
            "p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all",
            collapsed && "mx-auto mt-0"
          )}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navItems.map((group) => (
          <div key={group.group}>
            {!collapsed && (
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 px-2">
                {group.group}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User/Logout */}
      <div className="p-3 border-t border-white/8">
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full",
            collapsed && "justify-center"
          )}
          onClick={() => {
            fetch("/api/auth/logout", { method: "POST" }).then(() => {
              window.location.href = "/login";
            });
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
