"use client";
import { useState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/lib/utils/format";
import { CURRENCIES, TRANSFER_FEE_RATE } from "@/lib/constants";

type Status = "idle" | "loading" | "success" | "error";

export function SendForm() {
  const [recipient, setRecipient] = useState("");
  const [currency, setCurrency]   = useState("USD");
  const [amount, setAmount]       = useState("");
  const [note, setNote]           = useState("");
  const [status, setStatus]       = useState<Status>("idle");
  const [reference, setReference] = useState("");
  const [errorMsg, setErrorMsg]   = useState("");

  const numAmount = parseFloat(amount || "0");
  const fee       = numAmount * TRANSFER_FEE_RATE;
  const total     = numAmount + fee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount || numAmount <= 0) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/transactions/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, currency, amount: numAmount, note }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReference(data.data?.reference ?? `KW-${Date.now()}`);
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "حدث خطأ، يرجى المحاولة مجدداً");
        setStatus("error");
      }
    } catch {
      setErrorMsg("تعذّر الاتصال بالخادم");
      setStatus("error");
    }
  };

  const reset = () => {
    setRecipient(""); setCurrency("USD"); setAmount(""); setNote("");
    setStatus("idle"); setReference(""); setErrorMsg("");
  };

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center p-8">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">تم الإرسال بنجاح!</h2>
          <p className="text-slate-400 text-sm mb-4">تم تحويل {formatAmount(numAmount, currency)} {currency} إلى {recipient}</p>
          <div className="rounded-xl bg-white/4 border border-white/8 p-4 mb-6">
            <p className="text-slate-400 text-xs mb-1">رقم المرجع</p>
            <p className="text-blue-400 font-mono font-bold">{reference}</p>
          </div>
          <Button variant="secondary" onClick={reset} className="w-full">إرسال تحويل جديد</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader><CardTitle>إرسال أموال</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && (
              <div className="flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </div>
            )}

            <Input
              label="المستلم (بريد إلكتروني أو كود KW)"
              placeholder="example@email.com أو KW-USER-XXXXXX"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">العملة</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0b1120]">
                    {c.emoji} {c.code} — {c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="المبلغ"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <Input
              label="ملاحظة (اختياري)"
              placeholder="أضف ملاحظة…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {numAmount > 0 && (
              <div className="rounded-xl bg-white/3 border border-white/8 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">المبلغ</span>
                  <span className="text-white">{formatAmount(numAmount, currency)} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الرسوم (0.1%)</span>
                  <span className="text-amber-400">{formatAmount(fee, currency)} {currency}</span>
                </div>
                <div className="h-px bg-white/8" />
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">الإجمالي</span>
                  <span className="text-white">{formatAmount(total, currency)} {currency}</span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={status === "loading"}>
              <Send className="w-4 h-4" />
              إرسال الآن
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
