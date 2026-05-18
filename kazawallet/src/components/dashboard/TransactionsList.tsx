"use client";
import { useState } from "react";
import {
  ArrowDownLeft, ArrowUpRight, ArrowUpDown,
  Download as DownloadIcon, Search, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { formatAmount, timeAgo } from "@/lib/utils/format";
import { TX_TYPE_AR, TX_STATUS_AR } from "@/lib/constants";

type TxFilter = "الكل" | "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "EXCHANGE";

const FILTER_TABS: { label: string; value: TxFilter }[] = [
  { label: "الكل",    value: "الكل"       },
  { label: "إيداع",   value: "DEPOSIT"    },
  { label: "سحب",     value: "WITHDRAWAL" },
  { label: "تحويل",   value: "TRANSFER"   },
  { label: "تبادل",   value: "EXCHANGE"   },
];

const now = new Date();
const MOCK_TXS = [
  { id: "TXN001", ref: "KW-REF-001", type: "DEPOSIT",       currency: "USD",  amount:  500.00, status: "COMPLETED", createdAt: new Date(now.getTime() - 10 * 60 * 1000),  desc: "إيداع من PayPal" },
  { id: "TXN002", ref: "KW-REF-002", type: "TRANSFER_IN",   currency: "USD",  amount:  250.00, status: "COMPLETED", createdAt: new Date(now.getTime() - 45 * 60 * 1000),  desc: "استلام من محمد علي" },
  { id: "TXN003", ref: "KW-REF-003", type: "EXCHANGE",      currency: "USDT", amount:  200.00, status: "COMPLETED", createdAt: new Date(now.getTime() - 2 * 3600 * 1000), desc: "تبادل USD → USDT" },
  { id: "TXN004", ref: "KW-REF-004", type: "TRANSFER_OUT",  currency: "USD",  amount: -150.00, status: "PENDING",   createdAt: new Date(now.getTime() - 5 * 3600 * 1000), desc: "إرسال إلى سارة محمد" },
  { id: "TXN005", ref: "KW-REF-005", type: "WITHDRAWAL",    currency: "USD",  amount: -300.00, status: "PROCESSING",createdAt: new Date(now.getTime() - 8 * 3600 * 1000), desc: "سحب إلى Payeer" },
  { id: "TXN006", ref: "KW-REF-006", type: "DEPOSIT",       currency: "BTC",  amount:  0.005,  status: "COMPLETED", createdAt: new Date(now.getTime() - 24 * 3600 * 1000), desc: "إيداع بيتكوين" },
  { id: "TXN007", ref: "KW-REF-007", type: "CARD_PAYMENT",  currency: "USD",  amount: -89.99,  status: "COMPLETED", createdAt: new Date(now.getTime() - 36 * 3600 * 1000), desc: "دفع بالبطاقة — Amazon" },
  { id: "TXN008", ref: "KW-REF-008", type: "EXCHANGE",      currency: "ETH",  amount:  0.1,    status: "COMPLETED", createdAt: new Date(now.getTime() - 48 * 3600 * 1000), desc: "تبادل USD → ETH" },
  { id: "TXN009", ref: "KW-REF-009", type: "TRANSFER_IN",   currency: "USDT", amount:  400.00, status: "FAILED",    createdAt: new Date(now.getTime() - 60 * 3600 * 1000), desc: "استلام من محفظة خارجية" },
  { id: "TXN010", ref: "KW-REF-010", type: "MASS_PAYOUT",   currency: "USD",  amount: -1200.00,status: "COMPLETED", createdAt: new Date(now.getTime() - 72 * 3600 * 1000), desc: "دفع جماعي — رواتب" },
];

const STATUS_BADGE: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  COMPLETED: "success", PENDING: "warning", FAILED: "destructive", CANCELLED: "secondary", PROCESSING: "secondary",
};

function TxIcon({ type }: { type: string }) {
  if (type.includes("IN") || type === "DEPOSIT")
    return <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
      <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
    </div>;
  if (type.includes("OUT") || type === "WITHDRAWAL" || type === "CARD_PAYMENT")
    return <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
      <ArrowUpRight className="w-4 h-4 text-red-400" />
    </div>;
  return <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
    <ArrowUpDown className="w-4 h-4 text-amber-400" />
  </div>;
}

function filterMatch(tx: typeof MOCK_TXS[0], f: TxFilter): boolean {
  if (f === "الكل") return true;
  if (f === "TRANSFER") return tx.type.includes("TRANSFER");
  return tx.type.startsWith(f);
}

export function TransactionsList() {
  const [filter, setFilter] = useState<TxFilter>("الكل");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const totalPages = 3;

  const exportCSV = () => {
    const header = "المرجع,النوع,العملة,المبلغ,الحالة,التاريخ\n";
    const rows = MOCK_TXS.map((t) =>
      `${t.ref},${TX_TYPE_AR[t.type] ?? t.type},${t.currency},${t.amount},${TX_STATUS_AR[t.status] ?? t.status},${t.createdAt.toISOString()}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = MOCK_TXS.filter((tx) => {
    const matchFilter = filterMatch(tx, filter);
    const q = search.toLowerCase();
    const matchSearch = !q || tx.ref.toLowerCase().includes(q) || tx.desc.includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle>سجل المعاملات</CardTitle>
          <Button variant="secondary" size="sm" onClick={exportCSV}>
            <DownloadIcon className="w-4 h-4" />
            تصدير CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8 overflow-x-auto">
            {FILTER_TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={cn(
                  "px-3 h-8 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  filter === value ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="sm:w-56">
            <Input
              placeholder="بحث برقم المرجع…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<Search className="w-4 h-4" />}
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Table */}
        <div className="space-y-1.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">لا توجد معاملات تطابق البحث</div>
          ) : (
            filtered.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 transition-colors"
              >
                <TxIcon type={tx.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{tx.desc}</p>
                  <p className="text-slate-500 text-xs">{tx.ref} · {timeAgo(tx.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <p className={cn("text-sm font-semibold", tx.amount > 0 ? "text-emerald-400" : "text-white")}>
                    {tx.amount > 0 ? "+" : ""}{formatAmount(Math.abs(tx.amount), tx.currency)} {tx.currency}
                  </p>
                  <Badge variant={STATUS_BADGE[tx.status] ?? "secondary"} className="text-[10px] h-4">
                    {TX_STATUS_AR[tx.status] ?? tx.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2 border-t border-white/8">
          <span className="text-slate-500 text-sm">صفحة {page} من {totalPages}</span>
          <div className="flex gap-2">
            <Button
              variant="secondary" size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>
            <Button
              variant="secondary" size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
