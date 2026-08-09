import SectionContainer from "@/components/ui/SectionContainer";
import PhoneMockup from "@/components/ui/PhoneMockup";

const SAMPLES = [
  {
    badge: "부가가치세 개정 콘텐츠",
    title: "2026년 부가가치세 달라진 점은?",
    body: "7월엔 사업자라면 누구나 2026년 상반기 부가가치세 확정신고를 해야 해요. 간이과세자 기준이 1억 400만 원으로 오르고, 가짜 세금계산서 가산세율은 4%로 상승한 게 대표적이에요.",
    ctaLabel: "세무사 상담 신청하기",
  },
  {
    badge: "법인차량 관련 콘텐츠",
    title: "법인차로 여행가도 탈세 아니에요",
    body: "연두색 번호판을 단 법인차로 여행가면 탈세라고 생각하는 대표님들이 있어요. 법인차를 개인적으로 쓰는 건 전혀 문제가 되지 않아요. 그런데 '이렇게' 처리하면 탈세가 될 수 있어 조심해야 해요.",
    ctaLabel: "자세히 보러가기",
  },
  {
    badge: "사업자 필수 체크 콘텐츠",
    title: "사업자 냈다면, 이건 무조건 해야 해요!",
    body: "딱 한번만 세팅해두면 계속해서 비용처리를 받을 수 있는 항목이 있습니다. AI 구독료, 핸드폰 요금 결제 카드 등록부터 꼭 확인해보세요.",
    ctaLabel: "바로 확인하기",
  },
];

export default function ContentExample() {
  return (
    <SectionContainer id="content-example" className="bg-gray-50 text-navy-950">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        콘텐츠 솔루션을 도입해
        <br />
        지속적으로 유용한 콘텐츠를 발송하세요
      </h2>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {SAMPLES.map((sample) => (
          <PhoneMockup key={sample.title} {...sample} />
        ))}
      </div>
    </SectionContainer>
  );
}
