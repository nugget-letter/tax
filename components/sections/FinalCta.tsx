"use client";

import { useState, type FormEvent } from "react";
import SectionContainer from "@/components/ui/SectionContainer";
import { usePlanSelection } from "@/components/PlanSelectionContext";
import type { ContactFormInput } from "@/lib/validation";

type SubmitState = "idle" | "loading" | "success" | "error";
type FieldErrors = Record<string, string[]>;

const PLAN_OPTIONS = [
  { value: "none", label: "선택 안 함" },
  { value: "light", label: "Light" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
] as const;

export default function FinalCta() {
  const { selectedPlan } = usePlanSelection();
  const [status, setStatus] = useState<SubmitState>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFieldErrors(null);

    const form = event.currentTarget;
    const payload: ContactFormInput = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      plan: (form.elements.namedItem("plan") as HTMLSelectElement)
        .value as ContactFormInput["plan"],
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (body?.fieldErrors) {
          setFieldErrors(body.fieldErrors);
        }
        throw new Error("request_failed");
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <SectionContainer id="contact-form" className="bg-navy-950 text-white">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        지금, 콘텐츠 1건을 무료로 받아보세요
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-center text-gray-300">
        계약 전, 세무사님 사무소 이름으로 실제 발송 화면 샘플 1건을
        무료로 제작해드립니다. 부담 없이 확인해보시고, 그다음에 결정하세요.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 max-w-xl space-y-4 rounded-2xl bg-white p-8 text-navy-950"
      >
        <div>
          <label htmlFor="name" className="text-sm font-semibold">
            이름 / 사무소명 *
          </label>
          <input
            id="name"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          {fieldErrors?.name && (
            <p className="mt-1 text-xs font-semibold text-red-600">
              {fieldErrors.name[0]}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-semibold">
            연락처 *
          </label>
          <input
            id="phone"
            name="phone"
            required
            minLength={9}
            placeholder="010-0000-0000"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          {fieldErrors?.phone && (
            <p className="mt-1 text-xs font-semibold text-red-600">
              {fieldErrors.phone[0]}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold">
            이메일 *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
          />
          {fieldErrors?.email && (
            <p className="mt-1 text-xs font-semibold text-red-600">
              {fieldErrors.email[0]}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="plan" className="text-sm font-semibold">
            관심 플랜
          </label>
          <select
            id="plan"
            name="plan"
            defaultValue={selectedPlan}
            key={selectedPlan}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
          >
            {PLAN_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="message" className="text-sm font-semibold">
            하고 싶은 말
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-full bg-gradient-to-r from-brand-orange to-brand-red py-3 font-bold text-white disabled:opacity-60"
        >
          {status === "loading" ? "전송 중..." : "무료 샘플 신청하기"}
        </button>

        {status === "success" && (
          <p className="text-center text-sm font-semibold text-green-600">
            신청이 접수되었습니다. 빠르게 연락드리겠습니다!
          </p>
        )}
        {status === "error" && !fieldErrors?.name && !fieldErrors?.phone && !fieldErrors?.email && (
          <p className="text-center text-sm font-semibold text-red-600">
            전송에 실패했습니다. won@nugget.im으로 직접 문의해주세요.
          </p>
        )}
      </form>
    </SectionContainer>
  );
}
