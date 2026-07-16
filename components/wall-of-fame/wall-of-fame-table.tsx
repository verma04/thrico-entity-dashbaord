"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, User, Calendar, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useRemoveFromWallOfFame } from "@/graphql/wall-of-fame";
import { notify } from "@/lib/notify";

interface WallOfFameTableProps {
  entries: any[];
  isLoading: boolean;
  onEdit: (entry: any) => void;
  onRefetch: () => void;
}

export function WallOfFameTable({
  entries,
  isLoading,
  onEdit,
  onRefetch,
}: WallOfFameTableProps) {
  const [removeEntry] = useRemoveFromWallOfFame();

  const handleDelete = async (id: string) => {
    try {
      await removeEntry({ variables: { removeFromWallOfFameId: id } });
      notify.success("Entry removed successfully");
      onRefetch();
    } catch (error) {
      notify.error("Failed to remove entry");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user",
      header: "Inductee",
      cell: ({ row }) => {
        const entry = row.original;
        const user = entry.user?.user;
        return (
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-border shadow-sm group-hover:scale-105 transition-transform">
              <AvatarImage
                src={user?.avatar}
                alt={user?.firstName}
              />
              <AvatarFallback className="bg-indigo-50 text-indigo-200">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                  {user?.firstName} {user?.lastName}
                </span>
                {entry.isFeatured && (
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                )}
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 line-clamp-1">
                {entry.title}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Taxonomy",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="font-bold bg-slate-50 border-slate-100 text-slate-600 text-[10px] uppercase tracking-tighter"
        >
          {row.original.category?.title || "Uncategorized"}
        </Badge>
      ),
    },
    {
      accessorKey: "achievement",
      header: "Achievement",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 max-w-[300px]">
          <Award className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
          <span className="text-xs font-medium text-slate-600 truncate italic">
            {row.original.achievement || "No achievement recorded"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "year",
      header: "Legacy Year",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {row.original.year || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right px-4">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-border shadow-xl">
              <DropdownMenuItem 
                className="gap-2 font-bold text-[10px] uppercase tracking-widest cursor-pointer rounded-lg"
                onClick={() => onEdit(row.original)}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit Protocol
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="gap-2 font-bold text-[10px] uppercase tracking-widest cursor-pointer rounded-lg text-rose-500 focus:text-rose-500 focus:bg-rose-50"
                onClick={() => handleDelete(row.original.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Purge Record
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={entries}
      isLoading={isLoading}
      rowClassName="h-16 group"
    />
  );
}
