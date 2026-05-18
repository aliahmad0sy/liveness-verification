import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MassPayoutWidget } from "@/components/dashboard/MassPayoutWidget";

export default function MassPayoutPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="الدفع الجماعي" subtitle="أرسل لعدد كبير من المستلمين دفعة واحدة" />
      <div className="flex-1 overflow-y-auto p-6">
        <MassPayoutWidget />
      </div>
    </div>
  );
}
