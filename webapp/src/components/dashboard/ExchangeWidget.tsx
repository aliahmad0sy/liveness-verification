"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CURRENCIES } from "@/lib/constants";

const mockRates: Record<string, Record<string, number>> = {
  USD: { USDT: 1.001, BTC: 0.0000157, ETH: 0.000294, EUR: 0.918, SAR: 3.75, AED: 3.67 },
  USDT: { USD: 0.999, BTC: 0.0000157, ETH: 0.000294 },
  BTC: { USD: 63500, USDT: 63570, ETH: 18.7 },
  ETH: { USD: 3400, USDT: 3403, BTC: 0.0535 },
  EUR: { USD: 1.089, USDT: 1.090 },
};

function getRate(from: string, to: string): number {
  return mockRates[from]?.[to] ?? 1;
}

export function ExchangeWidget() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const rate = getRate(fromCurrency, toCurrency);
  const fee = 0.001;

  useEffect(() => {
    if (fromAmount) {
      const result = parseFloat(fromAmount) * rate * (1 - fee);
      setToAmount(isNaN(result) ? "" : result.toFixed(6));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromCurrency, toCurrency, rate]);

  function swapCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  }

  async function handleExchange() {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    alert("تم التبادل بنجاح!");
  }

  const availableCurrencies = CURRENCIES;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Rate refresh notice */}
      <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-blue-300">
          <Info className="w-4 h-4" />
          <span>الأسعار تُحدَّث كل 10 دقائق تلقائياً</span>
        </div>
        <button
          onClick={() => setLastUpdated(new Date())}
          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          تحديث
        </button>
      </div>

      {/* Exchange Card */}
      <Card>
        <CardHeader>
          <CardTitle>تبادل العملات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* From */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <label className="text-xs text-slate-500 mb-2 block">أريد تحويل</label>
            <div className="flex items-center gap-3">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {availableCurrencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#1a2035]">
                    {c.emoji} {c.code} — {c.nameAr}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                className="flex-1 bg-transparent text-right text-2xl font-bold text-white outline-none placeholder:text-slate-600"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-500">رصيد متاح: 2,500.00 {fromCurrency}</span>
              <button
                onClick={() => setFromAmount("2500")}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                الكل
              </button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all hover:rotate-180 duration-300"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <label className="text-xs text-slate-500 mb-2 block">وسأستلم</label>
            <div className="flex items-center gap-3">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                {availableCurrencies
                  .filter((c) => c.code !== fromCurrency)
                  .map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#1a2035]">
                      {c.emoji} {c.code} — {c.nameAr}
                    </option>
                  ))}
              </select>
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.00"
                className="flex-1 bg-transparent text-right text-2xl font-bold text-emerald-400 outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Rate Info */}
          {fromAmount && parseFloat(fromAmount) > 0 && (
            <div className="space-y-2 bg-white/3 rounded-xl p-4 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>سعر الصرف</span>
                <span className="text-white font-medium">
                  1 {fromCurrency} = {rate.toFixed(6)} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>رسوم التحويل</span>
                <span className="text-white font-medium">
                  {(parseFloat(fromAmount) * fee).toFixed(4)} {fromCurrency} (0.1%)
                </span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                <span className="text-slate-300">ستستلم</span>
                <span className="text-emerald-400">
                  {toAmount} {toCurrency}
                </span>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleExchange}
            loading={loading}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0}
          >
            تأكيد التبادل
          </Button>
        </CardContent>
      </Card>

      {/* Recent exchange rates table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">أسعار الصرف الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { from: "USD", to: "USDT", rate: "1.001", change: "+0.01%" },
              { from: "BTC", to: "USD", rate: "63,500", change: "+2.3%" },
              { from: "ETH", to: "USD", rate: "3,400", change: "+1.8%" },
              { from: "USD", to: "EUR", rate: "0.918", change: "-0.2%" },
              { from: "USD", to: "SAR", rate: "3.75", change: "0%" },
            ].map((item) => (
              <div key={`${item.from}-${item.to}`} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <span className="text-sm text-slate-300 font-medium">
                  {item.from} / {item.to}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{item.rate}</span>
                  <span className={`text-xs font-medium ${item.change.startsWith("+") ? "text-emerald-400" : item.change === "0%" ? "text-slate-500" : "text-red-400"}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
