"use client";

import React from "react";
import { Offer, OfferSource } from "@/types/offer-types";
import { useOfferStore } from "@/store/useOfferStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useToast } from "@/hooks/use-toast";
import { Save, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

interface OfferEditorProps {
  offer?: Offer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: OfferSource;
}

const offerSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(20, "Description must be at least 20 characters"),
  categoryId: Yup.string().required("Category is required"),
  discount: Yup.string(),
  code: Yup.string(),
  validFrom: Yup.date().required("Start date is required"),
  validTo: Yup.date()
    .required("End date is required")
    .min(Yup.ref("validFrom"), "End date must be after start date"),
  website: Yup.string().url("Must be a valid URL"),
});

export const OfferEditor: React.FC<OfferEditorProps> = ({
  offer,
  open,
  onOpenChange,
  source = "admin",
}) => {
  const { addOffer, updateOffer, categories } = useOfferStore();
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      title: offer?.title || "",
      description: offer?.description || "",
      image: offer?.image || "",
      categoryId: offer?.categoryId || "",
      discount: offer?.discount || "",
      code: offer?.code || "",
      validFrom: offer?.validFrom || "",
      validTo: offer?.validTo || "",
      terms: offer?.terms || "",
      website: offer?.website || "",
      isFeatured: offer?.isFeatured || false,
      isTrending: offer?.isTrending || false,
    },
    validationSchema: offerSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const now = new Date().toISOString();

      const offerData: Offer = {
        id: offer?.id || `offer-${Date.now()}`,
        ...values,
        categoryName: categories.find((c) => c.id === values.categoryId)?.name,
        status: offer?.status || (source === "admin" ? "approved" : "pending"),
        source: offer?.source || source,
        addedBy: offer?.addedBy || (source === "admin" ? "admin" : "user-123"),
        isActive: offer?.isActive ?? true,
        createdAt: offer?.createdAt || now,
        updatedAt: now,
      };

      if (offer) {
        updateOffer(offer.id, offerData);
        toast({
          title: "Offer Updated",
          description: `"${values.title}" has been updated.`,
        });
      } else {
        addOffer(offerData);
        toast({
          title: "Offer Created",
          description: `"${values.title}" has been ${source === "admin" ? "created" : "submitted for approval"}.`,
        });
      }

      handleClose();
    },
  });

  const handleClose = () => {
    if (formik.dirty && !confirm("Discard unsaved changes?")) return;
    formik.resetForm();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>{offer ? "Edit Offer" : "Create New Offer"}</SheetTitle>
          <SheetDescription>
            {offer ? "Update offer details." : "Add a new offer to the platform."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 py-6 px-6">
          {/* Image */}
          <ImageUploadWithCrop
            label="Offer Image"
            currentImage={formik.values.image}
            onImageUpdate={(url) => formik.setFieldValue("image", url)}
            recommendedWidth={800}
            recommendedHeight={400}
            aspectRatio={2}
            maxFileSize={3}
          />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...formik.getFieldProps("title")}
              placeholder="e.g., 50% Off Summer Sale"
              className={cn(formik.touched.title && formik.errors.title && "border-destructive")}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-destructive">{formik.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...formik.getFieldProps("description")}
              rows={4}
              placeholder="Describe the offer in detail..."
              className={cn(
                formik.touched.description && formik.errors.description && "border-destructive"
              )}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-destructive">{formik.errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formik.values.categoryId}
              onValueChange={(value) => formik.setFieldValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.isActive)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="text-sm text-destructive">{formik.errors.categoryId}</p>
            )}
          </div>

          {/* Discount & Code */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                {...formik.getFieldProps("discount")}
                placeholder="e.g., 20% OFF"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Promo Code</Label>
              <Input id="code" {...formik.getFieldProps("code")} placeholder="SAVE20" />
            </div>
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validFrom">
                Valid From <span className="text-destructive">*</span>
              </Label>
              <Input
                id="validFrom"
                type="date"
                {...formik.getFieldProps("validFrom")}
                className={cn(
                  formik.touched.validFrom && formik.errors.validFrom && "border-destructive"
                )}
              />
              {formik.touched.validFrom && formik.errors.validFrom && (
                <p className="text-sm text-destructive">{formik.errors.validFrom}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="validTo">
                Valid To <span className="text-destructive">*</span>
              </Label>
              <Input
                id="validTo"
                type="date"
                {...formik.getFieldProps("validTo")}
                className={cn(
                  formik.touched.validTo && formik.errors.validTo && "border-destructive"
                )}
              />
              {formik.touched.validTo && formik.errors.validTo && (
                <p className="text-sm text-destructive">{formik.errors.validTo}</p>
              )}
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              {...formik.getFieldProps("website")}
              placeholder="https://example.com"
              type="url"
            />
            {formik.touched.website && formik.errors.website && (
              <p className="text-sm text-destructive">{formik.errors.website}</p>
            )}
          </div>

          {/* Terms */}
          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              {...formik.getFieldProps("terms")}
              rows={3}
              placeholder="Additional terms..."
            />
          </div>

          {/* Toggles (Admin only) */}
          {source === "admin" && (
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formik.values.isFeatured}
                  onChange={(e) => formik.setFieldValue("isFeatured", e.target.checked)}
                />
                <Label htmlFor="isFeatured" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Featured Offer
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isTrending"
                  checked={formik.values.isTrending}
                  onChange={(e) => formik.setFieldValue("isTrending", e.target.checked)}
                />
                <Label htmlFor="isTrending" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Trending Offer
                </Label>
              </div>
            </div>
          )}

          <SheetFooter className="gap-2 flex-row justify-end px-0 py-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid}>
              <Save className="h-4 w-4 mr-2" />
              {offer ? "Update" : source === "admin" ? "Create" : "Submit"} Offer
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
