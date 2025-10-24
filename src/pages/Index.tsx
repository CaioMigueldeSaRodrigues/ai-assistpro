import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Pricing } from "@/components/Pricing";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <Hero />
        <Benefits />
        <DashboardPreview />
        <Pricing />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
