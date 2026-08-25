"use client";

import React from "react";
import { useFormikContext } from "formik";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ProductFormValues } from "../product-form";
import { useModuleStore } from "@/store/useModuleStore";
import {
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";

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
    <div className="space-y-3">
      {/* Name & SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <PolarisInput
          id="title"
          name="title"
          label={`${singularName} Title`}
          required
          placeholder="e.g., Signature Heavyweight Tee"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={(touched.title || submitCount > 0) && errors.title ? String(errors.title) : undefined}
        />

        <div className="space-y-1">
          <PolarisLabel>
            SKU Identifier <span className="text-[#616161] font-normal text-[11px]">(Stock Unit)</span>
          </PolarisLabel>
          <div className="flex gap-1.5">
            <div className="flex-1">
              <PolarisInput
                id="sku"
                name="sku"
                placeholder="e.g., MERCH-TEE-001"
                value={values.sku || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                className="font-mono uppercase"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="Generate SKU from Title"
              className="h-[34px] w-[34px] border-[#aeb4b9] dark:border-zinc-700 shrink-0 rounded-[6px] cursor-pointer hover:bg-[#f6f6f7]"
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
              <RefreshCw className="h-3.5 w-3.5 text-[#616161]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Description Field */}
      <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
        <PolarisTextarea
          id="description"
          name="description"
          label="Product Description"
          placeholder="Describe product specifications, materials, fit, care instructions, and warranty..."
          rows={3}
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={`${values.description?.length || 0} characters`}
        />
      </div>
    </div>
  );
}
