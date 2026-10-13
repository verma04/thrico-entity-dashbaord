/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import {
  AuthPageTexts,
  DEFAULT_AUTH_TEXTS,
  HeaderAlignment,
  HeaderImagePlacement,
} from "./types";
import {
  RotateCcw,
  LogIn,
  UserPlus,
  Sparkles,
  Compass,
  Briefcase,
  Crown,
  Rocket,
  Info,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
  LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AuthTextCardProps {
  authTexts?: AuthPageTexts;
  entityName?: string;
  activeSection?: "login" | "signup";
  onSectionChange?: (section: "login" | "signup") => void;
  onChange: (updates: Partial<AuthPageTexts>) => void;
}

interface TonePreset {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  login: Partial<AuthPageTexts>;
  signup: Partial<AuthPageTexts>;
}

const TONE_PRESETS: TonePreset[] = [
  {
    id: "community",
    name: "Community",
    icon: Compass,
    description: "Warm, engaging, and welcoming tone for member networks.",
    login: {
      loginHeaderAlignment: "center",
      loginTagline: "WELCOME BACK",
      loginTitle: "Good to see you again!",
      loginDescription: "Sign in to catch up with fellow members, events, and latest discussions.",
      loginButtonText: "Enter Community",
      loginFooterText: "New to the community?",
      loginFooterLink: "Join us today",
    },
    signup: {
      signupHeaderAlignment: "center",
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
    name: "Enterprise",
    icon: Briefcase,
    description: "Polished, trust-focused, and concise for corporate organizations.",
    login: {
      loginHeaderAlignment: "left",
      loginTagline: "SECURE PORTAL",
      loginTitle: "Sign in to your account",
      loginDescription: "Enter your registered email or Google account to continue to your workspace.",
      loginButtonText: "Sign In to Workspace",
      loginFooterText: "Need an account?",
      loginFooterLink: "Request Access",
    },
    signup: {
      signupHeaderAlignment: "left",
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
    name: "VIP / Cohort",
    icon: Crown,
    description: "High-status voice for private alpha clubs or gated cohorts.",
    login: {
      loginHeaderAlignment: "center",
      loginTagline: "PRIVATE ACCESS",
      loginTitle: "Members Only Portal",
      loginDescription: "Provide your authenticated identity to unlock private cohort spaces.",
      loginButtonText: "Verify & Enter",
      loginFooterText: "Have an invitation key?",
      loginFooterLink: "Redeem invite",
    },
    signup: {
      signupHeaderAlignment: "center",
      signupTagline: "BY INVITATION",
      signupTitle: "Apply for Cohort Membership",
      signupDescription: "Complete onboarding application to verify credentials with our council.",
      signupButtonText: "Submit Application",
      signupFooterText: "Existing member?",
      signupFooterLink: "Direct sign in",
    },
  },
  {
    id: "growth",
    name: "High Growth",
    icon: Rocket,
    description: "Action-driven, punchy copy geared toward high conversion velocity.",
    login: {
      loginHeaderAlignment: "center",
      loginTagline: "WELCOME BACK",
      loginTitle: "Jump back into action",
      loginDescription: "Continue where you left off and keep leveling up your accomplishments.",
      loginButtonText: "Launch Dashboard",
      loginFooterText: "Don't have an account?",
      loginFooterLink: "Sign up in 30s",
    },
    signup: {
      signupHeaderAlignment: "center",
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
  authTexts = DEFAULT_AUTH_TEXTS,
  entityName = "Your Community",
  activeSection: activeSectionProp,
  onSectionChange,
  onChange,
}: AuthTextCardProps) {
  const [internalSection, setInternalSection] = useState<"login" | "signup">("login");
  const [appliedPresetId, setAppliedPresetId] = useState<string | null>(null);

  const isControlled = activeSectionProp !== undefined;
  const activeSection = isControlled ? activeSectionProp : internalSection;

  const setActiveSection = (section: "login" | "signup") => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    if (!isControlled) {
      setInternalSection(section);
    }
  };

  const handleFieldChange = (field: keyof AuthPageTexts, value: unknown) => {
    onChange({ [field]: value });
  };

  const handleApplyPreset = (preset: TonePreset) => {
    const updates = activeSection === "login" ? preset.login : preset.signup;
    onChange(updates);
    setAppliedPresetId(preset.id);
    setTimeout(() => setAppliedPresetId(null), 2500);
    toast.success(
      `Applied "${preset.name}" preset to ${activeSection === "login" ? "Login" : "Registration"} screen.`
    );
  };

  const handleResetSection = (section: "login" | "signup") => {
    if (section === "login") {
      onChange({
        loginHeaderAlignment: DEFAULT_AUTH_TEXTS.loginHeaderAlignment,
        loginHeaderImage: DEFAULT_AUTH_TEXTS.loginHeaderImage,
        loginHeaderImagePlacement: DEFAULT_AUTH_TEXTS.loginHeaderImagePlacement,
        loginHeaderImageSize: DEFAULT_AUTH_TEXTS.loginHeaderImageSize,
        loginTagline: DEFAULT_AUTH_TEXTS.loginTagline,
        loginTitle: DEFAULT_AUTH_TEXTS.loginTitle,
        loginDescription: DEFAULT_AUTH_TEXTS.loginDescription,
        loginFooterText: DEFAULT_AUTH_TEXTS.loginFooterText,
        loginFooterLink: DEFAULT_AUTH_TEXTS.loginFooterLink,
        loginButtonText: DEFAULT_AUTH_TEXTS.loginButtonText,
      });
    } else {
      onChange({
        signupHeaderAlignment: DEFAULT_AUTH_TEXTS.signupHeaderAlignment,
        signupHeaderImage: DEFAULT_AUTH_TEXTS.signupHeaderImage,
        signupHeaderImagePlacement: DEFAULT_AUTH_TEXTS.signupHeaderImagePlacement,
        signupHeaderImageSize: DEFAULT_AUTH_TEXTS.signupHeaderImageSize,
        signupTagline: DEFAULT_AUTH_TEXTS.signupTagline,
        signupTitle: DEFAULT_AUTH_TEXTS.signupTitle,
        signupDescription: DEFAULT_AUTH_TEXTS.signupDescription,
        signupFooterText: DEFAULT_AUTH_TEXTS.signupFooterText,
        signupFooterLink: DEFAULT_AUTH_TEXTS.signupFooterLink,
        signupButtonText: DEFAULT_AUTH_TEXTS.signupButtonText,
      });
    }
    toast.info(`${section === "login" ? "Login" : "Registration"} copy reset to defaults.`);
  };

  const handleInsertToken = (field: keyof AuthPageTexts, token: string) => {
    const currentValue = (authTexts[field] as string) || "";
    const updated = currentValue ? `${currentValue} ${token}` : token;
    onChange({ [field]: updated });
    toast.success(`Inserted ${token} variable.`);
  };

  const handleRevertField = (field: keyof AuthPageTexts) => {
    onChange({ [field]: DEFAULT_AUTH_TEXTS[field] });
    toast.info(`Reset to default.`);
  };

  const formatImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) {
      return url;
    }
    return `https://cdn.thrico.network/${url}`;
  };

  // Edited counts
  const loginKeys: (keyof AuthPageTexts)[] = [
    "loginHeaderAlignment",
    "loginHeaderImage",
    "loginTagline",
    "loginTitle",
    "loginDescription",
    "loginButtonText",
    "loginFooterText",
    "loginFooterLink",
  ];
  const signupKeys: (keyof AuthPageTexts)[] = [
    "signupHeaderAlignment",
    "signupHeaderImage",
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

  // Active field mappings for Header Alignment & Imagery
  const currentHeaderAlignmentField =
    activeSection === "login" ? "loginHeaderAlignment" : "signupHeaderAlignment";
  const currentImageField =
    activeSection === "login" ? "loginHeaderImage" : "signupHeaderImage";
  const currentPlacementField =
    activeSection === "login" ? "loginHeaderImagePlacement" : "signupHeaderImagePlacement";
  const currentImageSizeField =
    activeSection === "login" ? "loginHeaderImageSize" : "signupHeaderImageSize";

  const headerAlignmentVal: HeaderAlignment =
    authTexts[currentHeaderAlignmentField] ||
    authTexts.headerAlignment ||
    "center";

  const headerImageVal: string =
    (authTexts[currentImageField] as string) || "";

  const headerPlacementVal: HeaderImagePlacement =
    authTexts[currentPlacementField] || "above";

  const headerImageSizeVal: number =
    typeof authTexts[currentImageSizeField] === "number"
      ? (authTexts[currentImageSizeField] as number)
      : headerPlacementVal === "inline"
      ? 24
      : 40;

  // Active field mappings for Text
  const currentTaglineField = activeSection === "login" ? "loginTagline" : "signupTagline";
  const currentTitleField = activeSection === "login" ? "loginTitle" : "signupTitle";
  const currentDescField = activeSection === "login" ? "loginDescription" : "signupDescription";
  const currentBtnField = activeSection === "login" ? "loginButtonText" : "signupButtonText";
  const currentFooterTextField = activeSection === "login" ? "loginFooterText" : "signupFooterText";
  const currentFooterLinkField = activeSection === "login" ? "loginFooterLink" : "signupFooterLink";

  const hasCurrentHeaderImage = Boolean(headerImageVal);

  const taglineVal =
    typeof authTexts[currentTaglineField] === "string"
      ? authTexts[currentTaglineField]
      : hasCurrentHeaderImage
      ? ""
      : DEFAULT_AUTH_TEXTS[currentTaglineField];

  const titleVal =
    typeof authTexts[currentTitleField] === "string"
      ? authTexts[currentTitleField]
      : hasCurrentHeaderImage
      ? ""
      : DEFAULT_AUTH_TEXTS[currentTitleField];

  const descVal =
    typeof authTexts[currentDescField] === "string"
      ? authTexts[currentDescField]
      : hasCurrentHeaderImage
      ? ""
      : DEFAULT_AUTH_TEXTS[currentDescField];

  const btnVal = authTexts[currentBtnField] ?? DEFAULT_AUTH_TEXTS[currentBtnField];
  const footerTextVal = authTexts[currentFooterTextField] ?? DEFAULT_AUTH_TEXTS[currentFooterTextField];
  const footerLinkVal = authTexts[currentFooterLinkField] ?? DEFAULT_AUTH_TEXTS[currentFooterLinkField];

  const isTaglineCustom = Boolean(taglineVal && taglineVal !== DEFAULT_AUTH_TEXTS[currentTaglineField]);
  const isTitleCustom = Boolean(titleVal && titleVal !== DEFAULT_AUTH_TEXTS[currentTitleField]);
  const isDescCustom = Boolean(descVal && descVal !== DEFAULT_AUTH_TEXTS[currentDescField]);
  const isBtnCustom = btnVal !== DEFAULT_AUTH_TEXTS[currentBtnField];
  const isFooterTextCustom = footerTextVal !== DEFAULT_AUTH_TEXTS[currentFooterTextField];
  const isFooterLinkCustom = footerLinkVal !== DEFAULT_AUTH_TEXTS[currentFooterLinkField];

  const taglineSuggestions =
    activeSection === "login"
      ? ["WELCOME BACK", "MEMBERS ONLY", "SIGN IN", "PORTAL ACCESS"]
      : ["GET STARTED", "JOIN COMMUNITY", "BECOME A MEMBER", "EXCLUSIVE ACCESS"];

  const buttonSuggestions =
    activeSection === "login"
      ? ["Login to Community", "Sign In to Workspace", "Enter Portal"]
      : ["Join Community", "Create Account & Join", "Claim Your Spot"];

  return (
    <div className="space-y-4">
      {/* ── Screen Selector & Quick Presets Control Bar ── */}
      <div className="rounded-xl border border-border/70 p-3.5 bg-card shadow-2xs space-y-3">
        {/* Top: Active Screen Segmented Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg border border-border/60 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveSection("login")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                activeSection === "login"
                  ? "bg-background text-foreground shadow-2xs border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LogIn className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Login Screen</span>
              {loginCustomCount > 0 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  {loginCustomCount} edited
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full text-muted-foreground bg-muted/60">
                  Default
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("signup")}
              className={cn(
                "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
                activeSection === "signup"
                  ? "bg-background text-foreground shadow-2xs border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <UserPlus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Registration Screen</span>
              {signupCustomCount > 0 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  {signupCustomCount} edited
                </span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full text-muted-foreground bg-muted/60">
                  Default
                </span>
              )}
            </button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleResetSection(activeSection)}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer self-end sm:self-auto shrink-0"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset {activeSection === "login" ? "Login" : "Registration"}</span>
          </Button>
        </div>

        {/* Bottom: Tone Presets Bar */}
        <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-semibold text-foreground text-[11px]">Voice Tone:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {TONE_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isApplied = appliedPresetId === preset.id;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  title={preset.description}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer",
                    isApplied
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700 font-semibold"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
                  )}
                >
                  {isApplied ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Icon className="h-3 w-3" />
                  )}
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Card 1: Hero Header & Value Proposition ── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        {/* Header with Title and Section Alignment Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
              1
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Hero Header & Value Proposition
                </h3>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal uppercase">
                  {headerAlignmentVal}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Headline, imagery, and alignment shown at the top of the {activeSection} modal.
              </p>
            </div>
          </div>

          {/* Section 1 Alignment Controls: Left / Center / Right */}
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/60 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                onChange({
                  [currentHeaderAlignmentField]: "left",
                  headerAlignment: "left",
                });
                toast.success(`Header aligned Left for ${activeSection === "login" ? "Login" : "Registration"}.`);
              }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                headerAlignmentVal === "left"
                  ? "bg-background text-foreground shadow-2xs border border-border/70 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Align Full Hero Header to Left"
            >
              <AlignLeft className="h-3.5 w-3.5" />
              <span className="text-[11px]">Left</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onChange({
                  [currentHeaderAlignmentField]: "center",
                  headerAlignment: "center",
                });
                toast.success(`Header aligned Center for ${activeSection === "login" ? "Login" : "Registration"}.`);
              }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                headerAlignmentVal === "center"
                  ? "bg-background text-foreground shadow-2xs border border-border/70 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Align Full Hero Header to Center"
            >
              <AlignCenter className="h-3.5 w-3.5" />
              <span className="text-[11px]">Center</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onChange({
                  [currentHeaderAlignmentField]: "right",
                  headerAlignment: "right",
                });
                toast.success(`Header aligned Right for ${activeSection === "login" ? "Login" : "Registration"}.`);
              }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                headerAlignmentVal === "right"
                  ? "bg-background text-foreground shadow-2xs border border-border/70 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Align Full Hero Header to Right"
            >
              <AlignRight className="h-3.5 w-3.5" />
              <span className="text-[11px]">Right</span>
            </button>
          </div>
        </div>

        {/* ── Headline Graphic / Illustration Setting ── */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-muted/15 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <Label className="text-xs font-semibold text-foreground">
                Headline Graphic / Artwork
              </Label>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal text-muted-foreground">
                Optional
              </Badge>
              {headerImageVal && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-normal bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-full"
                >
                  Active Artwork
                </Badge>
              )}
            </div>

            {headerImageVal && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleFieldChange(currentImageField, "");
                  toast.info("Removed headline graphic.");
                }}
                className="h-6 text-[11px] gap-1 text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                <span>Remove</span>
              </Button>
            )}
          </div>

          {headerImageVal ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg border border-border/80 bg-white dark:bg-zinc-900 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                  <img
                    src={formatImageUrl(headerImageVal)}
                    alt="Headline Graphic"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <span className="text-xs font-semibold text-foreground">
                    {headerPlacementVal === "above"
                      ? "Hero Graphic (Positioned Above Headline)"
                      : "Inline Icon (Embedded in Headline)"}
                  </span>
                  <div className="flex items-center gap-2">
                    <ImageUploadWithCrop
                      currentImage={headerImageVal}
                      onImageUpdate={(cdnUrl) => handleFieldChange(currentImageField, cdnUrl)}
                      label={`Change ${activeSection === "login" ? "Login" : "Registration"} Graphic`}
                      recommendedWidth={160}
                      recommendedHeight={160}
                      aspectRatio={1 / 1}
                      allowFreeDimensions={true}
                      defaultDimensionMode="free"
                      maxFileSize={5}
                      showDimensions={false}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 text-[11px] gap-1 cursor-pointer border-border/80 hover:border-indigo-400"
                      >
                        <UploadCloud className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Replace Artwork</span>
                      </Button>
                    </ImageUploadWithCrop>
                  </div>
                </div>
              </div>

              {/* Placement Selector: Above Headline ("Image on that") vs Inline with Headline */}
              <div className="pt-2 border-t border-border/60 space-y-1.5">
                <Label className="text-[11px] font-semibold text-foreground">
                  Graphic Position in Modal
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange(currentPlacementField, "above");
                      toast.success("Artwork positioned above headline.");
                    }}
                    className={cn(
                      "flex items-start gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer",
                      headerPlacementVal === "above"
                        ? "bg-background border-indigo-500 ring-1 ring-indigo-500 shadow-2xs"
                        : "bg-muted/30 border-border/60 hover:bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <LayoutTemplate
                      className={cn(
                        "h-4 w-4 mt-0.5 shrink-0",
                        headerPlacementVal === "above" ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"
                      )}
                    />
                    <div>
                      <span className="text-xs font-semibold text-foreground block">
                        Above Headline (Hero Graphic)
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-snug block">
                        Positioned on top of the headline as an illustration banner or emblem.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleFieldChange(currentPlacementField, "inline");
                      toast.success("Artwork positioned inline with headline.");
                    }}
                    className={cn(
                      "flex items-start gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer",
                      headerPlacementVal === "inline"
                        ? "bg-background border-indigo-500 ring-1 ring-indigo-500 shadow-2xs"
                        : "bg-muted/30 border-border/60 hover:bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <Sparkles
                      className={cn(
                        "h-4 w-4 mt-0.5 shrink-0",
                        headerPlacementVal === "inline" ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"
                      )}
                    />
                    <div>
                      <span className="text-xs font-semibold text-foreground block">
                        Inline with Headline (Title Icon)
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-snug block">
                        Embedded directly beside the main modal headline text.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Artwork Height Presets & Fine-Tune Slider */}
              <div className="pt-2 border-t border-border/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold text-foreground">
                    Artwork Height:{" "}
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      {headerImageSizeVal}px
                    </span>
                  </Label>
                  <div className="flex items-center gap-1">
                    {[
                      { label: "S", px: headerPlacementVal === "inline" ? 18 : 28 },
                      { label: "M", px: headerPlacementVal === "inline" ? 24 : 40 },
                      { label: "L", px: headerPlacementVal === "inline" ? 32 : 56 },
                      { label: "XL", px: headerPlacementVal === "inline" ? 40 : 72 },
                    ].map((sz) => (
                      <button
                        key={sz.label}
                        type="button"
                        onClick={() => handleFieldChange(currentImageSizeField, sz.px)}
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer",
                          headerImageSizeVal === sz.px
                            ? "bg-foreground text-background font-bold border-foreground"
                            : "bg-muted/40 border-border/70 hover:bg-muted text-muted-foreground"
                        )}
                      >
                        {sz.label} ({sz.px}px)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">16px</span>
                  <div className="flex-1">
                    <Slider
                      value={[headerImageSizeVal]}
                      min={16}
                      max={headerPlacementVal === "inline" ? 48 : 84}
                      step={2}
                      onValueChange={(vals) => handleFieldChange(currentImageSizeField, vals[0])}
                      className="cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {headerPlacementVal === "inline" ? "48px" : "84px"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-lg border border-dashed border-border/80 bg-background hover:bg-muted/10 transition-colors">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground block">
                  Add artwork, icon, or badge graphic
                </span>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Upload an illustration to place on top of the headline or an icon beside the headline text.
                </p>
              </div>

              <ImageUploadWithCrop
                currentImage=""
                onImageUpdate={(cdnUrl) => {
                  handleFieldChange(currentImageField, cdnUrl);
                  toast.success("Headline artwork added!");
                }}
                label={`Upload ${activeSection === "login" ? "Login" : "Registration"} Graphic`}
                recommendedWidth={160}
                recommendedHeight={160}
                aspectRatio={1 / 1}
                allowFreeDimensions={true}
                defaultDimensionMode="free"
                maxFileSize={5}
                showDimensions={false}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 cursor-pointer border-border/80 hover:border-indigo-400 font-medium shrink-0"
                >
                  <UploadCloud className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Upload Graphic</span>
                </Button>
              </ImageUploadWithCrop>
            </div>
          )}
        </div>

        {/* Eyebrow Tagline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-foreground">Eyebrow Tagline</Label>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal text-muted-foreground">
                Badge
              </Badge>
              {isTaglineCustom && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full"
                >
                  Custom
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
            placeholder={hasCurrentHeaderImage ? "Leave empty for no tagline" : DEFAULT_AUTH_TEXTS[currentTaglineField]}
            className="h-9 text-xs font-mono uppercase tracking-wider"
          />

          <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
            <p className="text-[11px] text-muted-foreground leading-snug">
              Subtle uppercase text positioned right above the main title.
            </p>
            <div className="flex items-center gap-1 shrink-0 flex-wrap">
              {taglineSuggestions.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleFieldChange(currentTaglineField, chip)}
                  className="text-[10px] px-2 py-0.5 rounded border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
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
                  Custom
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

          <Input
            value={titleVal}
            onChange={(e) => handleFieldChange(currentTitleField, e.target.value)}
            placeholder={hasCurrentHeaderImage ? "Leave empty for artwork only" : DEFAULT_AUTH_TEXTS[currentTitleField]}
            className="h-9 text-xs font-semibold"
          />

          <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
            <p className="text-[11px] text-muted-foreground leading-snug">
              Primary headline greeting members as soon as the dialog opens.
            </p>
            <button
              type="button"
              onClick={() => handleInsertToken(currentTitleField, `{entityName}`)}
              className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 cursor-pointer transition-colors"
              title={`Insert token for: ${entityName}`}
            >
              + Insert &#123;entityName&#125;
            </button>
          </div>
        </div>

        {/* Modal Description */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-foreground">Sub-headline & Description</Label>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-normal text-muted-foreground">
                Body
              </Badge>
              {isDescCustom && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full"
                >
                  Custom
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
            placeholder={hasCurrentHeaderImage ? "Leave empty for no description" : DEFAULT_AUTH_TEXTS[currentDescField]}
            rows={2}
            className="text-xs min-h-[64px] resize-none"
          />

          <p className="text-[11px] text-muted-foreground leading-snug">
            Highlight exclusive access, discussions, community perks, or onboarding expectations.
          </p>
        </div>
      </div>

      {/* ── Card 2: CTA Action Button & Footer Navigation ── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              2
            </span>
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                Call-To-Action & Navigation Switcher
              </h3>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Configure the primary submit action and the footer link to switch screens.
              </p>
            </div>
          </div>
        </div>

        {/* Submit CTA Label */}
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
                  Custom
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

          <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
            <p className="text-[11px] text-muted-foreground leading-snug">
              Action-driven phrases like &quot;Join Community&quot; drive higher conversion.
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {buttonSuggestions.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleFieldChange(currentBtnField, chip)}
                  className="text-[10px] px-2 py-0.5 rounded border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Footer Switcher */}
        <div className="pt-2 border-t border-border/50">
          <div className="mb-2">
            <Label className="text-xs font-semibold text-foreground">Footer Screen Switcher</Label>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Allows visitors on your landing page to toggle between Sign In and Registration dialogs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Footer Prompt Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-foreground">Prompt Question</span>
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
              <p className="text-[10px] text-muted-foreground">
                e.g. &quot;{activeSection === "login" ? "Don't have an account?" : "Already have an account?"}&quot;
              </p>
            </div>

            {/* Footer Link Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-foreground">Clickable Link Label</span>
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
              <p className="text-[10px] text-muted-foreground">
                e.g. &quot;{activeSection === "login" ? "Register" : "Log in here"}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Brand Token Helper Note ── */}
      <div className="p-3 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 flex items-center gap-2.5 text-xs text-muted-foreground">
        <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span>
          Dynamic token <code className="font-mono text-indigo-700 dark:text-indigo-300 font-bold bg-indigo-100/70 dark:bg-indigo-900/50 px-1 py-0.5 rounded text-[10px]">&#123;entityName&#125;</code> automatically displays your community name (<strong className="text-foreground">{entityName}</strong>).
        </span>
      </div>
    </div>
  );
}
