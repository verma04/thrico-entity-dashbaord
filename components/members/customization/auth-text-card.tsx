"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthPageTexts, DEFAULT_AUTH_TEXTS } from "./types";
import {
  RotateCcw,
  LogIn,
  UserPlus,
  Sparkles,
  ArrowRight,
  Compass,
  Briefcase,
  Crown,
  Rocket,
  MousePointerClick,
  Info,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AuthTextCardProps {
  authTexts: AuthPageTexts;
  entityName?: string;
  onChange: (updates: Partial<AuthPageTexts>) => void;
}

interface TonePreset {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  badge: string;
  badgeClass: string;
  login: Partial<AuthPageTexts>;
  signup: Partial<AuthPageTexts>;
}

const TONE_PRESETS: TonePreset[] = [
  {
    id: "community",
    name: "Community & Social",
    icon: Compass,
    description: "Warm, engaging, and community-first tone for member networks.",
    badge: "Popular",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    login: {
      loginTagline: "WELCOME BACK",
      loginTitle: "Good to see you again!",
      loginDescription: "Sign in to catch up with fellow members, events, and latest discussions.",
      loginButtonText: "Enter Community",
      loginFooterText: "New to the community?",
      loginFooterLink: "Join us today",
    },
    signup: {
      signupTagline: "JOIN THE COMMUNITY",
      signupTitle: "Become a member today",
      signupDescription: "Connect with thousands of creators, mentors, and peers building together.",
      signupButtonText: "Claim Your Spot",
      signupFooterText: "Already a member?",
      signupFooterLink: "Sign in here",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise & Professional",
    icon: Briefcase,
    description: "Polished, trust-focused, and concise for corporate organizations.",
    badge: "B2B",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
    login: {
      loginTagline: "SECURE PORTAL",
      loginTitle: "Sign in to your account",
      loginDescription: "Enter your registered email or Google account to continue to your workspace.",
      loginButtonText: "Sign In to Workspace",
      loginFooterText: "Need an account?",
      loginFooterLink: "Request Access",
    },
    signup: {
      signupTagline: "GET STARTED",
      signupTitle: "Create your organization account",
      signupDescription: "Set up your verified member profile to access company tools and resources.",
      signupButtonText: "Complete Registration",
      signupFooterText: "Already registered?",
      signupFooterLink: "Access portal",
    },
  },
  {
    id: "exclusive",
    name: "VIP & Private Cohort",
    icon: Crown,
    description: "High-status voice for private alpha clubs or gated cohorts.",
    badge: "Exclusive",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
    login: {
      loginTagline: "PRIVATE ACCESS",
      loginTitle: "Members Only Portal",
      loginDescription: "Provide your authenticated identity to unlock private cohort spaces.",
      loginButtonText: "Verify & Enter",
      loginFooterText: "Have an invitation key?",
      loginFooterLink: "Redeem invite",
    },
    signup: {
      signupTagline: "BY INVITATION",
      signupTitle: "Apply for Cohort Membership",
      signupDescription: "Complete the onboarding application to verify credentials with our council.",
      signupButtonText: "Submit Application",
      signupFooterText: "Existing member?",
      signupFooterLink: "Direct sign in",
    },
  },
  {
    id: "growth",
    name: "High-Velocity SaaS",
    icon: Rocket,
    description: "Action-driven, punchy copy geared toward high conversion velocity.",
    badge: "High Conversion",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    login: {
      loginTagline: "WELCOME BACK",
      loginTitle: "Jump back into action",
      loginDescription: "Continue where you left off and keep leveling up your accomplishments.",
      loginButtonText: "Launch Dashboard",
      loginFooterText: "Don't have an account?",
      loginFooterLink: "Sign up in 30s",
    },
    signup: {
      signupTagline: "LEVEL UP",
      signupTitle: "Start your journey now",
      signupDescription: "Get instant access to tools, rewards, leaderboards, and exclusive perks.",
      signupButtonText: "Get Instant Access",
      signupFooterText: "Already got an account?",
      signupFooterLink: "Log in now",
    },
  },
];

export function AuthTextCard({
  authTexts,
  entityName = "Your Community",
  onChange,
}: AuthTextCardProps) {
  const [activeSection, setActiveSection] = useState<"login" | "signup">("login");
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  const handleFieldChange = (field: keyof AuthPageTexts, value: string) => {
    onChange({ [field]: value });
  };

  const handleApplyPreset = (preset: TonePreset) => {
    const updates = activeSection === "login" ? preset.login : preset.signup;
    onChange(updates);
    setAppliedPresetId(preset.id);
    setTimeout(() => setAppliedPresetId(null), 2500);
    toast.success(`Applied "${preset.name}" tone preset to ${activeSection === "login" ? "Login" : "Signup"}!`);
  };

  const handleResetSection = (section: "login" | "signup") => {
    if (section === "login") {
      onChange({
        loginTagline: DEFAULT_AUTH_TEXTS.loginTagline,
        loginTitle: DEFAULT_AUTH_TEXTS.loginTitle,
        loginDescription: DEFAULT_AUTH_TEXTS.loginDescription,
        loginFooterText: DEFAULT_AUTH_TEXTS.loginFooterText,
        loginFooterLink: DEFAULT_AUTH_TEXTS.loginFooterLink,
        loginButtonText: DEFAULT_AUTH_TEXTS.loginButtonText,
      });
    } else {
      onChange({
        signupTagline: DEFAULT_AUTH_TEXTS.signupTagline,
        signupTitle: DEFAULT_AUTH_TEXTS.signupTitle,
        signupDescription: DEFAULT_AUTH_TEXTS.signupDescription,
        signupFooterText: DEFAULT_AUTH_TEXTS.signupFooterText,
        signupFooterLink: DEFAULT_AUTH_TEXTS.signupFooterLink,
        signupButtonText: DEFAULT_AUTH_TEXTS.signupButtonText,
      });
    }
    toast.info(`${section === "login" ? "Login" : "Signup"} copy reset to system defaults.`);
  };

  // Insert token into title or description
  const handleInsertToken = (field: keyof AuthPageTexts, token: string) => {
    const currentValue = authTexts[field] || "";
    const updated = currentValue ? `${currentValue} ${token}` : token;
    onChange({ [field]: updated });
    toast.success(`Inserted ${token} token.`);
  };

  // Revert single field
  const handleRevertField = (field: keyof AuthPageTexts) => {
    onChange({ [field]: DEFAULT_AUTH_TEXTS[field] });
    toast.info(`Reverted "${field}" to default.`);
  };

  // Calculate customized counts
  const loginKeys: (keyof AuthPageTexts)[] = [
    "loginTagline",
    "loginTitle",
    "loginDescription",
    "loginButtonText",
    "loginFooterText",
    "loginFooterLink",
  ];
  const signupKeys: (keyof AuthPageTexts)[] = [
    "signupTagline",
    "signupTitle",
    "signupDescription",
    "signupButtonText",
    "signupFooterText",
    "signupFooterLink",
  ];

  const loginCustomCount = loginKeys.filter(
    (k) => (authTexts[k] || DEFAULT_AUTH_TEXTS[k]) !== DEFAULT_AUTH_TEXTS[k]
  ).length;

  const signupCustomCount = signupKeys.filter(
    (k) => (authTexts[k] || DEFAULT_AUTH_TEXTS[k]) !== DEFAULT_AUTH_TEXTS[k]
  ).length;

  // Active fields mapping based on mode
  const currentTaglineField = activeSection === "login" ? "loginTagline" : "signupTagline";
  const currentTitleField = activeSection === "login" ? "loginTitle" : "signupTitle";
  const currentDescField = activeSection === "login" ? "loginDescription" : "signupDescription";
  const currentBtnField = activeSection === "login" ? "loginButtonText" : "signupButtonText";
  const currentFooterTextField = activeSection === "login" ? "loginFooterText" : "signupFooterText";
  const currentFooterLinkField = activeSection === "login" ? "loginFooterLink" : "signupFooterLink";

  const taglineVal = authTexts[currentTaglineField] || DEFAULT_AUTH_TEXTS[currentTaglineField];
  const titleVal = authTexts[currentTitleField] || DEFAULT_AUTH_TEXTS[currentTitleField];
  const descVal = authTexts[currentDescField] || DEFAULT_AUTH_TEXTS[currentDescField];
  const btnVal = authTexts[currentBtnField] || DEFAULT_AUTH_TEXTS[currentBtnField];
  const footerTextVal = authTexts[currentFooterTextField] || DEFAULT_AUTH_TEXTS[currentFooterTextField];
  const footerLinkVal = authTexts[currentFooterLinkField] || DEFAULT_AUTH_TEXTS[currentFooterLinkField];

  const isTaglineCustom = taglineVal !== DEFAULT_AUTH_TEXTS[currentTaglineField];
  const isTitleCustom = titleVal !== DEFAULT_AUTH_TEXTS[currentTitleField];
  const isDescCustom = descVal !== DEFAULT_AUTH_TEXTS[currentDescField];
  const isBtnCustom = btnVal !== DEFAULT_AUTH_TEXTS[currentBtnField];
  const isFooterTextCustom = footerTextVal !== DEFAULT_AUTH_TEXTS[currentFooterTextField];
  const isFooterLinkCustom = footerLinkVal !== DEFAULT_AUTH_TEXTS[currentFooterLinkField];

  return (
    <div className="space-y-5">
      {/* ── Mode Switcher & Quick Reset Bar ── */}
      <div className="rounded-xl border border-border/70 p-3.5 bg-card shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                ★
              </span>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                Target Auth Screen
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
              Select which authentication modal view you want to customize.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleResetSection(activeSection)}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset {activeSection === "login" ? "Login" : "Signup"} Defaults</span>
          </Button>
        </div>

        {/* High-Contrast Interactive Segmented Control */}
        <div className="grid grid-cols-2 gap-2 bg-muted/40 p-1 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => setActiveSection("login")}
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer",
              activeSection === "login"
                ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/70"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <LogIn className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Login Screen Copy</span>
            {loginCustomCount > 0 ? (
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full ml-1"
              >
                {loginCustomCount} edited
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 text-muted-foreground rounded-full ml-1"
              >
                Default
              </Badge>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("signup")}
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer",
              activeSection === "signup"
                ? "bg-white dark:bg-zinc-800 text-foreground shadow-2xs border border-border/70"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <UserPlus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Signup Screen Copy</span>
            {signupCustomCount > 0 ? (
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full ml-1"
              >
                {signupCustomCount} edited
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 text-muted-foreground rounded-full ml-1"
              >
                Default
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* ── Curated Voice & Tone Presets Strip ── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
              Curated Voice Presets ({activeSection === "login" ? "Login" : "Signup"})
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground">Click to apply full copy theme</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {TONE_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isApplied = appliedPresetId === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={cn(
                  "flex flex-col text-left p-3 rounded-lg border transition-all duration-150 group cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500",
                  isApplied
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500"
                    : "border-border/70 hover:border-border bg-muted/20 hover:bg-muted/40"
                )}
              >
                <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded-md bg-background border border-border/60">
                      <Icon className="h-3 w-3 text-foreground" />
                    </div>
                    <span className="text-xs font-bold text-foreground">{preset.name}</span>
                  </div>
                  {isApplied ? (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 bg-emerald-100 text-emerald-800 border-emerald-300">
                      <Check className="h-2.5 w-2.5 mr-0.5" /> Applied
                    </Badge>
                  ) : (
                    <Badge variant="outline" className={cn("text-[9px] px-1 py-0", preset.badgeClass)}>
                      {preset.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section 1: Hero Header & Value Proposition ── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              1
            </span>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                Hero Header & Value Proposition
              </h3>
              <p className="text-[11px] text-muted-foreground leading-snug">
                The primary headline and welcoming tagline greeting members when the {activeSection} modal opens.
              </p>
            </div>
          </div>
        </div>

        {/* Eyebrow Tagline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-foreground">Eyebrow Tagline</Label>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal text-muted-foreground">
                Header Badge
              </Badge>
              {isTaglineCustom && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full"
                >
                  Customized
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono">
                {taglineVal.length}/30
              </span>
              {isTaglineCustom && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevertField(currentTaglineField)}
                  className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Revert to default"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
          </div>

          <Input
            value={taglineVal}
            onChange={(e) => handleFieldChange(currentTaglineField, e.target.value)}
            placeholder={DEFAULT_AUTH_TEXTS[currentTaglineField]}
            className="h-9 text-xs font-mono tracking-wider uppercase"
          />

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <p className="text-[11px] text-muted-foreground leading-snug">
              Appears in subtle uppercase above the main modal title. Keep it punchy (1–3 words).
            </p>
            {/* Quick chips */}
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              {["WELCOME BACK", "GET STARTED", "MEMBERS ONLY", "PRIVATE ACCESS"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleFieldChange(currentTaglineField, chip)}
                  className="text-[10px] px-1.5 py-0.5 rounded border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Title (H1) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-foreground">Main Modal Headline</Label>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal text-muted-foreground">
                H1 Title
              </Badge>
              {isTitleCustom && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full"
                >
                  Customized
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono">
                {titleVal.length}/50
              </span>
              {isTitleCustom && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevertField(currentTitleField)}
                  className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Revert to default"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="relative">
            <Input
              value={titleVal}
              onChange={(e) => handleFieldChange(currentTitleField, e.target.value)}
              placeholder={DEFAULT_AUTH_TEXTS[currentTitleField]}
              className="h-9 text-xs font-semibold pr-24"
            />
            <button
              type="button"
              onClick={() => handleInsertToken(currentTitleField, `{${entityName}}`)}
              className="absolute right-1.5 top-1.5 px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-[10px] font-medium text-foreground border border-border/70 cursor-pointer transition-colors"
              title={`Insert current entity name: ${entityName}`}
            >
              + {entityName}
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground leading-snug">
            Default: <span className="font-mono text-[10px] text-foreground">{DEFAULT_AUTH_TEXTS[currentTitleField]}</span>
          </p>
        </div>

        {/* Modal Description */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-foreground">Sub-headline & Description</Label>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal text-muted-foreground">
                Body Copy
              </Badge>
              {isDescCustom && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full"
                >
                  Customized
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono">
                {descVal.length}/160
              </span>
              {isDescCustom && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevertField(currentDescField)}
                  className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Revert to default"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
          </div>

          <Textarea
            value={descVal}
            onChange={(e) => handleFieldChange(currentDescField, e.target.value)}
            placeholder={DEFAULT_AUTH_TEXTS[currentDescField]}
            rows={2}
            className="text-xs min-h-[64px] resize-none"
          />

          <p className="text-[11px] text-muted-foreground leading-snug">
            Highlight exclusive access, discussions, community perks, or onboarding expectations.
          </p>
        </div>
      </div>

      {/* ── Section 2: Primary Call-to-Action (CTA) ── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              2
            </span>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                Primary Call-To-Action (CTA)
              </h3>
              <p className="text-[11px] text-muted-foreground leading-snug">
                The high-visibility button label submitted by members to confirm registration or login.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-foreground">Action Button Label</Label>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal text-muted-foreground">
                Submit CTA
              </Badge>
              {isBtnCustom && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full"
                >
                  Customized
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-mono">
                {btnVal.length}/30
              </span>
              {isBtnCustom && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevertField(currentBtnField)}
                  className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Revert to default"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
          </div>

          <Input
            value={btnVal}
            onChange={(e) => handleFieldChange(currentBtnField, e.target.value)}
            placeholder={DEFAULT_AUTH_TEXTS[currentBtnField]}
            className="h-9 text-xs font-medium"
          />

          {/* Quick chip options */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <p className="text-[11px] text-muted-foreground leading-snug">
              Tip: Action-driven phrases like &quot;Join Community&quot; outperform generic &quot;Submit&quot;.
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {(activeSection === "login"
                ? ["Login to Community", "Sign In to Workspace", "Enter Portal"]
                : ["Join Community", "Create Account & Join", "Claim Your Spot"]
              ).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleFieldChange(currentBtnField, chip)}
                  className="text-[10px] px-1.5 py-0.5 rounded border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic Live Button Component Preview */}
          <div className="mt-3 p-3 rounded-lg border border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MousePointerClick className="h-3.5 w-3.5 text-blue-600" />
              <span>Preview rendered button:</span>
            </div>
            <button
              type="button"
              disabled
              className="py-1.5 px-4 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 opacity-90 cursor-default"
            >
              <span>{btnVal}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Section 3: Navigation & Footer Mode Switcher ── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              3
            </span>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                Footer Navigation & Mode Switcher
              </h3>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Allows visitors on your landing page to toggle between Sign In and Registration dialogs.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Footer Prompt Text */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold text-foreground">Prompt Question</Label>
                {isFooterTextCustom && (
                  <Badge
                    variant="secondary"
                    className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full"
                  >
                    Customized
                  </Badge>
                )}
              </div>
              {isFooterTextCustom && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevertField(currentFooterTextField)}
                  className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Revert to default"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>

            <Input
              value={footerTextVal}
              onChange={(e) => handleFieldChange(currentFooterTextField, e.target.value)}
              placeholder={DEFAULT_AUTH_TEXTS[currentFooterTextField]}
              className="h-9 text-xs"
            />
            <p className="text-[11px] text-muted-foreground leading-snug">
              e.g. &quot;{activeSection === "login" ? "Don't have an account?" : "Already have an account?"}&quot;
            </p>
          </div>

          {/* Footer Link Text */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs font-semibold text-foreground">Clickable Link Anchor</Label>
                {isFooterLinkCustom && (
                  <Badge
                    variant="secondary"
                    className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full"
                  >
                    Customized
                  </Badge>
                )}
              </div>
              {isFooterLinkCustom && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevertField(currentFooterLinkField)}
                  className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Revert to default"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>

            <Input
              value={footerLinkVal}
              onChange={(e) => handleFieldChange(currentFooterLinkField, e.target.value)}
              placeholder={DEFAULT_AUTH_TEXTS[currentFooterLinkField]}
              className="h-9 text-xs text-blue-600 dark:text-blue-400 font-semibold"
            />
            <p className="text-[11px] text-muted-foreground leading-snug">
              e.g. &quot;{activeSection === "login" ? "Register" : "Log in here"}&quot;
            </p>
          </div>
        </div>

        {/* Live Combined Footer Preview */}
        <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center gap-1.5 text-xs">
          <span className="text-muted-foreground">{footerTextVal}</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer">
            {footerLinkVal}
          </span>
        </div>
      </div>

      {/* ── Dynamic Tokens Notice Card ── */}
      <div className="p-3.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20 flex items-start gap-3">
        <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-foreground">
            Dynamic Workspace Brand Variables
          </span>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            You can inject dynamic entity tokens like <code className="font-mono text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-100/70 dark:bg-indigo-900/50 px-1 py-0.5 rounded text-[10px]">&#123;entityName&#125;</code> into any title or description field. The platform resolves this dynamically to your community name (currently: <strong className="text-foreground">{entityName}</strong>).
          </p>
        </div>
      </div>
    </div>
  );
}
