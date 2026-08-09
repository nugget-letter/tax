# 너겟 세무사 랜딩페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 너겟 세무사(카카오톡 브랜드메시지 콘텐츠 서비스) 소개 및 리드 확보용 정적 랜딩페이지를 Next.js로 구축한다.

**Architecture:** Next.js 15 App Router 단일 페이지. `app/page.tsx`가 섹션 컴포넌트들을 순서대로 조립하고, 요금제 선택 상태는 작은 React Context로 Pricing↔FinalCta 사이에서만 공유한다. 문의 폼 제출은 `app/api/contact/route.ts`가 zod로 검증 후 Resend로 이메일을 발송한다.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4 (CSS 기반 테마, 별도 config 파일 없음), zod, Resend, Noto Sans KR (`next/font/google`)

## Global Constraints

- Next.js 15 App Router + TypeScript + Tailwind CSS v4 사용, 별도 `tailwind.config` 파일을 만들지 않고 `app/globals.css`의 `@theme`으로 토큰을 정의한다.
- 이메일 발송은 Resend API 사용. 환경변수 `RESEND_API_KEY`, `CONTACT_EMAIL_TO`(기본값 `won@nugget.im`). `RESEND_API_KEY`가 없으면 실제 발송을 건너뛰고 콘솔에 로그만 남긴다.
- 승인된 스펙에 따라 **별도 유닛 테스트 프레임워크를 도입하지 않는다.** 각 태스크의 검증은 `npm run build`, `npx tsc --noEmit`, `npm run lint`, 그리고 `curl`을 이용한 렌더링 결과 확인으로 대체한다.
- 한국어 전용, i18n 없음.
- 이 프로젝트의 git 원격 저장소 `origin`은 이미 `https://github.com/nugget-letter/tax.git`로 연결되어 있다. 각 태스크마다 **로컬 커밋**은 수행하되, `git push`는 절대 자동으로 실행하지 않는다 (사용자 확인 필요).
- 비주얼 팔레트: 다크 네이비 배경(`#0b0b10`, `#15151c`) + 오렌지→레드 그라데이션 포인트(`#ffb020` → `#ff5a36`), 흰 카드 섹션, 굵은 Noto Sans KR.
- 스코프 제외: Vercel 배포 연결, CMS 연동, i18n, GitHub 원격 push.

---

### Task 1: 프로젝트 스캐폴딩

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

**Interfaces:**
- Produces: `npm run dev` / `npm run build` / `npm run lint`이 동작하는 기본 Next.js 프로젝트. 이후 모든 태스크는 `app/`, `components/`, `lib/`를 이 스캐폴드 위에 추가한다.

- [ ] **Step 1: package.json 작성**

```json
{
  "name": "nugget-tax-landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  }
}
```

- [ ] **Step 2: 의존성 설치**

Run:
```bash
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/node @types/react @types/react-dom eslint eslint-config-next @eslint/eslintrc tailwindcss @tailwindcss/postcss
```

Expected: `node_modules/`가 생성되고 `package.json`에 dependencies/devDependencies가 채워짐 (이미 `.gitignore`에 `node_modules`가 등록되어 있음).

- [ ] **Step 3: tsconfig.json 작성**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: next.config.ts 작성**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 5: postcss.config.mjs 작성**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 6: eslint.config.mjs 작성**

```js
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript")];

export default eslintConfig;
```

- [ ] **Step 7: app/globals.css 작성**

```css
@import "tailwindcss";

body {
  background-color: white;
}
```

- [ ] **Step 8: app/layout.tsx 작성**

```tsx
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "너겟 세무사 | 고객과의 접점을 늘리는 브랜드메시지 서비스",
  description:
    "세무사님 대신 너겟이 매달 카카오톡 브랜드메시지 콘텐츠를 만들어 보내드립니다. 지금 무료 샘플을 받아보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 9: app/page.tsx 작성 (placeholder)**

```tsx
export default function Home() {
  return <main className="p-10 text-center">Coming soon</main>;
}
```

- [ ] **Step 10: 빌드 검증**

Run: `npm run build`
Expected: `Compiled successfully` 출력, 에러 없음. `next-env.d.ts`와 `.next/`가 자동 생성됨.

- [ ] **Step 11: 커밋**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs app
git commit -m "chore: scaffold Next.js 15 project"
```

---

