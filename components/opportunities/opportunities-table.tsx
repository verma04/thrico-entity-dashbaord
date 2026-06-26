"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Target, Calendar } from "lucide-react";
import moment from "moment";
import Actions from "./action";
import { AdminOpportunity } from "@/graphql/actions/opportunities";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";

export default function OpportunitiesTable({
  data,
}: {
  data: AdminOpportunity[] | undefined;
}) {
  const columns: AdminTableColumn<AdminOpportunity>[] = [
    {
      key: "title",
      header: "Opportunity",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            <Target className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground leading-tight truncate max-w-[280px]">
              {row.title}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 border-emerald-200">
                {row.category?.replace(/_/g, " ")}
              </span>
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
      key: "actions",
      header: "",
      headerClassName: "w-12",
      className: "text-right",
      cell: (row) => <Actions {...row} />,
    },
  ];

  return (
    <AdminTable<AdminOpportunity>
      columns={columns}
      data={data}
      keyExtractor={(j) => j.id}
      emptyIcon={Target}
      emptyTitle={`No opportunities here`}
      emptyDescription="Try searching for something else."
    />
  );
}
