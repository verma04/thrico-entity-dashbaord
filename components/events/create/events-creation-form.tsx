"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
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
import {
  Camera,
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GooglePlacesInput from "@/components/layout/google-place-input";

import { useToast } from "@/components/ui/use-toast";
import { ImageCropper } from "@/components/communities/add/image-cropper";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

interface EventsCreationFormProps {
  initialValues?: Record<string, any>;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
  cover: any;
  setCover: (cover: any) => void;
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
}: EventsCreationFormProps) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      location: initialValues?.location || "",
      description: initialValues?.description || "",
      startDate: initialValues?.startDate || "",
      endDate: initialValues?.endDate || "",
      startTime: initialValues?.startTime || "",
      type: initialValues?.type || "IN_PERSON",
      lastDateOfRegistration: initialValues?.lastDateOfRegistration || "",
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

  return (
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
                Create Event
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Events</span>
              <ChevronRight className="h-3 w-3" />
              <span>Create New Event</span>
            </div>
          </div>
          </div>
        </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
                className="space-y-8"
              >
                {/* Cover Image Card */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Event Cover Image</CardTitle>
                    <CardDescription>
                      Upload an eye-catching cover image for your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="relative">
                        <div className="aspect-[3/1] overflow-hidden rounded-lg bg-muted border-2 border-dashed">
                          <Image
                            src={
                              imageUrl ||
                              "https://cdn.thrico.network/default_event.png"
                            }
                            alt="Event cover"
                            width={600}
                            height={200}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <label htmlFor="cover-upload">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute bottom-4 right-4 gap-2"
                            onClick={() =>
                              document.getElementById("cover-upload")?.click()
                            }
                          >
                            <Camera className="h-4 w-4" />
                            Update Cover
                          </Button>
                        </label>
                        <input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 1200 x 400px. Max file size: 5MB.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Info */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    <CardDescription>
                      Essential details about your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Event Title{" "}
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
                        Event Description{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe the event, what attendees can expect, and what makes it exciting..."
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
                    <CardTitle className="text-xl">Event Details</CardTitle>
                    <CardDescription>
                      Date, time, and type of event
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
                          Event Type <span className="text-destructive">*</span>
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
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IN_PERSON">In Person</SelectItem>
                            <SelectItem value="ONLINE">Online</SelectItem>
                            <SelectItem value="HYBRID">Hybrid</SelectItem>
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
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Live Preview Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Event Preview</h3>
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
                    <div className="aspect-[3/1] overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={
                          imageUrl ||
                          "https://cdn.thrico.network/defaultEventCover.png"
                        }
                        alt="Event preview"
                        width={400}
                        height={133}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div>
                      <h4 className="font-bold text-lg leading-tight">
                        {formik.values.title || "Event Title"}
                      </h4>
                      <p className="text-muted-foreground text-sm mt-1">
                        {formik.values.type || "Event Type"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/5 text-primary border-primary/10"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {formik.values.location || "Location"}
                      </Badge>
                      {formik.values.startDate && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/5 text-blue-600 border-blue-500/10"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {formik.values.startDate}
                        </Badge>
                      )}
                      {formik.values.startTime && (
                        <Badge
                          variant="secondary"
                          className="bg-green-500/5 text-green-600 border-green-500/10"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {formik.values.startTime}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Description
                      </h5>
                      <p className="text-sm line-clamp-3 text-foreground/80 leading-relaxed">
                        {formik.values.description ||
                          "Event description will appear here..."}
                      </p>
                    </div>

                    <Button className="w-full" disabled>
                      Register Now
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground italic">
                      Preview version - Final layout may vary slightly
                    </p>
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
        title="Unsaved Event Data"
        description="You have unfilled form data."
        buttonText="Create Event"
      />
    </div>
  );
}
