"use client";

import { useState } from "react";
import { Shield, CheckCircle, Clock, XCircle, Upload, Phone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type KYCStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

const statusConfig = {
  NONE: { label: "غير مقدّم", color: "secondary" as const, icon: Shield },
  PENDING: { label: "قيد المراجعة", color: "warning" as const, icon: Clock },
  APPROVED: { label: "موافق عليه", color: "success" as const, icon: CheckCircle },
  REJECTED: { label: "مرفوض", color: "destructive" as const, icon: XCircle },
};

const benefits = [
  { title: "حدود سحب أعلى", desc: "ارفع حد السحب اليومي من $500 إلى $10,000" },
  { title: "بطاقة افتراضية", desc: "احصل على بطاقة فيزا افتراضية دولية" },
  { title: "تحويلات دولية", desc: "أرسل للخارج بدون قيود إضافية" },
  { title: "شارة موثّق", desc: "اكسب ثقة المستخدمين الآخرين" },
];

export function KYCVerification() {
  const [kycStatus] = useState<KYCStatus>("NONE");
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "telegram">("whatsapp");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const StatusIcon = statusConfig[kycStatus].icon;

  async function handleSubmit() {
    if (!phone || !file) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted || kycStatus === "PENDING") {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">طلبك قيد المراجعة</h3>
            <p className="text-slate-400 mb-2">
              سيتم مراجعة طلب التحقق من هويتك خلال <strong className="text-white">24-48 ساعة</strong>
            </p>
            <p className="text-sm text-slate-500">
              سيتم إشعارك عبر {contactMethod === "whatsapp" ? "WhatsApp" : "Telegram"} على الرقم {phone}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (kycStatus === "APPROVED") {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="text-center py-12 border-emerald-500/20">
          <CardContent>
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">تم التحقق من هويتك</h3>
            <Badge variant="success" className="text-sm px-4 py-1">موثّق ✓</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">التحقق من الهوية (KYC)</h2>
        <Badge variant={statusConfig[kycStatus].color}>
          <StatusIcon className="w-3.5 h-3.5 ml-1.5" />
          {statusConfig[kycStatus].label}
        </Badge>
      </div>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">مميزات التحقق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white">{b.title}</div>
                  <div className="text-xs text-slate-500">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Steps indicator */}
      <div className="flex items-center gap-3">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
              step >= s
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-slate-500"
            )}>
              {s}
            </div>
            <span className={cn("text-sm", step >= s ? "text-white" : "text-slate-500")}>
              {s === 1 ? "بيانات التواصل" : "الوثائق"}
            </span>
            {s < 2 && <div className="w-12 h-0.5 bg-white/10" />}
          </div>
        ))}
      </div>

      {/* Step 1: Contact info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              بيانات التواصل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="رقم الهاتف"
              type="tel"
              placeholder="+963 xxx xxx xxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              hint="سيتم التواصل معك على هذا الرقم بعد المراجعة"
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                طريقة التواصل المفضلة
              </label>
              <div className="flex gap-3">
                {(["whatsapp", "telegram"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setContactMethod(method)}
                    className={cn(
                      "flex-1 py-3 rounded-xl border text-sm font-medium transition-all",
                      contactMethod === method
                        ? "bg-blue-500/10 border-blue-500/40 text-blue-300"
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/8"
                    )}
                  >
                    {method === "whatsapp" ? "واتساب" : "تيليغرام"}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!phone}
            >
              التالي
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Documents */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" />
              رفع الوثائق
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-300 leading-relaxed">
                  <p className="font-semibold mb-1">تعليمات الصورة:</p>
                  <p>التقط صورة سيلفي واضحة تُظهر وجهك مع:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-yellow-400/80">
                    <li>بطاقة هويتك الوطنية أو جواز سفرك</li>
                    <li>ورقة مكتوب عليها &ldquo;KazaWallet&rdquo; وتاريخ اليوم بخط يدك</li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                file
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-white/20 hover:border-blue-500/40 hover:bg-white/3"
              )}
              onClick={() => document.getElementById("kyc-file")?.click()}
            >
              {file ? (
                <div>
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-emerald-300 font-medium">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-300 font-medium">اضغط لرفع الصورة</p>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG — حجم أقصى 5MB</p>
                </div>
              )}
              <input
                id="kyc-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                رجوع
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                loading={loading}
                disabled={!file}
              >
                إرسال طلب التحقق
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
