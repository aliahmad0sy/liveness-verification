const steps = [
  {
    number: "01",
    title: "أنشئ حسابك",
    description: "سجّل بياناتك الأساسية واحصل على محفظتك الرقمية فوراً في دقائق.",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "02",
    title: "أضف رصيدك",
    description: "أودع عبر الكريبتو، PayPal، Payeer أو Perfect Money بسهولة تامة.",
    color: "from-purple-500 to-purple-600",
  },
  {
    number: "03",
    title: "بادل وأرسل",
    description: "حوّل بين العملات أو أرسل للأصدقاء والعائلة حول العالم بلحظات.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    number: "04",
    title: "استمتع بمحفظتك",
    description: "استخدم البطاقة الافتراضية للتسوق أو فعّل نظام الوكالة لكسب عمولات.",
    color: "from-orange-500 to-orange-600",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-[#080c16] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm text-blue-300 font-medium">كيف يعمل</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            ابدأ في{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              4 خطوات
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            الإعداد سهل وسريع. لا رسوم مخفية، لا تعقيدات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-orange-500/50" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              {/* Step number circle */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl font-black text-white shadow-xl mb-5 group-hover:scale-110 transition-transform relative z-10`}
              >
                {step.number}
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
