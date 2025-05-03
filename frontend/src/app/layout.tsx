import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pluse BNPL - Сервис рассрочки для предпринимателей",
  description: "Pluse BNPL - платформа рассрочки платежей для бизнеса",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased min-h-screen bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}
