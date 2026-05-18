import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SendMoneyForm } from "@/components/dashboard/SendMoneyForm";

export const metadata = { title: "إرسال الأموال | KazaWallet" };

export default function SendPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="إرسال الأموال" subtitle="أرسل للأصدقاء والعائلة في ثوانٍ" />
      <div className="flex-1 overflow-y-auto p-6">
        <SendMoneyForm />
      </div>
    </div>
  );
}
