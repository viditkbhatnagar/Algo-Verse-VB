import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Your bookmarked algorithms for quick reference.",
};

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
