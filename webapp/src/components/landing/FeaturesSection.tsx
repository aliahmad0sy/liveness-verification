import {
  Wallet,
  CreditCard,
  ArrowLeftRight,
  Users,
  Building2,
  Shield,
  Zap,
  Globe,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "محافظ متعددة العملات",
    description: "أدر أكثر من 30 عملة رقمية ومشفرة في مكان واحد. رصيدك في متناول يدك دائماً.",
    color: "from-blue-500 to-blue-600",
    glow: "shadow-blue-500/20",
  },
  {
    icon: ArrowLeftRight,
    title: "تبادل فوري بأفضل الأسعار",
    description: "حوّل بين العملات الرقمية والمشفرة بأسعار تنافسية تُحدّث كل 10 دقائق.",
    color: "from-purple-500 to-purple-600",
    glow: "shadow-purple-500/20",
  },
  {
    icon: CreditCard,
    title: "بطاقة فيزا افتراضية",
    description: "احصل على بطاقتك الافتراضية الدولية فوراً. ادفع في ملايين المتاجر حول العالم.",
    color: "from-emerald-500 to-emerald-600",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: Users,
    title: "دفع جماعي (Mass Payout)",
    description: "أرسل مدفوعات لمئات المستلمين في آن واحد عبر رفع ملف Excel بسهولة.",
    color: "from-orange-500 to-orange-600",
    glow: "shadow-orange-500/20",
  },
  {
    icon: Building2,
    title: "نظام التجار",
    description: "تكامل كامل مع متجرك عبر API أو إضافة WordPress. اقبل 70+ طريقة دفع.",
    color: "from-cyan-500 to-cyan-600",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: Shield,
    title: "أمان بنكي 24/7",
    description: "تشفير متقدم، حماية 3D Secure، ومراقبة مستمرة لحماية أصولك الرقمية.",
    color: "from-red-500 to-red-600",
    glow: "shadow-red-500/20",
  },
  {
    icon: Globe,
    title: "دعم عالمي",
    description: "خدمة عملاء على مدار الساعة باللغتين العربية والإنجليزية. نحن هنا لمساعدتك.",
    color: "from-teal-500 to-teal-600",
    glow: "shadow-teal-500/20",
  },
  {
    icon: Zap,
    title: "معاملات فورية",
    description: "تقنية حديثة تضمن تنفيذ معاملاتك بسرعة لا مثيل لها دون تأخير.",
    color: "from-yellow-500 to-yellow-600",
    glow: "shadow-yellow-500/20",
  },
  {
    icon: BarChart3,
    title: "برنامج الوكلاء",
    description: "انضم لبرنامج الوكلاء واكسب عمولة 1-1.5% على كل عملية سحب لعملائك.",
    color: "from-pink-500 to-pink-600",
    glow: "shadow-pink-500/20",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#070b14] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm text-blue-300 font-medium">المميزات الرئيسية</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            كل ما تحتاجه في{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              محفظة واحدة
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            منصة شاملة تجمع كل خدمات العملات الرقمية في مكان واحد آمن وسهل الاستخدام
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-white/6 hover:border-white/15 transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-3`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
