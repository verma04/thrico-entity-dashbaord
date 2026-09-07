"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode;
  href: string;
  locked?: boolean;
}

export interface PlatformSettingsLayoutProps {
  children: React.ReactNode;
  headerIcon: LucideIcon;
  title: string;
  description: string;
  tabs?: Tab[];
  breadcrumb?: {
    label: string;
    href?: string;
  }[];
  badge?: string;
  layoutId?: string;
}

export function PlatformSettingsLayout({
  children,
  headerIcon: Icon,
  title,
  description,
  tabs,
  breadcrumb,
  badge,
  layoutId,
}: PlatformSettingsLayoutProps) {
  const pathname = usePathname();

  // Combine provided breadcrumb with a default 'Settings' one if appropriate
  const breadcrumbs = [
    ...(breadcrumb || []),
    { label: "Settings" }
  ];

  // Resolve active tab using exact match first, then longest matching prefix
  const activeTabId = React.useMemo(() => {
    if (!tabs || tabs.length === 0) return "";
    const exactMatch = tabs.find((t) => pathname === t.href);
    if (exactMatch) return exactMatch.id;

    const matchingTabs = tabs
      .filter((t) => pathname.startsWith(t.href.endsWith("/") ? t.href : `${t.href}/`))
      .sort((a, b) => b.href.length - a.href.length);

    return matchingTabs[0]?.id || tabs[0]?.id;
  }, [pathname, tabs]);

  const resolvedLayoutId =
    layoutId || `platform-tab-underline-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;

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
          <nav className="border-b border-border">
            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTabId === tab.id;

                const renderIcon = () => {
                  if (!tab.icon) return null;
                  if (React.isValidElement(tab.icon)) {
                    return tab.icon;
                  }
                  const IconComponent = tab.icon as React.ComponentType<{ className?: string }>;
                  return (
                    <IconComponent
                      className={cn(
                        "h-3.5 w-3.5 transition-colors duration-150 shrink-0",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover/tab:text-foreground",
                      )}
                    />
                  );
                };

                const content = (
                  <>
                    {renderIcon()}
                    <span className="leading-none">{tab.label}</span>
                    {tab.locked && <Lock className="h-3 w-3 text-muted-foreground/50 shrink-0" />}

                    {/* Active underline indicator */}
                    {isActive && !tab.locked && (
                      <motion.div
                        layoutId={resolvedLayoutId}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground dark:bg-white"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </>
                );

                const tabClass = cn(
                  "group/tab relative px-4 py-3 text-[12px] font-medium transition-colors duration-150 outline-none whitespace-nowrap flex items-center gap-1.5",
                  tab.locked
                    ? "cursor-not-allowed opacity-40 text-muted-foreground"
                    : isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                );

                if (tab.locked) {
                  return (
                    <button key={tab.id} className={tabClass} disabled>
                      {content}
                    </button>
                  );
                }

                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={tabClass}
                    draggable={false}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
          {children}
        </div>
      </EcosystemContainer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </EcosystemWrapper>
  );
}
