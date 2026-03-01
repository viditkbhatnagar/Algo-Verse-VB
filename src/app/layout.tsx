import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ClientShell } from "@/components/layout/ClientShell";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AlgoVerse — Interactive Algorithm Learning Platform",
    template: "%s | AlgoVerse",
  },
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://algoverse.vercel.app"
  ),
  openGraph: {
    title: "AlgoVerse — Interactive Algorithm Learning Platform",
    description:
      "Learn 300+ algorithms through animated step-by-step visualizations and AI-powered explanations.",
    type: "website",
    locale: "en_US",
    siteName: "AlgoVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoVerse — Interactive Algorithm Learning Platform",
    description:
      "Learn 300+ algorithms through animated step-by-step visualizations and AI-powered explanations.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
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
        </ThemeProvider>
      </body>
    </html>
  );
}
