"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-2">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[18px] bg-primary flex items-center justify-center text-primary-foreground shadow-lg shrink-0">
            <Icon size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground leading-none">
                {title}
              </h1>
              {badge && (
                <div className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider border border-border/50">
                  {badge}
                </div>
              )}
            </div>
            <p className="text-[14px] font-medium text-muted-foreground tracking-tight">
              {description}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-[14px] border border-border/40">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all group",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="platform-tab-pill"
                    className="absolute inset-0 bg-card rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-border/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon
                  size={16}
                  strokeWidth={2}
                  className={cn(
                    "relative z-10 transition-colors",
                    isActive
                      ? "text-indigo-600"
                      : "text-muted-foreground group-hover:text-muted-foreground",
                  )}
                />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both">
        {children}
      </div>

      {/* Footer */}
      <div className="py-8 border-t border-border flex items-center justify-between">
        <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          Cloud Synchronized
        </div>
        <div className="text-[11px] font-medium text-muted-foreground">
          v4.0.26-sober
        </div>
      </div>
    </div>
  );
}
