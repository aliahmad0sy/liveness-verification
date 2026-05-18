"use client";
import { useState } from "react";
import { User, Save, Shield, Smartphone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { CURRENCIES } from "@/lib/constants";

type Tab = "profile" | "security" | "notifications" | "preferences";
const TABS: { value: Tab; label: string }[] = [
  { value: "profile",       label: "الملف الشخصي" },
  { value: "security",      label: "الأمان"        },
  { value: "notifications", label: "الإشعارات"     },
  { value: "preferences",   label: "التفضيلات"     },
];

const NOTIF_PREFS = [
  { key: "receive",  label: "استلام تحويل",    defaultOn: true  },
  { key: "send",     label: "إرسال تحويل",     defaultOn: true  },
  { key: "exchange", label: "تبادل العملات",   defaultOn: false },
  { key: "security", label: "تنبيهات الأمان",  defaultOn: true  },
  { key: "promo",    label: "العروض والأخبار",  defaultOn: false },
];

const MOCK_SESSIONS = [
  { id: "s1", device: "Chrome — Windows 11",   location: "دمشق، سوريا",     current: true,  time: "الآن"       },
  { id: "s2", device: "Safari — iPhone 14",    location: "الرياض، السعودية", current: false, time: "قبل 3 أيام" },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors shrink-0",
        checked ? "bg-blue-600" : "bg-white/10"
      )}
    >
      <span
        className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
          checked ? "right-1" : "right-6"
        )}
      />
    </button>
  );
}

export function SettingsPanel() {
  const [tab, setTab]       = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  /* Profile */
  const [firstName, setFirstName] = useState("أحمد");
  const [lastName,  setLastName]  = useState("خالد");
  const [email,     setEmail]     = useState("ahmad@example.com");
  const [phone,     setPhone]     = useState("+963 912 345 678");
  const [country,   setCountry]   = useState("سوريا");

  /* Security */
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError,   setPwError]   = useState("");
  const [twoFaOn,   setTwoFaOn]   = useState(false);

  /* Notifications */
  const [nEmail, setNEmail] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_PREFS.map((n) => [n.key, n.defaultOn]))
  );
  const [nSMS, setNSMS] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_PREFS.map((n) => [n.key, n.key !== "promo"]))
  );

  /* Preferences */
  const [lang,    setLang]    = useState("ar");
  const [defCurr, setDefCurr] = useState("USD");

  const save = async () => {
    if (tab === "security") {
      if (newPw && newPw !== confirmPw) { setPwError("كلمتا المرور غير متطابقتين"); return; }
      if (newPw && newPw.length < 8)    { setPwError("يجب ألا تقل كلمة المرور عن 8 أحرف"); return; }
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
      <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8 overflow-x-auto w-fit">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              "px-4 h-9 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              tab === value ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Profile ── */}
      {tab === "profile" && (
        <Card>
          <CardHeader><CardTitle>معلومات الحساب</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-white" />
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">الدولة</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {["سوريا","السعودية","الإمارات","مصر","تركيا","الأردن","العراق","لبنان","المغرب","تونس"].map((c) => (
                  <option key={c} value={c} className="bg-[#0b1120]">{c}</option>
                ))}
              </select>
            </div>
            <Button onClick={save} loading={saving} className="w-full">
              <Save className="w-4 h-4" />
              {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Security ── */}
      {tab === "security" && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>تغيير كلمة المرور</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {pwError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-sm">{pwError}</div>
              )}
              <Input label="كلمة المرور الحالية" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
              <Input label="كلمة المرور الجديدة" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} hint="8 أحرف على الأقل" />
              <Input label="تأكيد كلمة المرور"   type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
              <Button onClick={save} loading={saving} className="w-full">
                <Shield className="w-4 h-4" />
                {saved ? "تم التحديث ✓" : "تحديث كلمة المرور"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">التحقق بخطوتين (2FA)</p>
                <p className="text-slate-400 text-sm mt-0.5">تأمين إضافي عبر تطبيق المصادقة</p>
              </div>
              <Toggle checked={twoFaOn} onChange={setTwoFaOn} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>الجلسات النشطة</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {MOCK_SESSIONS.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">{s.device}</p>
                      <p className="text-slate-500 text-xs">{s.location} · {s.time}</p>
                    </div>
                  </div>
                  {s.current ? (
                    <span className="text-emerald-400 text-xs font-semibold">الجلسة الحالية</span>
                  ) : (
                    <Button variant="destructive" size="sm" className="text-xs h-7">إنهاء</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Notifications ── */}
      {tab === "notifications" && (
        <Card>
          <CardHeader><CardTitle>تفضيلات الإشعارات</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-right text-slate-400 font-medium pb-3 pl-8">الحدث</th>
                    <th className="text-center text-slate-400 font-medium pb-3 px-4">بريد إلكتروني</th>
                    <th className="text-center text-slate-400 font-medium pb-3">رسالة SMS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {NOTIF_PREFS.map(({ key, label }) => (
                    <tr key={key} className="hover:bg-white/3 transition-colors">
                      <td className="py-4 pl-8 text-white">{label}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          <Toggle checked={nEmail[key]} onChange={(v) => setNEmail((n) => ({ ...n, [key]: v }))} />
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center">
                          <Toggle checked={nSMS[key]} onChange={(v) => setNSMS((n) => ({ ...n, [key]: v }))} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button onClick={save} loading={saving} className="w-full">
                <Save className="w-4 h-4" />
                {saved ? "تم الحفظ ✓" : "حفظ إعدادات الإشعارات"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Preferences ── */}
      {tab === "preferences" && (
        <Card>
          <CardHeader><CardTitle>التفضيلات</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">اللغة</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="ar" className="bg-[#0b1120]">🇸🇦 العربية</option>
                <option value="en" className="bg-[#0b1120]">🇺🇸 English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">العملة الافتراضية</label>
              <select
                value={defCurr}
                onChange={(e) => setDefCurr(e.target.value)}
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0b1120]">
                    {c.emoji} {c.code} — {c.nameAr}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={save} loading={saving} className="w-full">
              <Save className="w-4 h-4" />
              {saved ? "تم الحفظ ✓" : "حفظ التفضيلات"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
