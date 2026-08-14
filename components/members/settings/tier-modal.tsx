"use client";

import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  CREATE_MEMBERSHIP_TIER,
  UPDATE_MEMBERSHIP_TIER,
} from "@/graphql/membership-tier";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { Award, Loader2, Save, Sparkles } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";

interface TierModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTier: any | null;
  onSuccess: () => void;
}

const PRESET_COLORS = [
  { name: "Monochrome", hex: "#18181b" },
  { name: "Gold", hex: "#eab308" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Rose", hex: "#f43f5e" },
];

export function TierModal({
  isOpen,
  onClose,
  editingTier,
  onSuccess,
}: TierModalProps) {
  const [createTier] = useMutation(CREATE_MEMBERSHIP_TIER);
  const [updateTier] = useMutation(UPDATE_MEMBERSHIP_TIER);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      badgeColor: "#18181b",
      badgeIcon: "",
      benefits: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tier Name is required"),
      description: Yup.string(),
      badgeColor: Yup.string(),
      badgeIcon: Yup.string(),
      benefits: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const input = {
          name: values.name,
          description: values.description,
          badgeColor: values.badgeColor,
          badgeIcon: values.badgeIcon,
          benefits: [values.benefits].filter(Boolean),
        };

        if (editingTier) {
          await updateTier({
            variables: {
              id: editingTier.id,
              input,
            },
          });
          toast.success("Membership tier updated successfully");
        } else {
          await createTier({
            variables: {
              input,
            },
          });
          toast.success("Membership tier created successfully");
        }
        onSuccess();
        onClose();
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (editingTier && isOpen) {
      formik.setValues({
        name: editingTier.name,
        description: editingTier.description || "",
        badgeColor: editingTier.badgeColor || "#18181b",
        badgeIcon: editingTier.badgeIcon || "",
        benefits: editingTier.benefits ? editingTier.benefits.join("<br />") : "",
      });
    } else if (isOpen) {
      formik.resetForm();
    }
  }, [editingTier, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl flex flex-col p-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                {editingTier ? "Edit Membership Tier" : "Create Membership Tier"}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Define tier identity, distinctive insignia badge, and exclusive privileges.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={formik.handleSubmit}>
          <div className="p-6 space-y-4 bg-white dark:bg-zinc-950 overflow-y-auto max-h-[65vh]">
            {/* Tier Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tier Designation <span className="text-rose-500">*</span>
              </Label>
              <Input
                name="name"
                placeholder="e.g., Platinum Founder, VIP Tier"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tier Summary <span className="text-zinc-400 font-normal">(Optional)</span>
              </Label>
              <Input
                name="description"
                placeholder="Brief summary of member eligibility or status..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
              />
            </div>

            {/* Badge Color & Theme Swatches */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tier Color Theme
              </Label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="color"
                    name="badgeColor"
                    className="w-10 h-10 p-1 rounded-lg border-zinc-200 dark:border-zinc-800 cursor-pointer shrink-0"
                    value={formik.values.badgeColor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Input
                    name="badgeColor"
                    placeholder="#18181b"
                    value={formik.values.badgeColor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold font-mono uppercase"
                  />
                </div>
              </div>

              {/* Quick Preset Color Chips */}
              <div className="flex items-center gap-1.5 pt-1">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => formik.setFieldValue("badgeColor", preset.hex)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all cursor-pointer",
                      formik.values.badgeColor?.toLowerCase() === preset.hex.toLowerCase()
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xs"
                        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300",
                    )}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Icon / Thumbnail */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tier Insignia / Badge Icon
              </Label>
              <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40">
                <ImageUploadWithCrop
                  label=""
                  currentImage={formik.values.badgeIcon}
                  returnKeyOnly
                  onImageUpdate={(key) =>
                    formik.setFieldValue("badgeIcon", key)
                  }
                  recommendedWidth={120}
                  recommendedHeight={120}
                  aspectRatio={1}
                  circularCrop
                />
              </div>
            </div>

            {/* Exclusive Benefits */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tier Benefits & Privileges
              </Label>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50/20 dark:bg-zinc-900/20">
                <RichTextEditor
                  value={formik.values.benefits}
                  onChange={(content) =>
                    formik.setFieldValue("benefits", content)
                  }
                  placeholder="Outline VIP perks, discounted passes, priority access, or custom roles..."
                  minHeight="140px"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={formik.isSubmitting}
              className="h-9 text-xs font-semibold border-zinc-200 dark:border-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || !formik.values.name.trim()}
              className="h-9 px-4 text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-1.5 shadow-xs"
            >
              {formik.isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {editingTier ? "Save Changes" : "Create Tier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
