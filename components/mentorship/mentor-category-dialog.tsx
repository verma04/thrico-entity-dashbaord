"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MentorCategory } from "@/graphql/mentorship/mentorship-quiries";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
});

interface MentorCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: MentorCategory | null;
  isLoading: boolean;
  onSave: (values: z.infer<typeof formSchema>) => Promise<void>;
}

export function MentorCategoryDialog({
  isOpen,
  onOpenChange,
  editingCategory,
  isLoading,
  onSave,
}: MentorCategoryDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (editingCategory) {
      form.reset({
        title: editingCategory.title,
      });
    } else {
      form.reset({
        title: "",
      });
    }
  }, [editingCategory, form, isOpen]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSave(values);
    } catch (error: any) {
      if (
        error.message?.includes("AllReady exist") ||
        error.message?.includes("already exists")
      ) {
        form.setError("title", {
          type: "manual",
          message: "This category already exists",
        });
      } else {
        form.setError("root", {
          type: "manual",
          message: error.message || "An unexpected error occurred",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {editingCategory
              ? "Update the category's information below."
              : "Enter the details for the new mentorship category."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Technology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
