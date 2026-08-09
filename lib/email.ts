import { Resend } from "resend";
import type { ContactFormInput } from "./validation";

const PLAN_LABEL: Record<ContactFormInput["plan"], string> = {
  light: "Light",
  standard: "Standard",
  premium: "Premium",
  none: "미선택",
};

export async function sendContactNotification(data: ContactFormInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO ?? "won@nugget.im";

  if (!apiKey) {
    console.log(
      "[contact] RESEND_API_KEY가 없어 메일 발송을 건너뜁니다. 제출 내용:",
      data
    );
    return { skipped: true as const };
  }

  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from: "너겟 랜딩페이지 <onboarding@resend.dev>",
    to,
    replyTo: data.email,
    subject: `[너겟 세무사] 무료 샘플 신청 - ${data.name}`,
    text: [
      `이름/사무소명: ${data.name}`,
      `연락처: ${data.phone}`,
      `이메일: ${data.email}`,
      `관심 플랜: ${PLAN_LABEL[data.plan]}`,
      `하고 싶은 말: ${data.message || "(없음)"}`,
    ].join("\n"),
  });

  return { skipped: false as const, id: result.data?.id };
}
