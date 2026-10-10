import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";
import { BasketProvider } from "@/context/basket";
import { CustomerProvider } from "@/context/customer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mockup — TCC",
  description: "App de mockup de telas, sem auth nem backend.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CustomerProvider>
          <BasketProvider>{children}</BasketProvider>
        </CustomerProvider>
      </body>
    </html>
  );
}
