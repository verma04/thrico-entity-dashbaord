"use client";

import React, { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { PolarisEligibilityCard } from "@/components/gamification/shared/polaris-eligibility-card";

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
  memberEligibility: Yup.string().default("ALL"),
  membershipTierId: Yup.array().when("memberEligibility", {
    is: "TIERS",
    then: (schema) =>
      schema.min(1, "Please select at least one membership tier"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleTierIds: Yup.array().when("memberEligibility", {
    is: "TIERS",
    then: (schema) =>
      schema.min(1, "Please select at least one membership tier"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleUserIds: Yup.array().when("memberEligibility", {
    is: "SPECIFIC_CUSTOMERS",
    then: (schema) => schema.min(1, "Please select at least one customer"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleCommunityIds: Yup.array().when("memberEligibility", {
    is: "COMMUNITY",
    then: (schema) => schema.min(1, "Please select at least one community"),
    otherwise: (schema) => schema.notRequired(),
  }),
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
      startDate: initialValues?.startDate || null,
      endDate: initialValues?.endDate || null,
      startTime: initialValues?.startTime || null,
      type: initialValues?.type || "in_person",
      lastDateOfRegistration: initialValues?.lastDateOfRegistration || null,
      communityId: initialValues?.communityId || "",
      communityIds: initialValues?.communityIds || [],
      memberEligibility: initialValues?.memberEligibility || "ALL",
      membershipTierId:
        initialValues?.membershipTierId || initialValues?.eligibleTierIds || [],
      eligibleTierIds:
        initialValues?.eligibleTierIds || initialValues?.membershipTierId || [],
      eligibleUserIds:
        initialValues?.eligibleUserIds ||
        initialValues?.eligibility?.eligibleUserIds ||
        [],
      eligibleSegmentIds:
        initialValues?.eligibleSegmentIds ||
        initialValues?.eligibility?.eligibleSegmentIds ||
        [],
      eligibleCommunityIds:
        initialValues?.eligibleCommunityIds ||
        initialValues?.eligibility?.eligibleCommunityIds ||
        [],
      isActive: initialValues?.isActive ?? true,
    },
    validationSchema: eventSchema,
    onSubmit: (values) => {
      const eligibilityPayload = {
        memberEligibility: values.memberEligibility,
        membershipTierId:
          values.memberEligibility === "TIERS" ? values.membershipTierId : [],
        eligibleTierIds:
          values.memberEligibility === "TIERS" ? values.eligibleTierIds : [],
        eligibleUserIds:
          values.memberEligibility === "SPECIFIC_CUSTOMERS"
            ? values.eligibleUserIds
            : [],
        eligibleSegmentIds: values.eligibleSegmentIds || [],
        eligibleCommunityIds:
          values.memberEligibility === "COMMUNITY"
            ? values.eligibleCommunityIds
            : [],
        communityIds: values.communityIds || [],
      };
      onFinish({
        ...values,
        memberEligibility: values.memberEligibility,
        eligibility: eligibilityPayload,
      });
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
                  label="Audience"
                  value={
                    formik.values.memberEligibility === "ALL"
                      ? "All Members"
                      : formik.values.memberEligibility === "VERIFIED"
                        ? "Verified Only"
                        : formik.values.memberEligibility === "TIERS"
                          ? `Specific Tiers (${(formik.values.membershipTierId || []).length})`
                          : formik.values.memberEligibility === "COMMUNITY"
                            ? `Specific Communities (${(formik.values.eligibleCommunityIds || []).length})`
                            : formik.values.memberEligibility === "SPECIFIC_CUSTOMERS"
                              ? `Specific Members (${(formik.values.eligibleUserIds || []).length})`
                              : formik.values.memberEligibility === "OUTSIDE_PLATFORM"
                                ? "Outside Platform (Public)"
                                : "All Members"
                  }
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
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Step 1: Core Event Identity & Venue */}
          <PolarisFormCard
            step={1}
            title={`Core ${singularName} Identity & Venue`}
            description="Configure the event cover banner, headline title, location coordinates, and attendee summary."
            badge="Required"
          >
            {/* Cover Image Upload */}
            <div className="space-y-1.5">
              <PolarisLabel required>Event Banner</PolarisLabel>
              <div className="relative group aspect-[3/2] sm:aspect-[21/9] w-full rounded-[6px] overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7] dark:bg-zinc-900 flex items-center justify-center">
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
                    className="h-8 px-3 bg-zinc-900/80 hover:bg-zinc-900 text-white backdrop-blur-xs border-none text-[12px] font-semibold shadow-md gap-1.5 cursor-pointer rounded-[4px]"
                    onClick={() =>
                      document.getElementById("cover-upload")?.click()
                    }
                  >
                    <Camera className="h-3 w-3" />
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
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                Recommended aspect ratio: 3:2 or 21:9 banner (1536 × 1024px). Max
                5MB.
              </p>
            </div>

            {/* Title & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisInput
                id="title"
                name="title"
                label={`${singularName} Title`}
                required
                placeholder="e.g. Annual Community Summit 2026"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && formik.errors.title ? String(formik.errors.title) : undefined}
              />

              <div className="space-y-1">
                <PolarisLabel required>Venue / Location</PolarisLabel>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#616161] z-10" />
                  <GooglePlacesInput
                    id="location"
                    name="location"
                    onBlur={formik.handleBlur}
                    placeholder="Search venue or address..."
                    className="h-[34px] pl-8 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12.5px] text-[#303030] dark:text-zinc-100 rounded-[6px]"
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
                  <p className="text-[12px] text-[#d72c0d] font-normal leading-[16px]">
                    {formik.errors.location as string}
                  </p>
                )}
              </div>
            </div>

            {/* Description Field */}
            <PolarisTextarea
              id="description"
              name="description"
              label={`${singularName} Description`}
              required
              rows={3}
              placeholder="Detail what attendees can expect, keynotes, topics, and schedule highlights..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={`${formik.values.description.length} characters (min 30)`}
              error={formik.touched.description && formik.errors.description ? String(formik.errors.description) : undefined}
            />
          </PolarisFormCard>

          {/* Step 2: Schedule & Registration Timeline */}
          <PolarisFormCard
            step={2}
            title="Schedule & Registration Timeline"
            description="Define event meeting format, dates, timezones, and RSVP cutoff deadlines."
            badge="Schedule"
          >
            {/* Meeting Format Selectable Tiles */}
            <div className="space-y-1.5">
              <PolarisLabel required>Event Format</PolarisLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                        "relative flex flex-col items-start p-3 rounded-[6px] border text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
                          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                      )}
                    >
                      <div
                        className={cn(
                          "h-7 w-7 rounded-[4px] flex items-center justify-center mb-1.5 border transition-colors",
                          isSelected
                            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                            : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        {type.label}
                      </span>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
                        {type.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisInput
                id="startDate"
                name="startDate"
                type="date"
                label="Start Date"
                required
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.startDate && formik.errors.startDate ? String(formik.errors.startDate) : undefined}
              />

              <PolarisInput
                id="endDate"
                name="endDate"
                type="date"
                label="End Date"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <PolarisInput
                id="startTime"
                name="startTime"
                type="time"
                label="Start Time"
                value={formik.values.startTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Registration Deadline & Active Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisInput
                id="lastDateOfRegistration"
                name="lastDateOfRegistration"
                type="date"
                label="RSVP Registration Deadline"
                value={formik.values.lastDateOfRegistration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <div className="space-y-1">
                <PolarisLabel>Publishing Status</PolarisLabel>
                <div className="h-[34px] px-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#303030] dark:text-zinc-300">
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

          {/* Step 3: Audience & Member Eligibility */}
          <PolarisEligibilityCard
            key={`eligibility-${formik.values.memberEligibility || "ALL"}`}
            step={3}
            title="Audience & Eligibility"
            description={`Define who can view and RSVP for this ${singularName.toLowerCase()} — open to the public, all community members, verified members, specific tiers, communities, or invite-only guests.`}
            badge="Access"
            allowOutsidePlatform={true}
            allowCommunity={true}
            eligibility={formik.values.memberEligibility || "ALL"}
            onEligibilityChange={(val) => {
              formik.setFieldValue("memberEligibility", val);
              if (
                val === "ALL" ||
                val === "VERIFIED" ||
                val === "OUTSIDE_PLATFORM"
              ) {
                formik.setFieldValue("membershipTierId", []);
                formik.setFieldValue("eligibleTierIds", []);
                formik.setFieldValue("eligibleUserIds", []);
                formik.setFieldValue("eligibleCommunityIds", []);
                formik.setFieldValue("communityIds", []);
              }
            }}
            tierIds={
              formik.values.membershipTierId ||
              formik.values.eligibleTierIds ||
              []
            }
            onTierIdsChange={(tiers) => {
              formik.setFieldValue("membershipTierId", tiers);
              formik.setFieldValue("eligibleTierIds", tiers);
            }}
            communityIds={
              formik.values.eligibleCommunityIds ||
              formik.values.communityIds ||
              []
            }
            onCommunityIdsChange={(comms) => {
              formik.setFieldValue("eligibleCommunityIds", comms);
              formik.setFieldValue("communityIds", comms);
            }}
            userIds={formik.values.eligibleUserIds || []}
            onUserIdsChange={(users) => {
              formik.setFieldValue("eligibleUserIds", users);
            }}
            errorMessage={
              formik.values.memberEligibility === "TIERS"
                ? ((formik.touched.membershipTierId && formik.errors.membershipTierId) ||
                    (formik.touched.eligibleTierIds && formik.errors.eligibleTierIds)) as string
                : formik.values.memberEligibility === "COMMUNITY"
                  ? ((formik.touched.eligibleCommunityIds && formik.errors.eligibleCommunityIds) ||
                      (formik.touched.communityIds && formik.errors.communityIds)) as string
                  : formik.values.memberEligibility === "SPECIFIC_CUSTOMERS"
                    ? (formik.touched.eligibleUserIds && (formik.errors.eligibleUserIds as string))
                    : null
            }
          />

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
