"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Smartphone } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Dashboard", href: "/mobile-app/android" },
  { name: "Google Play", href: "/mobile-app/android/google-play" },
  { name: "History", href: "/mobile-app/android/history" },
  { name: "Errors", href: "/mobile-app/android/errors" },
  { name: "Updates", href: "/mobile-app/android/updates" },
  { name: "Publish", href: "/mobile-app/android/publish" },
  { name: "Settings", href: "/mobile-app/android/settings" },
];

export default function AndroidTabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Android App Management"
        description="Manage your custom Android application for the Google Play Store."
        icon={Smartphone}
      />

      <div className="w-full">
        <div className="mb-6 grid w-full grid-cols-4 md:grid-cols-7 lg:w-[750px] items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "bg-background text-foreground shadow"
                    : "hover:bg-background/50 hover:text-foreground"
                )}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
        
        {children}
      </div>
    </div>
  );
}
