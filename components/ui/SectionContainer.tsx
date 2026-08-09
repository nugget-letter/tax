import type { ReactNode } from "react";

type SectionContainerProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function SectionContainer({
  id,
  className = "",
  children,
}: SectionContainerProps) {
  return (
    <section id={id} className={`py-20 px-6 scroll-mt-24 ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}
