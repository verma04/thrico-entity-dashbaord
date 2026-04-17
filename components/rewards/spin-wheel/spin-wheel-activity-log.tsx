"use client";

import React, { useMemo } from "react";
import { AppDataTable } from "@/components/ui/app-data-table";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

interface SpinWheelActivityLogProps {
  activityData: any;
}

export const SpinWheelActivityLog = ({ activityData }: SpinWheelActivityLogProps) => {
  const data = activityData?.getSpinWheelPlays || [];

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      id: "user",
      accessorFn: (row) => `${row.user?.firstName} ${row.user?.lastName}`,
      header: "User",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900 leading-tight">
          {row.original.user?.firstName} {row.original.user?.lastName}
        </span>
      ),
    },
    {
      accessorKey: "prizeType",
      header: "Outcome",
      cell: ({ row }) => (
        <Badge
          className="text-[10px] font-bold uppercase tracking-tight"
          variant={row.original.prizeType === "NOTHING" ? "secondary" : "default"}
        >
          {row.original.prizeType}
        </Badge>
      ),
    },
    {
      accessorKey: "prizeValue",
      header: "Prize Value",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <div className="h-4 w-4 rounded-full bg-amber-400 flex items-center justify-center text-[8px] text-amber-900 border border-amber-500/20">
            TC
          </div>
          {row.original.prizeValue}
        </div>
      ),
    },
    {
      accessorKey: "tcSpent",
      header: "TC Spent",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
          {row.original.tcSpent}
        </div>
      ),
    },
    {
      accessorKey: "prize",
      header: "Segment",
      cell: ({ row }) => (
        <span className="text-xs text-slate-600 font-medium">
          {row.original.prize?.label || "—"}
        </span>
      ),
    },
    {
      accessorKey: "playedAt",
      header: "Time",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500 font-medium">
          {moment(row.original.playedAt).fromNow()}
        </span>
      ),
    },
  ], []);

  return (
    <div className="p-1 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-inner">
      <AppDataTable
        columns={columns}
        data={data}
        isLoading={!activityData}
        searchableColumns={[{ id: "user", placeholder: "Search activity..." }]}
        isShowExportButtons={true}
      />
    </div>
  );
};
