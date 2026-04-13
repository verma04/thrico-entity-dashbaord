"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Image as ImageIcon } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ShopBanner {
  id: string;
  title: string;
  image: string;
  linkedProduct?: {
    id: string;
    title: string;
  } | null;
  isActive: boolean;
}

interface BannerRowProps {
  banner: ShopBanner;
  onRemove: (id: string) => void;
}

export function SortableBannerRow({ banner, onRemove }: BannerRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className="bg-background">
      <TableCell className="w-[40px]">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-primary focus:outline-none"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell>
        <div className="h-10 w-15 relative rounded overflow-hidden bg-muted/20 border group">
          {banner.image ? (
            <img
              src={`https://cdn.thrico.network/${banner?.image}`}
              alt={banner?.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
          ) : (
            <ImageIcon className="w-full h-full p-2 text-muted-foreground" />
          )}
        </div>
      </TableCell>
      <TableCell className="font-medium">{banner.title}</TableCell>
      <TableCell>
        {banner.linkedProduct?.title ? (
          <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold border border-primary/20">
            {banner.linkedProduct.title}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs italic opacity-60">
            No Link
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(banner.id)}
          className="hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
