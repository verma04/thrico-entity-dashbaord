"use client";

import { useFormikContext } from "formik";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ProductFormValues } from "../product-form";

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

  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-xl">Basic Information</CardTitle>
        <CardDescription>Core details about your product</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Product Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Vintage T-Shirt"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={
              (touched.title || submitCount > 0) && errors.title
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {(touched.title || submitCount > 0) && errors.title && (
            <p className="text-xs text-destructive">{errors.title as string}</p>
          )}
        </div>

        {/* SKU Field */}
        <div className="space-y-2">
          <Label htmlFor="sku" className="text-sm font-medium">
            SKU{" "}
            <span className="text-muted-foreground font-normal">
              (Stock Keeping Unit)
            </span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="sku"
              name="sku"
              placeholder="e.g. SUMMER-TEE-001"
              value={values.sku || ""}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              title="Generate SKU from Title"
              onClick={() => {
                if (values.title) {
                  const generated = values.title
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "-") // Replace non-alphanumeric with hyphen
                    .replace(/-+/g, "-") // Replace multiple hyphens with single
                    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
                  setFieldValue("sku", generated);
                }
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your product..."
            rows={4}
            className="resize-none"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label>Out of Stock</Label>
            <p className="text-xs text-muted-foreground">
              Mark this product as unavailable
            </p>
          </div>
          <Switch
            checked={values.isOutOfStock}
            onCheckedChange={(checked) =>
              setFieldValue("isOutOfStock", checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
