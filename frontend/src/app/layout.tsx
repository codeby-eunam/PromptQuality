import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptQuality",
  description: "질문의 품질을 점수와 신호등으로 확인하는 도구"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
