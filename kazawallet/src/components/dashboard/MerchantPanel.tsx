"use client";
import { useState } from "react";
import { Copy, RefreshCw, CheckCheck, Download, Play } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { formatAmount } from "@/lib/utils/format";

type Tab = "overview" | "api" | "webhook" | "integration";
const TABS: { value: Tab; label: string }[] = [
  { value: "overview",    label: "نظرة عامة"  },
  { value: "api",         label: "مفاتيح API" },
  { value: "webhook",     label: "Webhook"    },
  { value: "integration", label: "التكامل"    },
];

const STATS = [
  { label: "إجمالي المبيعات", value: "$12,450", change: "+18%" },
  { label: "المعاملات",       value: "248",      change: "+12%" },
  { label: "متوسط الطلب",    value: "$50.2",    change: "+3%"  },
  { label: "العملاء",         value: "89",       change: "+7%"  },
];

const RECENT_PAYMENTS = [
  { ref: "PAY-001", customer: "أحمد خالد",    amount: 150.00, status: "COMPLETED", date: "قبل 5 دقائق"  },
  { ref: "PAY-002", customer: "سارة محمد",    amount:  89.99, status: "COMPLETED", date: "قبل 22 دقيقة" },
  { ref: "PAY-003", customer: "محمد علي",     amount: 200.00, status: "PENDING",   date: "قبل ساعة"      },
  { ref: "PAY-004", customer: "فاطمة حسن",   amount:  45.00, status: "FAILED",    date: "قبل ساعتين"    },
];

const STATUS_BADGE: Record<string, "success" | "warning" | "destructive"> = {
  COMPLETED: "success", PENDING: "warning", FAILED: "destructive",
};
const STATUS_AR = { COMPLETED: "مكتمل", PENDING: "معلق", FAILED: "فشل" } as Record<string, string>;

const WEBHOOK_EVENTS = [
  "payment.completed", "payment.failed", "payment.pending",
  "refund.created", "dispute.opened",
];

const JS_SNIPPET = `<!-- KazaWallet Payment Button -->
<script src="https://js.kazawallet.com/v1/checkout.js"></script>
<button
  data-kw-key="pk_live_xxxxxxxxxxxx"
  data-kw-amount="5000"
  data-kw-currency="USD"
  data-kw-name="اسم المنتج"
>
  ادفع الآن
</button>`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/14 transition-all shrink-0">
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function MerchantPanel() {
  const [tab, setTab]             = useState<Tab>("overview");
  const [webhookUrl, setWebhookUrl] = useState("https://yoursite.com/webhook/kaza");
  const [events, setEvents]       = useState<string[]>(["payment.completed", "payment.failed"]);
  const [testLoading, setTestLoading] = useState(false);
  const [testOk, setTestOk]       = useState(false);

  const toggleEvent = (ev: string) =>
    setEvents((prev) => prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]);

  const handleTest = async () => {
    setTestLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setTestLoading(false);
    setTestOk(true);
    setTimeout(() => setTestOk(false), 3000);
  };

  const copySnippet = async () => {
    await navigator.clipboard.writeText(JS_SNIPPET).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
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

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-5">
                  <p className="text-slate-400 text-xs mb-2">{s.label}</p>
                  <p className="text-white text-xl font-bold">{s.value}</p>
                  <p className="text-emerald-400 text-xs mt-1">{s.change} هذا الشهر</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle>آخر المدفوعات</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1">
                {RECENT_PAYMENTS.map((p) => (
                  <div key={p.ref} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/4 transition-colors">
                    <div>
                      <p className="text-white text-sm font-medium">{p.customer}</p>
                      <p className="text-slate-500 text-xs">{p.ref} · {p.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white text-sm font-semibold">{formatAmount(p.amount, "USD")} USD</span>
                      <Badge variant={STATUS_BADGE[p.status]}>{STATUS_AR[p.status]}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Keys */}
      {tab === "api" && (
        <div className="max-w-2xl space-y-4">
          <Card>
            <CardHeader><CardTitle>مفاتيح API</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "مفتاح النشر (Public Key)", value: "pk_live_xxxxxxxxxxxxxxxxxxxx" },
                { label: "المفتاح السري (Secret Key)", value: "sk_live_••••••••••••••••••••" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-slate-400 text-sm mb-2">{label}</p>
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                    <code className="flex-1 text-blue-300 text-sm font-mono truncate">{value}</code>
                    <CopyButton text={value} />
                  </div>
                </div>
              ))}
              <Button variant="secondary" className="w-full">
                <RefreshCw className="w-4 h-4" />
                إعادة توليد المفاتيح
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Webhook */}
      {tab === "webhook" && (
        <div className="max-w-2xl space-y-4">
          <Card>
            <CardHeader><CardTitle>إعدادات Webhook</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <Input
                label="رابط Webhook"
                placeholder="https://yoursite.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <div>
                <p className="text-slate-300 text-sm font-medium mb-3">الأحداث المراقبة</p>
                <div className="space-y-2">
                  {WEBHOOK_EVENTS.map((ev) => (
                    <label key={ev} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={events.includes(ev)}
                        onChange={() => toggleEvent(ev)}
                        className="w-4 h-4 rounded accent-blue-500"
                      />
                      <span className="text-slate-300 text-sm font-mono group-hover:text-white transition-colors">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1">حفظ الإعدادات</Button>
                <Button variant="secondary" loading={testLoading} onClick={handleTest}>
                  <Play className="w-4 h-4" />
                  {testOk ? "تم الإرسال ✓" : "اختبار"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integration */}
      {tab === "integration" && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>كود JavaScript</CardTitle>
                <Button variant="secondary" size="sm" onClick={copySnippet}>
                  <Copy className="w-3.5 h-3.5" />
                  نسخ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="rounded-xl bg-[#070c15] border border-white/10 p-4 text-xs text-slate-300 overflow-x-auto font-mono leading-relaxed">
                {JS_SNIPPET}
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>WordPress Plugin</CardTitle></CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">ثبّت إضافة WooCommerce لقبول المدفوعات تلقائياً</p>
              <Button variant="secondary">
                <Download className="w-4 h-4" />
                تحميل الإضافة (.zip)
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
