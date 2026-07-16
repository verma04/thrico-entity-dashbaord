"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldOff, ArrowLeft, AlertTriangle, UserX } from "lucide-react";
import Link from "next/link";

interface PermissionDeniedProps {
  moduleKey: string;
}

export function PermissionDenied({ moduleKey }: PermissionDeniedProps) {
  return (
    <div className="relative flex items-center justify-center p-8 h-full min-h-[calc(100vh-16rem)] w-full overflow-hidden">
      {/* Subtle red-tinted ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, var(--destructive) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Diagonal line pattern for restricted feel */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 10px, var(--foreground) 10px, var(--foreground) 11px)",
        }}
      />

      <div className="relative max-w-md w-full flex flex-col items-center text-center">
        {/* Shield icon with danger accent */}
        <div className="relative mb-10">
          {/* Outer restricted ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-destructive/15 scale-[2.6] animate-[spin_25s_linear_infinite]" />
          {/* Static ring */}
          <div className="absolute inset-0 rounded-full border border-border/30 scale-[1.9]" />
          {/* Glow */}
          <div
            className="absolute inset-0 rounded-full scale-[1.6] blur-2xl opacity-15"
            style={{
              background:
                "linear-gradient(135deg, var(--destructive), var(--muted-foreground))",
            }}
          />
          {/* Icon container */}
          <div className="relative flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-background border border-border shadow-lg">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-destructive/8">
              <ShieldOff className="h-5 w-5 text-destructive/70" strokeWidth={1.8} />
            </div>
          </div>
        </div>

        {/* Warning badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/5 border border-destructive/15 mb-5">
          <AlertTriangle className="h-3 w-3 text-destructive/60" />
          <span className="text-[11px] font-medium tracking-wider uppercase text-destructive/70">
            Access Restricted
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2.5 mb-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Permission Required
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[320px] mx-auto">
            You don&apos;t have the required permissions to access the{" "}
            <span className="font-medium text-foreground/80 capitalize">
              {moduleKey.toLowerCase()}
            </span>{" "}
            module. Please reach out to your organization admin to
            request access.
          </p>
        </div>

        {/* Info card */}
        <div className="w-full max-w-[300px] rounded-xl border border-border/60 bg-muted/30 p-4 mb-8">
          <div className="flex items-start gap-3 text-left">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/80 shrink-0 mt-0.5">
              <UserX className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-medium text-foreground/80">
                Need access?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contact your administrator or request an elevated role
                through your organization settings.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2.5 w-full max-w-[260px]">
          <Link href="/" className="w-full">
            <Button className="w-full gap-2 h-10 text-sm font-medium" size="sm">
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/settings/users/roles" className="w-full">
            <Button
              variant="ghost"
              className="w-full gap-2 h-9 text-sm text-muted-foreground hover:text-foreground transition-colors"
              size="sm"
            >
              View Roles & Permissions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
