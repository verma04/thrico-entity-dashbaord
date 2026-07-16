"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ModuleLockedProps {
  moduleKey: string;
}

export function ModuleLocked({ moduleKey }: ModuleLockedProps) {
  return (
    <div className="relative flex items-center justify-center p-8 h-full min-h-[calc(100vh-16rem)] w-full overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Dot grid texture */}
      <div className="absolute inset-0 bg-dots-grid opacity-40 pointer-events-none" />

      <div className="relative max-w-md w-full flex flex-col items-center text-center">
        {/* Lock icon with animated rings */}
        <div className="relative mb-10">
          {/* Outermost pulse ring */}
          <div
            className="absolute inset-0 rounded-full border border-border/30 scale-[2.8] animate-pulse"
            style={{ animationDuration: "3s" }}
          />
          {/* Middle ring */}
          <div className="absolute inset-0 rounded-full border border-border/20 scale-[2.1]" />
          {/* Glow behind icon */}
          <div
            className="absolute inset-0 rounded-full scale-[1.8] blur-2xl opacity-20"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--muted-foreground))",
            }}
          />
          {/* Icon container */}
          <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-background border border-border shadow-lg">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-muted/80">
              <Lock className="h-5 w-5 text-foreground/70" strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border/50 mb-5">
          <Sparkles className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
            Premium Feature
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2.5 mb-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Unlock{" "}
            {moduleKey.charAt(0).toUpperCase() +
              moduleKey.slice(1).toLowerCase()}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[320px] mx-auto">
            This module requires an upgraded subscription. Upgrade your plan to
            access powerful{" "}
            <span className="font-medium text-foreground/80 capitalize">
              {moduleKey.toLowerCase()}
            </span>{" "}
            capabilities and elevate your workflow.
          </p>
        </div>

        {/* Feature hints */}
        <div className="flex items-center gap-6 mb-8 text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span className="text-xs">Full Access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span className="text-xs">Analytics</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span className="text-xs">Integrations</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2.5 w-full max-w-[260px]">
          <Link href="/settings/subscription" className="w-full">
            <Button
              className="w-full gap-2 h-10 text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
              size="sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Upgrade Plan
              <ArrowUpRight className="h-3.5 w-3.5 ml-auto" />
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button
              variant="ghost"
              className="w-full gap-2 h-9 text-sm text-muted-foreground hover:text-foreground transition-colors"
              size="sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
