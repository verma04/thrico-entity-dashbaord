"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { MediaGalleryDeveloperKpis } from "./media-gallery-developer-kpis";
import { useMediaGalleryDeveloper } from "./media-gallery-developer-context";
import { MediaGalleryDeveloperStartersDrawer } from "./media-gallery-developer-starters-drawer";
import {
  RotateCcw,
  Sparkles,
  UploadCloud,
  ShieldCheck,
  KeyRound,
  Globe,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaGalleryDeveloperLayoutShellProps {
  children: ReactNode;
}

export function MediaGalleryDeveloperLayoutShell({
  children,
}: MediaGalleryDeveloperLayoutShellProps) {
  const pathname = usePathname();
  const {
    formik,
    client,
    pendingCount,
    isSaving,
    isSaved,
    isRefreshing,
    handleManualRefresh,
    handleReset,
    startersDrawerOpen,
    setStartersDrawerOpen,
    applyPreset,
  } = useMediaGalleryDeveloper();

  const isTabActive = (href: string) => {
    if (pathname === href) return true;
    if (
      href === "/media-gallery/developer/policy" &&
      (pathname === "/media-gallery/developer" || pathname === "/media-gallery/developer/")
    ) {
      return true;
    }
    return false;
  };

  const allowedDomainsCount = client?.allowedDomains?.length || 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pt-6 pb-24 space-y-6">
      {/* ── Sub-header Action Bar (Polaris / Customization Style) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 pt-1 border-b border-border/60">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Media Gallery Developer & SDK Hub
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure client upload policies, review queue, embed widgets, API credentials, and CORS whitelists.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-all"
            title="Reload Settings"
          >
            <RotateCcw size={13} className={cn(isRefreshing && "animate-spin")} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setStartersDrawerOpen(true)}
            className="h-8 rounded-lg text-xs gap-1.5 font-medium border-border cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-800"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Preset Recipes</span>
          </Button>

          <Button
            size="sm"
            onClick={() => formik.handleSubmit()}
            disabled={isSaving || !formik.dirty}
            className="h-8 rounded-lg gap-1.5 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving…" : "Save Policy"}</span>
          </Button>
        </div>
      </div>

      {/* ── KPI Summary Cards (Polaris 4-Card Style) ── */}
      <MediaGalleryDeveloperKpis />

      {/* ── Sub-Nav Tabs Strip (Pills Nav Style) ── */}
      <div className="border-b border-border/60 bg-muted/20 px-2 sm:px-4 py-1.5 rounded-xl flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-2xs">
        {/* Tab 1: Upload Policy & Quotas */}
        <Link
          href="/media-gallery/developer/policy"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/media-gallery/developer/policy")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <UploadCloud className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
          <span>Upload Policy & Quotas</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5"
          >
            {formik.values.allowThirdPartyUploads ? "Permitted" : "Paused"}
          </Badge>
        </Link>

        {/* Tab 2: Submissions & Moderation Queue */}
        <Link
          href="/media-gallery/developer/submissions"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/media-gallery/developer/submissions")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Submissions & Review Queue</span>
          {pendingCount > 0 ? (
            <Badge
              variant="default"
              className="text-[10px] px-1.5 py-0 font-bold bg-amber-500 text-white rounded-full ml-0.5"
            >
              {pendingCount} Pending
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5"
            >
              0
            </Badge>
          )}
        </Link>

        {/* Tab 3: Embed Code & SDK Snippets */}
        <Link
          href="/media-gallery/developer/embed"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/media-gallery/developer/embed")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>Embed Code & SDK Snippets</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5 hidden sm:inline-flex"
          >
            HTML & React
          </Badge>
        </Link>

        {/* Tab 4: API Credentials & Security */}
        <Link
          href="/media-gallery/developer/credentials"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/media-gallery/developer/credentials")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <KeyRound className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
          <span>API Credentials & Security</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5 hidden sm:inline-flex"
          >
            Live Key
          </Badge>
        </Link>

        {/* Tab 5: Allowed CORS Domains */}
        <Link
          href="/media-gallery/developer/domains"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/media-gallery/developer/domains")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Globe className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Allowed CORS Domains</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5 hidden sm:inline-flex"
          >
            {allowedDomainsCount}
          </Badge>
        </Link>
      </div>

      {/* ── Active Tab Page Content ── */}
      {children}

      {/* ── Floating Save Panel on Dirty Formik State ── */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={isSaved}
        isSaving={isSaving || formik.isSubmitting}
        onSave={() => formik.handleSubmit()}
        onReset={handleReset}
        saveButtonText="Save Policy Changes"
        discardButtonText="Discard"
      />

      {/* ── Starter Presets Drawer ── */}
      <MediaGalleryDeveloperStartersDrawer
        open={startersDrawerOpen}
        onOpenChange={setStartersDrawerOpen}
        onSelectPreset={applyPreset}
      />
    </div>
  );
}
