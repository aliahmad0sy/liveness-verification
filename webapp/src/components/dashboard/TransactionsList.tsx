"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  RefreshCw,
  CreditCard,
  Users,
  DollarSign,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TRANSACTION_TYPE_LABELS, TRANSACTION_STATUS_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type TxType = "ALL" | "DEPOSIT" | "WITHDRAWAL" | "TRANSFER_IN" | "TRANSFER_OUT" | "EXCHANGE";

interface Transaction {
  id: string;
  reference: string;
  type: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  counterparty?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    reference: "KW-TXN-001",
    type: "DEPOSIT",
    description: "إيداع عبر USDT (TRC20)",
    amount: 500,
    currency: "USDT",
    status: "COMPLETED",
    createdAt: "2025-05-15T10:30:00Z",
    counterparty: "TRx9kH2mVp3Nq...",
  },
  {
    id: "2",
    reference: "KW-TXN-002",
    type: "TRANSFER_OUT",
    description: "تحويل إلى محمد أحمد",
    amount: 150,
    currency: "USD",
    status: "COMPLETED",
    createdAt: "2025-05-14T15:20:00Z",
    counterparty: "KW-USER-XYZ789",
  },
  {
    id: "3",
    reference: "KW-TXN-003",
    type: "EXCHANGE",
    description: "تحويل USD إلى USDT",
    amount: 300,
    currency: "USD",
    status: "COMPLETED",
    createdAt: "2025-05-13T09:15:00Z",
  },
  {
    id: "4",
    reference: "KW-TXN-004",
    type: "WITHDRAWAL",
    description: "سحب إلى PayPal",
    amount: 200,
    currency: "USD",
    status: "PENDING",
    createdAt: "2025-05-12T18:45:00Z",
    counterparty: "user@example.com",
  },
  {
    id: "5",
    reference: "KW-TXN-005",
    type: "TRANSFER_IN",
    description: "استلام من سارة العلي",
    amount: 75,
    currency: "SAR",
    status: "COMPLETED",
    createdAt: "2025-05-11T12:00:00Z",
    counterparty: "KW-USER-SAR123",
  },
  {
    id: "6",
    reference: "KW-TXN-006",
    type: "DEPOSIT",
    description: "إيداع عبر Perfect Money",
    amount: 1000,
    currency: "USD",
    status: "COMPLETED",
    createdAt: "2025-05-10T08:30:00Z",
  },
  {
    id: "7",
    reference: "KW-TXN-007",
    type: "EXCHANGE",
    description: "تحويل BTC إلى USD",
    amount: 0.005,
    currency: "BTC",
    status: "COMPLETED",
    createdAt: "2025-05-09T20:10:00Z",
  },
  {
    id: "8",
    reference: "KW-TXN-008",
    type: "WITHDRAWAL",
    description: "سحب إلى بنك الراجحي",
    amount: 500,
    currency: "SAR",
    status: "FAILED",
    createdAt: "2025-05-08T14:25:00Z",
    counterparty: "SA2980000...",
  },
  {
    id: "9",
    reference: "KW-TXN-009",
    type: "TRANSFER_OUT",
    description: "دفع جماعي — دفعة مارس",
    amount: 2500,
    currency: "USD",
    status: "COMPLETED",
    createdAt: "2025-05-07T11:00:00Z",
  },
  {
    id: "10",
    reference: "KW-TXN-010",
    type: "DEPOSIT",
    description: "إيداع عبر Payeer",
    amount: 250,
    currency: "USD",
    status: "PROCESSING",
    createdAt: "2025-05-06T16:50:00Z",
  },
];

