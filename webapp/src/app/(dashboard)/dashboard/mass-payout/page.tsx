import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MassPayoutWidget } from "@/components/dashboard/MassPayoutWidget";

export const metadata = { title: "الدفع الجماعي | KazaWallet" };

export default function MassPayoutPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="الدفع الجماعي" subtitle="أرسل لمئات المستلمين دفعة واحدة" />
      <div className="flex-1 overflow-y-auto p-6">
        <MassPayoutWidget />
      </div>
    </div>
  );
}
