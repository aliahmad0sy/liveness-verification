import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="الإعدادات" subtitle="إدارة حسابك وتفضيلاتك" />
      <div className="flex-1 overflow-y-auto p-6">
        <SettingsPanel />
      </div>
    </div>
  );
}
