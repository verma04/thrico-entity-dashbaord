"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Globe, Users } from "lucide-react";
import moment from "moment";
import { communityEntity } from "./ts-types";
import Actions from "./Actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminVerifiedBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function List({ data }: { data: communityEntity[] }) {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const columns: AdminTableColumn<communityEntity>[] = [
    {
      key: "title",
      header: singularName,
    cell: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 rounded-lg border border-border/60 shrink-0">
          <AvatarImage
            src={`https://cdn.thrico.network/${row.cover}`}
            alt={row.title}
            className="object-cover"
          />
          <AvatarFallback className="rounded-lg bg-muted text-muted-foreground text-xs font-semibold">
            {row.title?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <p className="text-[13px] font-semibold text-foreground leading-tight truncate">
            {row.title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
            <Globe className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate max-w-[160px]">
              {row.tagline || "Global ecosystem"}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "description",
    header: "Description",
    cell: (row) => (
      <p className="text-[12px] text-muted-foreground line-clamp-2 max-w-[240px] leading-relaxed">
        {row.description || "No description provided."}
      </p>
    ),
  },
  {
    key: "members",
    header: "Members",
    cell: (row) => (
      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        <Users className="h-3 w-3 shrink-0" />
        <span className="font-medium text-foreground/80">{row.numberOfUser ?? 0}</span>
      </div>
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
    cell: (row) => <AdminVerifiedBadge verified={!!row.verification?.isVerified} />,
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
    key: "creator",
    header: "Creator",
    cell: (row) => {
      if (!row.creator) {
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
        <UserProfileHoverCard user={row.creator}>
          <div className="flex items-center gap-2 cursor-pointer group">
            <Avatar className="h-6 w-6 rounded-full border border-border/60">
              <AvatarImage
                src={
                  row.creator.avatar
                    ? row.creator.avatar.startsWith("http")
                      ? row.creator.avatar
                      : `https://cdn.thrico.network/${row.creator.avatar}`
                    : ""
                }
                alt={`${row.creator.firstName} ${row.creator.lastName}`}
              />
              <AvatarFallback className="text-[10px] bg-muted">
                {row.creator.firstName?.charAt(0)}
                {row.creator.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[12px] font-medium group-hover:text-primary transition-colors truncate max-w-[100px]">
              {row.creator.firstName} {row.creator.lastName}
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
    <AdminTable<communityEntity>
      columns={columns}
      data={data}
      keyExtractor={(c) => c.id}
      emptyIcon={Users}
      emptyTitle={`No ${moduleName.toLowerCase()} found`}
      emptyDescription="Try adjusting your search or filter criteria."
    />
  );
}
