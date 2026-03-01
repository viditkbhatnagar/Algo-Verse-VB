import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}
