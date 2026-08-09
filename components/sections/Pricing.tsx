"use client";

import SectionContainer from "@/components/ui/SectionContainer";
import Button from "@/components/ui/Button";
import { usePlanSelection, type PlanId } from "@/components/PlanSelectionContext";

type PricingPlan = {
  id: PlanId;
  name: string;
  frequency: string;
  description: string;
  price: string;
  highlighted?: boolean;
};

const PLANS: PricingPlan[] = [
  {
    id: "light",
    name: "Light",
    frequency: "월 2회 발행",
    description: "가볍게 시작하는 입문용 플랜",
    price: "50만원",
  },
  {
    id: "standard",
    name: "Standard",
    frequency: "월 4회 발행",
    description: "가장 많이 선택하는 플랜",
    price: "95만원",
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    frequency: "월 8회 발행",
    description: "전담 에디터가 맞춤 콘텐츠를 기획·발송하는 플랜",
    price: "180만원",
  },
];

export default function Pricing() {
  const { selectPlan } = usePlanSelection();

  function handleSelect(planId: PlanId) {
    selectPlan(planId);
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <SectionContainer id="pricing" className="bg-gray-50 text-navy-950">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">요금제 소개</h2>
      <p className="mt-3 text-center text-gray-500">
        세무사님께 적합한 플랜을 선택하세요
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col rounded-2xl border p-8 ${
              plan.highlighted
                ? "scale-105 border-brand-orange shadow-xl"
                : "border-gray-200"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-4 w-fit rounded-full bg-gradient-to-r from-brand-orange to-brand-red px-3 py-1 text-xs font-bold text-white">
                가장 많이 선택하는 플랜
              </span>
            )}
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <p className="mt-2 font-semibold text-brand-orange">{plan.frequency}</p>
            <p className="mt-4 flex-1 text-gray-500">{plan.description}</p>
            <p className="mt-6 text-3xl font-extrabold">
              월 {plan.price}
              <span className="ml-1 text-sm font-normal text-gray-400">
                / VAT별도
              </span>
            </p>
            <Button className="mt-6" onClick={() => handleSelect(plan.id)}>
              이 플랜으로 문의하기
            </Button>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
