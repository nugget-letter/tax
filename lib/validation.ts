import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(9, "연락처를 입력해주세요"),
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  plan: z.enum(["light", "standard", "premium", "none"]).default("none"),
  message: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