### Task 2: 디자인 토큰 & 기본 UI 컴포넌트

**Files:**
- Modify: `app/globals.css`
- Create: `components/ui/Button.tsx`
- Create: `components/ui/SectionContainer.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/FeatureCard.tsx`

**Interfaces:**
- Consumes: 없음 (기반 컴포넌트)
- Produces:
  - `Button({ variant?: "primary" | "secondary", href?: string, className?: string, ...restProps })` — `href`가 있으면 `<a>`, 없으면 `<button>` 렌더링
  - `SectionContainer({ id?: string, className?: string, children })`
  - `Badge({ children, className? })`
  - `FeatureCard({ icon: string, title: string, description: string })`
  - Tailwind 유틸리티: `bg-brand-orange`, `text-brand-orange`, `from-brand-orange`, `to-brand-red`, `bg-navy-950`, `bg-navy-900`, `text-navy-950` 등

- [ ] **Step 1: app/globals.css에 디자인 토큰 추가**

`app/globals.css` 전체를 아래로 교체:

```css
@import "tailwindcss";

@theme {
  --color-brand-orange: #ffb020;
  --color-brand-red: #ff5a36;
  --color-navy-950: #0b0b10;
  --color-navy-900: #15151c;
  --font-sans: var(--font-noto-sans-kr), ui-sans-serif, system-ui, sans-serif;
}

body {
  background-color: white;
}
```

- [ ] **Step 2: components/ui/Button.tsx 작성**

```tsx
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type CommonProps = {
  variant?: "primary" | "secondary";
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const BASE_CLASS =
  "inline-flex items-center justify-center rounded-full px-6 py-3 font-bold transition-transform hover:scale-105";

const VARIANT_CLASS: Record<NonNullable<CommonProps["variant"]>, string> = {
  primary: "bg-gradient-to-r from-brand-orange to-brand-red text-white",
  secondary: "bg-white text-navy-950 border border-navy-950/10",
};

export default function Button({
  variant = "primary",
  className = "",
  href,
  ...props
}: ButtonProps) {
  const classes = `${BASE_CLASS} ${VARIANT_CLASS[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  );
}
```

- [ ] **Step 3: components/ui/SectionContainer.tsx 작성**

```tsx
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
    <section id={id} className={`py-20 px-6 ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: components/ui/Badge.tsx 작성**

```tsx
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
```

- [ ] **Step 5: components/ui/FeatureCard.tsx 작성**

```tsx
type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 text-xl font-bold text-navy-950">{title}</h3>
      <p className="mt-2 text-gray-500">{description}</p>
    </div>
  );
}
```

- [ ] **Step 6: 임시 렌더링으로 컴포넌트 검증**

`app/page.tsx`를 임시로 아래 내용으로 바꿔 확인한다:

```tsx
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import FeatureCard from "@/components/ui/FeatureCard";
import SectionContainer from "@/components/ui/SectionContainer";

export default function Home() {
  return (
    <main>
      <SectionContainer className="bg-navy-950 text-white">
        <Badge>테스트 배지</Badge>
        <Button href="#test">테스트 버튼</Button>
        <FeatureCard icon="✨" title="테스트" description="설명" />
      </SectionContainer>
    </main>
  );
}
```

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "테스트 배지"
kill %1
```
Expected: `테스트 배지` 출력.

- [ ] **Step 7: app/page.tsx를 placeholder로 되돌리기**

Task 1의 Step 9 내용으로 복원한다 (`<main className="p-10 text-center">Coming soon</main>`).

- [ ] **Step 8: 커밋**

```bash
git add app/globals.css components/ui
git commit -m "feat: add design tokens and base UI components"
```

---

### Task 3: 헤더 & 히어로 섹션

**Files:**
- Create: `components/sections/Header.tsx`
- Create: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `Button`(from `@/components/ui/Button`), `Badge`(from `@/components/ui/Badge`)
- Produces: `Header()`, `Hero()` default-export 컴포넌트

- [ ] **Step 1: components/sections/Header.tsx 작성**

```tsx
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
```

- [ ] **Step 2: components/sections/Hero.tsx 작성**

