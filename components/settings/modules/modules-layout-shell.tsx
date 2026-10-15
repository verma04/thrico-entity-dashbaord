"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Puzzle,
  AlertCircle,
  Smartphone,
  LayoutGrid,
  Monitor,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useModulesContext } from "./modules-context";

interface ModulesLayoutShellProps {
  children: React.ReactNode;
}

export function ModulesLayoutShell({ children }: ModulesLayoutShellProps) {
  const pathname = usePathname();
  const {
    modules,
    filteredModules,
    searchTerm,
    enabledCount,
    navCount,
    webNavCount,
    loading,
    error,
    notification,
    showExportModal,
    setShowExportModal,
    hasChanged,
    saved,
    saving,
    saveChanges,
    onReset,
  } = useModulesContext();

  const isMobileNav =
    pathname.startsWith("/settings/modules/mobile-nav") ||
    pathname.startsWith("/settings/modules/navigation");
  const isWebNav =
    pathname.startsWith("/settings/modules/web-nav") ||
    pathname.startsWith("/settings/modules/web-navigation");
  const isRegistry = !isMobileNav && !isWebNav;

  const breadcrumbs = [
    { label: "Settings", href: "/settings" },
    { label: "Modules", href: "/settings/modules" },
    ...(isMobileNav ? [{ label: "Mobile Nav" }] : []),
    ...(isWebNav ? [{ label: "Web Nav" }] : []),
  ];

  const tabs = [
    {
      key: "registry",
      label: "Registry",
      href: "/settings/modules",
      icon: LayoutGrid,
      isActive: isRegistry,
    },
    {
      key: "mobile-nav",
      label: "Mobile Nav",
      href: "/settings/modules/mobile-nav",
      icon: Smartphone,
      isActive: isMobileNav,
    },
    {
      key: "web-nav",
      label: "Web Nav",
      href: "/settings/modules/web-nav",
      icon: Monitor,
      isActive: isWebNav,
    },
  ];

  // --- Loading state ---
  if (loading) {
    return (
      <EcosystemWrapper>
        <div className="rounded-xl border border-border/80 bg-card shadow-sm p-5 animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-3 w-64 bg-muted rounded" />
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted/50 rounded-lg" />
          ))}
        </div>
      </EcosystemWrapper>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <EcosystemWrapper>
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-red-800">
              Failed to load modules
            </p>
            <p className="text-[12px] text-red-600 mt-0.5">{error.message}</p>
          </div>
        </div>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      {/* Page header */}
      <EcosystemHeader
        title="Modules"
        description="Activate, configure and sequence modular capabilities across your entity."
        breadcrumbs={breadcrumbs}
        icon={Puzzle}
        badgeText="Platform"
        showLiveIndicator={false}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 text-xs font-medium bg-card border-border shadow-2xs text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-8 space-y-6">
          {/* Notification toast */}
          {notification && (
            <div
              className={cn(
                "flex items-start gap-3 px-4 py-3 rounded-xl border",
                notification.type === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-emerald-50 border-emerald-200",
              )}
            >
              <div
                className={cn(
                  "w-1.5 h-4 rounded-full shrink-0 mt-0.5",
                  notification.type === "error"
                    ? "bg-red-500"
                    : "bg-emerald-500",
                )}
              />
              <div>
                <p
                  className={cn(
                    "text-[12px] font-semibold leading-none",
                    notification.type === "error"
                      ? "text-red-700"
                      : "text-emerald-700",
                  )}
                >
                  {notification.message}
                </p>
                {notification.description && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Main card */}
          <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
            {/* Card header with tab links + stats */}
            <div className="px-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-card">
              <nav className="flex items-center gap-0 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Link
                      key={tab.key}
                      href={tab.href}
                      className={cn(
                        "group/tab relative px-4 py-3 text-[12px] font-medium transition-colors duration-150 outline-none whitespace-nowrap flex items-center gap-1.5",
                        tab.isActive
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 transition-colors duration-150 shrink-0",
                          tab.isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover/tab:text-foreground",
                        )}
                      />
                      <span className="leading-none">{tab.label}</span>

                      {/* Active underline indicator */}
                      {tab.isActive && (
                        <motion.div
                          layoutId="modules-tab-underline"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground dark:bg-white"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.4,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2 py-2 sm:py-0 px-2 sm:px-0">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md">
                  {enabledCount} / {modules.length} active
                </span>
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-md">
                  {webNavCount} in web nav
                </span>
                <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 px-2.5 py-1 rounded-md">
                  {navCount} / 3 mobile nav
                </span>
              </div>
            </div>

            {/* Page content */}
            {children}
          </div>
        </div>
      </EcosystemContainer>

      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={saved}
        isSaving={saving}
        onSave={saveChanges}
        onReset={onReset}
      />

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="modules"
        description="Export all entity module activation statuses, categories, and navigation configurations as CSV."
        totalCount={modules.length}
        matchingCount={searchTerm.trim() ? filteredModules.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredModules;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: "No modules found." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Module Name", getValue: (m) => m.name || "" },
            { header: "Category", getValue: (m) => m.category || "" },
            { header: "Enabled", getValue: (m) => m.enabled ? "Active" : "Disabled" },
            { header: "Required", getValue: (m) => m.required ? "Yes" : "No" },
            { header: "Web Navigation", getValue: (m) => m.showInWebNavigation ? "Yes" : "No" },
            { header: "Mobile Navigation", getValue: (m) => m.showInMobileNavigation ? "Yes" : "No" },
            { header: "Public Facing", getValue: (m) => m.isPublicFacing ? "Yes" : "No" },
            { header: "Popular", getValue: (m) => m.isPopular ? "Yes" : "No" },
          ]);
          downloadCsv(csv, `modules-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} module${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
