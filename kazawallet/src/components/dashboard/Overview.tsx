"use client";
import Link from "next/link";
import {
  Send, Download, ArrowUpDown, CreditCard,
  TrendingUp, ArrowUpRight, ArrowDownLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatAmount, timeAgo } from "@/lib/utils/format";
import { TX_TYPE_AR, TX_STATUS_AR } from "@/lib/constants";

const MOCK_WALLETS = [
  { code: "USD",  nameAr: "دولار أمريكي", emoji: "🇺🇸", balance: 2450.00, type: "FIAT"   },
  { code: "USDT", nameAr: "تيثر",          emoji: "💰",  balance: 1200.50, type: "CRYPTO" },
  { code: "BTC",  nameAr: "بيتكوين",       emoji: "₿",   balance: 0.01852, type: "CRYPTO" },
  { code: "EUR",  nameAr: "يورو",           emoji: "🇪🇺", balance: 850.25,  type: "FIAT"   },
  { code: "ETH",  nameAr: "إيثيريوم",      emoji: "Ξ",   balance: 0.42310, type: "CRYPTO" },
];

const now = new Date();
const MOCK_TRANSACTIONS = [
  {
    id: "1", type: "TRANSFER_IN",  currency: "USD",  amount: 500.00,
    status: "COMPLETED", createdAt: new Date(now.getTime() - 15 * 60 * 1000),
    description: "استلام من أحمد خالد",
  },
  {
    id: "2", type: "EXCHANGE",     currency: "USDT", amount: -200.00,
    status: "COMPLETED", createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    description: "تبادل USD → USDT",
  },
  {
    id: "3", type: "TRANSFER_OUT", currency: "USD",  amount: -150.00,
    status: "PENDING",   createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    description: "إرسال إلى سارة محمد",
  },
  {
    id: "4", type: "DEPOSIT",      currency: "BTC",  amount: 0.005,
    status: "COMPLETED", createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    description: "إيداع بيتكوين",
  },
];

const QUICK_ACTIONS = [
  { label: "إرسال",   icon: Send,        href: "/dashboard/send",     color: "text-blue-400",    bg: "bg-blue-500/10"    },
  { label: "استقبال", icon: Download,    href: "/dashboard/receive",  color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "تبادل",   icon: ArrowUpDown, href: "/dashboard/exchange", color: "text-amber-400",   bg: "bg-amber-500/10"   },
  { label: "بطاقة",   icon: CreditCard,  href: "/dashboard/cards",    color: "text-purple-400",  bg: "bg-purple-500/10"  },
];

const STATUS_BADGE: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  COMPLETED: "success", PENDING: "warning", FAILED: "destructive", CANCELLED: "secondary", PROCESSING: "secondary",
};

function TxTypeIcon({ type }: { type: string }) {
  if (type.includes("IN") || type === "DEPOSIT")
    return <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
      <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
    </div>;
  if (type.includes("OUT") || type === "WITHDRAWAL")
    return <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
      <ArrowUpRight className="w-4 h-4 text-red-400" />
    </div>;
  return <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
    <ArrowUpDown className="w-4 h-4 text-amber-400" />
  </div>;
}

export function Overview() {
  return (
    <div className="space-y-6">
      {/* Balance card */}
      <div className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-br from-blue-600/20 via-blue-700/10 to-blue-900/20 border border-blue-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative">
          <p className="text-slate-400 text-sm mb-1">إجمالي الرصيد</p>
          <div className="flex items-end gap-3 mb-2">
            <span className="text-4xl font-bold text-white">$4,850.32</span>
            <span className="text-slate-400 mb-1">USD</span>
          </div>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+2.4%</span>
            </div>
            <span className="text-slate-500 text-sm">هذا الشهر</span>
          </div>
          <div className="flex gap-3">
            <Button asChild size="sm">
              <Link href="/dashboard/send">
                <Send className="w-3.5 h-3.5" />
                إرسال
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/dashboard/receive">
                <Download className="w-3.5 h-3.5" />
                استقبال
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ label, icon: Icon, href, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/14 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <span className="text-slate-300 text-xs font-medium group-hover:text-white transition-colors">{label}</span>
          </Link>
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallets */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>محافظي</CardTitle>
              <Link href="/dashboard/wallets" className="text-blue-400 text-xs hover:text-blue-300 transition-colors">عرض الكل</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <ul className="space-y-2">
              {MOCK_WALLETS.map((w) => (
                <li key={w.code} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center">{w.emoji}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{w.code}</p>
                      <p className="text-slate-500 text-xs">{w.nameAr}</p>
                    </div>
                  </div>
                  <div className="text-left flex flex-col items-end gap-1">
                    <p className="text-white text-sm font-semibold">{formatAmount(w.balance, w.code)}</p>
                    <Badge variant={w.type === "FIAT" ? "default" : w.type === "CRYPTO" ? "warning" : "secondary"} className="text-[10px] h-4">
                      {w.type}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>آخر المعاملات</CardTitle>
              <Link href="/dashboard/transactions" className="text-blue-400 text-xs hover:text-blue-300 transition-colors">عرض الكل</Link>
            </div>
          </CardHeader>
          <CardContent className="pt-3">
            <ul className="space-y-2">
              {MOCK_TRANSACTIONS.map((tx) => (
                <li key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-colors">
                  <TxTypeIcon type={tx.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-slate-500 text-xs">{timeAgo(tx.createdAt)}</p>
                  </div>
                  <div className="text-left flex flex-col items-end gap-1 shrink-0">
                    <p className={`text-sm font-semibold ${tx.amount > 0 ? "text-emerald-400" : "text-white"}`}>
                      {tx.amount > 0 ? "+" : ""}{formatAmount(Math.abs(tx.amount), tx.currency)} {tx.currency}
                    </p>
                    <Badge variant={STATUS_BADGE[tx.status] ?? "secondary"} className="text-[10px] h-4">
                      {TX_STATUS_AR[tx.status] ?? tx.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
