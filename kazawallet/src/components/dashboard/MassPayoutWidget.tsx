"use client";
import { useState, useRef } from "react";
import { Download, Upload, CheckCircle2, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/lib/utils/format";

const MOCK_RECIPIENTS = [
  { name: "أحمد خالد",   identifier: "KW-USER-A1B2C3", amount: 500.00  },
  { name: "سارة محمد",   identifier: "sara@email.com",  amount: 250.00  },
  { name: "محمد علي",    identifier: "KW-USER-D4E5F6", amount: 1000.00 },
  { name: "فاطمة حسن",   identifier: "KW-USER-G7H8I9", amount: 750.00  },
];

const MOCK_HISTORY = [
  { id: "PAY-001", date: "2026-05-10", recipients: 12, total: 8500.00,  status: "COMPLETED" },
  { id: "PAY-002", date: "2026-04-28", recipients:  8, total: 4200.00,  status: "COMPLETED" },
];

const TOTAL = MOCK_RECIPIENTS.reduce((s, r) => s + r.amount, 0);
const FEE   = TOTAL * 0.001;

export function MassPayoutWidget() {
  const [dragging,   setDragging]   = useState(false);
  const [uploaded,   setUploaded]   = useState(false);
  const [executing,  setExecuting]  = useState(false);
  const [executed,   setExecuted]   = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) setUploaded(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setUploaded(true);
  };

  const downloadTemplate = () => {
    const csv = "الاسم,المعرّف,المبلغ\nأحمد خالد,KW-USER-XXXXXX,500\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "mass_payout_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExecute = async () => {
    setExecuting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setExecuting(false);
    setExecuted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Template download */}
      <Card>
        <CardContent className="pt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold mb-1">قالب CSV</p>
            <p className="text-slate-400 text-sm">حمّل القالب وأدخل بيانات المستلمين</p>
          </div>
          <Button variant="secondary" onClick={downloadTemplate}>
            <Download className="w-4 h-4" />
            تحميل القالب
          </Button>
        </CardContent>
      </Card>

      {/* Upload area */}
      <div
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
          dragging
            ? "border-blue-500/60 bg-blue-500/10"
            : uploaded
            ? "border-emerald-500/40 bg-emerald-500/5"
            : "border-white/15 bg-white/2 hover:bg-white/4 hover:border-white/25"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        {uploaded ? (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <p className="text-emerald-400 font-semibold">تم تحميل الملف بنجاح</p>
            <p className="text-slate-500 text-sm">انقر لاستبداله</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-500" />
            <p className="text-slate-300 font-semibold">اسحب ملف CSV هنا</p>
            <p className="text-slate-500 text-sm">أو انقر للاختيار من جهازك</p>
          </>
        )}
      </div>

      {/* Preview table */}
      <Card>
        <CardHeader><CardTitle>معاينة المستلمين</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-right text-slate-400 font-medium pb-3 pr-0 pl-4">#</th>
                  <th className="text-right text-slate-400 font-medium pb-3 pl-4">الاسم</th>
                  <th className="text-right text-slate-400 font-medium pb-3 pl-4">المعرّف</th>
                  <th className="text-left  text-slate-400 font-medium pb-3">المبلغ (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_RECIPIENTS.map((r, i) => (
                  <tr key={r.identifier} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-0 pl-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 pl-4 text-white">{r.name}</td>
                    <td className="py-3 pl-4 text-blue-400 font-mono text-xs">{r.identifier}</td>
                    <td className="py-3 text-left text-emerald-400 font-semibold">{formatAmount(r.amount, "USD")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="pt-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">عدد المستلمين</span>
            <span className="text-white">{MOCK_RECIPIENTS.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">الإجمالي</span>
            <span className="text-white">{formatAmount(TOTAL, "USD")} USD</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">الرسوم (0.1%)</span>
            <span className="text-amber-400">{formatAmount(FEE, "USD")} USD</span>
          </div>
          <div className="h-px bg-white/8" />
          <div className="flex justify-between font-semibold">
            <span className="text-slate-300">الإجمالي الكلي</span>
            <span className="text-white">{formatAmount(TOTAL + FEE, "USD")} USD</span>
          </div>
        </CardContent>
      </Card>

      {executed ? (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <p className="text-emerald-400 font-semibold">تم تنفيذ الدفعة الجماعية بنجاح</p>
            <p className="text-slate-400 text-sm">جارٍ معالجة {MOCK_RECIPIENTS.length} تحويلات</p>
          </div>
        </div>
      ) : (
        <Button className="w-full" size="lg" loading={executing} onClick={handleExecute}>
          تنفيذ الدفعة الجماعية
        </Button>
      )}

      {/* History */}
      <Card>
        <CardHeader><CardTitle>السجل السابق</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {MOCK_HISTORY.map((h) => (
            <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/6 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{h.id}</p>
                  <p className="text-slate-500 text-xs">{h.date} · {h.recipients} مستلم</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-white text-sm font-semibold">{formatAmount(h.total, "USD")} USD</span>
                <Badge variant="success" className="text-[10px] h-4">مكتمل</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
