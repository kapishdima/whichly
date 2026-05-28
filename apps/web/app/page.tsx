import { FaqSection } from "@/components/sections/faq";
import { HeroSection } from "@/components/sections/hero";
import { HowItWorksSection } from "@/components/sections/how-it-works";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <FaqSection />
    </main>
  );
}
