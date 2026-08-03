"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ImageIcon, Link as LinkIcon, Save, Image as LucideImage } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ProductPicker } from "@/components/shop/product-picker";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";

interface BannerCreationFormProps {
  initialValues?: Record<string, any>;
  loading?: boolean;
  onFinish: (values: { title: string; image: string; linkedProductId?: string | null }) => void;
  onCancel?: () => void;
}

const bannerSchema = Yup.object().shape({
  title: Yup.string().required("Headline is required"),
  image: Yup.mixed().required("Banner image is required"),
  linkedProductId: Yup.string().nullable(),
});

export function BannerCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: BannerCreationFormProps) {
  const isEditMode = !!initialValues?.id;

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      image: initialValues?.image || "",
      linkedProductId: initialValues?.linkedProductId || "",
    },
    enableReinitialize: true,
    validationSchema: bannerSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {initialValues?.id ? "Edit Banner" : "Create Banner"}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Shop</span>
              <ChevronRight className="h-3 w-3" />
              <span>Banners</span>
              <ChevronRight className="h-3 w-3" />
              <span>
                {initialValues?.id ? "Edit Banner" : "Create New Banner"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <form className="space-y-8">
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Banner Details</CardTitle>
                    <CardDescription>
                      Upload the main image and provide a catchy headline.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-1.5">
                        Banner Image <span className="text-destructive">*</span>
                      </Label>
                      <ImageUploadWithCrop
                        currentImage={
                          typeof formik.values.image === "string"
                            ? formik.values.image
                            : formik.values.image instanceof File
                            ? URL.createObjectURL(formik.values.image)
                            : ""
                        }
                        onImageUpdate={(cdnUrl, url) => {
                          if (!url) {
                            formik.setFieldValue("image", "");
                            formik.setFieldTouched("image", true);
                          }
                        }}
                        returnFileOnly={true}
                        onFileChange={(file) => {
                          formik.setFieldValue("image", file);
                          formik.setFieldTouched("image", true);
                        }}
                        aspectRatio={3 / 2}
                        recommendedWidth={1536}
                        recommendedHeight={1024}
                        label=""
                      />
                      {formik.touched.image && formik.errors.image && (
                        <p className="text-xs text-destructive">
                          {String(formik.errors.image)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium flex items-center gap-1.5">
                        Headline <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g. Summer Sale 50% Off"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={cn(
                          "h-10",
                          formik.touched.title && formik.errors.title && "border-destructive"
                        )}
                      />
                      {formik.touched.title && formik.errors.title && (
                        <p className="text-xs text-destructive">
                          {String(formik.errors.title)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Action &amp; Linking</CardTitle>
                    <CardDescription>
                      Link this banner to a specific product to drive conversions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-1.5">
                        Link to Product (Optional)
                      </Label>
                      <ProductPicker
                        value={formik.values.linkedProductId}
                        onSelect={(id) => {
                          formik.setFieldValue("linkedProductId", id);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Banner Preview</h3>
                  <Badge
                    variant="outline"
                    className="bg-green-500/5 text-green-600 border-green-500/20"
                  >
                    Live Preview
                  </Badge>
                </div>

                <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
                  <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/2] bg-muted/30 flex flex-col items-center justify-center overflow-hidden group">
                      {formik.values.image ? (
                        <img
                          src={
                            typeof formik.values.image === "string"
                              ? formik.values.image.startsWith("http") || formik.values.image.startsWith("blob:") || formik.values.image.startsWith("data:")
                                ? formik.values.image
                                : `${process.env.NEXT_PUBLIC_CDN_URL}/${formik.values.image}`
                              : formik.values.image instanceof File
                              ? URL.createObjectURL(formik.values.image)
                              : ""
                          }
                          alt="Banner Preview"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-muted-foreground/60">
                          <LucideImage className="w-12 h-12" />
                          <span className="text-sm font-medium">No Image Selected</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90" />
                      
                      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-4 transform transition-all duration-300">
                        <h4 className="text-white font-bold text-2xl sm:text-3xl leading-tight line-clamp-2 drop-shadow-md">
                          {formik.values.title || "Your Engaging Headline Here"}
                        </h4>
                        <Button 
                          variant="secondary" 
                          className="bg-white/90 hover:bg-white text-black font-semibold rounded-full px-6 shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
                        >
                          Shop Now
                        </Button>
                      </div>

                      {formik.values.linkedProductId && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <LinkIcon className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="p-4 rounded-xl bg-muted/30 border border-dashed border-border flex items-start gap-4">
                  <div className="mt-1 p-1 bg-primary/20 rounded-full shrink-0">
                    <ImageIcon className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Make sure your banner has a strong, clear headline. The image should be high quality and relevant to the promotion. Linked products will direct users directly to the item.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={false}
        isSaving={loading}
        onSave={() => formik.handleSubmit()}
        onReset={() => {
          formik.resetForm();
          if (onCancel) onCancel();
          else window.history.back();
        }}
        title={isEditMode ? "Unsaved Changes" : "Unsaved Banner"}
        description={isEditMode ? "You have unsaved changes." : "You have unfilled form data."}
        buttonText={isEditMode ? "Update Banner" : "Publish Banner"}
      />
    </div>
  );
}
