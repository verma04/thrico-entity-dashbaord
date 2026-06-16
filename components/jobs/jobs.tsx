"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, MapPin, Calendar, Building2, Users2 } from "lucide-react";
import moment from "moment";
import Actions from "./action";
import { useModuleStore } from "@/store/useModuleStore";
import { Job } from "@/graphql/actions/jobs";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";

// ─────────────────────────────────────────────────────────────────────────────
// Job Type Badge
// ─────────────────────────────────────────────────────────────────────────────

const JOB_TYPE_COLORS: Record<string, string> = {
  FULL_TIME: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PART_TIME: "bg-sky-50 text-sky-700 border-sky-200",
  CONTRACT: "bg-amber-50 text-amber-700 border-amber-200",
  INTERNSHIP: "bg-violet-50 text-violet-700 border-violet-200",
  FREELANCE: "bg-orange-50 text-orange-700 border-orange-200",
};

function JobTypeBadge({ type }: { type: string }) {
  const color =
    JOB_TYPE_COLORS[type?.toUpperCase()] ??
    "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wide ${color}`}
    >
      {type?.replace(/_/g, " ")}
    </span>
  );
}

export default function Jobs({ data }: { data: Job[] | undefined }) {
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);

  const columns: AdminTableColumn<Job>[] = [
    {
      key: "title",
      header: singularName,
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Briefcase className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground leading-tight truncate max-w-[280px]">
              {row.title}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <JobTypeBadge type={row.jobType} />
              {row.location && (
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {row.location}
                </span>
              )}
            </div>
          </div>
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
    header: "People",
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
    header: "Date",
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground whitespace-nowrap">
        <Calendar className="h-3 w-3 shrink-0" />
        <span>{moment(row.createdAt).format("MMM DD, YYYY")}</span>
      </div>
    ),
  },
  {
    key: "creator",
    header: "Creator",
    cell: (row) => {
      if (!row.postedBy) {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 rounded-full border border-border/60">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                EN
              </AvatarFallback>
            </Avatar>
            <span className="text-[12px] font-semibold text-muted-foreground">
              Entity
            </span>
          </div>
        );
      }
      
      return (
        <UserProfileHoverCard user={row.postedBy}>
          <div className="flex items-center gap-2 cursor-pointer group">
            <Avatar className="h-6 w-6 rounded-full border border-border/60">
              <AvatarImage
                src={
                  row.postedBy.avatar
                    ? row.postedBy.avatar.startsWith("http")
                      ? row.postedBy.avatar
                      : `https://cdn.thrico.network/${row.postedBy.avatar}`
                    : ""
                }
                alt={`${row.postedBy.firstName} ${row.postedBy.lastName}`}
              />
              <AvatarFallback className="text-[10px] bg-muted">
                {row.postedBy.firstName?.charAt(0)}
                {row.postedBy.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[12px] font-medium group-hover:text-primary transition-colors truncate max-w-[100px]">
              {row.postedBy.firstName} {row.postedBy.lastName}
            </span>
          </div>
        </UserProfileHoverCard>
      );
    },
  },
  {
    key: "actions",
    header: "",
    headerClassName: "w-12",
    className: "text-right",
    cell: (row) => <Actions {...row} />,
  },
];

  return (
    <AdminTable<Job>
      columns={columns}
      data={data}
      keyExtractor={(j) => j.id}
      emptyIcon={Briefcase}
      emptyTitle={`No ${moduleName.toLowerCase()} here`}
      emptyDescription="Try searching for something else."
    />
  );
}
