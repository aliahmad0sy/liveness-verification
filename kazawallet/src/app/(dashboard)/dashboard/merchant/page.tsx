import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MerchantPanel } from "@/components/dashboard/MerchantPanel";

export default function MerchantPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="لوحة التاجر" subtitle="إدارة مدفوعاتك وتكاملاتك" />
      <div className="flex-1 overflow-y-auto p-6">
        <MerchantPanel />
      </div>
    </div>
  );
}
