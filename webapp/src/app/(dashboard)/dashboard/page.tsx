import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export const metadata = {
  title: "لوحة التحكم | KazaWallet",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="لوحة التحكم" subtitle="مرحباً بك في KazaWallet" />
      <div className="flex-1 overflow-y-auto p-6">
        <DashboardOverview />
      </div>
    </div>
  );
}
