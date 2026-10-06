"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { MemberCustomizationKpis } from "./member-customization-kpi";
import { useMemberCustomization } from "./member-customization-context";
import {
  RotateCcw,
  Sparkles,
  Plus,
  Layers,
  ShieldCheck,
  Type,
  Gift,
  Eye,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MemberCustomizationLayoutShellProps {
  children: ReactNode;
}

export function MemberCustomizationLayoutShell({
  children,
}: MemberCustomizationLayoutShellProps) {
  const pathname = usePathname();
  const {
    formik,
    isSaving,
    isSaved,
    isRefreshing,
    handleManualRefresh,
    handleReset,
    setStartersDrawerOpen,
    setAddFieldDrawerOpen,
  } = useMemberCustomization();

  const isTabActive = (href: string) => {
    if (pathname === href) return true;
    if (
      href === "/members/settings/customization/fields" &&
      pathname === "/members/settings/customization"
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="w-full pb-20 space-y-6">
      {/* ── Sub-header Action Bar (UTM EcosystemHeader Actions Style) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-border/60">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Registration & Gatekeeping Protocols
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure member sign-in methods, CSV whitelist rosters, regex patterns, and referral loops.
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
            onClick={() => setAddFieldDrawerOpen(true)}
            className="h-8 rounded-lg gap-1.5 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Field</span>
          </Button>
        </div>
      </div>

      {/* ── KPI Summary Cards (UTM UtmKpiSummary Style) ── */}
      <MemberCustomizationKpis config={formik.values} />

      {/* ── Sub-Nav Tabs Strip (UTM CampaignNavTab Style) ── */}
      <div className="border-b border-border/60 bg-muted/20 px-2 sm:px-4 py-1.5 rounded-xl flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-2xs">
        {/* Tab 1: Custom Registration Fields */}
        <Link
          href="/members/settings/customization/fields"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/members/settings/customization/fields")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Layers className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          <span>Custom Registration Inputs</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5"
          >
            {formik.values.customFields.length}
          </Badge>
        </Link>

        {/* Tab 2: Authentication & SSO */}
        <Link
          href="/members/settings/customization/auth"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/members/settings/customization/auth")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Authentication & SSO</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5 hidden sm:inline-flex"
          >
            {formik.values.authMethod === "BOTH"
              ? "Email & Google"
              : formik.values.authMethod === "EMAIL_ONLY"
              ? "Email"
              : "Google"}
          </Badge>
        </Link>

        {/* Tab 3: Auth Page Text */}
        <Link
          href="/members/settings/customization/text"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/members/settings/customization/text")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Type className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Login / Signup Text</span>
        </Link>

        {/* Tab 4: Referral & Invites */}
        <Link
          href="/members/settings/customization/referral"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/members/settings/customization/referral")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Gift className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          <span>Referral & Invites</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5 hidden sm:inline-flex"
          >
            {!formik.values.referral.enabled
              ? "Off"
              : formik.values.referral.required
              ? "Mandatory"
              : "Optional"}
          </Badge>
        </Link>

        {/* Tab: Terms & Conditions Agreement */}
        <Link
          href="/members/settings/customization/terms"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/members/settings/customization/terms")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <FileText className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
          <span>Terms & Legal</span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 font-normal bg-muted text-muted-foreground rounded-full ml-0.5 hidden sm:inline-flex"
          >
            {!formik.values.termsAndConditions?.enabled
              ? "Off"
              : formik.values.termsAndConditions?.required
              ? "Mandatory"
              : "Optional"}
          </Badge>
        </Link>

        {/* Tab 5: Live Onboarding Simulator */}
        <Link
          href="/members/settings/customization/preview"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0",
            isTabActive("/members/settings/customization/preview")
              ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/60 font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Live Onboarding Preview</span>
        </Link>
      </div>

      {/* ── Active Tab Page Content ── */}
      {children}

      {/* Floating Save Panel using Formik dirty state and actions */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={isSaved}
        isSaving={isSaving || formik.isSubmitting}
        onSave={() => formik.handleSubmit()}
        onReset={handleReset}
        saveButtonText="Save Changes"
        discardButtonText="Discard"
      />
    </div>
  );
}
