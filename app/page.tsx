import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import RsvpFlowSection from '@/components/RsvpFlowSection';
import ProofOfContactSection from '@/components/ProofOfContactSection';
import FeaturesServiceSection from '@/components/FeaturesServiceSection';
import MidPageCTA from '@/components/MidPageCTA';
import RoadmapSection from '@/components/RoadmapSection';
import SeatingLayoutSection from '@/components/SeatingLayoutSection';
import ComparisonSection from '@/components/ComparisonSection';
import ConsultationSection from '@/components/ConsultationSection';
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
      <RsvpFlowSection />
      <ProofOfContactSection />
      <FeaturesServiceSection />
      {/* mid-page CTA #1 */}
      <MidPageCTA />
      <RoadmapSection />
      <SeatingLayoutSection />
      <ComparisonSection />
      {/* personal consultation — replaces the old savings calculator */}
      <ConsultationSection />
      {/* mid-page CTA #2 — the "be among the first" launch banner */}
      <JoinBanner />
      <FAQSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
