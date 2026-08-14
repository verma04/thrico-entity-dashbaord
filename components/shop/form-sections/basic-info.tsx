"use client";

import { useFormikContext } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ProductFormValues } from "../product-form";
import { useModuleStore } from "@/store/useModuleStore";

export function BasicInfoSection() {
  const {
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    submitCount,
  } = useFormikContext<ProductFormValues>();
  const singularName = useModuleStore((state) => state.shopSingularName);

  return (
    <div className="space-y-4">
      {/* Name & SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {singularName} Title <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Signature Heavyweight Tee"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
          />
          {(touched.title || submitCount > 0) && errors.title && (
            <p className="text-[11px] text-rose-500 font-medium">{errors.title as string}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sku" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            SKU Identifier <span className="text-zinc-400 font-normal">(Stock Unit)</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="sku"
              name="sku"
              placeholder="e.g., MERCH-TEE-001"
              value={values.sku || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold font-mono uppercase"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="Generate SKU from Title"
              className="h-10 w-10 border-zinc-200 dark:border-zinc-800 shrink-0"
              onClick={() => {
                if (values.title) {
                  const generated = values.title
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");
                  setFieldValue("sku", generated);
                }
              }}
            >
              <RefreshCw className="h-4 w-4 text-zinc-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Description Field */}
      <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Label htmlFor="description" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Product Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder={`Describe product specifications, materials, fit, care instructions, and warranty...`}
          rows={4}
          className="min-h-[110px] bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-medium resize-none shadow-none"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p className="text-[10px] text-zinc-400 font-medium text-right">
          {values.description?.length || 0} characters
        </p>
      </div>

      {/* Stock Status */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40">
        <div className="space-y-0.5">
          <Label className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Out of Stock Toggle
          </Label>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            Temporarily disable checkout and mark this item as unavailable.
          </p>
        </div>
        <Switch
          checked={values.isOutOfStock}
          onCheckedChange={(checked) =>
            setFieldValue("isOutOfStock", checked)
          }
        />
      </div>
    </div>
  );
}
