import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="bg-navy-950 px-6 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <Badge>고객과의 접점을 늘리는 브랜드메시지 서비스</Badge>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
          세무사님 대신, 너겟이
          <br />
          매달 콘텐츠를 만들어 보내드립니다
        </h1>
        <p className="mt-6 text-lg text-gray-300">
          카카오톡 브랜드메시지 한 건으로, 고객이 세금 신고 시즌마다
          사무소를 먼저 떠올리게 하세요.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Button href="#contact-form" className="px-8 py-4 text-base">
            무료 샘플 1건 받아보기
          </Button>
          <span className="text-sm text-gray-400">
            계약 전, 부담 없이 확인해보세요
          </span>
        </div>
      </div>
    </section>
  );
}
