"use client";

import React from "react";
import { useFormikContext } from "formik";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormValues } from "../product-form";

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
      <div className="space-y-1.5">
        <label
          htmlFor="price"
          className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
        >
          Base Retail Price <span className="text-[#d72c0d] ml-0.5">*</span>
        </label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={values.price}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
        />
        {(touched.price || submitCount > 0) && errors.price && (
          <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
            {errors.price as string}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="currency"
          className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
        >
          Currency Unit <span className="text-[#d72c0d] ml-0.5">*</span>
        </label>
        <Select
          onValueChange={(val) => setFieldValue("currency", val)}
          value={values.currency}
        >
          <SelectTrigger className="h-[40px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px]">
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
          <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
            {errors.currency as string}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="category"
          className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
        >
          Store Category <span className="text-[#d72c0d] ml-0.5">*</span>
        </label>
        <Select
          onValueChange={(val) => setFieldValue("category", val)}
          value={values.category}
        >
          <SelectTrigger className="h-[40px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px]">
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
          <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
            {errors.category as string}
          </p>
        )}
      </div>
    </div>
  );
}
