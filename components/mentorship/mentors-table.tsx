"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mentor } from "@/types/mentor-types";
import { Star, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { MentorActions } from "./mentor-actions";

interface MentorsTableProps {
  mentors: any[];
  isLoading: boolean;
  onEdit: (mentor: any) => void;
  onRefetch: () => void;
}

export function MentorsTable({
  mentors,
  isLoading,
  onEdit,
  onRefetch,
}: MentorsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "rejected":
        return "text-rose-600 bg-rose-50 border-rose-200";
      default:
        return "text-muted-foreground bg-muted border-transparent";
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Mentor",
      cell: ({ row }) => {
        const mentor = row.original;
        return (
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={mentor.image} alt={mentor.name} />
              <AvatarFallback>
                <User className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground leading-tight">
                  {mentor.name}
                </span>
                {(mentor.isFeatured || mentor.isTrending) && (
                  <div className="flex gap-1">
                    {mentor.isFeatured && (
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    )}
                    {mentor.isTrending && (
                      <TrendingUp className="h-3 w-3 text-blue-500" />
                    )}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {mentor.title}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="font-medium bg-muted/30 border-transparent text-foreground"
        >
          {row.original.categoryName}
        </Badge>
      ),
    },
    {
      accessorKey: "expertise",
      header: "Expertise",
      cell: ({ row }) => {
        const expertise = row.original.expertise || [];
        return (
          <div className="flex flex-wrap gap-1 max-w-[250px]">
            {expertise.slice(0, 2).map((item: string, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4"
              >
                {item}
              </Badge>
            ))}
            {expertise.length > 2 && (
              <span className="text-[10px] text-muted-foreground">
                +{expertise.length - 2}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] uppercase font-bold px-1.5 py-0 h-5",
            getStatusColor(row.original.status),
          )}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right px-4">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end px-2">
          <MentorActions
            mentor={row.original}
            onView={() => onEdit(row.original)}
            refetch={onRefetch}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={mentors}
      isLoading={isLoading}
      rowClassName="h-16 group"
    />
  );
}
