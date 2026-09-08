"use client";

import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";

interface SignupModuleProps {
  module: ModuleData;
  previewDevice?: string;
}

export function SignupModule({ module, previewDevice }: SignupModuleProps) {
  return (
    <div className="w-full min-h-[560px] flex flex-col items-center justify-center p-6 md:p-12 bg-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* System Module Badge */}
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <UserPlus className="w-3.5 h-3.5" />
            Signup Module
          </span>
        </div>

        {/* Card Mockup Skeleton */}
        <div className="rounded-2xl border bg-card/90 backdrop-blur-sm p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center flex flex-col items-center">
            <Skeleton className="h-7 w-52 mx-auto rounded-lg" />
            <Skeleton className="h-4 w-72 mx-auto rounded-md" />
          </div>

          {/* Form Fields */}
          <div className="space-y-4 pt-2">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Action button */}
            <Skeleton className="h-11 w-full rounded-lg" />

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-3 w-6 rounded" />
              <Skeleton className="h-px flex-1" />
            </div>

            {/* Social login */}
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Terms footer */}
          <div className="pt-2 flex flex-col items-center gap-1.5">
            <Skeleton className="h-3 w-60 rounded" />
          </div>
        </div>

        {/* Trusted Members Preview */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="flex -space-x-2">
            <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
            <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
            <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
            <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3.5 w-28 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
