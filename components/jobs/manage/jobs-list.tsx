"use client";

import React from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Building2,
  Users2,
  Eye,
  ShieldCheck,
  Layers,
  UserCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job } from "@/graphql/actions/jobs";
import { JobActions } from "./job-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminVerifiedBadge,
  AdminTableColumn,
  AdminTableDate,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Job Type Badge
// ─────────────────────────────────────────────────────────────────────────────

const JOB_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  FULL_TIME: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  PART_TIME: {
    bg: "bg-sky-500/10",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-500/20",
  },
  CONTRACT: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
  },
  INTERNSHIP: {
    bg: "bg-violet-500/10",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-500/20",
  },
  FREELANCE: {
    bg: "bg-orange-500/10",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-500/20",
  },
};

function JobTypeBadge({ type }: { type: string }) {
  const norm = type?.toUpperCase() || "FULL_TIME";
  const cfg = JOB_TYPE_COLORS[norm] || {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-tight",
        cfg.bg,
        cfg.text,
        cfg.border,
      )}
    >
      {type?.replace(/_/g, " ")}
    </span>
  );
}

function JobEligibilityBadge({ eligibility }: { eligibility?: string | null }) {
  const norm = eligibility?.toUpperCase() || "ALL";
  const config: Record<
    string,
    { label: string; icon: React.ElementType; className: string }
  > = {
    ALL: {
      label: "All Members",
      icon: Users2,
      className: "border-border bg-muted/50 text-foreground/80",
    },
    VERIFIED: {
      label: "Verified",
      icon: ShieldCheck,
      className:
        "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    },
    TIERS: {
      label: "Tiers",
      icon: Layers,
      className:
        "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-400",
    },
    SPECIFIC_CUSTOMERS: {
      label: "Specific",
      icon: UserCheck,
      className:
        "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    },
  };

  const c = config[norm] || config.ALL;
  const Icon = c.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold",
        c.className,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {c.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getJobTableColumns = (
  singularName: string,
): AdminTableColumn<Job>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "job",
    header: singularName,
    cell: (row) => {
      const companyLogo =
        row.company?.logo?.startsWith("http")
          ? row.company.logo
          : row.company?.logo
            ? `https://cdn.thrico.network/${row.company.logo}`
            : null;

      return (
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <Link href={`/jobs/${row.id}/manage`} className="shrink-0">
            <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0 hover:border-primary transition-colors">
              {companyLogo ? (
                <AvatarImage
                  src={companyLogo}
                  alt={row.company?.name || row.title}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                {(row.company?.name || row.title || "JB").substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/jobs/${row.id}/manage`}
              className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[220px] hover:text-primary hover:underline transition-colors"
              title={row.title}
            >
              {row.title}
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground truncate max-w-[200px]">
              <span className="truncate">{row.company?.name || "Company"}</span>
              {row.location && (
                <>
                  <span>·</span>
                  <span className="truncate">
                    {typeof row.location === "string"
                      ? row.location
                      : (row.location as any).name || ""}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    key: "type",
    header: "Type",
    cell: (row) => <JobTypeBadge type={row.jobType} />,
  },
  {
    key: "workplace",
    header: "Workplace",
    cell: (row) => (
      <span className="text-[11px] font-medium text-foreground/80">
        {row.workplaceType || "On-Site"}
      </span>
    ),
  },
  {
    key: "eligibility",
    header: "Audience",
    cell: (row) => {
      const elig =
        row.memberEligibility ||
        row.eligibility?.memberEligibility ||
        row.eligibilityRule?.memberEligibility ||
        "ALL";
      return <JobEligibilityBadge eligibility={elig} />;
    },
  },
  {
    key: "applicants",
    header: "Applicants",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={Users2}
        value={row.numberOfApplicant || 0}
        variant="indigo"
      />
    ),
  },
  {
    key: "views",
    header: "Views",
    headerClassName: "text-right",
    className: "text-right",
    cell: (row) => (
      <AdminTableMetric
        icon={Eye}
        value={row.numberOfViews || 0}
      />
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge status={row.status} />,
  },
  {
    key: "verification",
    header: "Verified",
    cell: (row) => (
      <AdminVerifiedBadge verified={!!row.verification?.isVerified} />
    ),
  },
  {
    key: "created",
    header: "Posted",
    cell: (row) => <AdminTableDate date={row.createdAt} />,
  },
  {
    key: "creator",
    header: "Creator",
    cell: (row) => {
      if (!row.postedBy) {
        return (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
            <Avatar className="h-5 w-5 rounded-full border border-primary/20">
              <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                EN
              </AvatarFallback>
            </Avatar>
            <span>Entity</span>
          </div>
        );
      }

      return (
        <UserProfileHoverCard user={row.postedBy}>
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <Avatar className="h-5 w-5 rounded-full border border-border/60 shrink-0">
              <AvatarImage
                src={
                  row.postedBy.avatar?.startsWith("http")
                    ? row.postedBy.avatar
                    : `https://cdn.thrico.network/${row.postedBy.avatar}`
                }
                alt={`${row.postedBy.firstName || ""} ${row.postedBy.lastName || ""}`}
              />
              <AvatarFallback className="text-[8px] bg-muted font-bold">
                {row.postedBy.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] font-medium group-hover:text-primary transition-colors truncate max-w-[110px]">
              {row.postedBy.firstName} {row.postedBy.lastName}
            </span>
          </div>
        </UserProfileHoverCard>
      );
    },
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => <JobActions job={row} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface JobsListProps {
  jobs: Job[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function JobsList({
  jobs,
  visibleColumns,
  offset = 0,
}: JobsListProps) {
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);

  const baseColumns = React.useMemo(
    () => getJobTableColumns(singularName),
    [singularName],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<Job>
        columns={activeColumns}
        data={jobs}
        keyExtractor={(j) => j.id}
        emptyIcon={Briefcase}
        emptyTitle={`No ${moduleName.toLowerCase()} found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default JobsList;
