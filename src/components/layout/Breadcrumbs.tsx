"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { getCategoryBySlug } from "@/data/categories";

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
  ];

  let path = "";
  for (let i = 0; i < segments.length; i++) {
    path += `/${segments[i]}`;
    const segment = segments[i];

    if (segment === "algorithms" && i === 0) {
      crumbs.push({ label: "Algorithms", href: path });
    } else if (i === 1 && segments[0] === "algorithms") {
      // Category slug
      const cat = getCategoryBySlug(segment);
      crumbs.push({ label: cat?.name ?? slugToTitle(segment), href: path });
    } else if (i === 2 && segments[0] === "algorithms") {
      // Algorithm slug
      crumbs.push({ label: slugToTitle(segment), href: path });
    } else {
      crumbs.push({ label: slugToTitle(segment), href: path });
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 overflow-x-auto scrollbar-thin">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            {isLast ? (
              <span className="text-foreground font-medium truncate">
                {i === 0 ? <Home className="h-3.5 w-3.5 inline" /> : crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-colors truncate"
              >
                {i === 0 ? <Home className="h-3.5 w-3.5 inline" /> : crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
