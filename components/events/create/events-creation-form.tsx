"use client";

import React, { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Camera,
  Calendar,
  MapPin,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GooglePlacesInput from "@/components/layout/google-place-input";

import { useToast } from "@/components/ui/use-toast";
import { ImageCropper } from "@/components/communities/add/image-cropper";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { EventPreview } from "./event-preview";
import { useModuleStore } from "@/store/useModuleStore";

interface EventsCreationFormProps {
  initialValues?: Record<string, any>;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
  cover: any;
  setCover: (cover: any) => void;
  initialCoverUrl?: string | null;
  buttonText?: string;
  headerTitle?: string;
}

const eventSchema = Yup.object().shape({
  title: Yup.string().required("Event title is required"),
  location: Yup.mixed().required("Location is required"),
  description: Yup.string()
    .required("Event description is required")
    .min(50, "Description must be at least 50 characters"),
  type: Yup.string().required("Event type is required"),
});

export function EventsCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
  cover,
  setCover,
  initialCoverUrl,
  buttonText = "Create Event",
  headerTitle = "Create Event",
}: EventsCreationFormProps) {
  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(initialCoverUrl || null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialCoverUrl) {
      setImageUrl(initialCoverUrl);
    }
  }, [initialCoverUrl]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: initialValues?.title || "",
      location: initialValues?.location || "",
      description: initialValues?.description || "",
      startDate: initialValues?.startDate || "",
      endDate: initialValues?.endDate || "",
      startTime: initialValues?.startTime || "",
      type: initialValues?.type || "in_person",
      lastDateOfRegistration: initialValues?.lastDateOfRegistration || "",
      isActive: initialValues?.isActive ?? false,
    },
    validationSchema: eventSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setCropModalVisible(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage: any, croppedUrl: string) => {
    setCover(croppedImage);
    setImageUrl(croppedUrl);
    setCropModalVisible(false);
    setSelectedImage(null);
    toast({
      title: "Success",
      description: "Cover image updated successfully!",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <FormikProvider value={formik}>
      <>
        <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
          {/* Header section - Sticky */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {headerTitle}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
                  <span>{moduleName}</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>Create New {singularName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">Basic Information</CardTitle>
                        <CardDescription>
                          Essential details about your {singularName.toLowerCase()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        {/* Cover Image Section */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Cover Image</Label>
                          <div
                            className={cn(
                              "relative group rounded-xl overflow-hidden border-2 border-dashed transition-all cursor-pointer",
                              imageUrl ? "border-transparent" : "border-muted-foreground/25 hover:border-primary/50 bg-muted/30"
                            )}
                            onClick={() => !imageUrl && document.getElementById("cover-upload")?.click()}
                          >
                            {imageUrl ? (
                              <>
                                <div className="aspect-[21/9] w-full relative">
                                  <Image
                                    src={imageUrl}
                                    alt={`${singularName} cover preview`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    className="gap-2 shadow-lg"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      document.getElementById("cover-upload")?.click();
                                    }}
                                  >
                                    <Camera className="h-4 w-4" />
                                    Change Cover Image
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <div className="aspect-[21/9] w-full flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors">
                                <div className="p-4 rounded-full bg-primary/10 text-primary ring-4 ring-primary/5">
                                  <Camera className="h-6 w-6" />
                                </div>
                                <div className="text-center space-y-1">
                                  <p className="text-sm font-medium">
                                    Click to upload cover image
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    PNG, JPG or WEBP (max. 5MB)
                                  </p>
                                </div>
                              </div>
                            )}
                            <input
                              id="cover-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-medium">
                              {singularName} Title{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="title"
                              name="title"
                              placeholder="e.g., Annual Tech Conference 2024"
                              value={formik.values.title}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={cn(
                                formik.touched.title &&
                                  formik.errors.title &&
                                  "border-destructive",
                              )}
                            />
                            {formik.touched.title && formik.errors.title && (
                              <p className="text-xs text-destructive">
                                {String(formik.errors.title)}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="location"
                              className="text-sm font-medium"
                            >
                              Location <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                              <GooglePlacesInput
                                id="location"
                                name="location"
                                onBlur={formik.handleBlur}
                                placeholder="Search for a location"
                                className={cn(
                                  "pl-10",
                                  formik.touched.location &&
                                    formik.errors.location &&
                                    "border-destructive",
                                )}
                                initialValue={
                                  formik.values.location
                                    ? {
                                        name: formik.values.location,
                                        address: formik.values.location,
                                        latitude: 0,
                                        longitude: 0,
                                      }
                                    : null
                                }
                                onChange={(loc) =>
                                  formik.setFieldValue(
                                    "location",
                                    loc.address || loc.name,
                                  )
                                }
                              />
                            </div>
                            {formik.touched.location && formik.errors.location && (
                              <p className="text-xs text-destructive">
                                {String(formik.errors.location)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                          >
                            {singularName} Description{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder={`Describe the ${singularName.toLowerCase()}, what attendees can expect, and what makes it exciting...`}
                            className={cn(
                              "min-h-[160px] resize-none",
                              formik.touched.description &&
                                formik.errors.description &&
                                "border-destructive",
                            )}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.description &&
                            formik.errors.description && (
                              <p className="text-xs text-destructive">
                                {String(formik.errors.description)}
                              </p>
                            )}
                          <p className="text-[11px] text-muted-foreground text-right italic">
                            {formik.values.description.length} characters (min 50)
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Event Details */}
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">{singularName} Details</CardTitle>
                        <CardDescription>
                          Date, time, and type of {singularName.toLowerCase()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="startDate"
                              className="text-sm font-medium"
                            >
                              Start Date <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="startDate"
                              name="startDate"
                              type="date"
                              value={formik.values.startDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="endDate"
                              className="text-sm font-medium"
                            >
                              End Date <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="endDate"
                              name="endDate"
                              type="date"
                              value={formik.values.endDate}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="startTime"
                              className="text-sm font-medium"
                            >
                              Start Time <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="startTime"
                              name="startTime"
                              type="time"
                              value={formik.values.startTime}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="type" className="text-sm font-medium">
                              {singularName} Type <span className="text-destructive">*</span>
                            </Label>
                            <Select
                              onValueChange={(value) =>
                                formik.setFieldValue("type", value)
                              }
                              value={formik.values.type}
                            >
                              <SelectTrigger
                                id="type"
                                className={cn(
                                  formik.touched.type &&
                                    formik.errors.type &&
                                    "border-destructive",
                                )}
                              >
                                <SelectValue placeholder={`Select ${singularName.toLowerCase()} type`} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="in_person">In Person</SelectItem>
                                <SelectItem value="virtual">Virtual</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                            {formik.touched.type && formik.errors.type && (
                              <p className="text-xs text-destructive">
                                {String(formik.errors.type)}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="lastDateOfRegistration"
                              className="text-sm font-medium"
                            >
                              Registration Deadline{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="lastDateOfRegistration"
                              name="lastDateOfRegistration"
                              type="date"
                              value={formik.values.lastDateOfRegistration}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="isActive" className="text-sm font-medium">
                            Active Status
                          </Label>
                          <div className="flex items-center space-x-2 mt-2">
                            <Switch
                              id="isActive"
                              checked={formik.values.isActive}
                              onCheckedChange={(checked) => formik.setFieldValue("isActive", checked)}
                            />
                            <Label htmlFor="isActive" className="text-sm text-muted-foreground">
                              {formik.values.isActive ? `${singularName} is Active` : `${singularName} is Inactive`}
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                </div>

                {/* Live Preview Sidebar */}
                <div className="lg:col-span-4">
                  <div className="sticky top-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{singularName} Preview</h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/5 text-green-600 border-green-500/20"
                      >
                        Live Preview
                      </Badge>
                    </div>

                    <EventPreview
                      eventData={{
                        ...formik.values,
                        location: formik.values.location ? { name: formik.values.location } : undefined,
                      }}
                      coverImage={imageUrl || undefined}
                    />

                    <Card className="border-none shadow-sm ring-1 ring-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Info className="h-5 w-5" />
                          Tips for Success
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 text-sm">
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>
                              Choose a clear, descriptive title for your {singularName.toLowerCase()}.
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>
                              Upload a high-quality cover image to attract attendees.
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>
                              Provide a detailed description of what attendees can expect.
                            </span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>
                              Double-check your date, time, and location settings.
                            </span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Cropper Modal */}
          {selectedImage && (
            <ImageCropper
              cropModalVisible={cropModalVisible}
              image={selectedImage}
              onCropComplete={handleCropComplete}
              onCancel={() => {
                setCropModalVisible(false);
                setSelectedImage(null);
              }}
            />
          )}
        </div>
        
        <FloatingSavePanel
          hasChanged={formik.dirty}
          saved={false}
          isSaving={loading}
          onSave={handleSubmit}
          onReset={() => {
            formik.resetForm();
            if (onCancel) onCancel();
            else window.history.back();
          }}
          title={`Unsaved ${singularName} Data`}
          description="You have unfilled form data."
          buttonText={buttonText}
        />
      </>
    </FormikProvider>
  );
}
