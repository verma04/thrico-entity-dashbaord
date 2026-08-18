"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MentorActions } from "../mentor-actions";
import { MentorDetailsDialog } from "../mentor-details-dialog";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getMentorTableColumns = (
  singularName: string,
  onView: (mentor: any) => void,
  refetch?: () => void,
): AdminTableColumn<any>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "mentor",
    header: singularName,
    cell: (row) => {
      const userObj = row.mentorUser?.user || null;
      const displayName =
        row.name ||
        row.displayName ||
        (userObj
          ? `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim()
          : "Anonymous");

      const avatarUrl =
        row.image ||
        (userObj?.avatar
          ? userObj.avatar.startsWith("http")
            ? userObj.avatar
            : `https://cdn.thrico.network/${userObj.avatar}`
          : null);

      return (
        <div className="flex items-center gap-3 min-w-[200px]">
          {userObj ? (
            <UserProfileHoverCard user={userObj}>
              <Avatar className="h-9 w-9 rounded-full border border-border/60 shrink-0 cursor-pointer">
                {avatarUrl ? (
                  <AvatarImage
                    src={avatarUrl}
                    alt={displayName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </UserProfileHoverCard>
          ) : (
            <Avatar className="h-9 w-9 rounded-full border border-border/60 shrink-0">
              {avatarUrl ? (
                <AvatarImage
                  src={avatarUrl}
                  alt={displayName}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex flex-col min-w-0">
            <span
              onClick={() => onView(row)}
              className="text-[12px] font-semibold text-foreground leading-tight truncate max-w-[200px] hover:text-primary hover:underline cursor-pointer transition-colors"
              title={displayName}
            >
              {displayName}
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[200px] mt-0.5">
              {row.title || row.intro || userObj?.email || "Mentor"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    key: "category",
    header: "Category",
    cell: (row) => (
      <span className="text-[11px] font-medium text-foreground bg-muted/60 border border-border/50 px-2 py-0.5 rounded-md whitespace-nowrap">
        {row.categoryName || row.category?.title || "Uncategorized"}
      </span>
    ),
  },
  {
    key: "skills",
    header: "Expertise",
    cell: (row) => {
      const skills: string[] = row.expertise || row.skills || [];
      return (
        <div className="flex items-center gap-1 flex-wrap max-w-[180px]">
          {skills.slice(0, 2).map((skill, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border truncate max-w-[80px]"
              title={skill}
            >
              {skill}
            </span>
          ))}
          {skills.length > 2 && (
            <span className="text-[10px] font-medium text-muted-foreground">
              +{skills.length - 2}
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => {
      const status = row.isApproved
        ? "APPROVED"
        : row.isRequested
          ? "PENDING"
          : "REJECTED";
      return <AdminStatusBadge status={status} />;
    },
  },
  {
    key: "topMentor",
    header: "Featured",
    cell: (row) =>
      row.isTopMentor ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Sparkles className="h-2.5 w-2.5 fill-amber-500" />
          Top Mentor
        </span>
      ) : (
        <span className="text-[11px] text-muted-foreground">—</span>
      ),
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (row) => (
      <MentorActions
        mentor={row}
        onView={() => onView(row)}
        refetch={() => refetch?.()}
      />
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface MentorsListProps {
  mentors: any[];
  onEdit?: (mentor: any) => void;
  refetch?: () => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function MentorsList({
  mentors,
  onEdit,
  refetch,
  visibleColumns,
  offset = 0,
}: MentorsListProps) {
  const singularName = useModuleStore((state) => state.mentorshipSingularName);
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);

  const baseColumns = React.useMemo(
    () =>
      getMentorTableColumns(
        singularName,
        (mentor) => setSelectedMentor(mentor),
        refetch,
      ),
    [singularName, refetch],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<any>
        columns={activeColumns}
        data={mentors}
        keyExtractor={(m) => m.id}
        emptyIcon={GraduationCap}
        emptyTitle={`No ${singularName.toLowerCase()}s found`}
        emptyDescription="Try adjusting your search or filter criteria."
        pageSize={100}
        baseIndex={offset}
      />

      <MentorDetailsDialog
        mentor={selectedMentor}
        open={!!selectedMentor}
        onOpenChange={(open) => {
          if (!open) setSelectedMentor(null);
        }}
      />
    </div>
  );
}

export default MentorsList;
