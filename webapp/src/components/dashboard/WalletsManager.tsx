"use client";

import { useState } from "react";
import { Plus, Send, Download, ArrowLeftRight, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CURRENCIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type CurrencyType = "ALL" | "FIAT" | "CRYPTO" | "EBANK";

const mockBalances: Record<string, string> = {
  USD: "2500.00",
  EUR: "650.00",
  AED: "0.00",
  SAR: "0.00",
  USDT: "1200.000000",
  BTC: "0.02450000",
  ETH: "0.15800000",
  LTC: "0.00",
  PayPal: "0.00",
  Payeer: "350.00",
};

export function WalletsManager() {
  const [filter, setFilter] = useState<CurrencyType>("ALL");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const activeWallets = CURRENCIES.filter((c) => mockBalances[c.code] !== undefined);

  const filtered = activeWallets.filter((c) => {
    const matchType = filter === "ALL" || c.type === filter;
    const matchSearch =
      !search ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.nameAr.includes(search);
    return matchType && matchSearch;
  });

  const totalUSD = filtered.reduce((sum, c) => {
    const bal = parseFloat(mockBalances[c.code] || "0");
    const rates: Record<string, number> = {
      EUR: 1.09,
      AED: 0.27,
      SAR: 0.27,
      USDT: 1,
      BTC: 63500,
      ETH: 3400,
      LTC: 65,
      Payeer: 1,
    };
    const rate = rates[c.code] ?? 1;
    return sum + bal * rate;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Total */}
      <div className="bg-gradient-to-r from-blue-600/15 to-blue-900/15 border border-blue-500/20 rounded-2xl p-5">
        <p className="text-sm text-slate-400 mb-1">إجمالي الرصيد (USD)</p>
        <div className="text-3xl font-black text-white">
          ${totalUSD.toFixed(2)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث عن عملة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full"
          />
        </div>

        <div className="flex gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1">
          {(["ALL", "FIAT", "CRYPTO", "EBANK"] as CurrencyType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filter === f
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {f === "ALL" ? "الكل" : f === "FIAT" ? "رقمية" : f === "CRYPTO" ? "مشفرة" : "إلكترونية"}
            </button>
          ))}
        </div>

        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          إضافة عملة
        </Button>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((currency) => {
          const balance = mockBalances[currency.code] || "0";
          const hasBalance = parseFloat(balance) > 0;

          return (
            <Card
              key={currency.code}
              className={cn("hover:border-white/20 transition-all", hasBalance && "border-white/12")}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currency.emoji}</span>
                    <div>
                      <div className="font-bold text-white">{currency.code}</div>
                      <div className="text-xs text-slate-500">{currency.nameAr}</div>
                    </div>
                  </div>
                  <Badge variant={currency.type === "FIAT" ? "default" : currency.type === "CRYPTO" ? "gold" : "secondary"}>
                    {currency.type === "FIAT" ? "رقمية" : currency.type === "CRYPTO" ? "مشفرة" : "إلك."}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className={cn("text-xl font-black", hasBalance ? "text-white" : "text-slate-600")}>
                    {formatCurrency(balance, currency.code)}
                  </div>
                  <div className="text-xs text-slate-500">{currency.code}</div>
                </div>

                <div className="flex gap-2">
                  <Link href="/dashboard/send" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      <Send className="w-3 h-3" />
                      إرسال
                    </Button>
                  </Link>
                  <Link href="/dashboard/receive" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      <Download className="w-3 h-3" />
                      استقبال
                    </Button>
                  </Link>
                  <Link href="/dashboard/exchange" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      <ArrowLeftRight className="w-3 h-3" />
                      تبادل
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
