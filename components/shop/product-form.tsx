"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { VariantManager } from "./variant-manager";
import { UTMGenerator } from "./utm-generator";
import { Loader2 } from "lucide-react";
import { useShopStore } from "@/store/useShopStore";
import { Label } from "@/components/ui/label";
import { getCategoryDefaultImage } from "@/lib/shop-utils";
import { useModuleStore } from "@/store/useModuleStore";

// Validation Schema with Yup
const productSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, "Title must be at least 2 characters")
    .required("Title is required"),
  description: Yup.string(),
  price: Yup.string().required("Price is required"),
  currency: Yup.string().required("Currency is required"),
  category: Yup.string().required("Category is required"),
  image: Yup.string(),
  images: Yup.array().of(Yup.string()).optional(),
  isOutOfStock: Yup.boolean().optional(),
  sku: Yup.string().optional(),
  externalLink: Yup.string().url("Invalid URL").optional(),
});

export interface ProductFormValues {
  title: string;
  description: string;
  price: string;
  currency: string;
  category: string;
  image: string;
  images?: string[];
  isOutOfStock?: boolean;
  sku?: string;
  externalLink: string;
  // Variants/Options are managed by Zustand, but we include them in the submit payload for the parent
  variants?: any[];
  options?: any[];
  hasVariants?: boolean;
}

interface ProductFormProps {
  initialData?: ProductFormValues;
  onSubmit: (data: ProductFormValues) => void;
  isLoading?: boolean;
  categories: { id: string; name: string }[];
  entityName?: string;
}

export function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  categories,
  entityName = "My Store",
}: ProductFormProps) {
  const singularName = useModuleStore((state) => state.shopSingularName);
  const {
    variants,
    options,
    setVariants,
    setOptions,
    hasVariants,
    setHasVariants,
    reset,
  } = useShopStore();

  // Initialize Zustand store with initialData on mount
  useEffect(() => {
    if (initialData) {
      if (initialData.variants) setVariants(initialData.variants);
      if (initialData.options) setOptions(initialData.options);
      if (initialData.hasVariants !== undefined)
        setHasVariants(initialData.hasVariants);
    } else {
      // Reset if no initialData (e.g. creating new)
      // Check if we are truly unmounting or just re-rendering
      // Ideally should reset on unmount or on mount of "New" page
      reset();
    }
  }, [initialData, setVariants, setOptions, setHasVariants, reset]);

  const formik = useFormik({
    initialValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      currency: initialData?.currency || "USD",
      category: initialData?.category || "",
      image: initialData?.image || "",
      externalLink: initialData?.externalLink || "",
    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      console.log(values);
      // Merge Formik values with Zustand state
      // const submissionData: ProductFormValues = {
      //   ...values,
      //   variants: variants,
      //   options: options,
      //   hasVariants: hasVariants,
      // };
      // onSubmit(submissionData);
    },
  });

  const handleUTMChange = (url: string) => {
    // If it comes from the generator, update the form
    formik.setFieldValue("externalLink", url);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{singularName} Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="T-Shirt, Gift Card, etc."
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.title && formik.errors.title
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-xs text-red-500">{formik.errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.price && formik.errors.price
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.touched.price && formik.errors.price && (
                    <p className="text-xs text-red-500">
                      {formik.errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(val) => {
                      formik.setFieldValue("category", val);
                      // Auto-set category default image if no image exists
                      if (!formik.values.image) {
                        formik.setFieldValue(
                          "image",
                          getCategoryDefaultImage(val),
                        );
                      }
                    }}
                    value={formik.values.category}
                  >
                    <SelectTrigger
                      className={
                        formik.touched.category && formik.errors.category
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <p className="text-xs text-red-500">
                      {formik.errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={`Describe your ${singularName.toLowerCase()}...`}
                  className="min-h-[120px]"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>{singularName} Image</Label>
                <ImageUploadWithCrop
                  currentImage={formik.values.image}
                  onImageUpdate={(url) => formik.setFieldValue("image", url)}
                  label="Upload Image"
                  aspectRatio={1}
                />
              </div>
            </CardContent>
          </Card>

          <UTMGenerator
            entityName={entityName}
            baseUrl={formik.values.externalLink}
            onUrlChange={(url) => {
              // We only want to auto-update if the user is using the generator
              // OR if we treat the generator as the primary input for this field.
              // Based on previous implementation, let's sync them.
              formik.setFieldValue("externalLink", url);
            }}
          />
          {formik.touched.externalLink && formik.errors.externalLink && (
            <p className="text-xs text-red-500 -mt-4">
              {formik.errors.externalLink}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Variants</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant={hasVariants ? "secondary" : "outline"}
                  onClick={() => setHasVariants(!hasVariants)}
                  className="text-xs h-7"
                >
                  {hasVariants ? "Disable Variants" : "Enable Variants"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!hasVariants ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  This {singularName.toLowerCase()} has no variants.
                  <br />
                  Enable variants to add options like Size or Color.
                </div>
              ) : (
                <VariantManager basePrice={formik.values.price || "0"} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || formik.isSubmitting || !formik.isValid}
          className="min-w-[150px]"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? `Update ${singularName}` : `Create ${singularName}`}
        </Button>
      </div>
    </form>
  );
}
