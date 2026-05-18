"use client";

import { useState } from "react";
import {
  Send,
  User,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CURRENCIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type Status = "idle" | "loading" | "success" | "error";

export function SendMoneyForm() {
  const [recipient, setRecipient] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [amountError, setAmountError] = useState("");

  const fee = amount && !isNaN(parseFloat(amount)) ? parseFloat(amount) * 0.001 : 0;
  const total = amount && !isNaN(parseFloat(amount)) ? parseFloat(amount) + fee : 0;

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency);

  function validate() {
    let valid = true;
    setRecipientError("");
    setAmountError("");

    if (!recipient.trim()) {
      setRecipientError("يرجى إدخال اسم المستخدم أو البريد الإلكتروني");
      valid = false;
    }
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setAmountError("يرجى إدخال مبلغ صحيح أكبر من صفر");
      valid = false;
    }
    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/transactions/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: recipient.trim(),
          currency,
          amount: parseFloat(amount),
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "حدث خطأ أثناء إرسال الأموال");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    }
  }

  function handleReset() {
    setRecipient("");
    setCurrency("USD");
    setAmount("");
    setDescription("");
    setStatus("idle");
    setErrorMsg("");
    setRecipientError("");
    setAmountError("");
  }

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="p-10 flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">تم الإرسال بنجاح!</h2>
            <p className="text-slate-400">
              تم إرسال{" "}
              <span className="text-white font-semibold">
                {formatCurrency(amount, currency)} {currency}
              </span>{" "}
              إلى{" "}
              <span className="text-white font-semibold">{recipient}</span>
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full text-sm text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>المبلغ المُرسَل</span>
                <span className="text-white">{formatCurrency(amount, currency)} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم التحويل (0.1%)</span>
                <span className="text-white">{formatCurrency(fee, currency)} {currency}</span>
              </div>
            </div>
            <Button className="w-full mt-2" onClick={handleReset}>
              إرسال مرة أخرى
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-400" />
            تفاصيل التحويل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Recipient */}
            <Input
              label="المستلم"
              placeholder="اسم المستخدم أو البريد الإلكتروني"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              error={recipientError}
              startIcon={<User className="w-4 h-4" />}
              dir="ltr"
            />

            {/* Currency Selector */}
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                العملة
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#1a2035]">
                    {c.emoji} {c.code} — {c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <Input
              label="المبلغ"
              type="number"
              placeholder="0.00"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={amountError}
              startIcon={<DollarSign className="w-4 h-4" />}
              hint={
                selectedCurrency
                  ? `رصيدك المتاح: ${formatCurrency(2500, currency)} ${currency}`
                  : undefined
              }
              dir="ltr"
            />

            {/* Note */}
            <Input
              label="ملاحظة (اختياري)"
              placeholder="سبب التحويل..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              startIcon={<FileText className="w-4 h-4" />}
            />

            {/* Fee Display */}
            {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
              <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex items-center gap-1.5 text-slate-400 mb-3">
                  <Info className="w-3.5 h-3.5" />
                  <span className="text-xs">تفاصيل العملية</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>المبلغ</span>
                  <span className="text-white font-medium">
                    {formatCurrency(amount, currency)} {currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>رسوم التحويل (0.1%)</span>
                  <span className="text-white font-medium">
                    {formatCurrency(fee, currency)} {currency}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                  <span className="text-slate-300">الإجمالي المخصوم</span>
                  <span className="text-white">
                    {formatCurrency(total, currency)} {currency}
                  </span>
                </div>
              </div>
            )}

            {/* Error */}
            {status === "error" && errorMsg && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={status === "loading"}
              disabled={!recipient || !amount || parseFloat(amount) <= 0}
            >
              <Send className="w-4 h-4" />
              إرسال الأموال
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="mt-4 flex items-start gap-2 bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3 text-xs text-blue-300">
        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <span>
          التحويلات الداخلية فورية. التحويلات الخارجية قد تستغرق من 1-3 أيام عمل. رسوم التحويل 0.1% بحد أدنى $0.50.
        </span>
      </div>
    </div>
  );
}
