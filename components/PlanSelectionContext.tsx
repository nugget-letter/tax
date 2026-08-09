"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type PlanId = "none" | "light" | "standard" | "premium";

type PlanSelectionContextValue = {
  selectedPlan: PlanId;
  selectPlan: (plan: PlanId) => void;
};

const PlanSelectionContext = createContext<PlanSelectionContextValue | null>(null);

export function PlanSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("none");

  return (
    <PlanSelectionContext.Provider
      value={{ selectedPlan, selectPlan: setSelectedPlan }}
    >
      {children}
    </PlanSelectionContext.Provider>
  );
}

export function usePlanSelection() {
  const context = useContext(PlanSelectionContext);
  if (!context) {
    throw new Error(
      "usePlanSelection은 PlanSelectionProvider 내부에서만 사용할 수 있습니다"
    );
  }
  return context;
}
