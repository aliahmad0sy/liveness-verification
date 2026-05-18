import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KYCVerification } from "@/components/dashboard/KYCVerification";

export const metadata = { title: "التحقق من الهوية (KYC) | KazaWallet" };

export default function KYCPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="التحقق من الهوية" subtitle="أكمل التحقق للوصول لجميع المميزات" />
      <div className="flex-1 overflow-y-auto p-6">
        <KYCVerification />
      </div>
    </div>
  );
}
