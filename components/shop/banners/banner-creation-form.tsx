"use client";

import React from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Link as LinkIcon,
  Image as LucideImage,
  Sparkles,
} from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ProductPicker } from "@/components/shop/product-picker";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";

interface BannerCreationFormProps {
  initialValues?: Record<string, any>;
  loading?: boolean;
  onFinish: (values: {
    title: string;
    image: string;
    linkedProductId?: string | null;
  }) => void;
  onCancel?: () => void;
}

const bannerSchema = Yup.object().shape({
  title: Yup.string().required("Headline is required"),
  image: Yup.mixed().required("Banner image is required"),
  linkedProductId: Yup.string().nullable(),
});

export function BannerCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: BannerCreationFormProps) {
  const isEditMode = !!initialValues?.id;

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      image: initialValues?.image || "",
      linkedProductId: initialValues?.linkedProductId || "",
    },
    enableReinitialize: true,
    validationSchema: bannerSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            <PolarisSidebarCard
              title="Banner Preview"
              badge="Live Preview"
              icon={Sparkles}
            >
              <div className="relative aspect-[3/2] rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 flex flex-col items-center justify-center overflow-hidden group shadow-2xs">
                {formik.values.image ? (
                  <img
                    src={
                      typeof formik.values.image === "string"
                        ? formik.values.image.startsWith("http") ||
                          formik.values.image.startsWith("blob:") ||
                          formik.values.image.startsWith("data:")
                          ? formik.values.image
                          : `https://cdn.thrico.network/${formik.values.image}`
                        : formik.values.image instanceof File
                          ? URL.createObjectURL(formik.values.image)
                          : ""
                    }
                    alt="Banner Preview"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#8c9196]">
                    <LucideImage className="w-8 h-8 opacity-40" />
                    <span className="text-[11px] font-medium">
                      No Image Selected
                    </span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90" />

                <div className="absolute inset-x-0 bottom-0 p-3.5 flex flex-col items-start gap-2">
                  <h4 className="text-white font-bold text-lg sm:text-xl leading-tight line-clamp-2 drop-shadow-md">
                    {formik.values.title || "Your Engaging Headline Here"}
                  </h4>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 px-3 bg-white hover:bg-white/90 text-black font-semibold rounded-full text-[11px] shadow-md cursor-pointer"
                  >
                    Shop Now
                  </Button>
                </div>

                {formik.values.linkedProductId && (
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs rounded-full p-1.5 shadow-md">
                    <LinkIcon className="w-3 h-3 text-[#303030]" />
                  </div>
                )}
              </div>

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Headline"
                  value={
                    <span className="truncate max-w-[150px] inline-block font-semibold">
                      {formik.values.title || "Not specified"}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Banner Asset"
                  value={formik.values.image ? "Uploaded" : "Pending"}
                />
                <PolarisSummaryRow
                  label="Linked Item"
                  value={formik.values.linkedProductId ? "Assigned" : "None"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            <PolarisTipCard title="Storefront Banner Tip">
              Make sure your banner has a strong, clear headline. High-contrast images and direct product links boost campaign click-through rates.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-3.5">
          <PolarisFormCard
            step={1}
            title="Banner Media & Headline"
            description="Upload the primary promo creative and provide an eye-catching title."
            badge="Required"
          >
            <div className="space-y-1.5">
              <PolarisLabel required>Banner Image</PolarisLabel>
              <ImageUploadWithCrop
                currentImage={
                  typeof formik.values.image === "string"
                    ? formik.values.image
                    : formik.values.image instanceof File
                      ? URL.createObjectURL(formik.values.image)
                      : ""
                }
                onImageUpdate={(cdnUrl, url) => {
                  if (!url) {
                    formik.setFieldValue("image", "");
                    formik.setFieldTouched("image", true);
                  }
                }}
                returnFileOnly={true}
                onFileChange={(file) => {
                  formik.setFieldValue("image", file);
                  formik.setFieldTouched("image", true);
                }}
                aspectRatio={3 / 2}
                recommendedWidth={1536}
                recommendedHeight={1024}
                label=""
              />
              {formik.touched.image && formik.errors.image && (
                <p className="text-[12px] text-[#d72c0d] font-normal leading-[16px]">
                  {String(formik.errors.image)}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisInput
                id="title"
                name="title"
                label="Headline"
                required
                placeholder="e.g. Summer Sale 50% Off"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && formik.errors.title ? String(formik.errors.title) : undefined}
              />
            </div>
          </PolarisFormCard>

          <PolarisFormCard
            step={2}
            title="Action & Destination Link"
            description="Link this banner directly to a specific catalog item to maximize conversion."
            badge="Destination"
          >
            <div className="space-y-1">
              <PolarisLabel>Link to Product (Optional)</PolarisLabel>
              <ProductPicker
                value={formik.values.linkedProductId}
                onSelect={(id) => {
                  formik.setFieldValue("linkedProductId", id);
                }}
              />
            </div>
          </PolarisFormCard>

          <FloatingSavePanel
            hasChanged={formik.dirty}
            saved={false}
            isSaving={loading}
            onSave={() => formik.handleSubmit()}
            onReset={() => {
              formik.resetForm();
              if (onCancel) onCancel();
              else window.history.back();
            }}
            title={isEditMode ? "Unsaved Changes" : "Unsaved Banner"}
            description={
              isEditMode
                ? "You have unsaved changes."
                : "You have unfilled form data."
            }
            buttonText={isEditMode ? "Update Banner" : "Publish Banner"}
          />
        </form>
      </PolarisFormLayout>
    </FormikProvider>
  );
}
