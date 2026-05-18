import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KYCFlow } from "@/components/dashboard/KYCFlow";

export default function KYCPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="التحقق من الهوية" subtitle="احصل على مزايا إضافية" />
      <div className="flex-1 overflow-y-auto p-6">
        <KYCFlow />
      </div>
    </div>
  );
}
