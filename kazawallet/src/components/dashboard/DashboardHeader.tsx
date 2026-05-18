"use client";
import { useState } from "react";
import { Bell, Search, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/8 bg-[#0b1120]/80 backdrop-blur-xl shrink-0 gap-4">
      {/* Left: title */}
      <div className="min-w-0">
        <h1 className="text-white font-bold text-lg leading-tight truncate">{title}</h1>
        {subtitle && (
          <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search */}
        <div className="hidden sm:block w-48">
          <Input
            placeholder="بحث…"
            prefix={<Search className="w-4 h-4" />}
            className="h-9 text-xs"
          />
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0b1120]" />
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 h-9 px-3 rounded-xl bg-white/5 border border-white/8 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-medium hidden sm:block">حسابي</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform", dropdownOpen && "rotate-180")} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute top-full left-0 mt-2 w-44 rounded-xl bg-[#0b1120] border border-white/10 shadow-xl shadow-black/50 z-20 py-1 overflow-hidden">
                <button
                  onClick={() => { setDropdownOpen(false); router.push("/dashboard/settings"); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-white/6 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  الإعدادات
                </button>
                <div className="h-px bg-white/8 mx-2 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
