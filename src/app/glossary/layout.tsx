import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Browse 446 CS, ML, and NLP terms with definitions and formal explanations.",
};

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
