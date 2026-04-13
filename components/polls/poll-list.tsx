"use client";

import React from "react";
import {
  AdminTable,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import {
  BarChart3,
  MessageSquare,
  Clock,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import moment from "moment";
import { poll } from "./ts-types";
import Actions from "./poll-actions";
import { cn } from "@/lib/utils";

export default function List({
  data,
  isLoading = false,
}: {
  data: poll[];
  isLoading?: boolean;
}) {
  const columns = [
    {
      key: "title",
      header: "Poll",
      cell: (poll: poll) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
            <MessageSquare className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate max-w-[280px]">
              {poll.title}
            </span>
            <span className="text-[11px] text-zinc-400 line-clamp-1 max-w-[320px] mt-0.5">
              {poll.question}
            </span>
          </div>
        </div>
      ),
    },

    {
      key: "options",
      header: "Options",
      cell: (poll: poll) => (
        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
          {poll.options?.slice(0, 3).map((opt, i) => (
            <div
              key={i}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-50 text-zinc-500 border border-zinc-200/50"
            >
              {opt.text}
            </div>
          ))}
          {(poll.options?.length || 0) > 3 && (
            <span className="text-[10px] text-zinc-400 ml-0.5">
              +{(poll.options?.length || 0) - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: "dates",
      header: "Date",
      cell: (poll: poll) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-300" />
            <span className="text-xs text-foreground">
              {moment(poll.createdAt).format("MMM D, YYYY")}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 ml-5.5 mt-0.5">
            Updated {moment(poll.updatedAt).fromNow()}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (poll: poll) => (
        <div className="flex justify-end pr-2">
          <Actions {...poll} />
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={data || []}
      loading={isLoading}
      keyExtractor={(poll) => poll.id}
      emptyTitle="No polls found"
      emptyDescription="Create a new poll to start gathering feedback."
    />
  );
}
