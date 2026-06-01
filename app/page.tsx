import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import FeaturesServiceSection from '@/components/FeaturesServiceSection';
import RoadmapSection from '@/components/RoadmapSection';
import SeatingLayoutSection from '@/components/SeatingLayoutSection';
import ComparisonSection from '@/components/ComparisonSection';
import SavingsCalculatorSection from '@/components/SavingsCalculatorSection';
import JoinBanner from '@/components/JoinBanner';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <HeroSection />
      <HowItWorks />
      <FeaturesServiceSection />
      <RoadmapSection />
      <SeatingLayoutSection />
      <ComparisonSection />
      <SavingsCalculatorSection />
      <JoinBanner />
      <FAQSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
