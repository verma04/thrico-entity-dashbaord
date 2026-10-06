"use client";

import React, { useState } from "react";
import { PolarisSidebarCard } from "@/components/gamification/shared/polaris-form-ui";
import { Sparkles, ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MemberOnboardingConfig } from "./types";

// Google Icon SVG
function GoogleSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

interface LiveSignupPreviewProps {
  config: MemberOnboardingConfig;
  entityName?: string;
}

export function LiveSignupPreview({
  config,
  entityName = "Thrico Community",
}: LiveSignupPreviewProps) {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");

  const showGoogle = config.authMethod === "BOTH" || config.authMethod === "GOOGLE_ONLY";
  const showEmail = config.authMethod === "BOTH" || config.authMethod === "EMAIL_ONLY";

  // Gatekeeping fields relevant on login
  const gatekeeperFields = config.customFields.filter(
    (f) =>
      f.blockIfNotExists ||
      f.validationMode === "CSV_ROSTER" ||
      f.validationMode === "BOTH" ||
      f.validationMode === "REGEX"
  );

  const [authChoice, setAuthChoice] = useState<"google" | "email">(
    config.authMethod === "GOOGLE_ONLY" ? "google" : "email"
  );

  const isGoogleActive =
    config.authMethod === "GOOGLE_ONLY" ||
    (config.authMethod === "BOTH" && authChoice === "google");

  return (
    <PolarisSidebarCard
      title="Live Experience Preview"
      badge="Simulated View"
      icon={Sparkles}
    >
      <div className="space-y-3">
        {/* Subtitle / Mode info */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span>Member Registration & Gatekeeping</span>
          <span className="font-mono text-[10px]">interactive</span>
        </div>

        {/* Realistic Mobile / Modal Container */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 p-3 shadow-inner">
          {/* Tab switcher: Register vs Log In */}
          <div className="flex rounded-lg bg-zinc-200/70 dark:bg-zinc-800 p-0.5 mb-3 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={cn(
                "flex-1 py-1 rounded-md text-center transition-all",
                activeTab === "signup"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              )}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={cn(
                "flex-1 py-1 rounded-md text-center transition-all",
                activeTab === "login"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              )}
            >
              Log In
            </button>
          </div>

          {/* Modal Card Content */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-3 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3">
            {/* Header */}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                {activeTab === "signup"
                  ? (config.authTexts?.signupTagline || "GET STARTED")
                  : (config.authTexts?.loginTagline || "WELCOME BACK")}
              </span>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {activeTab === "signup"
                  ? (config.authTexts?.signupTitle || `Register to ${entityName}`)
                  : (config.authTexts?.loginTitle || `Sign In to ${entityName}`)}
              </h4>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                {activeTab === "signup"
                  ? (config.authTexts?.signupDescription || "Sign up to unlock exclusive features.")
                  : (config.authTexts?.loginDescription || "Log in to access your community.")}
              </p>
            </div>

            {/* Google OAuth Button */}
            {showGoogle && (
              <button
                type="button"
                onClick={() => setAuthChoice("google")}
                className={cn(
                  "w-full py-1.5 px-2.5 rounded-lg border text-[11px] font-medium flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer",
                  isGoogleActive && activeTab === "signup"
                    ? "border-blue-500/80 bg-blue-50/40 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-1 ring-blue-500/50"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200"
                )}
              >
                <GoogleSvg className="w-3.5 h-3.5" />
                <span>Continue with Google</span>
              </button>
            )}

            {/* Divider if both enabled */}
            {showGoogle && showEmail && (
              <div className="relative flex items-center justify-center my-1.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                </div>
                <button
                  type="button"
                  onClick={() => setAuthChoice(isGoogleActive ? "email" : "google")}
                  className="relative bg-white dark:bg-zinc-900 px-2 text-[9px] uppercase tracking-wider text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                >
                  or with email
                </button>
              </div>
            )}

            {/* Email field if email allowed and either email mode selected or EMAIL_ONLY */}
            {showEmail && (!isGoogleActive || config.authMethod === "EMAIL_ONLY") && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 block">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    readOnly
                    placeholder="alex@example.com"
                    className="w-full px-2 py-1 text-[11px] rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-400 cursor-default focus:outline-hidden"
                  />
                  <Mail className="w-3 h-3 text-zinc-400 absolute right-2 top-2" />
                </div>
              </div>
            )}

            {/* Google Profile Auto-Sync Banner when Google SSO is active */}
            {activeTab === "signup" && isGoogleActive && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-[10.5px] text-blue-700 dark:text-blue-300">
                <GoogleSvg className="w-3.5 h-3.5 shrink-0" />
                <span>
                  First Name & Last Name auto-synced from Google profile. No manual input needed.
                </span>
              </div>
            )}

            

            {/* Standard name inputs (shown ONLY on email signup when Google SSO is not selected) */}
            {activeTab === "signup" && !isGoogleActive && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 block">
                    First Name *
                  </label>
                  <input
                    type="text"
                    readOnly
                    placeholder="Alex"
                    className="w-full px-2 py-1 text-[11px] rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-400 cursor-default focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 block">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    readOnly
                    placeholder="Taylor"
                    className="w-full px-2 py-1 text-[11px] rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-400 cursor-default focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Referral Code Field (shown only on signup if enabled) */}
            {activeTab === "signup" && config.referral.enabled && (
              <div className="space-y-1 p-2 rounded-md bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-zinc-800 dark:text-zinc-200 block">
                    Referral Code{" "}
                    {config.referral.required ? (
                      <span className="text-red-500 font-bold">*</span>
                    ) : (
                      <span className="text-zinc-400 font-normal">(Optional)</span>
                    )}
                  </label>
                  {config.referral.required && (
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1 py-0 bg-purple-50 text-purple-700 border-purple-200"
                    >
                      Required
                    </Badge>
                  )}
                </div>
                <input
                  type="text"
                  readOnly
                  placeholder="e.g. VIP-INVITE-2026"
                  className="w-full px-2 py-1 text-[11px] rounded border border-amber-200 dark:border-amber-800 bg-white dark:bg-zinc-900 text-zinc-400 cursor-default focus:outline-hidden"
                />
              </div>
            )}

            {/* Custom Registration Fields (shown on signup) */}
            {activeTab === "signup" && config.customFields.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Additional Details & Gatekeeping
                </span>

                {config.customFields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 block truncate max-w-[170px]">
                        {field.label}{" "}
                        {field.required ? (
                          <span className="text-red-500 font-bold">*</span>
                        ) : (
                          <span className="text-zinc-400 font-normal">(Optional)</span>
                        )}
                      </label>

                      {/* Validation Badges */}
                      {field.validationMode === "CSV_ROSTER" && (
                        <Badge variant="outline" className="text-[8px] px-1 py-0 bg-purple-50 text-purple-700 border-purple-200">
                          Roster
                        </Badge>
                      )}
                      {field.validationMode === "REGEX" && (
                        <Badge variant="outline" className="text-[8px] px-1 py-0 bg-blue-50 text-blue-700 border-blue-200">
                          Regex
                        </Badge>
                      )}
                      {field.validationMode === "BOTH" && (
                        <Badge variant="outline" className="text-[8px] px-1 py-0 bg-indigo-50 text-indigo-700 border-indigo-200">
                          Dual
                        </Badge>
                      )}
                    </div>

                    {field.type === "select" ? (
                      <div className="relative">
                        <select
                          disabled
                          className="w-full appearance-none px-2 py-1 text-[11px] rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-400 cursor-default focus:outline-hidden pr-6"
                        >
                          <option>{field.placeholder || "Select an option..."}</option>
                          {field.options?.map((opt, i) => (
                            <option key={i}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-2 pointer-events-none" />
                      </div>
                    ) : field.type === "textarea" ? (
                      <textarea
                        readOnly
                        rows={2}
                        placeholder={field.placeholder || "Enter details..."}
                        className="w-full px-2 py-1 text-[11px] rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-400 cursor-default focus:outline-hidden resize-none"
                      />
                    ) : field.type === "checkbox" ? (
                      <div className="flex items-center gap-2 pt-0.5">
                        <input
                          type="checkbox"
                          disabled
                          className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 w-3.5 h-3.5"
                        />
                        <span className="text-[10px] text-zinc-600 dark:text-zinc-400">
                          {field.placeholder || "I agree to this requirement"}
                        </span>
                      </div>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        readOnly
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        className={cn(
                          "w-full px-2 py-1 text-[11px] rounded border bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-400 cursor-default focus:outline-hidden",
                          field.validationMode === "CSV_ROSTER" || field.validationMode === "BOTH"
                            ? "border-purple-200 dark:border-purple-900/60 font-mono"
                            : "border-zinc-200 dark:border-zinc-700"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Action Submit Button */}
            <button
              type="button"
              className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors mt-2"
            >
              {activeTab === "signup"
                ? (config.authTexts?.signupButtonText || "Create Account & Join")
                : (config.authTexts?.loginButtonText || "Login to Community")}
            </button>

            {/* Footer switcher */}
            <div className="text-center text-[10px] text-zinc-500 pt-1">
              <span>
                {activeTab === "signup"
                  ? (config.authTexts?.signupFooterText || "Already have an account?")
                  : (config.authTexts?.loginFooterText || "Don't have an account?")}
              </span>{" "}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === "signup" ? "login" : "signup")}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
              >
                {activeTab === "signup"
                  ? (config.authTexts?.signupFooterLink || "Log in here")
                  : (config.authTexts?.loginFooterLink || "Register")}
              </button>
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="space-y-1.5 pt-1 text-[11px]">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span>Authentication Mode:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {config.authMethod === "BOTH"
                ? "Email & Google"
                : config.authMethod === "EMAIL_ONLY"
                ? "Email Only"
                : "Google Only"}
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span>Gatekeeping Fields:</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {gatekeeperFields.length} active roster / regex filters
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span>Total Custom Fields:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {config.customFields.length} total ({config.customFields.filter((f) => f.required).length} required)
            </span>
          </div>
        </div>
      </div>
    </PolarisSidebarCard>
  );
}
