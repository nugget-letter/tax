import SectionContainer from "@/components/ui/SectionContainer";

export default function SocialProof() {
  return (
    <SectionContainer className="bg-navy-950 text-white">
      <h2 className="text-center text-3xl font-extrabold leading-tight md:text-4xl">
        2,450만명의 고객을 가진 삼쩜삼도,
        <br />
        꾸준히 카카오톡 메시지를 보냅니다
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-center text-gray-300">
        카카오톡 메시지 한 건으로, 고객들은 세금 신고 기간마다 삼쩜삼을
        잊지 않고 찾고 있습니다.
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-gray-400">
        블로그는 검색해야 하고, 인스타그램은 알고리즘에 묻히지만, 카카오톡은
        고객이 하루에도 몇 번씩 여는 유일한 채널입니다.
      </p>
    </SectionContainer>
  );
}
