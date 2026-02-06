"use client";

import { useFormikContext } from "formik";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";
import { ProductFormValues } from "../product-form";

export function MediaSection() {
  const { values, setFieldValue } = useFormikContext<ProductFormValues>();

  const handleImagesChange = (imgs: string[]) => {
    setFieldValue("images", imgs);

    console.log(imgs);
    // Backward compatibility or secondary field update if needed
    // if (imgs.length > 0) setFieldValue("image", imgs[0]);
  };

  return (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-xl">Product Media</CardTitle>
        <CardDescription>Upload images for your product</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="p-4 border border-dashed rounded-lg bg-muted/20">
            <MultiImageUpload
              images={values.images || (values.image ? [values.image] : [])}
              onImagesChange={handleImagesChange}
              maxImages={8}
              returnKeyOnly={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
