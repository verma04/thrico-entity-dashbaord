"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useCreateSponsor, useUpdateSponsor } from "@/graphql/actions/sponsors";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  ChevronRight,
  HeartHandshake,
  Globe,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SponsorFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().nullable(),
  externalUrl: Yup.string()
    .test("is-url-valid", "Must be a valid URL", (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    })
    .nullable(),
  isActive: Yup.boolean().required("Status is required"),
});

export default function SponsorForm({ initialData, isEdit }: SponsorFormProps) {
  const router = useRouter();
  const [createSponsor, { loading: creating }] = useCreateSponsor();
  const [updateSponsor, { loading: updating }] = useUpdateSponsor();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    externalUrl: initialData?.externalUrl || "",
    isActive: initialData?.isActive ?? true,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!imageFile && !initialData?.image) {
      toast.error("Sponsor image is required");
      return;
    }

    try {
      const input: any = {
        title: values.title,
        description: values.description,
        externalUrl: values.externalUrl,
        isActive: values.isActive,
      };

      if (imageFile) {
        input.imageUpload = imageFile;
      }

      if (isEdit && initialData?.id) {
        await updateSponsor({
          variables: { id: initialData.id, input },
        });
        toast.success("Sponsor updated successfully");
      } else {
        await createSponsor({
          variables: { input },
        });
        toast.success("Sponsor created successfully");
      }
      router.push("/sponsors/all");
    } catch (error) {
      toast.error(`Failed to ${isEdit ? "update" : "create"} sponsor`);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden rounded-t-[inherit]">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <HeartHandshake className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEdit ? "Edit Sponsor" : "Create Sponsor"}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Sponsors</span>
              <ChevronRight className="h-3 w-3" />
              <span>{isEdit ? "Edit" : "Create New"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              setFieldValue,
              errors,
              touched,
              dirty,
              handleSubmit: formikSubmit,
              resetForm,
            }) => (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form fields */}
                <div className="lg:col-span-8 space-y-8">
                  <Form className="space-y-8">
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">
                          Basic Information
                        </CardTitle>
                        <CardDescription>
                          Details about the sponsor
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                          <Label>Sponsor Image *</Label>
                          <div className="w-full max-w-sm">
                            <ImageUploadWithCrop
                              returnFileOnly={true}
                              onFileChange={(file) => {
                                setImageFile(file);
                              }}
                              onImageUpdate={() => {}} // Not needed when returnFileOnly is true
                              aspectRatio={4 / 3}
                              recommendedWidth={400}
                              currentImage={initialData?.image || undefined}
                              label=""
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Upload a logo or image for the sponsor. Recommended
                            aspect ratio is 4:3.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-medium">
                            Sponsor Name / Title *
                          </Label>
                          <Field
                            as={Input}
                            id="title"
                            name="title"
                            placeholder="e.g. Acme Corp"
                            className={cn(
                              touched.title &&
                                errors.title &&
                                "border-destructive",
                            )}
                          />
                          {errors.title && touched.title && (
                            <div className="text-destructive text-xs mt-1">
                              {errors.title}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                          >
                            Description
                          </Label>
                          <Field
                            as={Textarea}
                            id="description"
                            name="description"
                            placeholder="Brief description about the sponsor"
                            rows={4}
                            className={cn(
                              "resize-none",
                              touched.description &&
                                errors.description &&
                                "border-destructive",
                            )}
                          />
                          {errors.description && touched.description && (
                            <div className="text-destructive text-xs mt-1">
                              {errors.description}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="externalUrl"
                            className="text-sm font-medium"
                          >
                            External Link (URL)
                          </Label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Field
                              as={Input}
                              id="externalUrl"
                              name="externalUrl"
                              type="url"
                              placeholder="https://example.com"
                              className={cn(
                                "pl-10",
                                touched.externalUrl &&
                                  errors.externalUrl &&
                                  "border-destructive",
                              )}
                            />
                          </div>
                          {errors.externalUrl && touched.externalUrl && (
                            <div className="text-destructive text-xs mt-1">
                              {errors.externalUrl}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                          <div>
                            <Label className="text-base font-semibold">
                              Active Status
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Determines if this sponsor is visible on the
                              platform.
                            </p>
                          </div>
                          <Switch
                            checked={values.isActive}
                            onCheckedChange={(val) =>
                              setFieldValue("isActive", val)
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Form>
                </div>

                {/* Preview Sidebar */}
                <div className="lg:col-span-4">
                  <div className="sticky top-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Listing Preview</h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/5 text-green-600 border-green-500/20"
                      >
                        Live Preview
                      </Badge>
                    </div>

                    <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
                      <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                      <CardContent className="pt-6 space-y-6">
                        <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                          {imageFile ? (
                            <Image
                              src={URL.createObjectURL(imageFile)}
                              alt="Preview"
                              fill
                              className="object-contain"
                            />
                          ) : initialData?.image ? (
                            <Image
                              src={initialData.image}
                              alt="Preview"
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="text-muted-foreground text-xs flex flex-col items-center gap-2">
                              <HeartHandshake className="h-8 w-8 opacity-20" />
                              <span>No Image</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-xl leading-tight text-center">
                            {values.title || "Sponsor Title"}
                          </h4>
                        </div>

                        {values.description && (
                          <>
                            <Separator className="opacity-50" />
                            <div className="text-sm text-center text-muted-foreground line-clamp-4">
                              {values.description}
                            </div>
                          </>
                        )}

                        {values.externalUrl && (
                          <Button
                            variant="outline"
                            className="w-full gap-2"
                            disabled
                          >
                            <Globe className="h-4 w-4" />
                            Visit Website
                          </Button>
                        )}

                        <p className="text-[10px] text-center text-muted-foreground italic mt-4">
                          Preview version - Final layout may vary
                        </p>
                      </CardContent>
                    </Card>

                    <FloatingSavePanel
                      hasChanged={dirty || !!imageFile}
                      saved={false}
                      isSaving={creating || updating}
                      onSave={() => formikSubmit()}
                      onReset={() => {
                        resetForm();
                        setImageFile(null);
                        router.back();
                      }}
                      title={isEdit ? "Unsaved Changes" : "Unsaved Sponsor"}
                      description={
                        isEdit
                          ? "You have unsaved edits."
                          : "You have unfilled form data."
                      }
                      buttonText={isEdit ? "Update Sponsor" : "Publish Sponsor"}
                    />
                  </div>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
