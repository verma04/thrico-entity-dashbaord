"use client";

import React from "react";
import { useFormikContext } from "formik";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormValues } from "../product-form";
import {
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";

interface PricingSectionProps {
  categories: { id: string; name: string }[];
}

export function PricingSection({ categories }: PricingSectionProps) {
  const {
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldValue,
    submitCount,
  } = useFormikContext<ProductFormValues>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <PolarisInput
        id="price"
        name="price"
        type="number"
        step="0.01"
        label="Base Retail Price"
        required
        placeholder="0.00"
        value={values.price}
        onChange={handleChange}
        onBlur={handleBlur}
        error={(touched.price || submitCount > 0) && errors.price ? String(errors.price) : undefined}
      />

      <div className="space-y-1">
        <PolarisLabel required>Currency Unit</PolarisLabel>
        <Select
          onValueChange={(val) => setFieldValue("currency", val)}
          value={values.currency}
        >
          <SelectTrigger className="h-[34px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12.5px] text-[#303030] dark:text-zinc-100 rounded-[6px]">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="EUR">EUR (€)</SelectItem>
            <SelectItem value="GBP">GBP (£)</SelectItem>
            <SelectItem value="INR">INR (₹)</SelectItem>
            <SelectItem value="AUD">AUD ($)</SelectItem>
            <SelectItem value="CAD">CAD ($)</SelectItem>
          </SelectContent>
        </Select>
        {(touched.currency || submitCount > 0) && errors.currency && (
          <p className="text-[12px] text-[#d72c0d] font-normal leading-[16px]">
            {errors.currency as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <PolarisLabel required>Store Category</PolarisLabel>
        <Select
          onValueChange={(val) => setFieldValue("category", val)}
          value={values.category}
        >
          <SelectTrigger className="h-[34px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12.5px] text-[#303030] dark:text-zinc-100 rounded-[6px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(touched.category || submitCount > 0) && errors.category && (
          <p className="text-[12px] text-[#d72c0d] font-normal leading-[16px]">
            {errors.category as string}
          </p>
        )}
      </div>
    </div>
  );
}