```tsx
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="bg-navy-950 px-6 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <Badge>고객과의 접점을 늘리는 브랜드메시지 서비스</Badge>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
          세무사님 대신, 너겟이
          <br />
          매달 콘텐츠를 만들어 보내드립니다
        </h1>
        <p className="mt-6 text-lg text-gray-300">
          카카오톡 브랜드메시지 한 건으로, 고객이 세금 신고 시즌마다
          사무소를 먼저 떠올리게 하세요.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3">
          <Button href="#contact-form" className="px-8 py-4 text-base">
            무료 샘플 1건 받아보기
          </Button>
          <span className="text-sm text-gray-400">
            계약 전, 부담 없이 확인해보세요
          </span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: app/page.tsx에 임시로 연결해 검증**

`app/page.tsx`를 아래로 임시 교체:

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
    </main>
  );
}
```

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "무료 샘플 1건 받아보기"
kill %1
```
Expected: `무료 샘플 1건 받아보기` 출력.

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx components/sections/Header.tsx components/sections/Hero.tsx
git commit -m "feat: add header and hero sections"
```

---

### Task 4: 문제 정의 섹션

**Files:**
- Create: `components/sections/Problem.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `SectionContainer`
- Produces: `Problem()` 컴포넌트, `app/page.tsx`에 `<Hero />` 다음에 렌더링됨

- [ ] **Step 1: components/sections/Problem.tsx 작성**

```tsx
import SectionContainer from "@/components/ui/SectionContainer";

const POINTS = [
  "부가세·종합소득세 신고 시즌이 지나면, 고객과의 연락은 뚝 끊깁니다.",
  "그 사이 고객은 다른 세무사의 광고를 보고, '저 사무소가 더 잘 챙겨주나?' 생각합니다.",
  "접점이 없으면, 관계도 없습니다.",
];

