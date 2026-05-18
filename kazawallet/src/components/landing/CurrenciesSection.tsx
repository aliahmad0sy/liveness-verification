"use client";

import { useState } from "react";
import { CURRENCIES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

type FilterTab = "الكل" | "رقمية" | "مشفرة" | "إلكترونية";

const tabMap: Record<FilterTab, string | null> = {
  "الكل": null,
  "رقمية": "FIAT",
  "مشفرة": "CRYPTO",
  "إلكترونية": "EBANK",
};

const tabs: FilterTab[] = ["الكل", "رقمية", "مشفرة", "إلكترونية"];

export default function CurrenciesSection() {
  const [active, setActive] = useState<FilterTab>("الكل");

  const filtered = tabMap[active]
    ? CURRENCIES.filter((c) => c.type === tabMap[active])
    : CURRENCIES;

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            العملات المدعومة
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            أكثر من 30 عملة في متناولك
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            ندعم العملات الرقمية، المشفرة، والإلكترونية — كل ما تحتاجه في مكان
            واحد.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                active === tab
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Currency pills grid */}
        <div className="flex flex-wrap gap-3 justify-center">
          {filtered.map((currency) => (
            <div
              key={currency.code}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-blue-500/30 hover:text-blue-300 hover:bg-blue-500/5 transition-all duration-200 cursor-default group"
            >
              <span className="text-xl leading-none">{currency.emoji}</span>
              <div className="flex flex-col items-start">
                <span className="text-white text-sm font-semibold group-hover:text-blue-300 transition-colors leading-tight">
                  {currency.code}
                </span>
                <span className="text-slate-500 text-xs leading-tight">
                  {currency.nameAr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
