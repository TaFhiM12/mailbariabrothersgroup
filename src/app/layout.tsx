import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Manrope,
  Noto_Sans_Bengali,
} from "next/font/google";
import "./globals.css";
import { AuthInitializer } from "@/components/shared/auth-initializer";
import { PageTitle } from "@/components/shared/page-title";
import { Toaster } from "sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mailbaria Brothers Group",
    template: "%s | Mailbaria Brothers Group",
  },
  description: "Savings management dashboard for Mailbaria Brothers Group",
  icons: {
    icon: [
      {
        url: "/icon.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${notoSansBengali.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthInitializer />
        <PageTitle />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
