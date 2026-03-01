import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Algorithms",
  description:
    "Compare two algorithms side-by-side with animated visualizations and complexity analysis.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
