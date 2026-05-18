import { UserPlus, Wallet, ArrowLeftRight, Smile } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "أنشئ حسابك",
    desc: "سجّل مجاناً في دقيقة واحدة. لا رسوم خفية، لا تعقيدات.",
    icon: UserPlus,
    color: "blue",
    iconBg: "bg-blue-600",
    numberColor: "text-blue-400",
    connectorColor: "from-blue-500/40 to-purple-500/40",
  },
  {
    number: "02",
    title: "أضف رصيدك",
    desc: "اشحن محفظتك بالعملة التي تريد عبر عشرات طرق الإيداع المتاحة.",
    icon: Wallet,
    color: "purple",
    iconBg: "bg-purple-600",
    numberColor: "text-purple-400",
    connectorColor: "from-purple-500/40 to-emerald-500/40",
  },
  {
    number: "03",
    title: "بادل وأرسل",
    desc: "حوّل بين العملات بأفضل الأسعار وأرسل للأصدقاء والعائلة فوراً.",
    icon: ArrowLeftRight,
    color: "emerald",
    iconBg: "bg-emerald-600",
    numberColor: "text-emerald-400",
    connectorColor: "from-emerald-500/40 to-orange-500/40",
  },
  {
    number: "04",
    title: "استمتع بمحفظتك",
    desc: "ادفع بالبطاقة الافتراضية، تابع تحويلاتك، وراقب رصيدك في أي وقت.",
    icon: Smile,
    color: "orange",
    iconBg: "bg-orange-600",
    numberColor: "text-orange-400",
    connectorColor: "",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            كيف يعمل
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            ابدأ في 4 خطوات بسيطة
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            من التسجيل إلى أول معاملة ناجحة — العملية كلها لا تأخذ أكثر من
            دقائق.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ number, title, desc, icon: Icon, iconBg, numberColor }, idx) => (
            <div key={number} className="relative flex flex-col items-center text-center gap-4">
              {/* Connector line (desktop) */}
              {idx < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden lg:block absolute top-10 left-0 w-full h-px bg-gradient-to-l from-white/5 to-white/10 -z-10"
                  style={{ left: "50%", width: "100%" }}
                />
              )}

              {/* Number + icon */}
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-9 h-9 text-white" />
                </div>
                <span
                  className={`absolute -top-3 -right-3 text-xs font-black ${numberColor} bg-[#070c15] border border-white/10 rounded-full w-7 h-7 flex items-center justify-center`}
                >
                  {number}
                </span>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
