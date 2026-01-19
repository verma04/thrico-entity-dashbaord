"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Rank } from "@/graphql/actions";

const RANK_ICONS = [
  "🐣",
  "👶",
  "🔍",
  "📝",
  "🎯",
  "👑",
  "💎",
  "🏆",
  "⭐",
  "🌟",
  "🚀",
  "💪",
  "🎓",
  "🔥",
  "⚡",
  "🦁",
  "🦅",
  "🐲",
  "🌈",
  "🎖️",
];

interface RankDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRank: Rank | null;
  onSave: (formData: any) => void;
  isLoading?: boolean;
  nextOrder: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  icon: Yup.string().required("Icon is required"),
  color: Yup.string().required("Color is required"),
  minPoints: Yup.number()
    .min(0, "Cannot be negative")
    .required("Min points required"),
  maxPoints: Yup.number()
    .min(Yup.ref("minPoints"), "Max points must be greater than min points")
    .required("Max points required"),
  isActive: Yup.boolean(),
});

export function RankDialog({
  isOpen,
  onOpenChange,
  editingRank,
  onSave,
  isLoading = false,
  nextOrder,
}: RankDialogProps) {
  const formik = useFormik({
    initialValues: {
      name: editingRank?.name || "",
      icon: editingRank?.icon || "⭐",
      color: editingRank?.color || "#3b82f6",
      minPoints: editingRank?.minPoints || 0,
      maxPoints: editingRank?.maxPoints || 1000,

      order: editingRank?.order || nextOrder,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  useEffect(() => {
    if (isOpen && !editingRank) {
      formik.resetForm();
    }
  }, [isOpen, editingRank]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingRank ? "Edit Rank" : "Create Rank"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
              {RANK_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => formik.setFieldValue("icon", icon)}
                  className={cn(
                    "w-10 h-10 text-xl rounded-lg border-2 transition-all",
                    formik.values.icon === icon
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:bg-gray-100"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="e.g., Bronze"
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-destructive">{formik.errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  className="w-12 p-1 h-10"
                  {...formik.getFieldProps("color")}
                />
                <Input
                  placeholder="#000000"
                  {...formik.getFieldProps("color")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Points</Label>
              <Input type="number" {...formik.getFieldProps("minPoints")} />
              {formik.touched.minPoints && formik.errors.minPoints && (
                <p className="text-xs text-destructive">
                  {formik.errors.minPoints}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Max Points</Label>
              <Input type="number" {...formik.getFieldProps("maxPoints")} />
              {formik.touched.maxPoints && formik.errors.maxPoints && (
                <p className="text-xs text-destructive">
                  {formik.errors.maxPoints}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : editingRank
                ? "Save Changes"
                : "Create Rank"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
