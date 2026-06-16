"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MessageSquare } from "lucide-react";
import moment from "moment";
import { discussionForm } from "../ts-types";
import Actions from "./forum-actions";
import Vote from "./votes/forum-vote";
import { getVerificationTag, getStatusTag } from "../utils";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import {
  AdminTable,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

const columns: AdminTableColumn<discussionForm>[] = [
  {
    key: "verification",
    header: "Verification",
    cell: (row) => getVerificationTag(row.verification?.isVerified || false),
  },
  {
    key: "vote",
    header: "Vote",
    cell: (row) => <Vote id={row.id} />,
  },
  {
    key: "title",
    header: "Title",
    cell: (row) => (
      <div
        className="font-medium max-w-[200px] truncate text-[13px] text-foreground"
        title={row.title}
      >
        {row.title}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => getStatusTag(row.status),
  },
  {
    key: "creator",
    header: "Creator",
    cell: (row) => {
      if (!row.user) {
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 rounded-full border border-border/60">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                EN
              </AvatarFallback>
            </Avatar>
            <span className="text-[12px] font-semibold text-muted-foreground">
              Anonymous
            </span>
          </div>
        );
      }
      
      return (
        <UserProfileHoverCard user={row.user}>
          <div className="flex items-center gap-2 cursor-pointer group">
            <Avatar className="h-6 w-6 rounded-full border border-border/60">
              <AvatarImage
                src={
                  row.user.avatar
                    ? row.user.avatar.startsWith("http")
                      ? row.user.avatar
                      : `https://cdn.thrico.network/${row.user.avatar}`
                    : ""
                }
                alt={`${row.user.firstName} ${row.user.lastName}`}
              />
              <AvatarFallback className="text-[10px] bg-muted">
                {row.user.firstName?.charAt(0)}
                {row.user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[12px] font-medium group-hover:text-primary transition-colors truncate max-w-[100px]">
              {row.user.firstName} {row.user.lastName}
            </span>
          </div>
        </UserProfileHoverCard>
      );
    },
  },
  {
    key: "category",
    header: "Category",
    cell: (row) => (
      <div className="text-[12px] text-muted-foreground">{row.category?.name || "—"}</div>
    ),
  },
  {
    key: "createdAt",
    header: "Created",
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground whitespace-nowrap">
        <Calendar className="h-3 w-3 shrink-0" />
        <span>{moment(row.createdAt).format("MMM DD, YYYY")}</span>
      </div>
    ),
  },
  {
    key: "updatedAt",
    header: "Last Update",
    cell: (row) => (
      <div className="text-[12px] text-muted-foreground whitespace-nowrap">
        {moment(row.updatedAt).fromNow()}
      </div>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "w-12 text-right",
    className: "text-right",
    cell: (row) => <Actions {...row} />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

import { useModuleStore } from "@/store/useModuleStore";

export default function List({ data, loading }: { data: discussionForm[], loading?: boolean }) {
  const singularName = useModuleStore((state) => state.forumSingularName);
  return (
    <AdminTable<discussionForm>
      columns={columns}
      data={data}
      loading={loading}
      keyExtractor={(c) => c.id}
      emptyIcon={MessageSquare}
      emptyTitle={`No ${singularName.toLowerCase()}s found`}
      emptyDescription="Try adjusting your search or filter criteria."
    />
  );
}
