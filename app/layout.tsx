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
  openGraph: {
    title: "너겟 세무사 | 고객과의 접점을 늘리는 브랜드메시지 서비스",
    description:
      "세무사님 대신 너겟이 매달 카카오톡 브랜드메시지 콘텐츠를 만들어 보내드립니다. 지금 무료 샘플을 받아보세요.",
    locale: "ko_KR",
  },
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
