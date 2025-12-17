"use client";

import { usePathname } from "next/navigation";
import { getPageTitle, getPageDescription } from "@/lib/metadata";
import { Globe, Link2 } from "lucide-react";

interface PageHeaderProps {
  showUrl?: boolean;
  showDescription?: boolean;
  className?: string;
}

/**
 * PageHeader component displays the current page title, URL, and description
 * Based on the current pathname
 */
export function PageHeader({
  showUrl = true,
  showDescription = true,
  className = "",
}: PageHeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const description = getPageDescription(pathname);

  // Get the full URL (client-side only)
  const fullUrl =
    typeof window !== "undefined" ? window.location.href : pathname;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Page Title */}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

      {/* Current URL Display */}
      {showUrl && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link2 className="h-4 w-4" />
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">
            {pathname}
          </code>
        </div>
      )}

      {/* Page Description */}
      {showDescription && (
        <p className="text-sm text-muted-foreground max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Compact URL display component for showing just the current URL
 */
export function CurrentUrl({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      <Globe className="h-4 w-4" />
      <span className="font-medium">Current Page:</span>
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">
        {pathname}
      </code>
    </div>
  );
}
