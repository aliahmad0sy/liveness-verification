"use client";

import { useState } from "react";
import { Plus, Eye, EyeOff, Snowflake, Trash2, CreditCard, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { maskCardNumber } from "@/lib/utils/format";

const mockCards = [
  {
    id: "1",
    maskedNumber: "4532 **** **** 7890",
    cardHolder: "Mohammed Ahmad",
    expiryMonth: 12,
    expiryYear: 2027,
    balance: "850.00",
    status: "ACTIVE" as const,
    network: "VISA",
    color: "from-blue-600 to-indigo-700",
  },
];

function VirtualCard({
  card,
  showDetails,
}: {
  card: (typeof mockCards)[0];
  showDetails: boolean;
}) {
  return (
    <div
      className={`relative w-full max-w-sm h-48 rounded-3xl bg-gradient-to-br ${card.color} p-6 shadow-2xl shadow-blue-900/40 overflow-hidden`}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
      <div className="absolute -bottom-12 -left-8 w-48 h-48 bg-white/5 rounded-full" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-white/60 text-xs mb-1">KazaWallet</div>
            <div className="text-white font-bold text-lg">Virtual Card</div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs">الرصيد</div>
            <div className="text-white font-bold">${card.balance}</div>
          </div>
        </div>

        <div>
          <div className="font-mono text-white text-lg tracking-widest mb-3">
            {showDetails ? card.maskedNumber : "•••• •••• •••• 7890"}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-white/60 text-xs">صاحب البطاقة</div>
              <div className="text-white text-sm font-semibold">{card.cardHolder}</div>
            </div>
            <div className="text-left">
              <div className="text-white/60 text-xs">تنتهي</div>
              <div className="text-white text-sm font-mono">
                {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).slice(-2)}
              </div>
            </div>
            <div className="text-2xl font-bold italic text-white/80">{card.network}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardsManager() {
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      {mockCards.length === 0 ? (
        // Empty state
        <Card className="text-center py-16">
          <CardContent>
            <CreditCard className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">لا توجد بطاقات بعد</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              احصل على بطاقتك الافتراضية الدولية برسوم إصدار $5 مرة واحدة فقط.
              ادفع في ملايين المتاجر حول العالم.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              إنشاء بطاقتي الأولى
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card display */}
          <div className="space-y-4">
            <VirtualCard card={mockCards[0]} showDetails={showDetails} />

            {/* Card actions */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showDetails ? "إخفاء التفاصيل" : "إظهار التفاصيل"}
              </Button>
              <Button variant="secondary" size="sm">
                <Snowflake className="w-4 h-4" />
                تجميد
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Card info and actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">معلومات البطاقة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">الحالة</span>
                  <Badge variant="success">نشطة</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">رقم البطاقة</span>
                  <span className="text-sm text-white font-mono">
                    {showDetails ? "4532 1234 5678 7890" : "•••• •••• •••• 7890"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">CVV</span>
                  <span className="text-sm text-white font-mono">{showDetails ? "123" : "•••"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">الرصيد</span>
                  <span className="text-sm font-bold text-white">$850.00</span>
                </div>
              </CardContent>
            </Card>

            {/* Top up */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">شحن البطاقة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4">
                  <label className="text-xs text-slate-500 mb-2 block">المبلغ (USD)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="10"
                    className="w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-slate-600"
                  />
                </div>
                <Button className="w-full">
                  <Plus className="w-4 h-4" />
                  شحن البطاقة
                </Button>
              </CardContent>
            </Card>

            {/* Card features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <Lock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-xs text-slate-400">3D Secure</div>
                <div className="text-xs text-emerald-400 font-semibold">مفعّل</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <Globe className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-xs text-slate-400">قبول عالمي</div>
                <div className="text-xs text-emerald-400 font-semibold">متاح</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create card CTA (if has card, show add another) */}
      {mockCards.length > 0 && (
        <Button variant="secondary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          إضافة بطاقة جديدة ($5)
        </Button>
      )}
    </div>
  );
}
