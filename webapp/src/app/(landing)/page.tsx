import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CurrenciesSection } from "@/components/landing/CurrenciesSection";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "KazaWallet — محفظتك الرقمية لكل العملات",
  description:
    "أرسل، استقبل، وبادل العملات الرقمية والمشفرة بسرعة وأمان. بطاقة فيزا افتراضية، دفع جماعي، وأكثر من 30 عملة.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070b14]" dir="rtl">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CurrenciesSection />
      <Footer />
    </main>
  );
}
