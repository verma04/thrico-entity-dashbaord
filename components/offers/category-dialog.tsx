"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { OfferCategory } from "@/graphql/actions/offers";

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: OfferCategory | null;
  isLoading: boolean;
  onSave: (values: { name: string; color: string; isActive: boolean }) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  color: Yup.string().required("Color is required"),
  isActive: Yup.boolean().required(),
});

export function CategoryDialog({
  isOpen,
  onOpenChange,
  editingCategory,
  isLoading,
  onSave,
}: CategoryDialogProps) {
  const formik = useFormik({
    initialValues: {
      name: editingCategory?.name || "",
      color: editingCategory?.color || "#3b82f6",
      isActive: editingCategory ? editingCategory.isActive : true,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Category name"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-destructive">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Theme Color</Label>
              <div className="flex gap-3">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg border shadow-sm"
                  style={{ backgroundColor: formik.values.color }}
                />
                <Input
                  id="color"
                  type="text"
                  placeholder="#000000"
                  {...formik.getFieldProps("color")}
                />
              </div>
              {formik.touched.color && formik.errors.color && (
                <p className="text-xs text-destructive">
                  {formik.errors.color}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-xs">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Active Status</Label>
                <p className="text-[11px] text-muted-foreground">
                  Whether this category is visible to users
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formik.values.isActive}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("isActive", checked)
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading
                ? "Saving..."
                : editingCategory
                  ? "Save Changes"
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
