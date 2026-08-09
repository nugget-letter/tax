import SectionContainer from "@/components/ui/SectionContainer";
import FeatureCard from "@/components/ui/FeatureCard";

const FEATURES = [
  {
    icon: "✍️",
    title: "직접 쓸 필요 없어요",
    description: "경제·세무 콘텐츠를 전문적으로 다루는 팀이 직접 기획하고 작성합니다.",
  },
  {
    icon: "⏰",
    title: "지속적인 접점 확보",
    description: "정기적인 발송으로 자연스럽게 세무사님을 떠올리게 합니다.",
  },
  {
    icon: "📱",
    title: "자동으로 발송해요",
    description: "플러스친구를 통해 정해진 시간에 발송됩니다.",
  },
];

export default function HowItWorks() {
  return (
    <SectionContainer className="bg-gray-50 text-navy-950">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        세무사님도 너겟과 함께라면
        <br />
        간단하게 도입할 수 있습니다
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </SectionContainer>
  );
}
