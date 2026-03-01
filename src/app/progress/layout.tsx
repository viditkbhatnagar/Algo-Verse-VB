import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Dashboard",
  description:
    "Track your algorithm learning progress, streaks, and achievements.",
};

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
