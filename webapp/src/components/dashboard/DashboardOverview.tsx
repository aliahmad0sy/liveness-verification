"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Send,
  Download,
  Plus,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils/format";

const mockBalance = {
  total: "4850.32",
  currency: "USD",
  change: "+2.4%",
  isPositive: true,
};

const mockWallets = [
  { code: "USD", nameAr: "دولار أمريكي", balance: "2500.00", emoji: "🇺🇸", type: "FIAT" },
  { code: "USDT", nameAr: "تيثر", balance: "1200.000000", emoji: "💰", type: "CRYPTO" },
  { code: "BTC", nameAr: "بيتكوين", balance: "0.02450000", emoji: "₿", type: "CRYPTO" },
  { code: "EUR", nameAr: "يورو", balance: "650.00", emoji: "🇪🇺", type: "FIAT" },
  { code: "ETH", nameAr: "إيثيريوم", balance: "0.15800000", emoji: "Ξ", type: "CRYPTO" },
];

const mockTransactions = [
  {
    id: "1",
    type: "TRANSFER_IN",
    label: "استلام من أحمد محمد",
    amount: "+250.00",
    currency: "USD",
    status: "COMPLETED",
    date: new Date(Date.now() - 1000 * 60 * 10),
    isPositive: true,
  },
  {
    id: "2",
    type: "EXCHANGE",
    label: "تحويل USDT ← USD",
    amount: "-500.00",
    currency: "USD",
    status: "COMPLETED",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isPositive: false,
  },
  {
    id: "3",
    type: "CARD_PAYMENT",
    label: "دفع بالبطاقة - Amazon",
    amount: "-120.50",
    currency: "USD",
    status: "COMPLETED",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isPositive: false,
  },
  {
    id: "4",
    type: "DEPOSIT",
    label: "إيداع عبر USDT",
    amount: "+1000.00",
    currency: "USD",
    status: "COMPLETED",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isPositive: true,
  },
];

const quickActions = [
  { label: "إرسال", icon: Send, href: "/dashboard/send", color: "from-blue-500 to-blue-600" },
  { label: "استقبال", icon: Download, href: "/dashboard/receive", color: "from-emerald-500 to-emerald-600" },
  { label: "تبادل", icon: ArrowLeftRight, href: "/dashboard/exchange", color: "from-purple-500 to-purple-600" },
  { label: "بطاقة", icon: CreditCard, href: "/dashboard/cards", color: "from-orange-500 to-orange-600" },
];

const txTypeIcon: Record<string, React.ElementType> = {
  TRANSFER_IN: ArrowDownLeft,
  TRANSFER_OUT: ArrowUpRight,
  DEPOSIT: ArrowDownLeft,
  WITHDRAWAL: ArrowUpRight,
  EXCHANGE: ArrowLeftRight,
  CARD_PAYMENT: CreditCard,
  CARD_FUNDING: CreditCard,
};

const statusVariants: Record<string, "success" | "warning" | "default" | "destructive"> = {
  COMPLETED: "success",
  PENDING: "warning",
  PROCESSING: "default",
  FAILED: "destructive",
};

const statusLabels: Record<string, string> = {
  COMPLETED: "مكتمل",
  PENDING: "معلق",
  PROCESSING: "قيد المعالجة",
  FAILED: "فشل",
};

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">إجمالي الرصيد</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">
                  {formatCurrency(mockBalance.total, "USD", "ar-SA")}
                </span>
                <span className="text-xl text-slate-300">USD</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {mockBalance.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm font-medium ${mockBalance.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {mockBalance.change} هذا الشهر
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button size="sm" asChild>
                <Link href="/dashboard/send">
                  <ArrowUpRight className="w-4 h-4" />
                  إرسال
                </Link>
              </Button>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/dashboard/receive">
                  <ArrowDownLeft className="w-4 h-4" />
                  استقبال
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/8 hover:border-white/15 transition-all group cursor-pointer">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Wallets */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">محافظي</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/wallets">
                  <Plus className="w-4 h-4" />
                  إضافة
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 px-6 pb-6">
              {mockWallets.map((wallet) => (
                <div
                  key={wallet.code}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/3 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{wallet.code}</div>
                      <div className="text-xs text-slate-500">{wallet.nameAr}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {formatCurrency(wallet.balance, wallet.code)}
                    </div>
                    <div className="text-xs text-slate-500">{wallet.code}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">آخر المعاملات</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/transactions">عرض الكل</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 px-6 pb-6">
              {mockTransactions.map((tx) => {
                const TxIcon = txTypeIcon[tx.type] || ArrowLeftRight;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.isPositive ? "bg-emerald-500/10" : "bg-slate-500/10"}`}>
                      <TxIcon className={`w-4 h-4 ${tx.isPositive ? "text-emerald-400" : "text-slate-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{tx.label}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <span className="text-xs text-slate-500">{formatRelativeTime(tx.date)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-bold ${tx.isPositive ? "text-emerald-400" : "text-white"}`}>
                        {tx.isPositive ? "+" : ""}{tx.amount} {tx.currency}
                      </div>
                      <Badge variant={statusVariants[tx.status]} className="text-xs mt-0.5">
                        {statusLabels[tx.status]}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
