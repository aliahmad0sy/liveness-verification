import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Bell, CheckCircle2, AlertCircle, ArrowDownLeft, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const NOTIFICATIONS = [
  { id: "1", icon: ArrowDownLeft,  color: "text-emerald-400", bg: "bg-emerald-500/10", title: "استلمت تحويلاً",           body: "استلمت $500.00 من أحمد خالد",                   time: "منذ 5 دقائق",  read: false },
  { id: "2", icon: CheckCircle2,   color: "text-blue-400",    bg: "bg-blue-500/10",    title: "تم اكتمال التبادل",         body: "تم تبادل 200 USDT مقابل 200 USD بنجاح",         time: "منذ ساعتين",   read: false },
  { id: "3", icon: AlertCircle,    color: "text-amber-400",   bg: "bg-amber-500/10",   title: "تحويل قيد الانتظار",        body: "التحويل إلى سارة محمد بانتظار التأكيد",         time: "منذ 5 ساعات",  read: true  },
  { id: "4", icon: CreditCard,     color: "text-purple-400",  bg: "bg-purple-500/10",  title: "دفع ببطاقتك",               body: "تم الدفع بمبلغ $89.99 على Amazon",               time: "منذ يوم",      read: true  },
  { id: "5", icon: Bell,           color: "text-slate-400",   bg: "bg-white/8",        title: "تذكير: أكمل التحقق",        body: "أكمل التحقق من هويتك للحصول على حدود أعلى",   time: "منذ 3 أيام",   read: true  },
];

export default function NotificationsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="الإشعارات" subtitle="تابع آخر تحديثات حسابك" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-5 divide-y divide-white/6">
              {NOTIFICATIONS.map(({ id, icon: Icon, color, bg, title, body, time, read }) => (
                <div key={id} className={`flex items-start gap-4 py-4 first:pt-0 last:pb-0 transition-colors hover:bg-white/3 rounded-xl px-2 -mx-2 ${!read ? "opacity-100" : "opacity-70"}`}>
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-white text-sm font-semibold">{title}</p>
                      {!read && <Badge variant="default" className="text-[10px] h-4 shrink-0">جديد</Badge>}
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{body}</p>
                    <p className="text-slate-600 text-xs mt-1">{time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
