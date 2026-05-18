import {
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Users,
  Building2,
  Shield,
  Globe,
  Zap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const features = [
  {
    icon: Wallet,
    title: "محافظ متعددة العملات",
    desc: "أدر جميع عملاتك الرقمية والمشفرة والإلكترونية من مكان واحد بسهولة تامة.",
    color: "blue",
    gradient: "from-blue-600 to-blue-500",
    glow: "group-hover:shadow-blue-500/20",
    border: "group-hover:border-blue-500/30",
  },
  {
    icon: ArrowLeftRight,
    title: "تبادل بأفضل الأسعار",
    desc: "بادل بين العملات بأفضل الأسعار المتاحة في السوق مع رسوم شفافة وبسيطة.",
    color: "purple",
    gradient: "from-purple-600 to-purple-500",
    glow: "group-hover:shadow-purple-500/20",
    border: "group-hover:border-purple-500/30",
  },
  {
    icon: CreditCard,
    title: "بطاقة فيزا افتراضية",
    desc: "احصل على بطاقة فيزا افتراضية للتسوق عبر الإنترنت واشتراكات الخدمات العالمية.",
    color: "emerald",
    gradient: "from-emerald-600 to-emerald-500",
    glow: "group-hover:shadow-emerald-500/20",
    border: "group-hover:border-emerald-500/30",
  },
  {
    icon: Users,
    title: "دفع جماعي Mass Payout",
    desc: "أرسل مدفوعات لآلاف المستلمين في آنٍ واحد مع نظام الدفع الجماعي المتقدم.",
    color: "orange",
    gradient: "from-orange-600 to-orange-500",
    glow: "group-hover:shadow-orange-500/20",
    border: "group-hover:border-orange-500/30",
  },
  {
    icon: Building2,
    title: "نظام التجار",
    desc: "حلول دفع متكاملة للتجار والشركات مع لوحة تحكم احترافية وتقارير تفصيلية.",
    color: "cyan",
    gradient: "from-cyan-600 to-cyan-500",
    glow: "group-hover:shadow-cyan-500/20",
    border: "group-hover:border-cyan-500/30",
  },
  {
    icon: Shield,
    title: "حماية 24/7",
    desc: "حماية متكاملة لحسابك وأموالك على مدار الساعة بأعلى معايير الأمن والتشفير.",
    color: "red",
    gradient: "from-red-600 to-red-500",
    glow: "group-hover:shadow-red-500/20",
    border: "group-hover:border-red-500/30",
  },
  {
    icon: Globe,
    title: "دعم عالمي",
    desc: "خدمة متاحة في أكثر من 180 دولة حول العالم مع دعم متعدد اللغات.",
    color: "teal",
    gradient: "from-teal-600 to-teal-500",
    glow: "group-hover:shadow-teal-500/20",
    border: "group-hover:border-teal-500/30",
  },
  {
    icon: Zap,
    title: "معاملات فورية",
    desc: "تحويل الأموال بسرعة البرق بين حسابات KazaWallet دون أي تأخير أو رسوم إضافية.",
    color: "yellow",
    gradient: "from-yellow-600 to-yellow-500",
    glow: "group-hover:shadow-yellow-500/20",
    border: "group-hover:border-yellow-500/30",
  },
  {
    icon: BarChart3,
    title: "برنامج الوكلاء",
    desc: "انضم لشبكة وكلائنا وابدأ في كسب عمولات مجزية على كل معاملة ترعاها.",
    color: "pink",
    gradient: "from-pink-600 to-pink-500",
    glow: "group-hover:shadow-pink-500/20",
    border: "group-hover:border-pink-500/30",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            المميزات
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            كل ما تحتاجه في محفظة واحدة
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            من العملات المشفرة إلى بطاقات الدفع الافتراضية، KazaWallet تتيح لك
            التحكم الكامل في أموالك.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, gradient, glow, border }) => (
            <div
              key={title}
              className={cn(
                "group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6",
                "hover:bg-white/[0.06] transition-all duration-300",
                "hover:shadow-xl",
                glow,
                border
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                  "transition-transform duration-300 group-hover:scale-110",
                  gradient
                )}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
