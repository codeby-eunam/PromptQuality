import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptQuality",
  description: "A tool that scores question quality with a traffic light result."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
