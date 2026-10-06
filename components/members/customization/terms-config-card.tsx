"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { TermsAndConditionsConfig, DEFAULT_TERMS_CONFIG } from "./types";
import {
  Eye,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Scale,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

interface TermsConfigCardProps {
  termsConfig: TermsAndConditionsConfig;
  entityName?: string;
  onChange: (updates: Partial<TermsAndConditionsConfig>) => void;
}

const PRESET_TEMPLATES = [
  {
    name: "Community Guidelines",
    badge: "Recommended",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400",
    contentHtml: `<h3>Community Guidelines & Terms</h3>
<p>Welcome to our community! We are committed to fostering an inclusive, respectful, and safe space for all members.</p>
<h4>1. Respectful Interactions</h4>
<p>Treat all members with courtesy and professional respect. Harassment, discrimination, or disruptive conduct will not be tolerated.</p>
<h4>2. Confidentiality & Content Sharing</h4>
<p>Do not share private communications, proprietary data, or member details outside of this network without explicit consent.</p>
<h4>3. Account Responsibility</h4>
<p>You are responsible for all activity conducted through your authenticated member credentials.</p>`,
  },
  {
    name: "Enterprise & Professional",
    badge: "B2B",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400",
    contentHtml: `<h3>Enterprise Terms of Service</h3>
<p>These terms govern access and authorized participation in our corporate workspace network.</p>
<h4>1. Authorized User Verification</h4>
<p>Access is restricted strictly to verified organization personnel, alumni, and approved affiliate partners.</p>
<h4>2. Intellectual Property</h4>
<p>All platform materials, assets, and proprietary information remain the exclusive property of the host organization.</p>
<h4>3. Compliance & Governance</h4>
<p>Participation must strictly comply with company policies, data protection regulations, and workplace compliance rules.</p>`,
  },
  {
    name: "VIP / Gated Cohort",
    badge: "Exclusive",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-400",
    contentHtml: `<h3>Private Cohort Membership Agreement</h3>
<p>By entering this gated community, you agree to uphold the highest standards of trust and community excellence.</p>
<h4>1. Chatham House Rule</h4>
<p>Participants are free to use information received, but neither the identity nor affiliation of any speaker may be revealed.</p>
<h4>2. Active Participation</h4>
<p>Membership requires positive contributions and adherence to selective cohort guidelines.</p>`,
  },
];

export function TermsConfigCard({
  termsConfig,
  entityName = "Your Community",
  onChange,
}: TermsConfigCardProps) {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const handleApplyTemplate = (templateContent: string, templateName: string) => {
    onChange({ contentHtml: templateContent });
    toast.success(`Applied "${templateName}" terms template.`);
  };

  const handleResetToDefault = () => {
    onChange({
      enabled: DEFAULT_TERMS_CONFIG.enabled,
      required: DEFAULT_TERMS_CONFIG.required,
      checkboxLabel: DEFAULT_TERMS_CONFIG.checkboxLabel,
      linkText: DEFAULT_TERMS_CONFIG.linkText,
      contentHtml: DEFAULT_TERMS_CONFIG.contentHtml,
    });
    toast.info("Terms configuration reset to default.");
  };

  return (
    <div className="space-y-6">
      {/* ── Main Legal Configuration Card ── */}
      <div className="rounded-xl border border-border/70 bg-card p-5 shadow-2xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/40 shrink-0">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  Terms & Conditions Agreement
                </h3>
                <Badge
                  variant="outline"
                  className={
                    termsConfig.enabled
                      ? termsConfig.required
                        ? "text-[10px] bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-400"
                        : "text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400"
                      : "text-[10px] bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                  }
                >
                  {!termsConfig.enabled
                    ? "Disabled"
                    : termsConfig.required
                    ? "Mandatory Acceptance"
                    : "Optional Acceptance"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define the official terms of service, legal agreements, and mandatory checkboxes presented to new members upon registration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewModalOpen(true)}
              className="h-8 gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Eye className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
              <span>Preview Modal</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleResetToDefault}
              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Reset Terms to Default"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* ── Toggles Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toggle 1: Enable Terms */}
          <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <div className="space-y-0.5">
              <Label className="text-xs font-semibold text-foreground cursor-pointer">
                Display Terms & Conditions Checkbox
              </Label>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                When enabled, renders the agreement checkbox on the website registration and signup screens.
              </p>
            </div>
            <Switch
              checked={termsConfig.enabled}
              onCheckedChange={(val) => onChange({ enabled: val })}
              className="mt-0.5"
            />
          </div>

          {/* Toggle 2: Required */}
          <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold text-foreground cursor-pointer">
                  Mandatory Acceptance
                </Label>
                {termsConfig.required && (
                  <Badge variant="destructive" className="text-[9px] py-0 px-1">
                    Enforced
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Members must check the box before they can complete registration or sign in via Google.
              </p>
            </div>
            <Switch
              checked={termsConfig.required}
              disabled={!termsConfig.enabled}
              onCheckedChange={(val) => onChange({ required: val })}
              className="mt-0.5"
            />
          </div>
        </div>

        {/* ── Custom Labels Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Agreement Prefix Label
            </Label>
            <Input
              value={termsConfig.checkboxLabel}
              disabled={!termsConfig.enabled}
              onChange={(e) => onChange({ checkboxLabel: e.target.value })}
              placeholder="e.g. I have read and agree to the"
              className="h-9 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Text displayed before the interactive hyperlink.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Terms Hyperlink & Modal Title
            </Label>
            <Input
              value={termsConfig.linkText}
              disabled={!termsConfig.enabled}
              onChange={(e) => onChange({ linkText: e.target.value })}
              placeholder="e.g. Terms & Conditions"
              className="h-9 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Clickable anchor text that triggers the reader modal dialog.
            </p>
          </div>
        </div>

        {/* ── Preset Starter Templates ── */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-rose-500" />
              <span className="text-xs font-bold text-foreground">
                Starter Legal Templates
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              Click to replace canvas content
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_TEMPLATES.map((tpl) => (
              <button
                key={tpl.name}
                type="button"
                onClick={() => handleApplyTemplate(tpl.contentHtml, tpl.name)}
                className="p-2.5 rounded-lg border border-border/70 bg-card hover:bg-muted/40 hover:border-rose-300 dark:hover:border-rose-900 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {tpl.name}
                  </span>
                  <Badge variant="outline" className={`text-[9px] py-0 px-1 ${tpl.badgeClass}`}>
                    {tpl.badge}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-1">
                  Load structured guidelines
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Rich Text Editor ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span>Terms & Conditions Rich Text Document</span>
              </Label>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Format your community terms using headings, lists, links, bold, and quotes. This is rendered verbatim in the member modal reader.
              </p>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">
              HTML Canvas
            </div>
          </div>

          <div className="rounded-xl border border-border/80 overflow-hidden shadow-2xs bg-card focus-within:border-rose-400 transition-all">
            <RichTextEditor
              value={termsConfig.contentHtml}
              onChange={(value) => onChange({ contentHtml: value })}
              placeholder="Draft your community terms and conditions here..."
              minHeight="380px"
            />
          </div>
        </div>
      </div>

      {/* ── Interactive Modal Preview Dialog ── */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-5 pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <DialogTitle className="text-base font-bold">
                {termsConfig.linkText || "Terms & Conditions"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Simulated reader view of how members will read and accept your terms on {entityName}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 text-sm text-foreground leading-relaxed">
            <div
              className="prose dark:prose-invert max-w-none text-xs sm:text-sm"
              dangerouslySetInnerHTML={{ __html: termsConfig.contentHtml }}
            />
          </div>

          <DialogFooter className="p-4 border-t border-border/70 bg-muted/20 flex items-center justify-between gap-2 sm:justify-end">
            <div className="text-[11px] text-muted-foreground hidden sm:block mr-auto">
              Simulated member dialogue
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewModalOpen(false)}
            >
              Close Preview
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => {
                setPreviewModalOpen(false);
                toast.success("Preview verified: Acceptance simulated.");
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              <span>Simulate Accept</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
