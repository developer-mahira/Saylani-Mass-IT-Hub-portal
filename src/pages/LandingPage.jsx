import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import StatsBar from "../components/landing/StatsBar";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorks from "../components/landing/HowItWorks";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import VisionBanner from "../components/landing/VisionBanner";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <VisionBanner />
      <CTASection />
      <Footer />
    </div>
  );
}

