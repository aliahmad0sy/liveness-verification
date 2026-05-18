"use client";

import { useState } from "react";
import { Upload, Download, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const mockRecipients = [
  { id: "1", name: "أحمد محمد", identifier: "ahmed@example.com", amount: "100.00", status: "pending" },
  { id: "2", name: "سارة علي", identifier: "KW-SARA01", amount: "250.00", status: "pending" },
  { id: "3", name: "محمد حسن", identifier: "KW-MHSN02", amount: "75.50", status: "pending" },
  { id: "4", name: "فاطمة خالد", identifier: "fatima@mail.com", amount: "180.00", status: "pending" },
];

const mockHistory = [
  { id: "mp1", name: "رواتب ديسمبر", total: "5,200.00", count: 18, status: "COMPLETED", date: "2024-12-01" },
  { id: "mp2", name: "مكافآت نوفمبر", total: "1,800.00", count: 6, status: "COMPLETED", date: "2024-11-15" },
];

export function MassPayoutWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);

  const totalAmount = mockRecipients.reduce((s, r) => s + parseFloat(r.amount), 0);

  function downloadTemplate() {
    const csv = "الاسم,المعرف (بريد أو كود KW),المبلغ,العملة,الوصف\nأحمد محمد,ahmed@example.com,100,USD,راتب\n";
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kazawallet-mass-payout-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExecute() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    setLoading(false);
    alert("تم إرسال جميع المدفوعات بنجاح!");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">رفع ملف المستلمين</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Download template */}
              <Button variant="secondary" className="w-full" onClick={downloadTemplate}>
                <Download className="w-4 h-4" />
                تحميل نموذج Excel/CSV
              </Button>

              {/* Upload area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                  file
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-white/20 hover:border-blue-500/40 hover:bg-white/3"
                )}
                onClick={() => document.getElementById("payout-file")?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = e.dataTransfer.files[0];
                  if (dropped) {
                    setFile(dropped);
                    setShowPreview(true);
                  }
                }}
              >
                {file ? (
                  <>
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-emerald-300 font-medium">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">تم تحميل الملف بنجاح</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-300 font-medium">اسحب وأفلت الملف هنا</p>
                    <p className="text-xs text-slate-500 mt-1">أو اضغط لاختيار الملف (CSV, XLSX)</p>
                  </>
                )}
                <input
                  id="payout-file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                      setShowPreview(true);
                    }
                  }}
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">العملة</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="USD" className="bg-[#1a2035]">🇺🇸 دولار أمريكي (USD)</option>
                  <option value="USDT" className="bg-[#1a2035]">💰 تيثر (USDT)</option>
                  <option value="EUR" className="bg-[#1a2035]">🇪🇺 يورو (EUR)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {showPreview && (
            <Card className="border-blue-500/20">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">عدد المستلمين</span>
                  <span className="text-white font-bold">{mockRecipients.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">إجمالي المبلغ</span>
                  <span className="text-white font-bold">{totalAmount.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">رسوم التحويل (0.1%)</span>
                  <span className="text-white font-bold">{(totalAmount * 0.001).toFixed(2)} {currency}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                  <span className="text-slate-300">الإجمالي المطلوب</span>
                  <span className="text-blue-300">{(totalAmount * 1.001).toFixed(2)} {currency}</span>
                </div>
                <Button className="w-full" onClick={handleExecute} loading={loading}>
                  <Users className="w-4 h-4" />
                  تنفيذ الدفع الجماعي
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview table */}
        <div className="space-y-4">
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">معاينة المستلمين ({mockRecipients.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {mockRecipients.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-xs text-blue-400 font-bold flex-shrink-0">
                        {r.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{r.name}</div>
                        <div className="text-xs text-slate-500 truncate">{r.identifier}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-white">{r.amount} {currency}</div>
                        <Badge variant="warning" className="text-xs">معلق</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">سجل الدفعات الجماعية</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {mockHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">لا توجد دفعات سابقة</div>
          ) : (
            <div className="divide-y divide-white/5">
              {mockHistory.map((h) => (
                <div key={h.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{h.name}</div>
                    <div className="text-xs text-slate-500">{h.count} مستلم • {h.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{h.total} USD</div>
                    <Badge variant="success">مكتمل</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
