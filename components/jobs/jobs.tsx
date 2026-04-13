"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, MapPin, Calendar, Building2, Users2 } from "lucide-react";
import moment from "moment";
import Actions from "./action";
import { Job } from "@/graphql/actions/jobs";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Job Type Badge
// ─────────────────────────────────────────────────────────────────────────────

const JOB_TYPE_COLORS: Record<string, string> = {
  FULL_TIME:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  PART_TIME:   "bg-sky-50 text-sky-700 border-sky-200",
  CONTRACT:    "bg-amber-50 text-amber-700 border-amber-200",
  INTERNSHIP:  "bg-violet-50 text-violet-700 border-violet-200",
  FREELANCE:   "bg-orange-50 text-orange-700 border-orange-200",
};

function JobTypeBadge({ type }: { type: string }) {
  const color = JOB_TYPE_COLORS[type?.toUpperCase()] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wide ${color}`}
    >
      {type?.replace(/_/g, " ")}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

const columns: AdminTableColumn<Job>[] = [
  {
    key: "job",
    header: "Job & Location",
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 rounded-lg border border-border/60 shrink-0">
          <AvatarImage
            src={
              row.company?.logo
                ? `https://cdn.thrico.network/${row.company.logo}`
                : ""
            }
            alt={row.company?.name || row.title}
            className="object-cover"
          />
          <AvatarFallback className="rounded-lg bg-muted text-muted-foreground text-xs font-semibold">
            {row.title?.substring(0, 2).toUpperCase() || "JB"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-[13px] font-semibold text-foreground leading-tight truncate">
              {row.title}
            </p>
            <JobTypeBadge type={row.jobType} />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate max-w-[160px]">
              {row.location} · {row.workplaceType}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "company",
    header: "Company",
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <Building2 className="h-3 w-3 shrink-0" />
        <span className="truncate">{row.company?.name || "—"}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <AdminStatusBadge status={row.status} />,
  },
  {
    key: "applicants",
    header: "Applicants",
    headerClassName: "text-center",
    className: "text-center",
    cell: (row) => (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/60 border border-border/50 text-[12px] font-semibold text-foreground">
        <Users2 className="h-3 w-3 text-muted-foreground/60" />
        {row.numberOfApplicant || 0}
      </div>
    ),
  },
  {
    key: "posted",
    header: "Posted",
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground whitespace-nowrap">
        <Calendar className="h-3 w-3 shrink-0" />
        <span>{moment(row.createdAt).format("MMM DD, YYYY")}</span>
      </div>
    ),
  },
  {
    key: "actions",
    header: "",
    headerClassName: "w-12",
    className: "text-right",
    cell: (row) => <Actions {...row} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function Jobs({ data }: { data: Job[] | undefined }) {
  return (
    <AdminTable<Job>
      columns={columns}
      data={data}
      keyExtractor={(j) => j.id}
      emptyIcon={Briefcase}
      emptyTitle="No jobs found"
      emptyDescription="Try adjusting your filters or search terms."
    />
  );
}
