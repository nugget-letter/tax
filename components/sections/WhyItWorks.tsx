import SectionContainer from "@/components/ui/SectionContainer";
import FeatureCard from "@/components/ui/FeatureCard";

const BENEFITS = [
  {
    icon: "🛡️",
    title: "고객 이탈 방지",
    description: "신고 시즌 외에도 접점을 유지해, 고객이 다른 세무사를 찾지 않습니다.",
  },
  {
    icon: "✨",
    title: "전문성 있는 브랜딩",
    description: "매번 다른 콘텐츠를 직접 만들 필요 없이, 전문적인 이미지를 유지합니다.",
  },
  {
    icon: "📈",
    title: "신규 상담 전환",
    description: "바이럴 효과를 통해 신규 고객을 만날 수 있습니다.",
  },
];

export default function WhyItWorks() {
  return (
    <SectionContainer className="bg-gray-50 text-navy-950">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        세무사님은 세 가지를 얻어갈 수 있습니다
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <FeatureCard key={benefit.title} {...benefit} />
        ))}
      </div>
    </SectionContainer>
  );
}
