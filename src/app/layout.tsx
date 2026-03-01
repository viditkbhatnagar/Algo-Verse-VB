import type { Metadata, Viewport } from "next";
import { ClientShell } from "@/components/layout/ClientShell";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

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
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClientShell>{children}</ClientShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
