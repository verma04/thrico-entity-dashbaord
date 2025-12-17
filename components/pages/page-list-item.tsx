"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Page {
  id: string;
  name: string;
  slug: string;
  isEnabled: boolean;
}

interface PageListItemProps {
  page: Page;
  onEdit: (pageId: string) => void;
  onDelete: (pageId: string) => void;
  onToggleStatus: (pageId: string, currentStatus: boolean) => void;
  canDelete?: boolean;
}

export function PageListItem({
  page,
  onEdit,
  onDelete,
  onToggleStatus,
  canDelete = true,
}: PageListItemProps) {
  const isHomePage = page.slug === "home";

  return (
    <div
      className={cn(
        "grid grid-cols-12 p-4 items-center gap-4 border-b last:border-0 hover:bg-muted/10 transition-colors",
        !page.isEnabled && "opacity-60 bg-muted/5"
      )}
    >
      <div className="col-span-4 font-medium flex items-center gap-2">
        {page.name}
      </div>
      <div className="col-span-3 text-sm font-mono text-muted-foreground">
        /{page.slug}
      </div>
      <div className="col-span-2 flex justify-center">
        <Button
          variant={page.isEnabled ? "outline" : "ghost"}
          size="sm"
          className={cn(
            "h-7 text-xs gap-1.5",
            page.isEnabled
              ? "text-green-600 border-green-200 bg-green-50"
              : "text-muted-foreground"
          )}
          onClick={() => onToggleStatus(page.id, page.isEnabled)}
          disabled={isHomePage}
          title={
            isHomePage
              ? "Home page cannot be disabled"
              : page.isEnabled
              ? "Click to Disable"
              : "Click to Enable"
          }
        >
          {page.isEnabled ? (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Active
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              Draft
            </>
          )}
        </Button>
      </div>
      <div className="col-span-3 flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(page.id)}>
          <FileEdit className="h-4 w-4 mr-2" /> Design
        </Button>
        {canDelete && !isHomePage && (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => onDelete(page.id)}
            title="Delete page"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
