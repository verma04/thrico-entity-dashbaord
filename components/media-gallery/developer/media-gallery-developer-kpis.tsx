"use client";

import React from "react";
import {
  UploadCloud,
  ShieldCheck,
  KeyRound,
  Globe,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMediaGalleryDeveloper } from "./media-gallery-developer-context";

export function MediaGalleryDeveloperKpis() {
  const { formik, client, pendingCount } = useMediaGalleryDeveloper();
  const values = formik.values;

  const allowedDomainsCount = client?.allowedDomains?.length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Third-Party Upload Policy & Quota */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Upload Policy & Caps
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/40">
              <UploadCloud className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {values.allowThirdPartyUploads ? "Permitted" : "Restricted"}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded-[3px]"
              >
                {values.maxImageSizeMb}M Img • {values.maxVideoSizeMb}M Vid
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1 truncate">
              <Sparkles className="h-3 w-3 text-sky-500 shrink-0" />
              <span>
                {values.allowedMediaTypes === "ALL"
                  ? "Photos & Videos"
                  : values.allowedMediaTypes === "IMAGE_ONLY"
                  ? "Photos Only"
                  : "Videos Only"}
                {" • "}
                Max {values.maxDailyUploadsTotal}/day
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Review & Moderation Queue */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Submissions & Moderation
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {pendingCount}
              </span>
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 font-bold border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-[3px]"
              >
                {values.requireModeration ? "Approval Enforced" : "Direct Publish"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1 truncate">
              {pendingCount > 0 ? (
                <>
                  <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                  <span>{pendingCount} external submissions awaiting review</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>Review queue is cleared</span>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. API Credentials & Rate Limiting */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              API Client Credentials
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-100 dark:border-violet-900/40">
              <KeyRound className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-foreground truncate">
                {client?.clientId ? "Active Client Key" : "Key Configured"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400 border border-violet-200 dark:border-violet-800 rounded-[3px]"
              >
                Rate: {client?.rateLimitPerMinute || 3000}/min
              </Badge>
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <Lock className="h-2.5 w-2.5" />
                TTL {client?.tokenTtlSeconds || 3600}s
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Allowed CORS Domains */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Origin Gating (CORS)
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <Globe className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-foreground tracking-tight">
                {allowedDomainsCount} Allowed
              </span>
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 font-bold border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-[3px]"
              >
                {allowedDomainsCount > 0 ? "Protected" : "Open Origin"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1 truncate">
              {allowedDomainsCount > 0 ? (
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  Client uploads restricted to approved domains
                </span>
              ) : (
                <span className="text-muted-foreground">Any origin allowed</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
