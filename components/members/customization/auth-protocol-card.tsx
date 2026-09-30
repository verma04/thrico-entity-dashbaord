"use client";

import React from "react";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { AuthMethod } from "./types";
import { Mail, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

interface AuthProtocolCardProps {
  authMethod: AuthMethod;
  onChange: (method: AuthMethod) => void;
}

export function AuthProtocolCard({ authMethod, onChange }: AuthProtocolCardProps) {
  const options: Array<{
    id: AuthMethod;
    title: string;
    description: string;
    badge?: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "BOTH",
      title: "Email & Google",
      description: "Allow sign in with Email OTP passcode or 1-click Google OAuth.",
      badge: "Recommended",
      icon: (
        <div className="flex items-center -space-x-1 shrink-0">
          <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
            <Mail className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="w-5 h-5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-xs">
            <GoogleSvg className="w-2.5 h-2.5" />
          </div>
        </div>
      ),
    },
    {
      id: "EMAIL_ONLY",
      title: "Email OTP Only",
      description: "Require email verification via a secure one-time passcode.",
      icon: (
        <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
          <Mail className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        </div>
      ),
    },
    {
      id: "GOOGLE_ONLY",
      title: "Google SSO Only",
      description: "Fast 1-click login using Google Workspace or Gmail account.",
      icon: (
        <div className="w-5 h-5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-2xs shrink-0">
          <GoogleSvg className="w-3 h-3" />
        </div>
      ),
    },
  ];

  return (
    <PolarisFormCard
      icon={ShieldCheck}
      title="Authentication & Login Protocol"
      description="Configure how members verify their identity when registering and signing into your community."
      badge="Identity"
    >
      <div className="space-y-2.5">
        <div
          role="radiogroup"
          aria-label="Authentication Protocol"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
        >
          {options.map((opt) => {
            const isSelected = authMethod === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => onChange(opt.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(opt.id);
                  }
                }}
                className={cn(
                  "relative flex flex-col justify-between text-left p-3 rounded-lg border transition-all duration-150 group cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500",
                  isSelected
                    ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/25 dark:border-blue-500 shadow-2xs ring-1 ring-blue-500/20"
                    : "border-zinc-200/90 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                )}
              >
                {/* Header row: Icon + Title + (Badge) + Radio Check indicator */}
                <div className="flex items-center justify-between gap-1.5 w-full mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {opt.icon}
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {opt.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {opt.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                        {opt.badge}
                      </span>
                    )}
                    <div
                      className={cn(
                        "w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors",
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400"
                      )}
                    >
                      {isSelected && <CheckCircle2 className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* Concise description */}
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-2">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Compact Informative Status Bar */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 text-[11px]">
          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">
              Active Protocol:{" "}
              <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">
                {authMethod === "BOTH"
                  ? "Email OTP + Google SSO"
                  : authMethod === "EMAIL_ONLY"
                  ? "Email OTP Passcode"
                  : "Google 1-Click SSO"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {(authMethod === "BOTH" || authMethod === "EMAIL_ONLY") && (
              <Badge
                variant="outline"
                className="bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9.5px] px-1.5 py-0 h-4 flex items-center gap-1 font-normal border-zinc-200 dark:border-zinc-700"
              >
                <Mail className="w-2.5 h-2.5 text-blue-500" />
                Email
              </Badge>
            )}
            {(authMethod === "BOTH" || authMethod === "GOOGLE_ONLY") && (
              <Badge
                variant="outline"
                className="bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9.5px] px-1.5 py-0 h-4 flex items-center gap-1 font-normal border-zinc-200 dark:border-zinc-700"
              >
                <GoogleSvg className="w-2.5 h-2.5" />
                Google
              </Badge>
            )}
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
}