const FILTER_TABS: { label: string; value: TxType }[] = [
  { label: "الكل", value: "ALL" },
  { label: "إيداع", value: "DEPOSIT" },
  { label: "سحب", value: "WITHDRAWAL" },
  { label: "تحويل", value: "TRANSFER_OUT" },
  { label: "تبادل", value: "EXCHANGE" },
];

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "default" | "secondary"> = {
  COMPLETED: "success",
  PENDING: "warning",
  PROCESSING: "default",
  FAILED: "destructive",
  CANCELLED: "secondary",
  REFUNDED: "secondary",
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  DEPOSIT: <ArrowDownLeft className="w-4 h-4 text-emerald-400" />,
  WITHDRAWAL: <ArrowUpRight className="w-4 h-4 text-red-400" />,
  TRANSFER_IN: <ArrowDownLeft className="w-4 h-4 text-emerald-400" />,
  TRANSFER_OUT: <ArrowUpRight className="w-4 h-4 text-red-400" />,
  EXCHANGE: <ArrowLeftRight className="w-4 h-4 text-blue-400" />,
  CARD_FUNDING: <CreditCard className="w-4 h-4 text-purple-400" />,
  CARD_PAYMENT: <CreditCard className="w-4 h-4 text-purple-400" />,
  MASS_PAYOUT: <Users className="w-4 h-4 text-yellow-400" />,
  FEE: <DollarSign className="w-4 h-4 text-slate-400" />,
  COMMISSION: <DollarSign className="w-4 h-4 text-slate-400" />,
};

const PAGE_SIZE = 5;

function exportCSV(transactions: Transaction[]) {
  const header = "المرجع,النوع,الوصف,المبلغ,العملة,الحالة,التاريخ";
  const rows = transactions.map((t) =>
    [t.reference, TRANSACTION_TYPE_LABELS[t.type] ?? t.type, t.description, t.amount, t.currency, TRANSACTION_STATUS_LABELS[t.status] ?? t.status, t.createdAt].join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kaza-transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function TransactionsList() {
  const [activeFilter, setActiveFilter] = useState<TxType>("ALL");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const filtered = MOCK_TRANSACTIONS.filter((tx) => {
    if (activeFilter !== "ALL" && tx.type !== activeFilter) return false;
    if (search && !tx.reference.toLowerCase().includes(search.toLowerCase()) && !tx.description.includes(search)) return false;
    if (dateFrom && new Date(tx.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(tx.createdAt) > new Date(dateTo + "T23:59:59Z")) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(f: TxType) {
    setActiveFilter(f);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              activeFilter === tab.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + Date + Export */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <Input
            label="بحث بالمرجع"
            placeholder="KW-TXN-..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            startIcon={<Search className="w-4 h-4" />}
            dir="ltr"
          />
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">من تاريخ</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="w-40">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">إلى تاريخ</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <Button variant="secondary" size="default" onClick={() => exportCSV(filtered)} className="gap-2">
          <Download className="w-4 h-4" />
          تصدير CSV
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            المعاملات
            <span className="text-xs text-slate-500 font-normal mr-2">({filtered.length} معاملة)</span>
          </CardTitle>
          <Filter className="w-4 h-4 text-slate-500" />
        </CardHeader>
        <CardContent className="p-0 mt-4">
          {paginated.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <RefreshCw className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p>لا توجد معاملات تطابق الفلتر المحدد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-right text-xs font-semibold text-slate-500 px-6 py-3">النوع</th>
                    <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">الوصف</th>
                    <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">المبلغ</th>
                    <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">الحالة</th>
                    <th className="text-right text-xs font-semibold text-slate-500 px-6 py-3">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((tx) => {
                    const isCredit = tx.type === "DEPOSIT" || tx.type === "TRANSFER_IN";
                    return (
                      <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                              {TYPE_ICON[tx.type] ?? <DollarSign className="w-4 h-4 text-slate-400" />}
                            </div>
                            <div>
                              <div className="text-white text-xs font-semibold">
                                {TRANSACTION_TYPE_LABELS[tx.type] ?? tx.type}
                              </div>
                              <div className="text-slate-500 text-xs" dir="ltr">{tx.reference}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-white text-xs max-w-48 truncate">{tx.description}</div>
                          {tx.counterparty && (
                            <div className="text-slate-500 text-xs font-mono truncate max-w-32" dir="ltr">{tx.counterparty}</div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn("font-bold text-sm", isCredit ? "text-emerald-400" : "text-red-400")}>
                            {isCredit ? "+" : "-"}{formatCurrency(tx.amount, tx.currency)} {tx.currency}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={STATUS_VARIANT[tx.status] ?? "secondary"}>
                            {TRANSACTION_STATUS_LABELS[tx.status] ?? tx.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                          {formatDate(tx.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            صفحة {page} من {totalPages} — إجمالي {filtered.length} معاملة
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