export default function Problem() {
  return (
    <SectionContainer className="bg-navy-900 text-white">
      <h2 className="text-center text-3xl font-extrabold leading-tight md:text-4xl">
        고객이 세무사님을 찾는 건,
        <br />
        1년에 손에 꼽을 정도입니다
      </h2>
      <ul className="mx-auto mt-10 max-w-2xl space-y-4">
        {POINTS.map((point) => (
          <li key={point} className="border-l-2 border-brand-orange pl-4 text-gray-300">
            {point}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
```

- [ ] **Step 2: app/page.tsx에 연결**

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
    </main>
  );
}
```

- [ ] **Step 3: 검증**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "접점이 없으면, 관계도 없습니다"
kill %1
```
Expected: `접점이 없으면, 관계도 없습니다` 출력.

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx components/sections/Problem.tsx
git commit -m "feat: add problem statement section"
```

---

### Task 5: 사회적 증거 섹션

**Files:**
- Create: `components/sections/SocialProof.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `SectionContainer`
- Produces: `SocialProof()` 컴포넌트

- [ ] **Step 1: components/sections/SocialProof.tsx 작성**

```tsx
import SectionContainer from "@/components/ui/SectionContainer";

export default function SocialProof() {
  return (
    <SectionContainer className="bg-navy-950 text-white">
      <h2 className="text-center text-3xl font-extrabold leading-tight md:text-4xl">
        2,450만명의 고객을 가진 삼쩜삼도,
        <br />
        꾸준히 카카오톡 메시지를 보냅니다
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-center text-gray-300">
        카카오톡 메시지 한 건으로, 고객들은 세금 신고 기간마다 삼쩜삼을
        잊지 않고 찾고 있습니다.
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-gray-400">
        블로그는 검색해야 하고, 인스타그램은 알고리즘에 묻히지만, 카카오톡은
        고객이 하루에도 몇 번씩 여는 유일한 채널입니다.
      </p>
    </SectionContainer>
  );
}
```

- [ ] **Step 2: app/page.tsx에 연결 (Problem 다음)**

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <SocialProof />
    </main>
  );
}
```

- [ ] **Step 3: 검증**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "2,450만명의 고객을 가진 삼쩜삼도,"
kill %1
```
Expected: 해당 문자열 출력.

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx components/sections/SocialProof.tsx
git commit -m "feat: add social proof section"
```

---

### Task 6: 전략적 효익 섹션 (왜 효과적인가)

**Files:**
- Create: `components/sections/WhyItWorks.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `SectionContainer`, `FeatureCard`
- Produces: `WhyItWorks()` 컴포넌트

- [ ] **Step 1: components/sections/WhyItWorks.tsx 작성**

```tsx
import SectionContainer from "@/components/ui/SectionContainer";
import FeatureCard from "@/components/ui/FeatureCard";

const BENEFITS = [
  {
    icon: "🛡️",
    title: "고객 이탈 방지",
    description: "신고 시즌 외에도 접점을 유지해, 고객이 다른 세무사를 찾지 않습니다.",
  },
  {
    icon: "✨",
    title: "전문성 있는 브랜딩",
    description: "매번 다른 콘텐츠를 직접 만들 필요 없이, 전문적인 이미지를 유지합니다.",
  },
  {
    icon: "📈",
    title: "신규 상담 전환",
    description: "바이럴 효과를 통해 신규 고객을 만날 수 있습니다.",
  },
];

export default function WhyItWorks() {
  return (
    <SectionContainer className="bg-gray-50 text-navy-950">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        세무사님은 세 가지를 얻어갈 수 있습니다
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <FeatureCard key={benefit.title} {...benefit} />
        ))}
      </div>
    </SectionContainer>
  );
}
```

- [ ] **Step 2: app/page.tsx에 연결 (SocialProof 다음)**

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";
import WhyItWorks from "@/components/sections/WhyItWorks";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <SocialProof />
      <WhyItWorks />
    </main>
  );
}
```

- [ ] **Step 3: 검증**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "신규 상담 전환"
kill %1
```
Expected: `신규 상담 전환` 출력.

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx components/sections/WhyItWorks.tsx
git commit -m "feat: add why-it-works benefits section"
```

---

### Task 7: 운영적 특징 섹션 (어떻게 운영되는가)

**Files:**
- Create: `components/sections/HowItWorks.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `SectionContainer`, `FeatureCard`
- Produces: `HowItWorks()` 컴포넌트

- [ ] **Step 1: components/sections/HowItWorks.tsx 작성**

```tsx
import SectionContainer from "@/components/ui/SectionContainer";
import FeatureCard from "@/components/ui/FeatureCard";

const FEATURES = [
  {
    icon: "✍️",
    title: "직접 쓸 필요 없어요",
    description: "경제·세무 콘텐츠를 전문적으로 다루는 팀이 직접 기획하고 작성합니다.",
  },
  {
    icon: "⏰",
    title: "지속적인 접점 확보",
    description: "정기적인 발송으로 자연스럽게 세무사님을 떠올리게 합니다.",
  },
  {
    icon: "📱",
    title: "자동으로 발송해요",
    description: "플러스친구를 통해 정해진 시간에 발송됩니다.",
  },
];

export default function HowItWorks() {
  return (
    <SectionContainer className="bg-white text-navy-950">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        세무사님도 너겟과 함께라면
        <br />
        간단하게 도입할 수 있습니다
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </SectionContainer>
  );
}
```

- [ ] **Step 2: app/page.tsx에 연결 (WhyItWorks 다음)**

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";
import WhyItWorks from "@/components/sections/WhyItWorks";
import HowItWorks from "@/components/sections/HowItWorks";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <SocialProof />
      <WhyItWorks />
      <HowItWorks />
    </main>
  );
}
```

- [ ] **Step 3: 검증**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "자동으로 발송해요"
kill %1
```
Expected: `자동으로 발송해요` 출력.

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx components/sections/HowItWorks.tsx
git commit -m "feat: add how-it-works features section"
```

---

### Task 8: 콘텐츠 예시 섹션 (폰 목업)

**Files:**
- Create: `components/ui/PhoneMockup.tsx`
- Create: `components/sections/ContentExample.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `SectionContainer`
- Produces:
  - `PhoneMockup({ channelName?: string, badge: string, title: string, body: string, ctaLabel: string })`
  - `ContentExample()` 컴포넌트

- [ ] **Step 1: components/ui/PhoneMockup.tsx 작성**

```tsx
type PhoneMockupProps = {
  channelName?: string;
  badge: string;
  title: string;
  body: string;
  ctaLabel: string;
};

export default function PhoneMockup({
  channelName = "너겟 세무사",
  badge,
  title,
  body,
  ctaLabel,
}: PhoneMockupProps) {
  return (
    <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-3 shadow-lg">
      <div className="overflow-hidden rounded-[1.5rem] bg-white">
        <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
          <span className="text-sm font-semibold text-navy-950">{channelName}</span>
          <span className="text-xs text-gray-400">오후 8:00</span>
        </div>
        <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-orange/80 to-brand-red/80 px-4 text-center text-xs font-semibold text-white">
          {badge}
        </div>
        <div className="p-4">
          <h4 className="font-bold text-navy-950">{title}</h4>
          <p className="mt-2 line-clamp-4 text-sm text-gray-500">{body}</p>
          <button className="mt-4 w-full rounded-lg bg-brand-orange py-2 text-sm font-bold text-white">
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: components/sections/ContentExample.tsx 작성**

실제 발송 원고(`샘플 제작 ver0806.docx`, `브랜드메시지 디벨롭.xlsx`)에서 발췌한 샘플 3개를 사용:

```tsx
import SectionContainer from "@/components/ui/SectionContainer";
import PhoneMockup from "@/components/ui/PhoneMockup";

const SAMPLES = [
  {
    badge: "부가가치세 개정 콘텐츠",
    title: "2026년 부가가치세 달라진 점은?",
    body: "7월엔 사업자라면 누구나 2026년 상반기 부가가치세 확정신고를 해야 해요. 간이과세자 기준이 1억 400만 원으로 오르고, 가짜 세금계산서 가산세율은 4%로 상승한 게 대표적이에요.",
    ctaLabel: "세무사 상담 신청하기",
  },
  {
    badge: "법인차량 관련 콘텐츠",
    title: "법인차로 여행가도 탈세 아니에요",
    body: "연두색 번호판을 단 법인차로 여행가면 탈세라고 생각하는 대표님들이 있어요. 법인차를 개인적으로 쓰는 건 전혀 문제가 되지 않아요. 그런데 '이렇게' 처리하면 탈세가 될 수 있어 조심해야 해요.",
    ctaLabel: "자세히 보러가기",
  },
  {
    badge: "사업자 필수 체크 콘텐츠",
    title: "사업자 냈다면, 이건 무조건 해야 해요!",
    body: "딱 한번만 세팅해두면 계속해서 비용처리를 받을 수 있는 항목이 있습니다. AI 구독료, 핸드폰 요금 결제 카드 등록부터 꼭 확인해보세요.",
    ctaLabel: "바로 확인하기",
  },
];

export default function ContentExample() {
  return (
    <SectionContainer id="content-example" className="bg-gray-50 text-navy-950">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        콘텐츠 솔루션을 도입해
        <br />
        지속적으로 유용한 콘텐츠를 발송하세요
      </h2>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {SAMPLES.map((sample) => (
          <PhoneMockup key={sample.title} {...sample} />
        ))}
      </div>
    </SectionContainer>
  );
}
```

- [ ] **Step 3: app/page.tsx에 연결 (HowItWorks 다음)**

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";
import WhyItWorks from "@/components/sections/WhyItWorks";
import HowItWorks from "@/components/sections/HowItWorks";
import ContentExample from "@/components/sections/ContentExample";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <SocialProof />
      <WhyItWorks />
      <HowItWorks />
      <ContentExample />
    </main>
  );
}
```

- [ ] **Step 4: 검증**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "법인차로 여행가도 탈세 아니에요"
kill %1
```
Expected: `법인차로 여행가도 탈세 아니에요` 출력.

- [ ] **Step 5: 커밋**

```bash
git add app/page.tsx components/ui/PhoneMockup.tsx components/sections/ContentExample.tsx
git commit -m "feat: add content example section with phone mockups"
```

---

### Task 9: 제작 프로세스 섹션

**Files:**
- Create: `components/sections/Process.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `SectionContainer`
- Produces: `Process()` 컴포넌트

- [ ] **Step 1: components/sections/Process.tsx 작성**

```tsx
import SectionContainer from "@/components/ui/SectionContainer";

const STEPS = [
  { step: 1, title: "콘텐츠 기획", description: "너겟이 리서치 및 콘텐츠 작성" },
  {
    step: 2,
    title: "콘텐츠 확인",
    description: "발송 일주일 전, 세무사님께 전달 및 확인 요청",
  },
  {
    step: 3,
    title: "콘텐츠 발송",
    description: "세무사님 플러스친구로 정해진 시간에 콘텐츠 발송",
  },
];

export default function Process() {
  return (
    <SectionContainer className="bg-white text-navy-950">
      <h2 className="text-center text-3xl font-extrabold md:text-4xl">
        콘텐츠 제작 프로세스
      </h2>
      <p className="mt-3 text-center text-gray-500">
        기획부터 발송까지, 3단계로 진행됩니다
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((item) => (
          <div
            key={item.step}
            className="rounded-2xl border border-gray-200 p-8 text-center"
          >
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-orange to-brand-red text-sm font-bold text-white">
              {item.step}
            </span>
            <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
```

- [ ] **Step 2: app/page.tsx에 연결 (ContentExample 다음)**

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";
import WhyItWorks from "@/components/sections/WhyItWorks";
import HowItWorks from "@/components/sections/HowItWorks";
import ContentExample from "@/components/sections/ContentExample";
import Process from "@/components/sections/Process";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <SocialProof />
      <WhyItWorks />
      <HowItWorks />
      <ContentExample />
      <Process />
    </main>
  );
}
```

- [ ] **Step 3: 검증**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "콘텐츠 제작 프로세스"
kill %1
```
Expected: `콘텐츠 제작 프로세스` 출력.

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx components/sections/Process.tsx
git commit -m "feat: add process section"
```

---

### Task 10: 요금제 선택 컨텍스트 & 요금제 섹션

**Files:**
- Create: `components/PlanSelectionContext.tsx`
- Create: `components/sections/Pricing.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces:
  - `type PlanId = "none" | "light" | "standard" | "premium"`
  - `PlanSelectionProvider({ children: ReactNode })` — client component
  - `usePlanSelection(): { selectedPlan: PlanId; selectPlan: (plan: PlanId) => void }`
  - `Pricing()` — client component, `usePlanSelection`의 `selectPlan`을 호출하고 `#contact-form`으로 스크롤
- Consumes (다음 태스크에서): `usePlanSelection`은 Task 12의 `FinalCta`가 `selectedPlan`을 읽어 폼 select 기본값으로 사용한다.

- [ ] **Step 1: components/PlanSelectionContext.tsx 작성**

```tsx
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
```

- [ ] **Step 2: components/sections/Pricing.tsx 작성**

```tsx
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
    <SectionContainer id="pricing" className="bg-white text-navy-950">
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
```

- [ ] **Step 3: app/page.tsx에 연결 (Process 다음, PlanSelectionProvider로 감싸기)**

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";
import WhyItWorks from "@/components/sections/WhyItWorks";
import HowItWorks from "@/components/sections/HowItWorks";
import ContentExample from "@/components/sections/ContentExample";
import Process from "@/components/sections/Process";
import Pricing from "@/components/sections/Pricing";
import { PlanSelectionProvider } from "@/components/PlanSelectionContext";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <SocialProof />
      <WhyItWorks />
      <HowItWorks />
      <ContentExample />
      <Process />
      <PlanSelectionProvider>
        <Pricing />
      </PlanSelectionProvider>
    </main>
  );
}
```

- [ ] **Step 4: 검증**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "이 플랜으로 문의하기" | head -1
kill %1
```
Expected: `이 플랜으로 문의하기` 출력. (버튼 클릭 시 스크롤/상태 변경 동작은 Task 13에서 `#contact-form`이 실제로 존재하게 된 뒤 브라우저로 최종 확인한다.)

- [ ] **Step 5: 커밋**

```bash
git add app/page.tsx components/PlanSelectionContext.tsx components/sections/Pricing.tsx
git commit -m "feat: add plan selection context and pricing section"
```

---

### Task 11: 문의 폼 검증 로직, 이메일 발송, API 라우트

**Files:**
- Create: `lib/validation.ts`
- Create: `lib/email.ts`
- Create: `app/api/contact/route.ts`

**Interfaces:**
- Consumes: 환경변수 `RESEND_API_KEY`, `CONTACT_EMAIL_TO` (이미 `.env.local`에 설정되어 있음)
- Produces:
  - `contactFormSchema: ZodSchema`, `type ContactFormInput = { name: string; phone: string; email: string; plan: "light" | "standard" | "premium" | "none"; message?: string }` — Task 12의 `FinalCta`가 이 타입에 맞춰 요청 바디를 만든다.
  - `sendContactNotification(data: ContactFormInput): Promise<{ skipped: true } | { skipped: false; id?: string }>`
  - `POST /api/contact` — Task 12의 `FinalCta`가 호출하는 엔드포인트. 성공 시 `{ ok: true }` (200), 검증 실패 시 `{ error: "invalid_input", fieldErrors }` (400), 발송 실패 시 `{ error: "send_failed" }` (500)

- [ ] **Step 1: 의존성 설치**

Run: `npm install zod resend`

- [ ] **Step 2: lib/validation.ts 작성**

```ts
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(9, "연락처를 입력해주세요"),
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  plan: z.enum(["light", "standard", "premium", "none"]).default("none"),
  message: z.string().optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
```

- [ ] **Step 3: lib/email.ts 작성**

```ts
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
```

- [ ] **Step 4: app/api/contact/route.ts 작성**

```ts
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
```

- [ ] **Step 5: 검증 — 잘못된 입력 (400)**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{}'
kill %1
```
Expected: `{"error":"invalid_input","fieldErrors":{...}}` 형태의 JSON, 필드별 에러 메시지 포함.

- [ ] **Step 6: 검증 — 정상 입력 (200, 실제 이메일 발송)**

`.env.local`에 이미 유효한 `RESEND_API_KEY`가 있으므로 실제로 이메일이 발송된다. 테스트용임을 명확히 표시한다.

Run:
```bash
npm run start &
sleep 2
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"[테스트] 무시해주세요","phone":"010-0000-0000","email":"test@example.com","plan":"standard","message":"API 라우트 검증용 테스트 제출입니다."}'
kill %1
```
Expected: `{"ok":true}` 출력. `won@nugget.im` 수신함에 `[너겟 세무사] 무료 샘플 신청 - [테스트] 무시해주세요` 제목의 메일이 도착했는지 확인한다.

- [ ] **Step 7: 커밋**

```bash
git add lib/validation.ts lib/email.ts app/api/contact/route.ts package.json package-lock.json
git commit -m "feat: add contact form validation and email API route"
```

---

### Task 12: 최종 CTA 섹션 (문의 폼 UI)

**Files:**
- Create: `components/sections/FinalCta.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `usePlanSelection`(Task 10), `POST /api/contact`(Task 11), `ContactFormInput` 필드 이름(`name`, `phone`, `email`, `plan`, `message`)
- Produces: `FinalCta()` — client component, `id="contact-form"` 섹션

- [ ] **Step 1: components/sections/FinalCta.tsx 작성**

```tsx
"use client";

import { useState, type FormEvent } from "react";
import SectionContainer from "@/components/ui/SectionContainer";
import { usePlanSelection } from "@/components/PlanSelectionContext";

type SubmitState = "idle" | "loading" | "success" | "error";

const PLAN_OPTIONS = [
  { value: "none", label: "선택 안 함" },
  { value: "light", label: "Light" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
] as const;

export default function FinalCta() {
  const { selectedPlan } = usePlanSelection();
  const [status, setStatus] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      plan: (form.elements.namedItem("plan") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("request_failed");
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
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-semibold">
            연락처 *
          </label>
          <input
            id="phone"
            name="phone"
            required
            placeholder="010-0000-0000"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
          />
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
        {status === "error" && (
          <p className="text-center text-sm font-semibold text-red-600">
            전송에 실패했습니다. won@nugget.im으로 직접 문의해주세요.
          </p>
        )}
      </form>
    </SectionContainer>
  );
}
```

- [ ] **Step 2: app/page.tsx에 연결 (Pricing과 함께 PlanSelectionProvider 안에 배치)**

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";
import WhyItWorks from "@/components/sections/WhyItWorks";
import HowItWorks from "@/components/sections/HowItWorks";
import ContentExample from "@/components/sections/ContentExample";
import Process from "@/components/sections/Process";
import Pricing from "@/components/sections/Pricing";
import FinalCta from "@/components/sections/FinalCta";
import { PlanSelectionProvider } from "@/components/PlanSelectionContext";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <SocialProof />
      <WhyItWorks />
      <HowItWorks />
      <ContentExample />
      <Process />
      <PlanSelectionProvider>
        <Pricing />
        <FinalCta />
      </PlanSelectionProvider>
    </main>
  );
}
```

- [ ] **Step 3: 검증**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "무료 샘플 신청하기"
kill %1
```
Expected: `무료 샘플 신청하기` 출력.

브라우저로 `npm run dev` 실행 후 `http://localhost:3000`에서 직접 폼을 제출해, 요금제 카드의 "이 플랜으로 문의하기" 클릭 시 폼까지 스크롤되고 관심 플랜 select가 해당 플랜으로 채워지는지 확인한다.

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx components/sections/FinalCta.tsx
git commit -m "feat: add final CTA section with contact form"
```

---

### Task 13: 푸터 & 전체 페이지 조립 마무리

**Files:**
- Create: `components/sections/Footer.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: 없음
- Produces: `Footer()` 컴포넌트, 최종 `app/page.tsx` (모든 섹션 순서대로 조립 완료)

- [ ] **Step 1: components/sections/Footer.tsx 작성**

```tsx
export default function Footer() {
  return (
    <footer className="bg-navy-950 px-6 py-10 text-center text-sm text-gray-400">
      <p>주식회사 너겟 | 문의: won@nugget.im</p>
      <p className="mt-2">© 2026 nugget. All rights reserved.</p>
    </footer>
  );
}
```

- [ ] **Step 2: app/page.tsx 최종 형태로 작성**

```tsx
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import SocialProof from "@/components/sections/SocialProof";
import WhyItWorks from "@/components/sections/WhyItWorks";
import HowItWorks from "@/components/sections/HowItWorks";
import ContentExample from "@/components/sections/ContentExample";
import Process from "@/components/sections/Process";
import Pricing from "@/components/sections/Pricing";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";
import { PlanSelectionProvider } from "@/components/PlanSelectionContext";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Problem />
      <SocialProof />
      <WhyItWorks />
      <HowItWorks />
      <ContentExample />
      <Process />
      <PlanSelectionProvider>
        <Pricing />
        <FinalCta />
      </PlanSelectionProvider>
      <Footer />
    </main>
  );
}
```

- [ ] **Step 3: 검증**

Run:
```bash
npm run build && npm run start &
sleep 2
curl -s http://localhost:3000 | grep -o "주식회사 너겟"
kill %1
```
Expected: `주식회사 너겟` 출력.

- [ ] **Step 4: 커밋**

```bash
git add app/page.tsx components/sections/Footer.tsx
git commit -m "feat: add footer and assemble full landing page"
```

---

### Task 14: 최종 QA (빌드/린트/타입체크 + 수동 확인)

**Files:** 없음 (검증 전용 태스크, 필요 시 발견된 문제를 이전 태스크의 파일에 직접 수정)

**Interfaces:** 없음

- [ ] **Step 1: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없이 종료.

- [ ] **Step 2: 린트**

Run: `npm run lint`
Expected: 에러 없이 종료 (경고는 허용).

- [ ] **Step 3: 프로덕션 빌드**

Run: `npm run build`
Expected: `Compiled successfully`, 정적 페이지로 `/`와 `/api/contact`가 생성됨.

- [ ] **Step 4: 수동 QA 체크리스트**

`npm run dev` 실행 후 `http://localhost:3000`에서 브라우저로 아래 항목을 확인한다:

- [ ] 모바일 폭(375px)과 데스크톱 폭(1440px)에서 레이아웃이 깨지지 않는다
- [ ] 히어로/문제 정의/사회적 증거 섹션의 다크 배경에서 텍스트 명암비가 충분히 읽힌다
- [ ] 콘텐츠 예시 섹션의 폰 목업 3개가 가독성 있게 표시된다
- [ ] 요금제 카드의 "이 플랜으로 문의하기" 클릭 시 문의 폼까지 스무스 스크롤되고, 관심 플랜 select가 해당 플랜으로 미리 채워진다
- [ ] 문의 폼에 실제 값을 입력해 제출하면 "신청이 접수되었습니다" 메시지가 뜨고, `won@nugget.im`에 메일이 도착한다
- [ ] 필수 필드를 비운 채 제출하면 브라우저 기본 유효성 검사(`required`)로 제출이 막힌다

- [ ] **Step 5: 발견된 문제 수정**

체크리스트에서 문제가 발견되면 해당 컴포넌트 파일을 직접 수정하고, Step 1~3을 다시 실행해 통과를 확인한다.

- [ ] **Step 6: 최종 커밋**

```bash
git add -A
git commit -m "chore: final QA pass for landing page"
```

Push는 실행하지 않는다. 모든 태스크가 끝나면 사용자에게 `git push origin main` 실행 여부를 확인한다.
