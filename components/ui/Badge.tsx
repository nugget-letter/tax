import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full bg-gradient-to-r from-brand-orange to-brand-red bg-clip-text text-sm font-bold tracking-wide text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
