import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ClientShell } from "@/components/layout/ClientShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoVerse — Interactive Algorithm Learning Platform",
  description:
    "Learn algorithms, data structures, ML, deep learning, and NLP through animated step-by-step visualizations and AI-powered explanations.",
  keywords: [
    "algorithms",
    "data structures",
    "machine learning",
    "deep learning",
    "NLP",
    "visualization",
    "learning",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ClientShell>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 lg:ml-[280px] min-h-[calc(100vh-56px)] mt-14 pb-16 md:pb-0">
              {children}
            </main>
          </div>
          <MobileNav />
        </ClientShell>
      </body>
    </html>
  );
}
