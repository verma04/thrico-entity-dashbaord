"use client";

import React, { useMemo } from "react";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";

export default function List({
  data,
  isLoading = false,
}: {
  data: poll[];
  isLoading?: boolean;
}) {
  const moduleName = useModuleStore((state) => state.pollModuleName);
  const singularName = useModuleStore((state) => state.pollSingularName);

  const columns = useMemo<AdminTableColumn<poll>[]>(
    () => [
      {
        key: "title",
        header: singularName,
        cell: (row) => {
          const poll = row;
          return (
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-foreground leading-tight truncate max-w-[280px]">
                  {poll.title}
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-[320px] mt-0.5">
                  {poll.question}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: "options",
        header: "Options",
        cell: (row) => {
          const poll = row;
          return (
            <div className="flex items-center gap-1.5 flex-wrap max-w-[200px]">
              {poll.options?.slice(0, 3).map((opt, i) => (
                <div
                  key={i}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border"
                >
                  {opt.text}
                </div>
              ))}
              {(poll.options?.length || 0) > 3 && (
                <span className="text-[10px] font-bold text-muted-foreground ml-0.5">
                  +{(poll.options?.length || 0) - 3} more
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: "creator",
        header: "Creator",
        cell: (row) => {
          const poll = row;
          if (!poll.user) {
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
            <UserProfileHoverCard user={poll.user}>
              <div className="flex items-center gap-2 cursor-pointer group">
                <Avatar className="h-6 w-6 rounded-full border border-border/60">
                  <AvatarImage
                    src={
                      poll.user.avatar
                        ? poll.user.avatar.startsWith("http")
                          ? poll.user.avatar
                          : `${process.env.NEXT_PUBLIC_CDN_URL}/${poll.user.avatar}`
                        : ""
                    }
                    alt={`${poll.user.firstName} ${poll.user.lastName}`}
                  />
                  <AvatarFallback className="text-[10px] bg-muted font-bold">
                    {poll.user.firstName?.charAt(0)}
                    {poll.user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[12px] font-medium group-hover:text-primary transition-colors truncate max-w-[100px]">
                  {poll.user.firstName} {poll.user.lastName}
                </span>
              </div>
            </UserProfileHoverCard>
          );
        },
      },
      {
        key: "dates",
        header: "Date",
        cell: (row) => {
          const poll = row;
          return (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-[12px] font-bold text-foreground">
                  {moment(poll.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground ml-5 mt-0.5">
                Updated {moment(poll.updatedAt).fromNow()}
              </span>
            </div>
          );
        },
      },
      {
        key: "actions",
        header: "",
        headerClassName: "w-12 text-right",
        className: "text-right",
        cell: (row) => (
          <div className="flex justify-end">
            <Actions {...row} />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AdminTable<poll>
      columns={columns}
      data={data || []}
      loading={isLoading}
      keyExtractor={(poll) => poll.id}
      emptyIcon={BarChart3}
      emptyTitle={`No ${moduleName.toLowerCase()} found`}
      emptyDescription={`Create a new ${singularName.toLowerCase()} to start gathering feedback.`}
    />
  );
}
