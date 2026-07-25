import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { WebSocketProvider } from "@/providers/WebSocketProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Sportz | Real-Time Live Dashboard",
  description: "Live scores, real-time commentary, and sports administrative dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} flex flex-col min-h-screen relative`}>
        <WebSocketProvider>
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none" />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pt-24 z-10">
            {children}
          </main>
        </WebSocketProvider>
      </body>
    </html>
  );
}

