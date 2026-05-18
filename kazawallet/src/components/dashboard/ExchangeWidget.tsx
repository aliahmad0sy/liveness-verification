"use client";
import { useState, useEffect } from "react";
import { ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { CURRENCIES, EXCHANGE_FEE_RATE } from "@/lib/constants";
import { formatAmount } from "@/lib/utils/format";

const MOCK_RATES: Record<string, number> = {
  "USD-EUR":  0.92, "USD-AED":  3.67, "USD-SAR":  3.75, "USD-SYP": 13000,
  "USD-EGP":  48.5, "USD-TRY":  32.5, "USD-USDT": 1.00, "USD-BTC":  0.000016,
  "USD-ETH":  0.00035, "USD-LTC": 0.011, "USD-BNB": 0.0033, "USD-SOL": 0.0062,
  "USD-TRX":  11.5, "USD-USDC": 1.00,
  "EUR-USD":  1.087, "USDT-USD": 1.00, "BTC-USD": 62500, "ETH-USD": 2850,
};

function getRate(from: string, to: string): number {
  if (from === to) return 1;
  const direct = MOCK_RATES[`${from}-${to}`];
  if (direct) return direct;
  const usdFrom = MOCK_RATES[`USD-${from}`] ? 1 / MOCK_RATES[`USD-${from}`] : MOCK_RATES[`${from}-USD`] ?? 1;
  const usdTo   = MOCK_RATES[`USD-${to}`]   ?? (MOCK_RATES[`${to}-USD`] ? 1 / MOCK_RATES[`${to}-USD`] : 1);
  return usdFrom * usdTo;
}

const RATE_PAIRS = [
  { from: "USD",  to: "USDT", change: +0.01 },
  { from: "BTC",  to: "USD",  change: +2.34 },
  { from: "ETH",  to: "USD",  change: -1.12 },
  { from: "USD",  to: "EUR",  change: -0.21 },
  { from: "USDT", to: "TRX",  change: +0.55 },
];

export function ExchangeWidget() {
  const [fromCode, setFromCode]   = useState("USD");
  const [toCode, setToCode]       = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [swapRotated, setSwapRotated] = useState(false);
  const [loading, setLoading]     = useState(false);

  const rate    = getRate(fromCode, toCode);
  const feeAmt  = parseFloat(fromAmount || "0") * EXCHANGE_FEE_RATE;
  const receive = Math.max(0, parseFloat(fromAmount || "0") - feeAmt) * rate;

  const handleSwap = () => {
    setSwapRotated((v) => !v);
    setFromCode(toCode);
    setToCode(fromCode);
    setFromAmount("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setFromAmount("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader><CardTitle>تبادل العملات</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* FROM */}
          <div className="rounded-xl bg-white/3 border border-white/8 p-4">
            <p className="text-slate-400 text-xs mb-3">أريد تحويل</p>
            <div className="flex gap-3 items-center">
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="h-11 rounded-xl bg-white/8 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shrink-0"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0b1120]">
                    {c.emoji} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 text-left h-11 rounded-xl bg-white/8 border border-white/10 text-white text-2xl font-bold px-4 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-right"
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all"
            >
              <ArrowUpDown className={cn("w-4 h-4 transition-transform duration-300", swapRotated && "rotate-180")} />
            </button>
          </div>

          {/* TO */}
          <div className="rounded-xl bg-white/3 border border-white/8 p-4">
            <p className="text-slate-400 text-xs mb-3">وسأستلم</p>
            <div className="flex gap-3 items-center">
              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="h-11 rounded-xl bg-white/8 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shrink-0"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0b1120]">
                    {c.emoji} {c.code}
                  </option>
                ))}
              </select>
              <div className="flex-1 h-11 rounded-xl bg-white/4 border border-emerald-500/20 flex items-center px-4">
                <span className="text-emerald-400 text-2xl font-bold">
                  {fromAmount ? formatAmount(receive, toCode) : "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Rate info */}
          {fromAmount && parseFloat(fromAmount) > 0 && (
            <div className="rounded-xl bg-white/3 border border-white/8 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">سعر الصرف</span>
                <span className="text-white">1 {fromCode} = {formatAmount(rate, toCode)} {toCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">رسوم (0.1%)</span>
                <span className="text-amber-400">{formatAmount(feeAmt, fromCode)} {fromCode}</span>
              </div>
              <div className="h-px bg-white/8" />
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">ستستلم</span>
                <span className="text-emerald-400">{formatAmount(receive, toCode)} {toCode}</span>
              </div>
            </div>
          )}

          <Button className="w-full" size="lg" loading={loading} onClick={handleSubmit}>
            تبادل الآن
          </Button>
        </CardContent>
      </Card>

      {/* Rates table */}
      <Card>
        <CardHeader><CardTitle>أسعار الصرف</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-1">
            {RATE_PAIRS.map(({ from, to, change }) => (
              <div key={`${from}-${to}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/4 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">{from}/{to}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white text-sm">{formatAmount(getRate(from, to), to)}</span>
                  <div className={cn("flex items-center gap-1 text-xs font-medium", change >= 0 ? "text-emerald-400" : "text-red-400")}>
                    {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {change >= 0 ? "+" : ""}{change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
