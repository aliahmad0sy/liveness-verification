"use client";
import { useState } from "react";
import { Copy, Share2, QrCode, CheckCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type Tab = "USD" | "USDT" | "BTC";

const TABS: { value: Tab; label: string }[] = [
  { value: "USD",  label: "🇺🇸 USD"  },
  { value: "USDT", label: "💰 USDT" },
  { value: "BTC",  label: "₿ BTC"   },
];

const DEPOSIT_INFO: Record<Tab, { type: "wallet" | "crypto"; value: string; network?: string }> = {
  USD:  { type: "wallet", value: "KW-USER-A1B2C3" },
  USDT: { type: "crypto", value: "TDrJ2v3YXqxJVDhwGF9nJZ2KqJ8oKDrpLX", network: "TRC20" },
  BTC:  { type: "crypto", value: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "Bitcoin" },
};

export function ReceiveWidget() {
  const [tab, setTab]     = useState<Tab>("USD");
  const [copied, setCopied] = useState(false);

  const info = DEPOSIT_INFO[tab];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(info.value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "معلومات الإيداع", text: info.value }).catch(() => {});
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader><CardTitle>استقبال أموال</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
            {TABS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={cn(
                  "flex-1 h-9 rounded-lg text-sm font-medium transition-all",
                  tab === value ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* QR code placeholder */}
          <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/3 h-48">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <QrCode className="w-16 h-16" />
              <span className="text-xs">رمز QR</span>
            </div>
          </div>

          {/* Address / wallet ID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">
                {info.type === "wallet" ? "معرّف المحفظة" : "عنوان الإيداع"}
              </span>
              {info.network && (
                <Badge variant="warning" className="text-xs">{info.network}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
              <code className="flex-1 text-blue-300 text-sm font-mono break-all">{info.value}</code>
              <button
                onClick={copyToClipboard}
                className="shrink-0 w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/14 transition-all"
              >
                {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={copyToClipboard}>
              {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "تم النسخ!" : "نسخ"}
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              مشاركة
            </Button>
          </div>

          {/* Instructions */}
          <div className="rounded-xl bg-blue-500/8 border border-blue-500/20 p-4">
            <p className="text-blue-300 text-sm font-semibold mb-2">تعليمات الإيداع</p>
            {tab === "USD" ? (
              <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
                <li>أرسل المبلغ باستخدام معرّف المحفظة أعلاه</li>
                <li>يتم تأكيد الإيداع فوراً</li>
                <li>لا توجد رسوم على الإيداع</li>
              </ul>
            ) : tab === "USDT" ? (
              <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
                <li>تأكد من استخدام شبكة TRC20 (TRON)</li>
                <li>يتطلب 10 تأكيدات على الشبكة</li>
                <li>الحد الأدنى: 5 USDT</li>
              </ul>
            ) : (
              <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
                <li>تأكد من إرسال BTC فقط على شبكة Bitcoin</li>
                <li>يتطلب 3 تأكيدات على الشبكة</li>
                <li>الحد الأدنى: 0.0001 BTC</li>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
