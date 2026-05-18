"use client";
import { useState } from "react";
import { CheckCircle2, Clock, Shield, TrendingUp, Zap, Globe, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type KYCStatus = "NONE" | "PENDING" | "APPROVED";
type Step = 1 | 2;
type ContactMethod = "whatsapp" | "telegram";

const BENEFITS = [
  { icon: TrendingUp, title: "حدود أعلى",     desc: "رفع حد الإرسال والسحب"           },
  { icon: Shield,     title: "حساب آمن",       desc: "حماية إضافية لحسابك"             },
  { icon: Zap,        title: "معاملات أسرع",   desc: "معالجة فورية بدون تأخير"         },
  { icon: Globe,      title: "خدمات أشمل",     desc: "الوصول لجميع ميزات المنصة"       },
];

export function KYCFlow() {
  const [kycStatus, setKycStatus] = useState<KYCStatus>("NONE");
  const [step, setStep]           = useState<Step>(1);
  const [phone, setPhone]         = useState("");
  const [method, setMethod]       = useState<ContactMethod>("whatsapp");
  const [selfie, setSelfie]       = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setKycStatus("PENDING");
  };

  if (kycStatus === "APPROVED") {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center p-10">
          <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">تم التحقق بنجاح!</h2>
          <p className="text-slate-400 mb-4">حسابك موثّق ويمكنك الآن الاستمتاع بجميع المزايا</p>
          <Badge variant="success" className="text-sm px-4 py-1.5">حساب موثّق ✓</Badge>
        </Card>
      </div>
    );
  }

  if (kycStatus === "PENDING") {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center p-10">
          <Clock className="w-20 h-20 text-amber-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">طلبك قيد المراجعة</h2>
          <p className="text-slate-400 mb-4">سيتم مراجعة بياناتك خلال 24-48 ساعة وإشعارك بالنتيجة</p>
          <Badge variant="warning" className="text-sm px-4 py-1.5">قيد المراجعة</Badge>
          {/* For demo only */}
          <div className="mt-6">
            <Button variant="ghost" size="sm" onClick={() => setKycStatus("APPROVED")} className="text-xs text-slate-600">
              [عرض توضيحي: موافقة]
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Benefits */}
      <Card>
        <CardContent className="pt-5">
          <h2 className="text-white font-bold text-lg mb-4">مزايا التحقق من الهوية</h2>
          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-white/3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {([1, 2] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step >= s ? "bg-blue-600 text-white" : "bg-white/10 text-slate-500"
            }`}>
              {s}
            </div>
            <span className={`text-sm font-medium ${step === s ? "text-white" : "text-slate-500"}`}>
              {s === 1 ? "بيانات التواصل" : "صورة السيلفي"}
            </span>
            {s < 2 && <div className="flex-1 h-px bg-white/10 mx-2 w-8" />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card>
          <CardContent className="pt-5">
            <h3 className="text-white font-semibold mb-4">الخطوة 1: بيانات التواصل</h3>
            <form onSubmit={handleStep1} className="space-y-4">
              <Input
                label="رقم الهاتف"
                type="tel"
                placeholder="+963 XXX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <div>
                <p className="text-slate-300 text-sm font-medium mb-3">طريقة التواصل</p>
                <div className="flex gap-3">
                  {(["whatsapp", "telegram"] as ContactMethod[]).map((m) => (
                    <label key={m} className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        name="method"
                        value={m}
                        checked={method === m}
                        onChange={() => setMethod(m)}
                        className="sr-only"
                      />
                      <div className={`rounded-xl border p-3 text-center text-sm font-medium transition-all ${
                        method === m
                          ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                          : "border-white/10 bg-white/3 text-slate-400 hover:bg-white/6"
                      }`}>
                        {m === "whatsapp" ? "📱 WhatsApp" : "✈️ Telegram"}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">التالي</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card>
          <CardContent className="pt-5">
            <h3 className="text-white font-semibold mb-4">الخطوة 2: صورة السيلفي</h3>

            {/* Warning box */}
            <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 text-sm font-semibold mb-1">تعليمات مهمة</p>
                <ul className="text-amber-400/80 text-xs space-y-1">
                  <li>• تأكد أن وجهك ظاهر بوضوح في الصورة</li>
                  <li>• الإضاءة جيدة ولا توجد ظلال</li>
                  <li>• الصورة حديثة وغير معدّلة</li>
                  <li>• امسك ورقة مكتوب عليها تاريخ اليوم</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  رفع صورة السيلفي
                </label>
                <label className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-white/15 bg-white/3 cursor-pointer hover:bg-white/5 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="hidden"
                    onChange={(e) => setSelfie(e.target.files?.[0] ?? null)}
                    required
                  />
                  {selfie ? (
                    <div className="text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-emerald-400 text-sm">{selfie.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Shield className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">انقر لرفع الصورة</p>
                      <p className="text-slate-600 text-xs mt-1">JPG, PNG أو HEIC</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                  السابق
                </Button>
                <Button type="submit" className="flex-1" loading={submitting}>
                  إرسال للمراجعة
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
