"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreatePageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatePage: (name: string, slug: string) => void;
  isCreating: boolean;
}

export function CreatePageDialog({
  open,
  onOpenChange,
  onCreatePage,
  isCreating,
}: CreatePageDialogProps) {
  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");

  const handleSubmit = () => {
    if (!pageName || !pageSlug) return;
    onCreatePage(pageName, pageSlug);
    // Reset form
    setPageName("");
    setPageSlug("");
  };

  const handleNameChange = (value: string) => {
    setPageName(value);
    // Auto-generate slug from name
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
    setPageSlug(slug);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>
            Add a new page to your website.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Page Name</Label>
            <Input
              placeholder="e.g. Services"
              value={pageName}
              onChange={(e) => handleNameChange(e.target.value)}
              disabled={isCreating}
            />
          </div>
          <div className="space-y-2">
            <Label>URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">/pages/</span>
              <Input
                placeholder="services"
                value={pageSlug}
                onChange={(e) =>
                  setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                }
                disabled={isCreating}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCreating ? "Creating..." : "Create Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
