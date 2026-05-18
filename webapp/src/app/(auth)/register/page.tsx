"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Wallet, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    if (form.password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطأ في إنشاء الحساب");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("حدث خطأ. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center px-4 py-12" dir="rtl">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Kaza<span className="text-blue-400">Wallet</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">أنشئ حسابك المجاني</h1>
          <p className="text-slate-400">انضم لمئات الآلاف من المستخدمين</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="الاسم الأول"
                placeholder="محمد"
                value={form.firstName}
                onChange={update("firstName")}
                startIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="الاسم الأخير"
                placeholder="أحمد"
                value={form.lastName}
                onChange={update("lastName")}
                required
              />
            </div>

            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={update("email")}
              startIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <Input
              label="رقم الهاتف (اختياري)"
              type="tel"
              placeholder="+963 xxx xxx xxx"
              value={form.phone}
              onChange={update("phone")}
              startIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="كلمة المرور"
              type={showPassword ? "text" : "password"}
              placeholder="8 أحرف على الأقل"
              value={form.password}
              onChange={update("password")}
              startIcon={<Lock className="w-4 h-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />

            <Input
              label="تأكيد كلمة المرور"
              type={showPassword ? "text" : "password"}
              placeholder="أعد كتابة كلمة المرور"
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              startIcon={<Lock className="w-4 h-4" />}
              required
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="text-xs text-slate-500 leading-relaxed">
              بإنشائك للحساب، أنت توافق على{" "}
              <Link href="/terms" className="text-blue-400 hover:underline">الشروط والأحكام</Link>
              {" "}و{" "}
              <Link href="/privacy" className="text-blue-400 hover:underline">سياسة الخصوصية</Link>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              إنشاء الحساب مجاناً
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-slate-400 text-sm">لديك حساب بالفعل؟ </span>
            <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              سجّل دخولك
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
