"use client";

import React from "react";
import { useFormikContext } from "formik";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { ProductFormValues } from "../product-form";
import { PolarisLabel } from "@/components/gamification/shared/polaris-form-ui";

export function MediaSection() {
  const { values, setFieldValue } = useFormikContext<ProductFormValues>();

  const handleImagesChange = (imgs: string[]) => {
    setFieldValue("images", imgs);
  };

  return (
    <div className="space-y-1.5">
      <PolarisLabel>Product Photography Gallery (Up to 8 Images)</PolarisLabel>
      <div className="p-3 border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[6px] bg-[#f6f6f7]/60 dark:bg-zinc-900/40">
        <MultiImageUpload
          images={values.images || (values.image ? [values.image] : [])}
          onImagesChange={handleImagesChange}
          maxImages={8}
          returnKeyOnly={true}
        />
      </div>
      <p className="text-[11px] text-[#616161] dark:text-zinc-400">
        Supported formats: PNG, JPG, WEBP. First image will act as the primary catalog thumbnail.
      </p>
    </div>
  );
}
