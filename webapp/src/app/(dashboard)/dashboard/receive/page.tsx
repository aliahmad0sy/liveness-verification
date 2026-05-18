import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ReceiveWidget } from "@/components/dashboard/ReceiveWidget";

export const metadata = { title: "استقبال الأموال | KazaWallet" };

export default function ReceivePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="استقبال الأموال" subtitle="شارك عنوانك لاستقبال الأموال" />
      <div className="flex-1 overflow-y-auto p-6">
        <ReceiveWidget />
      </div>
    </div>
  );
}
