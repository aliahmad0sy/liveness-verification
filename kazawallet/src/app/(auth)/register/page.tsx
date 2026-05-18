"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين. يرجى التحقق والمحاولة مجدداً.");
      return;
    }

    if (!agreedToTerms) {
      setError("يجب الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070c15] flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59,130,246,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">
              Kaza<span className="text-blue-400">Wallet</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">انضم إلينا مجاناً</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 text-center">
              إنشاء حساب جديد
            </h2>

            {/* Error box */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-slate-300"
                  >
                    الاسم الأول
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="محمد"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-slate-300"
                  >
                    اسم العائلة
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="أحمد"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-300"
                >
                  البريد الإلكتروني
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>

              {/* Phone (optional) */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-slate-300"
                >
                  رقم الهاتف{" "}
                  <span className="text-slate-600 text-xs font-normal">
                    (اختياري)
                  </span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+966 5X XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-300"
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-300"
                >
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showConfirm ? "إخفاء التأكيد" : "إظهار التأكيد"}
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group mt-1">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-blue-500 cursor-pointer shrink-0"
                />
                <span className="text-sm text-slate-400 leading-relaxed">
                  أوافق على{" "}
                  <Link
                    href="/terms"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                    target="_blank"
                  >
                    شروط الاستخدام
                  </Link>{" "}
                  و{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                    target="_blank"
                  >
                    سياسة الخصوصية
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full mt-2"
              >
                إنشاء الحساب
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              لديك حساب بالفعل؟{" "}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                تسجيل الدخول
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
