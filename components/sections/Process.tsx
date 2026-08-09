import SectionContainer from "@/components/ui/SectionContainer";

const STEPS = [
  { step: 1, title: "콘텐츠 기획", description: "너겟이 리서치 및 콘텐츠 작성" },
  {
    step: 2,
    title: "콘텐츠 확인",
    description: "발송 일주일 전, 세무사님께 전달 및 확인 요청",
  },
  {
    step: 3,
    title: "콘텐츠 발송",
    description: "세무사님 플러스친구로 정해진 시간에 콘텐츠 발송",
  },
];

export default function Process() {
  return (
    <SectionContainer className="bg-white text-navy-950">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        콘텐츠 제작 프로세스
      </h2>
      <p className="mt-3 text-center text-gray-500">
        기획부터 발송까지, 3단계로 진행됩니다
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((item) => (
          <div
            key={item.step}
            className="rounded-2xl border border-gray-200 p-8 text-center"
          >
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-orange to-brand-red text-sm font-bold text-white">
              {item.step}
            </span>
            <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
