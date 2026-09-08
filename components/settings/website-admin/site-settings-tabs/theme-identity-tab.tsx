"use client";

import React from "react";
import { ThemeType, FontType } from "@/store/useWebsiteBuilderStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Type, Check, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumLock } from "./premium-lock";
import { THEME_OPTIONS, FONT_OPTIONS } from "./constants";

interface ThemeIdentityTabProps {
  isPremium: boolean;
  theme: string;
  font: string;
  onThemeChange: (themeId: ThemeType) => void;
  onFontChange: (fontId: FontType) => void;
}

export function ThemeIdentityTab({
  isPremium,
  theme,
  font,
  onThemeChange,
  onFontChange,
}: ThemeIdentityTabProps) {
  if (!isPremium) {
    return (
      <PremiumLock
        title="Theme & Identity"
        icon={Palette}
        description="Customize the aesthetic DNA of your platform. Access exclusive typography systems and high-fidelity global themes."
      />
    );
  }

  const activeFontFamily =
    FONT_OPTIONS.find((f) => f.id === (font || "inter"))?.fontFamily || "inherit";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        {/* Theme Archetypes */}
        <Card className="border-border bg-card shadow-2xs overflow-hidden">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2 mb-1">
              <Palette className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Theme Archetype
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Select an overarching visual design language for your entire platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {THEME_OPTIONS.map((opt) => {
                const isSelected = (theme || "academia") === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onThemeChange(opt.id as ThemeType)}
                    className={cn(
                      "flex flex-col text-left p-2.5 sm:p-3 rounded-[9px] border transition-all duration-150 relative group outline-none",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                        : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className={cn("h-3 w-3 rounded-full shadow-2xs shrink-0", opt.previewColor)}
                        />
                        <span className="text-xs font-semibold text-foreground truncate">
                          {opt.name}
                        </span>
                      </div>
                      {isSelected ? (
                        <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      ) : (
                        <span className="text-[9px] uppercase font-bold text-muted-foreground/70 px-1 py-0.2 rounded bg-muted shrink-0">
                          {opt.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-muted-foreground line-clamp-2 leading-snug">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Typography Protocols */}
        <Card className="border-border bg-card shadow-2xs overflow-hidden">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
            <div className="flex items-center gap-2 mb-1">
              <Type className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">
                Typography System
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Configure the global font family for headings, navigation, and body copy.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {FONT_OPTIONS.map((opt) => {
                const isSelected = (font || "inter") === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onFontChange(opt.id as FontType)}
                    className={cn(
                      "flex flex-col text-left p-2.5 sm:p-3 rounded-[9px] border transition-all duration-150 relative outline-none",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                        : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {opt.name}
                      </span>
                      {isSelected ? (
                        <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] shrink-0">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      ) : (
                        <span className="text-[9.5px] text-muted-foreground bg-muted px-1 py-0.2 rounded shrink-0">
                          {opt.category}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs text-foreground font-medium truncate mt-0.5"
                      style={{ fontFamily: opt.fontFamily }}
                    >
                      {opt.sample}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Live Preview */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="border-border bg-card shadow-2xs overflow-hidden">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
              <Laptop className="h-3.5 w-3.5 text-primary" />
              Live Typography Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="p-5 rounded-xl border border-border/80 bg-background/80 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Headline Preview
                </span>
                <h4
                  className="text-lg font-bold text-foreground leading-tight"
                  style={{ fontFamily: activeFontFamily }}
                >
                  Building Modern Communities
                </h4>
              </div>
              <p
                className="text-xs text-muted-foreground leading-relaxed"
                style={{ fontFamily: activeFontFamily }}
              >
                Empowering members with unified access, curated feeds, and interactive
                ecosystem features.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <Button size="sm" className="h-7 text-xs font-medium px-3">
                  Sample Action
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs font-medium px-3">
                  Details
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Active Theme:</span>
                <span className="font-semibold text-foreground capitalize">
                  {theme || "academia"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Active Font:</span>
                <span className="font-semibold text-foreground capitalize">
                  {font || "inter"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
