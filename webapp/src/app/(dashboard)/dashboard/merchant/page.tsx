import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MerchantDashboard } from "@/components/dashboard/MerchantDashboard";

export const metadata = { title: "نظام التجار | KazaWallet" };

export default function MerchantPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="نظام التجار" subtitle="تكامل كامل مع متجرك" />
      <div className="flex-1 overflow-y-auto p-6">
        <MerchantDashboard />
      </div>
    </div>
  );
}
