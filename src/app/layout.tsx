import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-slate-50`}>
        <QueryProvider>
        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
