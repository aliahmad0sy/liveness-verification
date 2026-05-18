"use client";

import { useState } from "react";
import { Copy, RefreshCw, Eye, EyeOff, Code, Webhook, BarChart3, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { id: "overview", label: "نظرة عامة", icon: BarChart3 },
  { id: "api", label: "مفاتيح API", icon: Key },
  { id: "webhook", label: "Webhook", icon: Webhook },
  { id: "integration", label: "التكامل", icon: Code },
];

const mockPayments = [
  { id: "p1", ref: "KW-PAY-001", amount: "250.00", currency: "USD", status: "COMPLETED", date: "منذ 5 دقائق" },
  { id: "p2", ref: "KW-PAY-002", amount: "120.50", currency: "USDT", status: "PENDING", date: "منذ 20 دقيقة" },
  { id: "p3", ref: "KW-PAY-003", amount: "89.99", currency: "USD", status: "COMPLETED", date: "منذ ساعة" },
  { id: "p4", ref: "KW-PAY-004", amount: "500.00", currency: "USD", status: "FAILED", date: "منذ 3 ساعات" },
];

const statusMap: Record<string, "success" | "warning" | "destructive"> = {
  COMPLETED: "success",
  PENDING: "warning",
  FAILED: "destructive",
};

const statusLabels: Record<string, string> = {
  COMPLETED: "مكتمل",
  PENDING: "معلق",
  FAILED: "فشل",
};

const jsCode = `// تكامل JavaScript
const response = await fetch('https://api.kazawallet.com/v1/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY',
    'X-API-Secret': 'YOUR_API_SECRET',
  },
  body: JSON.stringify({
    amount: 100.00,
    currency: 'USD',
    description: 'طلب #1234',
    webhookUrl: 'https://yoursite.com/webhook',
  }),
});
const { paymentUrl } = await response.json();
window.location.href = paymentUrl;`;

export function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showSecret, setShowSecret] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const mockApiKey = "kw_live_xK9mP2nQ8rL5vT4wA1bC";
  const mockApiSecret = "sk_live_7jRmN3hY6pE9qU2wX0dF";

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center",
              activeTab === tab.id
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/20"
                : "text-slate-400 hover:text-white"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "حجم المعاملات", value: "$12,450", sub: "هذا الشهر" },
              { label: "المعاملات", value: "48", sub: "هذا الشهر" },
              { label: "معدل النجاح", value: "94.2%", sub: "آخر 30 يوم" },
              { label: "في الانتظار", value: "$230", sub: "قيد المعالجة" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="text-2xl font-black text-white mb-0.5">{stat.value}</div>
                  <div className="text-xs font-medium text-slate-300">{stat.label}</div>
                  <div className="text-xs text-slate-500">{stat.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">آخر المدفوعات</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {mockPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <div className="text-sm font-medium text-white font-mono">{p.ref}</div>
                      <div className="text-xs text-slate-500">{p.date}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-white">{p.amount} {p.currency}</div>
                      <Badge variant={statusMap[p.status]}>{statusLabels[p.status]}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">مفاتيح API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-sm text-yellow-300">
              احتفظ بمفاتيحك سرية. لا تشاركها مع أي أحد.
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">API Key</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm text-slate-300 overflow-hidden">
                  {mockApiKey}
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => copyToClipboard(mockApiKey, "key")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {copied === "key" && <p className="text-xs text-emerald-400">تم النسخ!</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">API Secret</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm text-slate-300 overflow-hidden">
                  {showSecret ? mockApiSecret : "•".repeat(mockApiSecret.length)}
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => copyToClipboard(mockApiSecret, "secret")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {copied === "secret" && <p className="text-xs text-emerald-400">تم النسخ!</p>}
            </div>

            <Button variant="destructive" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              إعادة توليد المفاتيح
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Webhook Tab */}
      {activeTab === "webhook" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">إعداد Webhook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="رابط Webhook"
              type="url"
              placeholder="https://yoursite.com/kazawallet/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              hint="سيتم إرسال إشعارات المدفوعات إلى هذا العنوان"
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">الأحداث المفعلة</label>
              <div className="space-y-2">
                {[
                  { event: "payment.completed", label: "تم الدفع بنجاح" },
                  { event: "payment.failed", label: "فشل الدفع" },
                  { event: "payment.pending", label: "الدفع معلق" },
                  { event: "refund.completed", label: "تم الاسترداد" },
                ].map((e) => (
                  <label key={e.event} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-500" />
                    <span className="text-sm text-slate-300">{e.label}</span>
                    <code className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{e.event}</code>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" disabled={!webhookUrl}>
                إرسال اختبار
              </Button>
              <Button disabled={!webhookUrl}>
                حفظ الإعدادات
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Tab */}
      {activeTab === "integration" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">تكامل JavaScript</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-[#0d1117] border border-white/10 rounded-xl p-4 overflow-x-auto">
                <pre className="text-xs text-emerald-300 leading-relaxed font-mono whitespace-pre-wrap">{jsCode}</pre>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => copyToClipboard(jsCode, "js")}
              >
                <Copy className="w-3.5 h-3.5" />
                {copied === "js" ? "تم النسخ!" : "نسخ الكود"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">إضافة WordPress / WooCommerce</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                حوّل موقعك WordPress إلى منصة دفع آمنة مع إضافة KazaWallet للـ WooCommerce.
                يدعم أكثر من 70 طريقة دفع.
              </p>
              <Button>
                <Copy className="w-4 h-4" />
                تحميل الإضافة (v2.1.0)
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
