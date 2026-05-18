import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KazaWallet — محفظتك الرقمية لكل العملات",
  description:
    "منصة شاملة لإدارة العملات الرقمية والمشفرة. أرسل، استقبل، وبادل بأمان وسرعة.",
  keywords: ["محفظة رقمية", "كريبتو", "USDT", "BTC", "تحويل", "صرف عملات"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className={`${cairo.className} min-h-full bg-[#070b14] antialiased`}>
        {children}
      </body>
    </html>
  );
}
