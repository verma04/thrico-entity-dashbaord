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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { Award, Loader2, Save } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import {
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";

interface TierModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTier: any | null;
  onSuccess: () => void;
}

const PRESET_COLORS = [
  { name: "Monochrome", hex: "#303030" },
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
      badgeColor: "#303030",
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
        badgeColor: editingTier.badgeColor || "#303030",
        badgeIcon: editingTier.badgeIcon || "",
        benefits: editingTier.benefits ? editingTier.benefits.join("<br />") : "",
      });
    } else if (isOpen) {
      formik.resetForm();
    }
  }, [editingTier, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg flex flex-col p-0 rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-4 py-3.5 border-b border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[4px] bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
              <Award className="h-3.5 w-3.5" />
            </div>
            <div>
              <DialogTitle className="text-[13.5px] font-bold text-[#303030] dark:text-zinc-100 leading-tight">
                {editingTier ? "Edit Membership Tier" : "Create Membership Tier"}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5">
                Define tier identity, distinctive insignia badge, and exclusive privileges.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={formik.handleSubmit}>
          <div className="p-4 space-y-3 bg-white dark:bg-zinc-950 overflow-y-auto max-h-[65vh]">
            {/* Tier Name */}
            <PolarisInput
              id="tier-name"
              name="name"
              label="Tier Designation"
              required
              placeholder="e.g., Platinum Founder, VIP Tier"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name ? String(formik.errors.name) : undefined}
            />

            {/* Description */}
            <PolarisInput
              id="tier-description"
              name="description"
              label="Tier Summary (Optional)"
              placeholder="Brief summary of member eligibility or status..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {/* Badge Color & Theme Swatches */}
            <div className="space-y-1.5 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisLabel>Tier Color Theme</PolarisLabel>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="badgeColor"
                  className="w-8 h-[34px] p-0.5 rounded-[4px] border border-[#aeb4b9] dark:border-zinc-700 cursor-pointer shrink-0"
                  value={formik.values.badgeColor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <input
                  name="badgeColor"
                  placeholder="#303030"
                  value={formik.values.badgeColor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[34px] flex-1 px-2.5 rounded-[6px] border border-[#aeb4b9] dark:border-zinc-700 text-[12.5px] font-mono uppercase bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-100 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                />
              </div>

              {/* Quick Preset Color Chips */}
              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => formik.setFieldValue("badgeColor", preset.hex)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-semibold border transition-all cursor-pointer",
                      formik.values.badgeColor?.toLowerCase() === preset.hex.toLowerCase()
                        ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 border-[#303030] dark:border-zinc-100 shadow-2xs"
                        : "bg-[#f6f6f7] dark:bg-zinc-900 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-800 hover:border-[#aeb4b9]",
                    )}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: preset.hex }}
                    />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Icon / Thumbnail */}
            <div className="space-y-1 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisLabel>Tier Insignia / Badge Icon</PolarisLabel>
              <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40">
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
            <div className="space-y-1 pt-1 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisLabel>Tier Benefits & Privileges</PolarisLabel>
              <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
                <RichTextEditor
                  value={formik.values.benefits}
                  onChange={(content) =>
                    formik.setFieldValue("benefits", content)
                  }
                  placeholder="Outline VIP perks, discounted passes, priority access, or custom roles..."
                  minHeight="110px"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-4 py-3 border-t border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={formik.isSubmitting}
              className="h-[32px] text-[12px] font-semibold border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || !formik.values.name.trim()}
              className="h-[32px] px-3 text-[12px] font-semibold bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-[#202020] dark:hover:bg-zinc-200 flex items-center gap-1.5 rounded-[4px] shadow-2xs cursor-pointer"
            >
              {formik.isSubmitting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Save className="h-3 w-3" />
              )}
              {editingTier ? "Save Changes" : "Create Tier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
