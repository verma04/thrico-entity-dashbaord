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
import { useCreatePage } from "@/graphql/actions/website";
import { useToast } from "@/hooks/use-toast";

interface CreatePageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId?: string;
  /**
   * Callback fired when page is successfully created
   * @param pageData - The created page data including id, name, and slug
   */
  onSuccess?: (pageData: { id: string; name: string; slug: string }) => void;
  /**
   * Callback fired when page creation fails
   * @param error - The error object
   */
  onError?: (error: Error) => void;
  /**
   * Whether to show toast notifications (default: true)
   */
  showToast?: boolean;
  /**
   * Custom success message (default: "Page created successfully!")
   */
  successMessage?: string;
}

export function CreatePageDialog({
  open,
  onOpenChange,
  websiteId,
  onSuccess,
  onError,
  showToast = true,
  successMessage = "Page created successfully!",
}: CreatePageDialogProps) {
  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const { toast } = useToast();

  // Create page mutation
  const [createPageMutation, { loading: isCreating }] = useCreatePage({
    onCompleted: (data) => {
      if (showToast) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }

      // Reset form
      setPageName("");
      setPageSlug("");

      // Close dialog
      onOpenChange(false);

      // Call success callback with page data if provided
      onSuccess?.({
        id: data.createPage.id,
        name: data.createPage.name,
        slug: data.createPage.slug,
      });
    },
    onError: (error) => {
      if (showToast) {
        toast({
          title: "Error",
          description: error.message || "Failed to create page",
          variant: "destructive",
        });
      }

      // Call error callback if provided
      onError?.(error);
    },
  });

  const handleSubmit = () => {
    if (!pageName || !pageSlug) {
      if (showToast) {
        toast({
          title: "Validation Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
      }
      return;
    }

    if (!websiteId) {
      if (showToast) {
        toast({
          title: "Error",
          description: "Website not found",
          variant: "destructive",
        });
      }
      return;
    }

    const cleanSlug = pageSlug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Call GraphQL mutation
    createPageMutation({
      variables: {
        websiteId: websiteId,
        name: pageName,
        slug: cleanSlug,
      },
    });
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
          <DialogDescription>Add a new page to your website.</DialogDescription>
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
          <Button
            onClick={handleSubmit}
            disabled={isCreating || !pageName || !pageSlug}
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isCreating ? "Creating..." : "Create Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
