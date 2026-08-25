"use client";

import React from "react";
import { useFormikContext } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
          >
            {singularName} Title{" "}
            <span className="text-[#d72c0d] ml-0.5">*</span>
          </label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Signature Heavyweight Tee"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
          />
          {(touched.title || submitCount > 0) && errors.title && (
            <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
              {errors.title as string}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="sku"
            className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
          >
            SKU Identifier{" "}
            <span className="text-[#616161] font-normal">(Stock Unit)</span>
          </label>
          <div className="flex gap-2">
            <Input
              id="sku"
              name="sku"
              placeholder="e.g., MERCH-TEE-001"
              value={values.sku || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] font-mono uppercase"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="Generate SKU from Title"
              className="h-[40px] w-[40px] border-[#aeb4b9] dark:border-zinc-700 shrink-0 rounded-[8px] cursor-pointer"
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
              <RefreshCw className="h-4 w-4 text-[#616161]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Description Field */}
      <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
        <label
          htmlFor="description"
          className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
        >
          Product Description
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder={`Describe product specifications, materials, fit, care instructions, and warranty...`}
          rows={4}
          className="min-h-[110px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px] p-3 resize-none shadow-none"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p className="text-[11.5px] text-[#616161] font-medium text-right">
          {values.description?.length || 0} characters
        </p>
      </div>
    </div>
  );
}
