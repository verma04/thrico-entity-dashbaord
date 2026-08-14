"use client";

import { useFormikContext } from "formik";
import { Label } from "@/components/ui/label";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { ProductFormValues } from "../product-form";
import { useModuleStore } from "@/store/useModuleStore";

export function MediaSection() {
  const { values, setFieldValue } = useFormikContext<ProductFormValues>();
  const singularName = useModuleStore((state) => state.shopSingularName);

  const handleImagesChange = (imgs: string[]) => {
    setFieldValue("images", imgs);
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        Product Photography Gallery (Up to 8 Images)
      </Label>
      <div className="p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/40 dark:bg-zinc-900/40">
        <MultiImageUpload
          images={values.images || (values.image ? [values.image] : [])}
          onImagesChange={handleImagesChange}
          maxImages={8}
          returnKeyOnly={true}
        />
      </div>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        Supported formats: PNG, JPG, WEBP. First image will act as the primary catalog thumbnail.
      </p>
    </div>
  );
}
