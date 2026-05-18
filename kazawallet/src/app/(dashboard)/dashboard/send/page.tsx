import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SendForm } from "@/components/dashboard/SendForm";

export default function SendPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="إرسال أموال" subtitle="تحويل آمن وسريع" />
      <div className="flex-1 overflow-y-auto p-6">
        <SendForm />
      </div>
    </div>
  );
}
