"use client";

import { useFormikContext } from "formik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-xl">Pricing & Category</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price <span className="text-destructive">*</span>
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
              className={
                (touched.price || submitCount > 0) && errors.price
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {(touched.price || submitCount > 0) && errors.price && (
              <p className="text-xs text-destructive">
                {errors.price as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm font-medium">
              Currency <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => setFieldValue("currency", val)}
              value={values.currency}
            >
              <SelectTrigger
                className={
                  (touched.currency || submitCount > 0) && errors.currency
                    ? "border-destructive "
                    : ""
                }
              >
                <SelectValue placeholder="Select" />
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
              <p className="text-xs text-destructive">
                {errors.currency as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => setFieldValue("category", val)}
              value={values.category}
            >
              <SelectTrigger
                className={
                  (touched.category || submitCount > 0) && errors.category
                    ? "border-destructive"
                    : ""
                }
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
              <p className="text-xs text-destructive">
                {errors.category as string}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
