"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Star, GraduationCap } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { MentorActions } from "./mentor-actions";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/shared/admin-table/admin-table";

interface MentorsTableProps {
  mentors: any[];
  isLoading: boolean;
  onEdit: (mentor: any) => void;
  onRefetch: () => void;
}

import { useModuleStore } from "@/store/useModuleStore";

export function MentorsTable({
  mentors,
  isLoading,
  onEdit,
  onRefetch,
}: MentorsTableProps) {
  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);

  const columns = useMemo<AdminTableColumn<any>[]>(
    () => [
      {
        key: "name",
        header: singularName,
        cell: (row) => {
          const mentor = row;
          return (
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border border-border shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <AvatarImage
                  src={`https://cdn.thrico.network/${mentor.avatar}`}
                  alt={mentor.name}
                />
                <AvatarFallback className="bg-indigo-50 text-indigo-200">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground leading-tight truncate max-w-[150px]">
                    {mentor.name}
                  </span>
                  {mentor.isTopMentor && (
                    <div className="flex gap-1 shrink-0">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400 animate-pulse" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground truncate max-w-[150px]">
                  {mentor.title}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: "categoryName",
        header: "Category",
        cell: (row) => (
          <Badge
            variant="outline"
            className="font-bold bg-muted border-transparent text-foreground text-[10px] uppercase tracking-tighter"
          >
            {row.categoryName}
          </Badge>
        ),
      },
      {
        key: "expertise",
        header: "Expertise",
        cell: (row) => {
          const expertise = row.expertise || [];
          return (
            <div className="flex flex-wrap gap-1.5 max-w-[200px]">
              {expertise.slice(0, 2).map((item: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-[10px] font-bold px-2 py-0 h-4 rounded-md"
                >
                  {item}
                </Badge>
              ))}
              {expertise.length > 2 && (
                <Badge
                  variant="ghost"
                  className="text-[10px] font-bold text-muted-foreground px-1"
                >
                  +{expertise.length - 2}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        key: "mentorSince",
        header: `${singularName} Since`,
        cell: (row) => {
          const date = row.mentorSince || row.createdAt;
          if (!date) return <span className="text-muted-foreground">-</span>;
          return (
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-foreground">
                {format(new Date(date), "MMM d, yyyy")}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                {formatDistanceToNow(new Date(date), { addSuffix: true })}
              </span>
            </div>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        cell: (row) => <AdminStatusBadge status={row.status} />,
      },
      {
        key: "actions",
        header: "",
        headerClassName: "w-12 text-right",
        className: "text-right",
        cell: (row) => (
          <div className="flex justify-end">
            <MentorActions
              mentor={row}
              onView={() => onEdit(row)}
              refetch={onRefetch}
            />
          </div>
        ),
      },
    ],
    [onEdit, onRefetch],
  );

  return (
    <AdminTable<any>
      columns={columns}
      data={mentors}
      loading={isLoading}
      keyExtractor={(m) => m.id}
      emptyIcon={GraduationCap}
      emptyTitle={`No ${singularName.toLowerCase()}s found`}
      emptyDescription="Try adjusting your search or filter criteria."
    />
  );
}
