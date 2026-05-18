"use client";
import { useState } from "react";
import { Eye, EyeOff, Snowflake, Trash2, Plus, CheckCircle2, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/lib/utils/format";

const MOCK_CARD = {
  id: "card-001",
  last4: "4242",
  number: "4539 •••• •••• 4242",
  fullNumber: "4539 1234 5678 4242",
  holder: "AHMAD KHALID",
  expiry: "12/27",
  cvv: "•••",
  fullCvv: "123",
  balance: 350.00,
  currency: "USD",
  status: "ACTIVE" as "ACTIVE" | "FROZEN",
};

export function CardsManager() {
  const [showDetails, setShowDetails] = useState(false);
  const [frozen, setFrozen]           = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const cardStatus = frozen ? "FROZEN" : MOCK_CARD.status;

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount) return;
    setTopUpLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setTopUpLoading(false);
    setTopUpSuccess(true);
    setTopUpAmount("");
    setTimeout(() => setTopUpSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Visual card */}
      <div
        className={`relative rounded-2xl p-6 overflow-hidden select-none ${
          frozen ? "opacity-60 grayscale" : ""
        }`}
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)",
          minHeight: 200,
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-40 h-40 rounded-full border-2 border-white" />
          <div className="absolute top-10 right-10 w-28 h-28 rounded-full border-2 border-white" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full border-2 border-white" />
        </div>
        <div className="relative">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-white/70 text-xs mb-1">رصيد البطاقة</p>
              <p className="text-white text-2xl font-bold">
                ${formatAmount(MOCK_CARD.balance, "USD")}
              </p>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CreditCard className="w-6 h-6" />
              <span className="font-bold text-lg">VISA</span>
            </div>
          </div>
          <p className="text-white/90 font-mono text-lg tracking-widest mb-4">
            {showDetails ? MOCK_CARD.fullNumber : MOCK_CARD.number}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/60 text-[10px] uppercase mb-0.5">Card Holder</p>
              <p className="text-white text-sm font-semibold">{MOCK_CARD.holder}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-[10px] uppercase mb-0.5">Expires</p>
              <p className="text-white text-sm font-semibold">{MOCK_CARD.expiry}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card actions */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => setShowDetails((v) => !v)}
        >
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showDetails ? "إخفاء التفاصيل" : "إظهار التفاصيل"}
        </Button>
        <Button
          variant={frozen ? "secondary" : "outline"}
          className="flex-1"
          onClick={() => setFrozen((v) => !v)}
        >
          <Snowflake className="w-4 h-4" />
          {frozen ? "إلغاء التجميد" : "تجميد البطاقة"}
        </Button>
        <Button variant="destructive" size="icon">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Info panel */}
      <Card>
        <CardHeader><CardTitle>معلومات البطاقة</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/3 p-4">
              <p className="text-slate-500 text-xs mb-1">الحالة</p>
              <Badge variant={cardStatus === "ACTIVE" ? "success" : "warning"}>
                {cardStatus === "ACTIVE" ? "نشطة" : "مجمّدة"}
              </Badge>
            </div>
            <div className="rounded-xl bg-white/3 p-4">
              <p className="text-slate-500 text-xs mb-1">رقم البطاقة</p>
              <p className="text-white text-sm font-mono">
                {showDetails ? MOCK_CARD.fullNumber : `•••• •••• •••• ${MOCK_CARD.last4}`}
              </p>
            </div>
            <div className="rounded-xl bg-white/3 p-4">
              <p className="text-slate-500 text-xs mb-1">CVV</p>
              <p className="text-white text-sm font-mono">
                {showDetails ? MOCK_CARD.fullCvv : MOCK_CARD.cvv}
              </p>
            </div>
            <div className="rounded-xl bg-white/3 p-4">
              <p className="text-slate-500 text-xs mb-1">الرصيد</p>
              <p className="text-white text-sm font-semibold">
                ${formatAmount(MOCK_CARD.balance, "USD")}
              </p>
            </div>
          </div>

          {/* Feature badges */}
          <div className="flex gap-2 pt-2">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs">3D Secure</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs">Google Pay</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top-up */}
      <Card>
        <CardHeader><CardTitle>شحن البطاقة</CardTitle></CardHeader>
        <CardContent>
          {topUpSuccess && (
            <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-emerald-400 text-sm">تم شحن البطاقة بنجاح!</p>
            </div>
          )}
          <form onSubmit={handleTopUp} className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                min={1}
                placeholder="أدخل مبلغ الشحن (USD)"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                required
              />
            </div>
            <Button type="submit" loading={topUpLoading}>شحن</Button>
          </form>
        </CardContent>
      </Card>

      {/* Add new card */}
      <Button variant="secondary" className="w-full" size="lg">
        <Plus className="w-5 h-5" />
        إضافة بطاقة جديدة ($5)
      </Button>
    </div>
  );
}
