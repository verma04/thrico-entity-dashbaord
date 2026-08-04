"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface PlatformSettingsLayoutProps {
  children: React.ReactNode;
  headerIcon: LucideIcon;
  title: string;
  description: string;
  tabs: Tab[];
  breadcrumb?: {
    label: string;
    href?: string;
  }[];
  badge?: string;
}

export function PlatformSettingsLayout({
  children,
  headerIcon: Icon,
  title,
  description,
  tabs,
  breadcrumb,
  badge,
}: PlatformSettingsLayoutProps) {
  const pathname = usePathname();

  // Combine provided breadcrumb with a default 'Settings' one if appropriate
  const breadcrumbs = [
    ...(breadcrumb || []),
    { label: "Settings" }
  ];

  return (
    <EcosystemWrapper anonymized-1="platform-settings">
      <EcosystemHeader
        title={title}
        description={description}
        badgeText={badge || "Settings"}
        icon={Icon}
        breadcrumbs={breadcrumbs}
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        {tabs && tabs.length > 0 && (
          <div className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        )}
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
          {children}
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
