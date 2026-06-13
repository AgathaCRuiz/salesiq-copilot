import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Suppress TS error about missing type declarations for CSS module side-effect import
// @ts-ignore
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SalesIQ Copilot - Inteligência de Vendas & Atendimento",
  description: "Um copiloto inteligente para simulação de atendimento ao cliente e análise estratégica do Mercado Livre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-[#0b1329] text-slate-100 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-[#090d16]/35">
          {children}
        </main>
      </body>
    </html>
  );
}
