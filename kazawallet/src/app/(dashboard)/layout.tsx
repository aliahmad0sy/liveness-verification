"use client";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-screen bg-[#070c15] overflow-hidden" dir="rtl">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">{children}</main>
    </div>
  );
}
