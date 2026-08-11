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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useFormik } from "formik";
import * as Yup from "yup";

interface TierModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTier: any | null;
  onSuccess: () => void;
}

export function TierModal({ isOpen, onClose, editingTier, onSuccess }: TierModalProps) {
  const [createTier] = useMutation(CREATE_MEMBERSHIP_TIER);
  const [updateTier] = useMutation(UPDATE_MEMBERSHIP_TIER);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      badgeColor: "#fbbf24",
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
        badgeColor: editingTier.badgeColor || "#fbbf24",
        badgeIcon: editingTier.badgeIcon || "",
        benefits: editingTier.benefits ? editingTier.benefits.join("<br />") : "",
      });
    } else if (isOpen) {
      formik.resetForm();
    }
  }, [editingTier, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingTier ? "Edit Membership Tier" : "Create Membership Tier"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Tier Name</Label>
            <Input
              name="name"
              placeholder="e.g. Platinum Member"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-sm text-red-500">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              name="description"
              placeholder="Short description of this tier"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="space-y-2">
            <Label>Badge Color (Hex)</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                name="badgeColor"
                className="w-12 p-1 h-10"
                value={formik.values.badgeColor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Input
                name="badgeColor"
                placeholder="#fbbf24"
                value={formik.values.badgeColor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tier Icon / Thumbnail</Label>
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

          <div className="space-y-2">
            <Label>Benefits</Label>
            <RichTextEditor
              value={formik.values.benefits}
              onChange={(content) =>
                formik.setFieldValue("benefits", content)
              }
              placeholder="List the benefits of this tier..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {editingTier ? "Save Changes" : "Create Tier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
