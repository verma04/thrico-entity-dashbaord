"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import moment from "moment";
import {
  Briefcase,
  MapPin,
  Building2,
  Users2,
  Eye,
  CheckCircle2,
  DollarSign,
  Clock,
} from "lucide-react";
import { Job } from "@/graphql/actions/jobs";
import { JobActions } from "./job-actions";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface JobCardCompactProps {
  job: Job;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; bar: string }
> = {
  FULL_TIME: {
    label: "Full Time",
    bg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-500/30",
    bar: "#10b981",
  },
  PART_TIME: {
    label: "Part Time",
    bg: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-500/30",
    bar: "#0ea5e9",
  },
  CONTRACT: {
    label: "Contract",
    bg: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-500/30",
    bar: "#f59e0b",
  },
  INTERNSHIP: {
    label: "Internship",
    bg: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-500/30",
    bar: "#8b5cf6",
  },
  FREELANCE: {
    label: "Freelance",
    bg: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-500/30",
    bar: "#f97316",
  },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  DISABLED: {
    label: "Disabled",
    bg: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  PAUSED: {
    label: "Paused",
    bg: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    text: "text-slate-700 dark:text-slate-300",
    dot: "bg-slate-400",
  },
};

export function JobCardCompact({ job }: JobCardCompactProps) {
  const router = useRouter();
  const [logoError, setLogoError] = useState(false);

  const normalizedType = job.jobType?.toUpperCase() || "FULL_TIME";
  const typeInfo = TYPE_CONFIG[normalizedType] || {
    label: job.jobType || "Job",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    border: "border-border",
    bar: "#6366f1",
  };

  const statusInfo = STATUS_CONFIG[job.status?.toUpperCase()] || {
    label: job.status || "Unknown",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };

  const locationName =
    typeof job.location === "string"
      ? job.location
      : job.location?.name || job.location?.address || "";

  const companyLogo =
    !logoError && job.company?.logo
      ? job.company.logo.startsWith("http")
        ? job.company.logo
        : `https://cdn.thrico.network/${job.company.logo}`
      : null;

  return (
    <div
      onClick={() => router.push(`/jobs/${job.id}/manage`)}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      {/* Classification-card style top color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: typeInfo.bar }}
      />

      {/* ── Top Cover / Banner Area ─────────────────────────────────────── */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-muted/80 flex items-center justify-center">
        {/* Company Avatar / Logo in Center Banner */}
        <div className="flex flex-col items-center justify-center p-3 text-center transition-transform duration-300 group-hover:scale-105">
          <Avatar className="h-12 w-12 rounded-xl border-2 border-background shadow-xs bg-background">
            {companyLogo ? (
              <AvatarImage
                src={companyLogo}
                alt={job.company?.name || job.title}
                className="object-cover"
                onError={() => setLogoError(true)}
              />
            ) : null}
            <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-sm font-bold">
              {(job.company?.name || job.title || "JB").substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] font-semibold text-foreground/80 mt-1 truncate max-w-[150px]">
            {job.company?.name || "Verified Employer"}
          </span>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Floating Job Type Badge (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg px-2 py-1 flex items-center gap-1.5 shadow-xs leading-none">
          <Briefcase className="h-3 w-3 text-primary" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-foreground">
            {typeInfo.label}
          </span>
        </div>

        {/* Action button (Top-Right) */}
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-background/80 hover:bg-background backdrop-blur-md rounded-md shadow-xs transition-colors">
            <JobActions job={job} />
          </div>
        </div>

        {/* Workplace & Status pills on bottom of image */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          <span
            className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight backdrop-blur-md border shadow-2xs",
              typeInfo.bg,
            )}
          >
            {job.workplaceType || "On-Site"}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold backdrop-blur-md bg-black/50 text-white border border-white/10 shadow-2xs",
            )}
          >
            <span
              className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
            />
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Job Title */}
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={job.title}
          >
            {job.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
            <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
            <span className="truncate">
              {locationName || "Location not specified"}
            </span>
          </div>

          {/* Salary / Experience */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
            {job.salary && (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                {job.salary}
              </span>
            )}
            {job.experienceLevel && (
              <span className="text-[10px] text-muted-foreground/80 truncate">
                · {job.experienceLevel}
              </span>
            )}
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-foreground/80 font-medium">
              <Users2 className="h-3 w-3 text-muted-foreground shrink-0" />
              <span>{job.numberOfApplicant || 0}</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                applicants
              </span>
            </div>

            <div className="flex items-center gap-1 text-foreground/80 font-medium hidden sm:flex">
              <Eye className="h-3 w-3 text-muted-foreground shrink-0" />
              <span>{job.numberOfViews || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {job.verification?.isVerified && (
              <span
                className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400"
                title="Verified Job"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobCardCompact;
