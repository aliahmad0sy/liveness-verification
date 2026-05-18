import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CardsManager } from "@/components/dashboard/CardsManager";

export const metadata = { title: "البطاقات الافتراضية | KazaWallet" };

export default function CardsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="البطاقات الافتراضية" subtitle="أدر بطاقاتك الافتراضية" />
      <div className="flex-1 overflow-y-auto p-6">
        <CardsManager />
      </div>
    </div>
  );
}
