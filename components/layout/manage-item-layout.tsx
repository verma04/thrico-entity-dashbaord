"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { X, Loader2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FixedInsetMotionContainer } from "@/components/ui/fixed-inset-motion-container";
import { cn } from "@/lib/utils";

export interface ManageTabItem {
  key: string;
  label: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  path?: string;
  href?: string;
  badge?: React.ReactNode;
  count?: number | string;
  danger?: boolean;
}

export interface BreadcrumbItemConfig {
  label: string;
  href?: string;
}

export interface ManageTabsNavProps {
  tabs: ManageTabItem[];
  activeTab?: string;
  currentTab?: string;
  basePath?: string;
  layoutId?: string;
  className?: string;
  onTabChange?: (tab: ManageTabItem) => void;
}

/* ─── Standalone Reusable Tabs Navigation ───────────────────────────────── */
export function ManageTabsNav({
  tabs = [],
  activeTab,
  currentTab,
  basePath,
  layoutId = "menu-tab-underline",
  className,
  onTabChange,
}: ManageTabsNavProps) {
  const current = activeTab || currentTab;

  return (
    <div className={cn("overflow-x-auto no-scrollbar", className)}>
      <nav className="flex items-center gap-0 min-w-max">
        {tabs.map((tab) => {
          const isActive = current === tab.key;
          const Icon = tab.icon;
          const isDanger = tab.danger || tab.key === "danger-zone";
          const href =
            tab.href ||
            (basePath
              ? tab.path !== undefined
                ? tab.path
                  ? `${basePath}/${tab.path}`
                  : basePath
                : tab.key === "manage" || tab.key === ""
                  ? `${basePath}/manage`
                  : `${basePath}/${tab.key}`
              : undefined);

          const content = (
            <>
              {/* Active underline indicator */}
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-[2px] bg-foreground dark:bg-white",
                    isDanger && "bg-destructive dark:bg-destructive",
                  )}
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.4,
                  }}
                />
              )}

              {Icon && (
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 transition-colors duration-150 shrink-0",
                    isActive
                      ? isDanger
                        ? "text-destructive"
                        : "text-foreground"
                      : isDanger
                        ? "text-destructive/70 group-hover/tab:text-destructive"
                        : "text-muted-foreground group-hover/tab:text-foreground",
                  )}
                />
              )}

              <span className="leading-none">{tab.label}</span>

              {tab.count !== undefined && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] rounded-full font-semibold leading-tight",
                    isActive
                      ? "bg-foreground/10 text-foreground"
                      : "bg-muted text-muted-foreground group-hover/tab:text-foreground",
                  )}
                >
                  {tab.count}
                </span>
              )}

              {tab.badge}
            </>
          );

          const tabClassName = cn(
            "group/tab relative flex items-center gap-1.5 px-4 py-3 text-[12px] font-medium transition-colors duration-150 outline-none whitespace-nowrap",
            isActive
              ? isDanger
                ? "text-destructive"
                : "text-foreground"
              : isDanger
                ? "text-destructive/70 hover:text-destructive"
                : "text-muted-foreground hover:text-foreground",
          );

          if (onTabChange) {
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab)}
                className={tabClassName}
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={tab.key} href={href || "#"} className={tabClassName}>
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export interface ManageItemLayoutProps {
  children: React.ReactNode;
  title: string;
  loading?: boolean;
  loadingText?: string;
  coverImage?: string | null;
  defaultIcon?: LucideIcon | React.ComponentType<{ className?: string }>;
  iconContainerClassName?: string;
  status?: string | null;
  statusVariant?: "default" | "secondary" | "destructive" | "outline";
  statusColor?: string;
  badges?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  tabs?: ManageTabItem[];
  activeTab?: string;
  currentTab?: string;
  onTabChange?: (tab: ManageTabItem) => void;
  basePath?: string;
  closeHref?: string;
  onClose?: () => void;
  breadcrumbs?: BreadcrumbItemConfig[];
  layoutId?: string;
  className?: string;
  containerClassName?: string;
}

/* ─── Full Entity Manage Layout Component ───────────────────────────────── */
export function ManageItemLayout({
  children,
  title,
  loading = false,
  loadingText,
  coverImage,
  defaultIcon: DefaultIcon,
  iconContainerClassName,
  status,
  statusVariant = "secondary",
  statusColor,
  badges,
  subtitle,
  headerActions,
  tabs = [],
  activeTab,
  currentTab,
  onTabChange,
  basePath,
  closeHref,
  onClose,
  breadcrumbs,
  layoutId = "menu-tab-underline",
  className,
  containerClassName,
}: ManageItemLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (closeHref) {
      router.push(closeHref);
    } else {
      router.back();
    }
  };

  const resolvedActiveTab =
    activeTab ||
    currentTab ||
    (basePath && pathname
      ? pathname === basePath || pathname === `${basePath}/`
        ? "manage"
        : pathname.replace(`${basePath}/`, "").split("/")[0] || "manage"
      : "manage");

  return (
    <FixedInsetMotionContainer
      showAccentLine
      className={className}
      onClose={handleClose}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className={cn("max-w-7xl mx-auto px-6", containerClassName)}>
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4 min-w-0">
              {coverImage ? (
                <div className="relative shrink-0">
                  <img
                    src={
                      coverImage.startsWith("http")
                        ? coverImage
                        : `https://cdn.thrico.network/${coverImage}`
                    }
                    alt={title || "Cover"}
                    className="w-11 h-11 rounded-xl object-cover border border-border/60 shadow-sm"
                  />
                  {statusColor && (
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                        statusColor,
                      )}
                    />
                  )}
                </div>
              ) : DefaultIcon ? (
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shadow-sm",
                      iconContainerClassName,
                    )}
                  >
                    <DefaultIcon className="w-5 h-5" />
                  </div>
                  {statusColor && (
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                        statusColor,
                      )}
                    />
                  )}
                </div>
              ) : null}

              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-lg font-semibold tracking-tight truncate max-w-[500px]">
                    {loading ? loadingText || "Loading..." : title}
                  </h1>
                  {loading && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />
                  )}
                  {!loading && badges}
                  {!loading && status && !badges && (
                    <Badge
                      variant={statusVariant}
                      className="px-2 py-0 text-[10px] font-semibold uppercase tracking-wider rounded-md shrink-0"
                    >
                      {status}
                    </Badge>
                  )}
                </div>

                {!loading && subtitle && (
                  <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                    {subtitle}
                  </div>
                )}
              </div>
            </div>

            {/* Right actions & close */}
            <div className="flex items-center gap-2 shrink-0">
              {headerActions}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-muted/80 transition-colors"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          {tabs.length > 0 && (
            <ManageTabsNav
              tabs={tabs}
              activeTab={resolvedActiveTab}
              basePath={basePath}
              layoutId={layoutId}
              onTabChange={onTabChange}
            />
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className={cn("max-w-7xl mx-auto px-6 py-8", containerClassName)}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {isLast || !crumb.href ? (
                        <BreadcrumbPage className="text-xs font-medium">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={crumb.href}
                          className="text-xs font-medium"
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {children}
        </div>
      </div>
    </FixedInsetMotionContainer>
  );
}

export const MenuTabLayout = ManageItemLayout;
export const MenuTabsNav = ManageTabsNav;

export default ManageItemLayout;
