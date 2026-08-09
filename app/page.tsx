import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";
import WhyItWorks from "@/components/sections/WhyItWorks";
import HowItWorks from "@/components/sections/HowItWorks";
import ContentExample from "@/components/sections/ContentExample";

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
    </main>
  );
}
