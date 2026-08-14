"use client";

import { useFormikContext } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="price" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Base Retail Price <span className="text-rose-500">*</span>
        </Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={values.price}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
        />
        {(touched.price || submitCount > 0) && errors.price && (
          <p className="text-[11px] text-rose-500 font-medium">
            {errors.price as string}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="currency" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Currency Unit <span className="text-rose-500">*</span>
        </Label>
        <Select
          onValueChange={(val) => setFieldValue("currency", val)}
          value={values.currency}
        >
          <SelectTrigger
            className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
          >
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
          <p className="text-[11px] text-rose-500 font-medium">
            {errors.currency as string}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Store Category <span className="text-rose-500">*</span>
        </Label>
        <Select
          onValueChange={(val) => setFieldValue("category", val)}
          value={values.category}
        >
          <SelectTrigger
            className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
          >
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
          <p className="text-[11px] text-rose-500 font-medium">
            {errors.category as string}
          </p>
        )}
      </div>
    </div>
  );
}
