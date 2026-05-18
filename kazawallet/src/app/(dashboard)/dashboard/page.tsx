import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Overview } from "@/components/dashboard/Overview";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="لوحة التحكم" subtitle="مرحباً بعودتك" />
      <div className="flex-1 overflow-y-auto p-6">
        <Overview />
      </div>
    </div>
  );
}
