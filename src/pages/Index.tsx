import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import ImpactStats from "@/components/ImpactStats";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesGrid />
      <ImpactStats />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
