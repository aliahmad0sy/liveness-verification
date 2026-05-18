import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TransactionsList } from "@/components/dashboard/TransactionsList";

export const metadata = { title: "سجل المعاملات | KazaWallet" };

export default function TransactionsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="سجل المعاملات" subtitle="تاريخ جميع معاملاتك" />
      <div className="flex-1 overflow-y-auto p-6">
        <TransactionsList />
      </div>
    </div>
  );
}
