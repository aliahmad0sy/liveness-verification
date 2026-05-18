import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ExchangeWidget } from "@/components/dashboard/ExchangeWidget";

export const metadata = { title: "تبادل العملات | KazaWallet" };

export default function ExchangePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="تبادل العملات" subtitle="حوّل بين العملات بأفضل الأسعار" />
      <div className="flex-1 overflow-y-auto p-6">
        <ExchangeWidget />
      </div>
    </div>
  );
}
