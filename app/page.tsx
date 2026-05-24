import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesServiceSection from '@/components/FeaturesServiceSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <main className="w-full">
      <Header />
      <HeroSection />
      <FeaturesServiceSection />
      <ContactSection />
    </main>
  );
}
