"use client";

import React from "react";
import { useFormikContext } from "formik";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { ProductFormValues } from "../product-form";

export function MediaSection() {
  const { values, setFieldValue } = useFormikContext<ProductFormValues>();

  const handleImagesChange = (imgs: string[]) => {
    setFieldValue("images", imgs);
  };

  return (
    <div className="space-y-2">
      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
        Product Photography Gallery (Up to 8 Images)
      </label>
      <div className="p-4 border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[8px] bg-[#f6f6f7]/60 dark:bg-zinc-900/40">
        <MultiImageUpload
          images={values.images || (values.image ? [values.image] : [])}
          onImagesChange={handleImagesChange}
          maxImages={8}
          returnKeyOnly={true}
        />
      </div>
      <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
        Supported formats: PNG, JPG, WEBP. First image will act as the primary
        catalog thumbnail.
      </p>
    </div>
  );
}
