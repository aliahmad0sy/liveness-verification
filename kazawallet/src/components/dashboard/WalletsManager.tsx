"use client";
import { useState } from "react";
import { Send, Download, ArrowUpDown, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { formatAmount } from "@/lib/utils/format";
import { CURRENCIES } from "@/lib/constants";

type FilterType = "الكل" | "FIAT" | "CRYPTO" | "EBANK";

const FILTER_TABS: { label: string; value: FilterType }[] = [
  { label: "الكل",     value: "الكل"   },
  { label: "رقمية",   value: "FIAT"   },
  { label: "مشفرة",   value: "CRYPTO" },
  { label: "إلكترونية", value: "EBANK" },
];

const MOCK_BALANCES: Record<string, number> = {
  USD: 2450.00, EUR: 850.25, AED: 1200.00, SAR: 500.00,
  SYP: 12500000, EGP: 4200.00, TRY: 3100.00,
  USDT: 1200.50, BTC: 0.01852, ETH: 0.42310,
  LTC: 2.5, BNB: 1.2, SOL: 15.0, TRX: 4500, USDC: 300.00,
  PayPal: 0, Payeer: 0, PerfectMoney: 0,
};

const BADGE_VARIANT: Record<string, "default" | "warning" | "secondary"> = {
  FIAT: "default", CRYPTO: "warning", EBANK: "secondary",
};
const TYPE_AR: Record<string, string> = {
  FIAT: "رقمية", CRYPTO: "مشفرة", EBANK: "إلكترونية",
};

export function WalletsManager() {
  const [filter, setFilter] = useState<FilterType>("الكل");
  const [search, setSearch] = useState("");

  const totalUSD = Object.values(MOCK_BALANCES).reduce((s, v) => s + v, 0);

  const filtered = CURRENCIES.filter((c) => {
    const matchType = filter === "الكل" || c.type === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.code.toLowerCase().includes(q) || c.nameAr.includes(q);
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Total balance */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-blue-600/15 to-blue-900/15 border border-blue-500/20">
        <p className="text-slate-400 text-sm">إجمالي الرصيد (USD)</p>
        <p className="text-3xl font-bold text-white mt-1">${formatAmount(totalUSD, "USD")}</p>
      </div>

      {/* Filters + search + add */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
          {FILTER_TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                "px-3 h-8 rounded-lg text-sm font-medium transition-all",
                filter === value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-52">
            <Input
              placeholder="بحث عن عملة…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<Search className="w-4 h-4" />}
              className="h-9 text-xs"
            />
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4" />
            إضافة عملة
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((currency) => (
          <Card key={currency.code} className="hover:bg-white/6 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currency.emoji}</span>
                  <div>
                    <p className="text-white font-bold">{currency.code}</p>
                    <p className="text-slate-500 text-xs">{currency.nameAr}</p>
                  </div>
                </div>
                <Badge variant={BADGE_VARIANT[currency.type]} className="text-[10px]">
                  {TYPE_AR[currency.type]}
                </Badge>
              </div>
              <p className="text-white text-lg font-semibold mb-4">
                {formatAmount(MOCK_BALANCES[currency.code] ?? 0, currency.code)}{" "}
                <span className="text-slate-500 text-sm">{currency.code}</span>
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 text-xs h-8">
                  <Send className="w-3 h-3" />
                  إرسال
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 text-xs h-8">
                  <Download className="w-3 h-3" />
                  استقبال
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 text-xs h-8">
                  <ArrowUpDown className="w-3 h-3" />
                  تبادل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
