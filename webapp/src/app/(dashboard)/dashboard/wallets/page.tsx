import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WalletsManager } from "@/components/dashboard/WalletsManager";

export const metadata = { title: "محافظي | KazaWallet" };

export default function WalletsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="محافظي" subtitle="إدارة جميع محافظك" />
      <div className="flex-1 overflow-y-auto p-6">
        <WalletsManager />
      </div>
    </div>
  );
}
