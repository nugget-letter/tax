import SectionContainer from "@/components/ui/SectionContainer";

const POINTS = [
  "부가세·종합소득세 신고 시즌이 지나면, 고객과의 연락은 뚝 끊깁니다.",
  "그 사이 고객은 다른 세무사의 광고를 보고, '저 사무소가 더 잘 챙겨주나?' 생각합니다.",
  "접점이 없으면, 관계도 없습니다.",
];

export default function Problem() {
  return (
    <SectionContainer className="bg-navy-900 text-white">
      <h2 className="text-center text-3xl font-extrabold leading-tight md:text-4xl">
        고객이 세무사님을 찾는 건,
        <br />
        1년에 손에 꼽을 정도입니다
      </h2>
      <ul className="mx-auto mt-10 max-w-2xl space-y-4">
        {POINTS.map((point) => (
          <li key={point} className="border-l-2 border-brand-orange pl-4 text-gray-300">
            {point}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
