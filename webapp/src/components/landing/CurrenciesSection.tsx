import { CURRENCIES } from "@/lib/constants";

const fiat = CURRENCIES.filter((c) => c.type === "FIAT");
const crypto = CURRENCIES.filter((c) => c.type === "CRYPTO");
const ebanks = CURRENCIES.filter((c) => c.type === "EBANK");

function CurrencyGroup({
  title,
  currencies,
  badgeColor,
}: {
  title: string;
  currencies: typeof CURRENCIES[number][];
  badgeColor: string;
}) {
  return (
    <div className="mb-10">
      <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${badgeColor}`}>
        {title}
      </div>
      <div className="flex flex-wrap gap-3">
        {currencies.map((c) => (
          <div
            key={c.code}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 hover:border-blue-500/30 hover:bg-white/8 transition-all cursor-default group"
          >
            <span className="text-lg">{c.emoji}</span>
            <div>
              <div className="text-sm font-semibold text-white leading-none">{c.code}</div>
              <div className="text-xs text-slate-500 mt-0.5">{c.nameAr}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CurrenciesSection() {
  return (
    <section className="py-24 bg-[#070b14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm text-blue-300 font-medium">العملات المدعومة</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            أكثر من{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              30 عملة
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            عملات فيات، مشفرة، وإلكترونية. كلها في محفظة واحدة
          </p>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-3xl p-8">
          <CurrencyGroup
            title="عملات رقمية (Fiat)"
            currencies={fiat as unknown as typeof CURRENCIES[number][]}
            badgeColor="bg-blue-500/10 text-blue-300 border border-blue-500/20"
          />
          <CurrencyGroup
            title="عملات مشفرة (Crypto)"
            currencies={crypto as unknown as typeof CURRENCIES[number][]}
            badgeColor="bg-purple-500/10 text-purple-300 border border-purple-500/20"
          />
          <CurrencyGroup
            title="محافظ إلكترونية (E-Banks)"
            currencies={ebanks as unknown as typeof CURRENCIES[number][]}
            badgeColor="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
          />
        </div>
      </div>
    </section>
  );
}
