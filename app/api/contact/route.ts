import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await sendContactNotification(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] 이메일 발송 실패", error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }
}
