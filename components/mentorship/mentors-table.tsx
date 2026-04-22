"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mentor } from "@/types/mentor-types";
import { Ban, CheckCircle2, Clock, Star, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
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
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      approved: {
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        icon: <CheckCircle2 className="w-3 h-3" />,
      },
      pending: {
        color: "text-amber-600 bg-amber-50 border-amber-100",
        icon: <Clock className="w-3 h-3" />,
      },
      rejected: {
        color: "text-rose-600 bg-rose-50 border-rose-100",
        icon: <Ban className="w-3 h-3" />,
      },
    };

    const config = variants[status.toLowerCase()] || {
      color: "text-zinc-500 bg-zinc-50 border-zinc-100",
      icon: <User className="w-3 h-3" />,
    };

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300",
          config.color,
        )}
      >
        {config.icon}
        {status}
      </span>
    );
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Mentor",
      cell: ({ row }) => {
        const mentor = row.original;
        return (
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-border shadow-sm group-hover:scale-105 transition-transform">
              <AvatarImage
                src={`https://cdn.thrico.network/${mentor.avatar}`}
                alt={mentor.name}
              />
              <AvatarFallback className="bg-indigo-50 text-indigo-200">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                  {mentor.name}
                </span>
                {mentor.isTopMentor && (
                  <div className="flex gap-1">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400 animate-pulse" />
                  </div>
                )}
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 line-clamp-1">
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
          className="font-bold bg-slate-50 border-slate-100 text-slate-600 text-[10px] uppercase tracking-tighter"
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
          <div className="flex flex-wrap gap-1.5 max-w-[250px]">
            {expertise.slice(0, 2).map((item: string, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-[10px] font-bold px-2 py-0 h-4 bg-indigo-50 text-indigo-600 border-indigo-100 rounded-md"
              >
                {item}
              </Badge>
            ))}
            {expertise.length > 2 && (
              <Badge
                variant="ghost"
                className="text-[10px] font-bold text-slate-400 px-1"
              >
                +{expertise.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "mentorSince",
      header: "Mentor Since",
      cell: ({ row }) => {
        const date = row.original.mentorSince || row.original.createdAt;
        if (!date) return <span className="text-slate-400">-</span>;
        return (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">
              {format(new Date(date), "MMM d, yyyy")}
            </span>
            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
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
