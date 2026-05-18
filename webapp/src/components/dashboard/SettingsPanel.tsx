"use client";

import { useState } from "react";
import { User, Shield, Bell, Settings2, Eye, EyeOff, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { id: "profile", label: "الملف الشخصي", icon: User },
  { id: "security", label: "الأمان", icon: Shield },
  { id: "notifications", label: "الإشعارات", icon: Bell },
  { id: "preferences", label: "التفضيلات", icon: Settings2 },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors",
        checked ? "bg-blue-500" : "bg-white/20"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [notifications, setNotifications] = useState({
    emailTransfer: true,
    emailExchange: true,
    emailSecurity: true,
    smsTransfer: false,
    smsLogin: true,
  });
  const [profile, setProfile] = useState({
    firstName: "محمد",
    lastName: "أحمد",
    email: "mohammed@example.com",
    phone: "+963 933 123 456",
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Tabs */}
      <div className="lg:w-56 flex-shrink-0">
        <div className="flex lg:flex-col gap-1 bg-white/5 border border-white/10 rounded-2xl p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-right w-full",
                activeTab === tab.id
                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        {/* Profile */}
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl font-bold text-white">
                  م
                </div>
                <Button variant="secondary" size="sm">تغيير الصورة</Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="الاسم الأول"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                />
                <Input
                  label="الاسم الأخير"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                />
              </div>
              <Input
                label="البريد الإلكتروني"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <Input
                label="رقم الهاتف"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">الدولة</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  <option value="SY" className="bg-[#1a2035]">🇸🇾 سوريا</option>
                  <option value="SA" className="bg-[#1a2035]">🇸🇦 المملكة العربية السعودية</option>
                  <option value="AE" className="bg-[#1a2035]">🇦🇪 الإمارات</option>
                  <option value="EG" className="bg-[#1a2035]">🇪🇬 مصر</option>
                  <option value="TR" className="bg-[#1a2035]">🇹🇷 تركيا</option>
                </select>
              </div>

              <Button>حفظ التغييرات</Button>
            </CardContent>
          </Card>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">تغيير كلمة المرور</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="كلمة المرور الحالية"
                  type={showOldPw ? "text" : "password"}
                  placeholder="••••••••"
                  endIcon={
                    <button onClick={() => setShowOldPw(!showOldPw)} className="hover:text-white">
                      {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                <Input
                  label="كلمة المرور الجديدة"
                  type={showNewPw ? "text" : "password"}
                  placeholder="8 أحرف على الأقل"
                  endIcon={
                    <button onClick={() => setShowNewPw(!showNewPw)} className="hover:text-white">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                <Input
                  label="تأكيد كلمة المرور الجديدة"
                  type="password"
                  placeholder="••••••••"
                />
                <Button>تحديث كلمة المرور</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  المصادقة الثنائية (2FA)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">
                      {twoFA ? "مفعّلة" : "غير مفعّلة"}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      أضف طبقة أمان إضافية لحسابك
                    </p>
                  </div>
                  <Toggle checked={twoFA} onChange={setTwoFA} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">الجلسات النشطة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { device: "Chrome — Windows", ip: "192.168.1.1", time: "الآن", current: true },
                  { device: "Safari — iPhone 14", ip: "84.235.12.45", time: "منذ ساعتين", current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{session.device}</p>
                      <p className="text-xs text-slate-500">{session.ip} • {session.time}</p>
                    </div>
                    {session.current ? (
                      <span className="text-xs text-emerald-400 font-medium">الجلسة الحالية</span>
                    ) : (
                      <Button variant="destructive" size="sm">إنهاء</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">إشعارات البريد الإلكتروني</h4>
                <div className="space-y-3">
                  {[
                    { key: "emailTransfer", label: "التحويلات والمدفوعات" },
                    { key: "emailExchange", label: "تبادل العملات" },
                    { key: "emailSecurity", label: "تنبيهات الأمان" },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{n.label}</span>
                      <Toggle
                        checked={notifications[n.key as keyof typeof notifications]}
                        onChange={(v) => setNotifications({ ...notifications, [n.key]: v })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white mb-3">إشعارات SMS</h4>
                <div className="space-y-3">
                  {[
                    { key: "smsTransfer", label: "التحويلات الكبيرة (+$100)" },
                    { key: "smsLogin", label: "تسجيل الدخول من جهاز جديد" },
                  ].map((n) => (
                    <div key={n.key} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{n.label}</span>
                      <Toggle
                        checked={notifications[n.key as keyof typeof notifications]}
                        onChange={(v) => setNotifications({ ...notifications, [n.key]: v })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button>حفظ الإعدادات</Button>
            </CardContent>
          </Card>
        )}

        {/* Preferences */}
        {activeTab === "preferences" && (
          <Card>
            <CardHeader>
              <CardTitle>التفضيلات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">اللغة</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  <option value="ar" className="bg-[#1a2035]">العربية</option>
                  <option value="en" className="bg-[#1a2035]">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">العملة الافتراضية</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none">
                  <option value="USD" className="bg-[#1a2035]">🇺🇸 دولار أمريكي (USD)</option>
                  <option value="EUR" className="bg-[#1a2035]">🇪🇺 يورو (EUR)</option>
                  <option value="SAR" className="bg-[#1a2035]">🇸🇦 ريال سعودي (SAR)</option>
                  <option value="AED" className="bg-[#1a2035]">🇦🇪 درهم إماراتي (AED)</option>
                </select>
              </div>

              <Button>حفظ التفضيلات</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
