"use client";

import React from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableTag,
  AdminTableDate,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import {
  BookOpen,
  Eye,
  Trash2,
  MoreHorizontal,
  Clock,
  Radio,
} from "lucide-react";
import { Story } from "@/graphql/actions/stories";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMediaUrl } from "./story-card";
import { toast } from "sonner";
import { safeFormatDistanceToNow } from "@/lib/date-utils";

interface StoriesTableProps {
  stories: Story[];
  isLoading?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onSelectAll?: (all: boolean) => void;
  onSelectStory: (story: Story) => void;
  onDeleteStory?: (story: Story) => void;
}

export function StoriesTable({
  stories,
  isLoading,
  selectedIds = [],
  onToggleSelect,
  onSelectAll,
  onSelectStory,
  onDeleteStory,
}: StoriesTableProps) {
  const allSelected =
    stories.length > 0 && stories.every((s) => selectedIds.includes(s.id));
  const someSelected =
    stories.some((s) => selectedIds.includes(s.id)) && !allSelected;

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    toast.success("Story ID copied to clipboard");
  };

  const columns = [
    ...(onToggleSelect
      ? [
          {
            key: "select",
            header: "",
            headerClassName: "w-10 px-3",
            className: "w-10 px-3",
            headerComponent: onSelectAll ? (
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                aria-label="Select all"
              />
            ) : null,
            cell: (story: Story) => (
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(story.id)}
                  onCheckedChange={() => onToggleSelect(story.id)}
                  aria-label={`Select story ${story.id}`}
                />
              </div>
            ),
          },
        ]
      : []),
    {
      key: "story",
      header: "Story & Media",
      cell: (story: Story) => {
        const imageUrl = getMediaUrl(story.image);
        return (
          <div
            onClick={() => onSelectStory(story)}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
          >
            <div className="h-11 w-9 rounded-md bg-zinc-950 overflow-hidden border border-border/60 shrink-0 relative flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={story.caption || "Story"}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <BookOpen className="h-4 w-4 text-zinc-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[220px] sm:max-w-[280px]">
                {story.caption || "Story"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: "author",
      header: "Creator",
      cell: (story: Story) => {
        const author = story.user;
        const authorName =
          [author?.firstName, author?.lastName].filter(Boolean).join(" ") ||
          "Unknown User";
        const avatarUrl = getMediaUrl(author?.avatar);

        return (
          <AdminTableItem
            avatar={avatarUrl || null}
            title={authorName}
            subtitle={author?.headline || author?.email || "Story Author"}
            shape="circle"
            maxTitleWidth="max-w-[160px]"
            onClick={() => onSelectStory(story)}
          />
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (story: Story) => {
        const isLive =
          story.isActive && new Date(story.expiresAt).getTime() > Date.now();
        return (
          <AdminStatusBadge
            status={isLive ? "Live" : "Expired"}
            variant={isLive ? "success" : "neutral"}
            className="text-[10px]"
          />
        );
      },
    },
    {
      key: "createdAt",
      header: "Posted",
      cell: (story: Story) => <AdminTableDate date={story.createdAt} />,
    },
    {
      key: "expiresAt",
      header: "Expires",
      cell: (story: Story) => {
        const isLive =
          story.isActive && new Date(story.expiresAt).getTime() > Date.now();
        return (
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium text-foreground tabular-nums">
              {safeFormatDistanceToNow(story.expiresAt, { addSuffix: true })}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {isLive ? "Active countdown" : "Expired"}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right pr-4",
      cell: (story: Story) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-lg">
              <DropdownMenuItem
                onClick={() => onSelectStory(story)}
                className="text-xs font-medium cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                Inspect Story
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleCopyId(story.id, e)}
                className="text-xs font-medium cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                Copy ID
              </DropdownMenuItem>
              {onDeleteStory && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDeleteStory(story)}
                    className="text-xs font-medium text-rose-600 dark:text-rose-400 focus:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete Story
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={stories}
      loading={isLoading}
      keyExtractor={(item) => item.id}
      emptyIcon={BookOpen}
      emptyTitle="No stories found"
      emptyDescription="There are no stories matching the current filter criteria."
    />
  );
}
