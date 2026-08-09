import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";
import WhyItWorks from "@/components/sections/WhyItWorks";
import HowItWorks from "@/components/sections/HowItWorks";
import ContentExample from "@/components/sections/ContentExample";
import Process from "@/components/sections/Process";
import Pricing from "@/components/sections/Pricing";
import FinalCta from "@/components/sections/FinalCta";
import { PlanSelectionProvider } from "@/components/PlanSelectionContext";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <SocialProof />
      <WhyItWorks />
      <HowItWorks />
      <ContentExample />
      <Process />
      <PlanSelectionProvider>
        <Pricing />
        <FinalCta />
      </PlanSelectionProvider>
    </main>
  );
}
