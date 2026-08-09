import Button from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-navy-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="bg-gradient-to-r from-brand-orange to-brand-red bg-clip-text text-2xl font-extrabold italic text-transparent">
          nugget.
        </span>
        <Button href="#contact-form" className="px-5 py-2 text-sm">
          무료 샘플 받기
        </Button>
      </div>
    </header>
  );
}
