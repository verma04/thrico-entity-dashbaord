"use client";

import React from "react";
import { AdminTable, AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { ShieldAlert, User, ShieldCheck, Flag, Clock } from "lucide-react";
import moment from "moment";
import { Report } from "./types";
import Actions from "./Actions";
import { cn } from "@/lib/utils";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";

export default function ReportsList({ 
  data, 
  loading,
  canEdit = true
}: { 
  data: Report[]; 
  loading?: boolean;
  canEdit?: boolean;
}) {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  
  const columns = [
    {
      key: "reason",
      header: "Reason",
      cell: (report: Report) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate max-w-[240px]">
              {report.reason || "Reported"}
            </span>
            <span className="text-[10px] text-zinc-400 line-clamp-1 max-w-[300px] mt-0.5">
              {report.description || "No description provided."}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "module",
      header: "Module",
      cell: (report: Report) => (
        <span className="inline-flex h-4 items-center px-1.5 rounded bg-zinc-100 border border-zinc-200/50 text-[9px] font-medium text-zinc-500 uppercase tracking-widest">
          {report.module === "COMMUNITY" ? moduleName : report.module}
        </span>
      ),
    },
    {
      key: "reporter",
      header: "Reporter",
      cell: (report: Report) => (
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
             <User className="h-3.5 w-3.5 text-zinc-400" />
          </div>
          <div className="flex flex-col">
            {report.reporter ? (
              <UserProfileHoverCard
                user={{
                  id: report.reporter.id,
                  firstName: report.reporter.firstName,
                  lastName: report.reporter.lastName,
                }}
              >
                <span className="text-xs font-medium text-foreground leading-none cursor-pointer hover:underline hover:text-indigo-600 transition-colors">
                  {report.reporter.firstName} {report.reporter.lastName}
                </span>
              </UserProfileHoverCard>
            ) : (
              <span className="text-xs font-medium text-foreground leading-none">
                System
              </span>
            )}
            <span className="text-[9px] text-zinc-400 mt-1 uppercase tracking-tighter">
              {report.reporter ? "Member" : "Watchdog"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (report: Report) => {
        const status = report.status?.toUpperCase();
        const badgeStatus = status === "RESOLVED" || status === "APPROVED" ? "APPROVED" : status === "PENDING" ? "PENDING" : "BLOCKED";
        return (
          <AdminStatusBadge status={badgeStatus}>
            {report.status || "PENDING"}
          </AdminStatusBadge>
        );
      },
    },
    {
      key: "timeline",
      header: "Date",
      cell: (report: Report) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-zinc-300" />
            <span className="text-sm text-foreground">
              {moment(report.createdAt).format("MMM D, YYYY")}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 ml-5 mt-0.5">
            {moment(report.createdAt).fromNow()}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (report: Report) => (
        <div className="flex justify-end pr-2">
          <Actions report={report} canEdit={canEdit} />
        </div>
      ),
    },
  ];

  return (
    <div className="px-6 py-4">
      <AdminTable
        columns={columns}
        data={data || []}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyTitle="No reports"
        emptyDescription="System looks secure. No reports have been found."
      />
    </div>
  );
}
