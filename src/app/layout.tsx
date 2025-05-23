import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Add timestamp to force cache refresh
const cacheBuster = Date.now();

export const metadata: Metadata = {
  title: "Pluse BNPL - Сервис рассрочки для предпринимателей",
  description: "Pluse BNPL - платформа рассрочки платежей для бизнеса",
  icons: {
    icon: [
      { url: `/favicon-pluse.ico?v=${cacheBuster}` },
      { url: `/favicon.png?v=${cacheBuster}`, type: 'image/png' }
    ],
  },
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
        <link rel="icon" href={`/images/favicon.ico?v=${cacheBuster}`} />
        <link rel="shortcut icon" href={`/images/favicon.ico?v=${cacheBuster}`} />
        <link rel="icon" href={`/favicon-pluse.ico?v=${cacheBuster}`} />
        <link rel="icon" href={`/favicon.png?v=${cacheBuster}`} type="image/png" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-slate-50`}>
        <QueryProvider>
        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
