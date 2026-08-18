"use client";

import React from "react";
import {
  Images,
  LayoutGrid,
  Star,
  Pencil,
  Trash2,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableTag,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getAlbumTableColumns = (
  onEdit: (album: any) => void,
  onDelete: (id: string) => void,
  onClick: (id: string) => void,
): AdminTableColumn<any>[] => [
  {
    key: "serial",
    header: "S.No",
    headerClassName: "w-12 text-center",
    className: "text-center text-[11px] font-medium text-muted-foreground",
    cell: (_, index) => index + 1,
  },
  {
    key: "album",
    header: "Album",
    cell: (album) => {
      const coverUrl = album?.coverImage
        ? album.coverImage.startsWith("http")
          ? album.coverImage
          : `https://cdn.thrico.network/${album.coverImage}`
        : "";

      return (
        <div
          onClick={() => onClick(album?.id)}
          className="cursor-pointer"
        >
          <AdminTableItem
            avatar={coverUrl}
            icon={
              !coverUrl ? (
                <Images className="h-4 w-4 text-muted-foreground" />
              ) : undefined
            }
            title={album?.title}
            subtitle={album?.description || `ID: ${album?.id?.slice(0, 8)}...`}
          />
        </div>
      );
    },
  },
  {
    key: "photos",
    header: "Photos",
    cell: (album) => {
      const imageCount =
        album?.imageCount ?? album?.imagesCount ?? album?.images?.length ?? 0;
      return (
        <AdminTableMetric
          icon={LayoutGrid}
          value={imageCount.toLocaleString()}
          variant="mono"
        />
      );
    },
  },
  {
    key: "featured",
    header: "Featured",
    cell: (album) => (
      <AdminTableTag variant={album?.isFeatured ? "amber" : "default"}>
        {album?.isFeatured ? "Featured" : "Regular"}
      </AdminTableTag>
    ),
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-10 text-right",
    className: "text-right",
    isFixedRight: true,
    cell: (album) => (
      <div className="flex justify-end items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
              <span className="sr-only">Open actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 truncate">
              {album?.title}
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onClick(album?.id)}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              View Photos
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onEdit(album)}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
              Edit Album
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => onDelete(album?.id)}
              className="text-xs font-medium cursor-pointer gap-2 py-1.5 text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Album
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface AlbumsListProps {
  albums: any[];
  onEdit: (album: any) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function AlbumsList({
  albums,
  onEdit,
  onDelete,
  onClick,
  visibleColumns,
  offset = 0,
}: AlbumsListProps) {
  const baseColumns = React.useMemo(
    () => getAlbumTableColumns(onEdit, onDelete, onClick),
    [onEdit, onDelete, onClick],
  );

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<any>
        columns={activeColumns}
        data={albums}
        keyExtractor={(a) => a.id}
        emptyTitle="No albums found"
        emptyDescription="Create your first photo album to start curating event galleries, meetups, and highlights."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default AlbumsList;
