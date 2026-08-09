import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(100, "이름은 100자 이내로 입력해주세요"),
  phone: z
    .string()
    .min(9, "연락처를 입력해주세요")
    .max(20, "연락처는 20자 이내로 입력해주세요"),
  email: z
    .string()
    .email("올바른 이메일 형식이 아닙니다")
    .max(200, "이메일은 200자 이내로 입력해주세요"),
  plan: z.enum(["light", "standard", "premium", "none"]).default("none"),
  message: z
    .string()
    .max(2000, "메시지는 2000자 이내로 입력해주세요")
    .optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
