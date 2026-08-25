"use client";

import React, { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Camera,
  MapPin,
  Laptop,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import GooglePlacesInput from "@/components/layout/google-place-input";
import { useToast } from "@/components/ui/use-toast";
import { ImageCropper } from "@/components/communities/add/image-cropper";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { EventPreview } from "./event-preview";
import { useModuleStore } from "@/store/useModuleStore";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

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
    .min(30, "Description must be at least 30 characters"),
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
  buttonText,
}: EventsCreationFormProps) {
  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialCoverUrl || null,
  );
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
      isActive: initialValues?.isActive ?? true,
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

  const handleInputChange = (field: string, value: any) => {
    formik.setFieldValue(field, value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    formik.handleSubmit();
  };

  const formatLocationName = (loc: any) => {
    if (!loc) return "Venue not set";
    if (typeof loc === "string") return loc;
    return loc.name || loc.address || "Venue not set";
  };

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Event Preview Card */}
            <PolarisSidebarCard
              title={`${singularName} Preview`}
              badge="Live Preview"
              icon={Sparkles}
            >
              <EventPreview
                eventData={{
                  ...formik.values,
                  location: formik.values.location
                    ? { name: formatLocationName(formik.values.location) }
                    : undefined,
                }}
                coverImage={imageUrl || undefined}
              />

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Event Format"
                  value={
                    formik.values.type === "in_person"
                      ? "In Person Venue"
                      : formik.values.type === "virtual"
                        ? "Virtual Livestream"
                        : "Hybrid Meetup"
                  }
                />
                <PolarisSummaryRow
                  label="Location"
                  value={
                    <span className="truncate max-w-[150px] inline-block font-semibold">
                      {formatLocationName(formik.values.location)}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Start Date"
                  value={formik.values.startDate || "Not scheduled"}
                />
                <PolarisSummaryRow
                  label="Registration"
                  value={formik.values.lastDateOfRegistration || "Open"}
                />
                <PolarisSummaryRow
                  label="Status"
                  value={formik.values.isActive ? "Active (Live)" : "Draft"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Event Success Tip */}
            <PolarisTipCard title={`${singularName} Scheduling Tip`}>
              Clear registration deadlines and high-resolution cover banners
              increase member RSVP conversion rates by over 40%.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Core Event Identity & Venue */}
          <PolarisFormCard
            step={1}
            title={`Core ${singularName} Identity & Venue`}
            description={`Configure the event cover banner, headline title, location coordinates, and attendee summary.`}
            badge="Required"
          >
            {/* Cover Image Upload */}
            <div className="space-y-2">
              <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                Event Banner <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <div className="relative group aspect-[3/2] sm:aspect-[21/9] w-full rounded-[8px] overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7] dark:bg-zinc-900 flex items-center justify-center">
                <Image
                  src={
                    imageUrl || `https://cdn.thrico.network/default_event.png`
                  }
                  alt={`${singularName} cover`}
                  width={1536}
                  height={1024}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-9 px-4 bg-zinc-900/80 hover:bg-zinc-900 text-white backdrop-blur-xs border-none text-[13px] font-semibold shadow-md gap-2 cursor-pointer rounded-[6px]"
                    onClick={() =>
                      document.getElementById("cover-upload")?.click()
                    }
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Change Cover Banner
                  </Button>
                </div>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-[12px] text-[#616161] dark:text-zinc-400">
                Recommended aspect ratio: 3:2 or 21:9 banner (1536 × 1024px). Max
                5MB.
              </p>
            </div>

            {/* Title & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <div className="space-y-1.5">
                <label
                  htmlFor="title"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  {singularName} Title{" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder={`e.g. Annual Community Summit 2026`}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.title as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="location"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  Venue / Location{" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#616161] z-10" />
                  <GooglePlacesInput
                    id="location"
                    name="location"
                    onBlur={formik.handleBlur}
                    placeholder="Search venue or address..."
                    className="h-[40px] pl-9 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px]"
                    initialValue={
                      formik.values.location
                        ? {
                            name: formatLocationName(formik.values.location),
                            address: formatLocationName(formik.values.location),
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
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.location as string}
                  </p>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
              >
                {singularName} Description{" "}
                <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder={`Detail what attendees can expect, keynotes, topics, and schedule highlights...`}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-[110px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] p-3 resize-none shadow-none"
              />
              <div className="flex items-center justify-between">
                {formik.touched.description && formik.errors.description ? (
                  <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                    {formik.errors.description as string}
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-[11.5px] text-[#616161] font-medium">
                  {formik.values.description.length} characters (min 30)
                </p>
              </div>
            </div>
          </PolarisFormCard>

          {/* Step 2: Schedule & Registration Timeline */}
          <PolarisFormCard
            step={2}
            title="Schedule & Registration Timeline"
            description={`Define event meeting format, dates, timezones, and RSVP cutoff deadlines.`}
            badge="Schedule"
          >
            {/* Meeting Format Selectable Tiles */}
            <div className="space-y-2">
              <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                Event Format <span className="text-[#d72c0d] ml-0.5">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    value: "in_person",
                    label: "In Person",
                    icon: MapPin,
                    desc: "Physical venue gathering",
                  },
                  {
                    value: "virtual",
                    label: "Virtual",
                    icon: Laptop,
                    desc: "Online webinar or livestream",
                  },
                  {
                    value: "hybrid",
                    label: "Hybrid",
                    icon: RefreshCw,
                    desc: "Combined in-person & online",
                  },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = formik.values.type === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange("type", type.value)}
                      className={cn(
                        "relative flex flex-col items-start p-3.5 rounded-[8px] border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
                          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-[6px] flex items-center justify-center mb-2 border transition-colors",
                          isSelected
                            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                            : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
                        {type.label}
                      </span>
                      <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[16px]">
                        {type.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <div className="space-y-1.5">
                <label
                  htmlFor="startDate"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  Start Date <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="endDate"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  End Date
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="startTime"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  Start Time
                </label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formik.values.startTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
              </div>
            </div>

            {/* Registration Deadline & Active Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <div className="space-y-1.5">
                <label
                  htmlFor="lastDateOfRegistration"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  RSVP Registration Deadline
                </label>
                <Input
                  id="lastDateOfRegistration"
                  name="lastDateOfRegistration"
                  type="date"
                  value={formik.values.lastDateOfRegistration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                  Publishing Status
                </label>
                <div className="h-[40px] px-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#303030] dark:text-zinc-300">
                    {formik.values.isActive
                      ? "Published (Live Event)"
                      : "Draft (Hidden)"}
                  </span>
                  <Switch
                    id="isActive"
                    checked={formik.values.isActive}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("isActive", checked)
                    }
                  />
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Floating Save Action Bar */}
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
            title={buttonText || `Create ${singularName}`}
            description="You have pending changes to the event configuration."
            buttonText={buttonText || `Publish ${singularName}`}
          />
        </form>
      </PolarisFormLayout>

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
    </FormikProvider>
  );
}
