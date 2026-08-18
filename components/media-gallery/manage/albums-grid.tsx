"use client";

import React from "react";
import { Images, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlbumCardCompact } from "./album-card-compact";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

interface AlbumsGridProps {
  albums: any[];
  onEdit: (album: any) => void;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
  enableDrag?: boolean;
}

export function AlbumsGrid({
  albums,
  onEdit,
  onDelete,
  onClick,
  enableDrag = false,
}: AlbumsGridProps) {
  if (!albums || albums.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Images className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No albums found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Create your first photo album to start curating event galleries, meetups, and highlights.
          </p>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {albums.map((album) => (
        <AlbumCardCompact
          key={album?.id}
          album={album}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
          enableDrag={enableDrag}
        />
      ))}
    </div>
  );

  if (enableDrag) {
    return (
      <SortableContext
        items={albums.map((a) => a.id)}
        strategy={rectSortingStrategy}
      >
        {content}
      </SortableContext>
    );
  }

  return content;
}

export default AlbumsGrid;
