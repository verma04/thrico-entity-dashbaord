"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AuthPageTexts, DEFAULT_AUTH_TEXTS } from "./types";
import { RotateCcw, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AuthTextCardProps {
  authTexts: AuthPageTexts;
  onChange: (updates: Partial<AuthPageTexts>) => void;
}

function TextFieldRow({
  label,
  field,
  value,
  defaultValue,
  onChange,
  isTextarea,
}: {
  label: string;
  field: string;
  value: string;
  defaultValue: string;
  onChange: (field: string, value: string) => void;
  isTextarea?: boolean;
}) {
  const isCustomized = value !== defaultValue;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium text-foreground">{label}</Label>
        {isCustomized && (
          <Badge
            variant="secondary"
            className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full"
          >
            Customized
          </Badge>
        )}
      </div>
      {isTextarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={defaultValue}
          className="text-sm min-h-[60px] resize-none"
          rows={2}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={defaultValue}
          className="text-sm"
        />
      )}
      {isCustomized && (
        <p className="text-[10px] text-muted-foreground">
          Default: <span className="font-mono">{defaultValue}</span>
        </p>
      )}
    </div>
  );
}

export function AuthTextCard({ authTexts, onChange }: AuthTextCardProps) {
  const [activeSection, setActiveSection] = React.useState<"login" | "signup">("login");

  const handleFieldChange = (field: string, value: string) => {
    onChange({ [field]: value });
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
    toast.info(`${section === "login" ? "Login" : "Signup"} texts reset to defaults.`);
  };

  const loginFields = [
    { label: "Tagline", field: "loginTagline", defaultValue: DEFAULT_AUTH_TEXTS.loginTagline },
    { label: "Title", field: "loginTitle", defaultValue: DEFAULT_AUTH_TEXTS.loginTitle },
    { label: "Description", field: "loginDescription", defaultValue: DEFAULT_AUTH_TEXTS.loginDescription, isTextarea: true },
    { label: "Button Text", field: "loginButtonText", defaultValue: DEFAULT_AUTH_TEXTS.loginButtonText },
    { label: "Footer Text", field: "loginFooterText", defaultValue: DEFAULT_AUTH_TEXTS.loginFooterText },
    { label: "Footer Link Text", field: "loginFooterLink", defaultValue: DEFAULT_AUTH_TEXTS.loginFooterLink },
  ];

  const signupFields = [
    { label: "Tagline", field: "signupTagline", defaultValue: DEFAULT_AUTH_TEXTS.signupTagline },
    { label: "Title", field: "signupTitle", defaultValue: DEFAULT_AUTH_TEXTS.signupTitle },
    { label: "Description", field: "signupDescription", defaultValue: DEFAULT_AUTH_TEXTS.signupDescription, isTextarea: true },
    { label: "Button Text", field: "signupButtonText", defaultValue: DEFAULT_AUTH_TEXTS.signupButtonText },
    { label: "Footer Text", field: "signupFooterText", defaultValue: DEFAULT_AUTH_TEXTS.signupFooterText },
    { label: "Footer Link Text", field: "signupFooterLink", defaultValue: DEFAULT_AUTH_TEXTS.signupFooterLink },
  ];

  const activeFields = activeSection === "login" ? loginFields : signupFields;

  // Count customizations
  const loginCustomCount = loginFields.filter(
    (f) => authTexts[f.field as keyof AuthPageTexts] !== f.defaultValue
  ).length;
  const signupCustomCount = signupFields.filter(
    (f) => authTexts[f.field as keyof AuthPageTexts] !== f.defaultValue
  ).length;

  return (
    <div className="space-y-4">
      {/* Section Description */}
      <div className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs space-y-3">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
            Auth Page Text Customization
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Customize the text displayed on your community&apos;s login and signup pages. Changes
            are reflected on the user-facing website in real time after saving.
          </p>
        </div>

        {/* Login / Signup Toggle */}
        <div className="flex rounded-lg bg-muted/60 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveSection("login")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md transition-all cursor-pointer",
              activeSection === "login"
                ? "bg-white dark:bg-zinc-800 text-foreground font-semibold shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Login Page</span>
            {loginCustomCount > 0 && (
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full ml-1"
              >
                {loginCustomCount}
              </Badge>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("signup")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md transition-all cursor-pointer",
              activeSection === "signup"
                ? "bg-white dark:bg-zinc-800 text-foreground font-semibold shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Signup Page</span>
            {signupCustomCount > 0 && (
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-normal bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded-full ml-1"
              >
                {signupCustomCount}
              </Badge>
            )}
          </button>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleResetSection(activeSection)}
            className="h-7 text-[11px] gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset {activeSection === "login" ? "Login" : "Signup"} to Defaults
          </Button>
        </div>

        {/* Text Fields */}
        <div className="space-y-4 pt-1">
          {activeFields.map((field) => (
            <TextFieldRow
              key={field.field}
              label={field.label}
              field={field.field}
              value={authTexts[field.field as keyof AuthPageTexts] || field.defaultValue}
              defaultValue={field.defaultValue}
              onChange={handleFieldChange}
              isTextarea={field.isTextarea}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
