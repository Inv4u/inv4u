import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import InvitationGallery from '@/components/InvitationGallery';
import RsvpFlowSection from '@/components/RsvpFlowSection';
import ProofOfContactSection from '@/components/ProofOfContactSection';
import StatsStrip from '@/components/StatsStrip';
import TestimonialsSection from '@/components/TestimonialsSection';
import FeaturesServiceSection from '@/components/FeaturesServiceSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <HeroSection />
      {/* the product itself — 8 typographic invitation designs */}
      <InvitationGallery />
      {/* the real RSVP flow — the differentiator */}
      <RsvpFlowSection />
      {/* verifiable contact — the moat */}
      <ProofOfContactSection />
      {/* social proof — both hidden until real data is added (lib/stats, lib/testimonials) */}
      <StatsStrip />
      <FeaturesServiceSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
