import LandingLayout from "./layout";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CurrenciesSection from "@/components/landing/CurrenciesSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <LandingLayout>
      <main className="min-h-screen bg-[#070c15]">
        <Navbar />
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <HowItWorksSection />
        <CurrenciesSection />
        <CTASection />
        <Footer />
      </main>
    </LandingLayout>
  );
}
