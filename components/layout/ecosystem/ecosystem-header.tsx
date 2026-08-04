"use client";

import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface BreadcrumbType {
  label: string;
  href?: string;
}

interface EcosystemHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badgeText?: string;
  breadcrumb?: string;
  breadcrumbs?: BreadcrumbType[];
  showLiveIndicator?: boolean;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  iconClassName?: string;
  className?: string;
  dark?: boolean;
}

export function EcosystemHeader({
  title,
  description,
  icon: Icon,
  badgeText = "Ecosystem Hub",
  breadcrumb: _breadcrumb,
  breadcrumbs,
  showLiveIndicator = true,
  actions,
  children,
  iconClassName,
  className,
  dark = false,
}: EcosystemHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start justify-between gap-4 py-1 m-3 mb-0 pb-0",
        className,
      )}
    >
      {/* Left: Content */}
      <div className="flex flex-col gap-3.5 min-w-0">
        {/* Icon + Text */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="relative shrink-0 mt-0">
            <div
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center border transition-colors",
                dark
                  ? "bg-foreground/10 text-foreground border-foreground/15"
                  : "bg-primary text-primary-foreground border-primary/20",
                iconClassName,
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
            {showLiveIndicator && (
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2",
                  "border-background",
                )}
              >
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              {breadcrumbs && breadcrumbs.length > 0 ? (
                <div className="flex items-center flex-wrap gap-1.5 text-base tracking-tight leading-none">
                  {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={index}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className={cn(
                              "font-medium transition-colors hover:text-foreground",
                              dark
                                ? "text-muted-foreground hover:text-white"
                                : "text-muted-foreground",
                            )}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span
                            className={cn(
                              "font-semibold",
                              dark ? "text-white" : "text-foreground",
                            )}
                          >
                            {item.label}
                          </span>
                        )}
                        {!isLast && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground/60 shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <h1
                  className={cn(
                    "text-base font-semibold tracking-tight leading-none",
                    dark ? "text-white" : "text-foreground",
                  )}
                >
                  {title}
                </h1>
              )}

              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium leading-none",
                  dark
                    ? "bg-foreground/5 border-foreground/15 text-muted-foreground"
                    : "bg-muted border-border text-muted-foreground",
                )}
              >
                {badgeText}
              </span>
            </div>
            <p
              className={cn(
                "mt-0.5 text-xs leading-relaxed truncate max-w-md",
                dark ? "text-muted-foreground" : "text-muted-foreground",
              )}
            >
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Children + Actions */}
      {(children || actions) && (
        <div className="flex items-center gap-2 shrink-0 pt-1">
          {children}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
    </div>
  );
}
