import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KazaWallet — محفظتك الرقمية لكل العملات",
  description: "منصة شاملة لإدارة العملات الرقمية والمشفرة. أرسل، استقبل، وبادل بأمان.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="h-full">
      <body className={`${cairo.className} min-h-full bg-[#070c15] antialiased`}>
        {children}
      </body>
    </html>
  );
}
