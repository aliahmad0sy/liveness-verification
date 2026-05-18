"use client";
import { useState } from "react";
import { User, Lock, Bell, Shield, Smartphone, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

type Tab = "profile" | "security" | "notifications" | "2fa";
const TABS: { value: Tab; label: string; icon: React.ElementType }[] = [
  { value: "profile",       label: "الملف الشخصي", icon: User         },
  { value: "security",      label: "الأمان",        icon: Lock         },
  { value: "notifications", label: "الإشعارات",     icon: Bell         },
  { value: "2fa",           label: "التحقق بخطوتين",icon: Smartphone   },
];

const NOTIF_PREFS = [
  { key: "receive",  label: "استلام تحويل",     defaultOn: true  },
  { key: "send",     label: "إرسال تحويل",      defaultOn: true  },
  { key: "exchange", label: "تبادل العملات",    defaultOn: false },
  { key: "security", label: "تنبيهات الأمان",   defaultOn: true  },
  { key: "promo",    label: "العروض والأخبار",   defaultOn: false },
];

export function SettingsPanel() {
  const [tab, setTab]       = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const [firstName, setFirstName] = useState("أحمد");
  const [lastName,  setLastName]  = useState("خالد");
  const [email,     setEmail]     = useState("ahmad@example.com");
  const [phone,     setPhone]     = useState("+963912345678");

  const [currentPw, setCurrentPw]   = useState("");
  const [newPw,     setNewPw]       = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [pwError,   setPwError]     = useState("");

  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_PREFS.map((n) => [n.key, n.defaultOn]))
  );

  const [twoFaEnabled, setTwoFaEnabled] = useState(false);

  const handleSave = async () => {
    if (tab === "security") {
      if (newPw && newPw !== confirmPw) { setPwError("كلمتا المرور غير متطابقتين"); return; }
      if (newPw && newPw.length < 8)    { setPwError("يجب أن تكون كلمة المرور 8 أحرف على الأقل"); return; }
      setPwError("");
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8 overflow-x-auto">
        {TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              "flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              tab === value ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "profile" && (
        <Card>
          <CardHeader><CardTitle>معلومات الحساب</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                {firstName.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold">{firstName} {lastName}</p>
                <p className="text-slate-400 text-sm">{email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="الاسم الأول" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label="الاسم الأخير" value={lastName}  onChange={(e) => setLastName(e.target.value)}  />
            </div>
            <Input label="البريد الإلكتروني" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="رقم الهاتف" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Button onClick={handleSave} loading={saving} className="w-full">
              <Save className="w-4 h-4" />
              {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security */}
      {tab === "security" && (
        <Card>
          <CardHeader><CardTitle>تغيير كلمة المرور</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {pwError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">{pwError}</div>
            )}
            <Input label="كلمة المرور الحالية" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
            <Input label="كلمة المرور الجديدة" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} hint="8 أحرف على الأقل" />
            <Input label="تأكيد كلمة المرور" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            <Button onClick={handleSave} loading={saving} className="w-full">
              <Shield className="w-4 h-4" />
              {saved ? "تم التحديث ✓" : "تحديث كلمة المرور"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <Card>
          <CardHeader><CardTitle>تفضيلات الإشعارات</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {NOTIF_PREFS.map((n) => (
              <label key={n.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/4 cursor-pointer transition-colors">
                <span className="text-slate-300 text-sm">{n.label}</span>
                <button
                  role="switch"
                  aria-checked={notifs[n.key]}
                  onClick={() => setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors",
                    notifs[n.key] ? "bg-blue-600" : "bg-white/10"
                  )}
                >
                  <span className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
                    notifs[n.key] ? "right-1" : "right-6"
                  )} />
                </button>
              </label>
            ))}
            <Button onClick={handleSave} loading={saving} className="w-full mt-2">
              <Save className="w-4 h-4" />
              {saved ? "تم الحفظ ✓" : "حفظ التفضيلات"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 2FA */}
      {tab === "2fa" && (
        <Card>
          <CardHeader><CardTitle>التحقق بخطوتين (2FA)</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className={cn("rounded-xl p-4 border", twoFaEnabled ? "bg-emerald-500/8 border-emerald-500/20" : "bg-amber-500/8 border-amber-500/20")}>
              <p className={cn("text-sm font-medium", twoFaEnabled ? "text-emerald-400" : "text-amber-400")}>
                {twoFaEnabled ? "التحقق بخطوتين مفعّل" : "التحقق بخطوتين غير مفعّل"}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {twoFaEnabled ? "حسابك محمي بطبقة أمان إضافية" : "فعّله لزيادة حماية حسابك"}
              </p>
            </div>

            {!twoFaEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-36 h-36 rounded-2xl bg-white p-2 flex items-center justify-center">
                    <Smartphone className="w-24 h-24 text-[#070c15]" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm text-center">امسح رمز QR بتطبيق Google Authenticator أو Authy</p>
                <Input label="أدخل رمز التحقق (6 أرقام)" type="text" placeholder="000000" maxLength={6} />
                <Button onClick={() => setTwoFaEnabled(true)} className="w-full">
                  <Shield className="w-4 h-4" />
                  تفعيل 2FA
                </Button>
              </div>
            ) : (
              <Button variant="destructive" onClick={() => setTwoFaEnabled(false)} className="w-full">
                تعطيل التحقق بخطوتين
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
