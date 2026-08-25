"use client";

import React, { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Camera,
  Globe,
  Lock,
  Laptop,
  MapPin,
  RefreshCw,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CommunityPreview } from "./community-preview";
import { ImageCropper } from "./image-cropper";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";
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

interface CommunityCreationFormProps {
  initialValues?: any;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
  cover?: any;
  setCover: (cover: any) => void;
  initialCoverUrl?: string;
}

export function CommunityCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
  cover,
  setCover,
  initialCoverUrl,
}: CommunityCreationFormProps) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialCoverUrl || null,
  );
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const communitySchema = Yup.object({
    title: Yup.string()
      .required(`${singularName} name is required`)
      .max(50, "Max 50 characters"),
    tagline: Yup.string().max(100, "Max 100 characters"),
    description: Yup.string().max(300, "Max 300 characters"),
    privacy: Yup.string().required("Privacy setting is required"),
    communityType: Yup.string().required(`${singularName} type is required`),
    joiningTerms: Yup.string().required("Joining terms are required"),
  });

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      tagline: initialValues?.tagline || "",
      description: initialValues?.description || "",
      privacy: initialValues?.privacy || "PUBLIC",
      communityType: initialValues?.communityType || "VIRTUAL",
      joiningTerms: initialValues?.joiningTerms || "ANYONE_CAN_JOIN",
      requireAdminApprovalForPosts:
        initialValues?.requireAdminApprovalForPosts ?? false,
      allowMemberInvites: initialValues?.allowMemberInvites ?? false,
      enableEvents: initialValues?.enableEvents ?? false,
      enableRatingsAndReviews: initialValues?.enableRatingsAndReviews ?? false,
    },
    validationSchema: communitySchema,
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

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Community Preview Card */}
            <PolarisSidebarCard
              title={`${singularName} Preview`}
              badge="Live Preview"
              icon={Sparkles}
            >
              <CommunityPreview imageUrl={imageUrl} formData={formik.values} />

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Privacy"
                  value={
                    formik.values.privacy === "PUBLIC"
                      ? "Public Access"
                      : "Private (Invite Only)"
                  }
                />
                <PolarisSummaryRow
                  label="Meeting Mode"
                  value={
                    formik.values.communityType === "VIRTUAL"
                      ? "Virtual Online"
                      : formik.values.communityType === "INPERSON"
                        ? "In-Person"
                        : "Hybrid"
                  }
                />
                <PolarisSummaryRow
                  label="Joining Terms"
                  value={
                    formik.values.joiningTerms === "ANYONE_CAN_JOIN"
                      ? "Direct Join"
                      : "Admin Approval"
                  }
                />
                <PolarisSummaryRow
                  label="Post Moderation"
                  value={
                    formik.values.requireAdminApprovalForPosts
                      ? "Approval Required"
                      : "Instant Publishing"
                  }
                />
                <PolarisSummaryRow
                  label="Member Invites"
                  value={
                    formik.values.allowMemberInvites ? "Enabled" : "Disabled"
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Community Growth Tip */}
            <PolarisTipCard title={`${singularName} Launch Strategy`}>
              High-performing {moduleName.toLowerCase()} start with clear
              descriptions, public discoverability, and active events to drive
              organic peer onboarding.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Step 1: Core Identity & Branding */}
          <PolarisFormCard
            step={1}
            title={`Core ${singularName} Identity`}
            description={`Establish the visual presence, title, and mission for your ${singularName.toLowerCase()}.`}
            badge="Required"
          >
            {/* Cover Image Upload Area */}
            <div className="space-y-1.5">
              <PolarisLabel required>Cover Banner</PolarisLabel>
              <div className="relative group aspect-[3/2] sm:aspect-[21/9] w-full rounded-[6px] overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7] dark:bg-zinc-900 flex items-center justify-center">
                <Image
                  src={
                    imageUrl ||
                    `https://cdn.thrico.network/default_communities.png`
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
                Recommended aspect ratio: 3:2 or 21:9 banner (1536 × 1024px).
                Max 5MB WebP, PNG, or JPG.
              </p>
            </div>

            {/* Name Field */}
            <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisInput
                id="title"
                name="title"
                label={`${singularName} Name`}
                required
                maxLength={50}
                placeholder="e.g. NextGen Innovators Club"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && formik.errors.title ? String(formik.errors.title) : undefined}
              />
            </div>

            {/* Tagline Field */}
            <PolarisInput
              id="tagline"
              name="tagline"
              label="Headline / Tagline"
              maxLength={100}
              placeholder="e.g. Connecting tech leaders, developers, and product creators."
              value={formik.values.tagline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tagline && formik.errors.tagline ? String(formik.errors.tagline) : undefined}
            />

            {/* Description Field */}
            <PolarisTextarea
              id="description"
              name="description"
              label="About & Overview"
              rows={3}
              maxLength={300}
              placeholder={`Describe the mission, activities, guidelines, and benefits of joining this ${singularName.toLowerCase()}...`}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </PolarisFormCard>

          {/* Step 2: Access & Governance Settings */}
          <PolarisFormCard
            step={2}
            title="Access & Governance Policy"
            description="Define privacy bounds, physical location requirements, and entry conditions."
            badge="Governance"
          >
            {/* Privacy Setting Selectable Tiles */}
            <div className="space-y-1.5">
              <PolarisLabel required>Privacy Boundary</PolarisLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleInputChange("privacy", "PUBLIC")}
                  className={cn(
                    "relative flex items-start gap-2.5 p-3 rounded-[6px] border text-left transition-all cursor-pointer",
                    formik.values.privacy === "PUBLIC"
                      ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors",
                      formik.values.privacy === "PUBLIC"
                        ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                        : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                    )}
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Public {singularName}
                      </span>
                      <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border border-[#d2d5d9]">
                        Open
                      </span>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
                      Anyone in your ecosystem can discover, view, and join this{" "}
                      {singularName.toLowerCase()}.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange("privacy", "PRIVATE")}
                  className={cn(
                    "relative flex items-start gap-2.5 p-3 rounded-[6px] border text-left transition-all cursor-pointer",
                    formik.values.privacy === "PRIVATE"
                      ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors",
                      formik.values.privacy === "PRIVATE"
                        ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                        : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                    )}
                  >
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Private {singularName}
                      </span>
                      <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded-[3px] bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border border-[#d2d5d9]">
                        Restricted
                      </span>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
                      Only invited or approved members can view discussions and
                      media.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Meeting Mode / Community Type */}
            <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisLabel required>Meeting Format</PolarisLabel>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    value: "VIRTUAL",
                    label: "Virtual",
                    icon: Laptop,
                    desc: "Digital discussions & virtual meetups",
                  },
                  {
                    value: "INPERSON",
                    label: "In Person",
                    icon: MapPin,
                    desc: "Local chapter meeting at a venue",
                  },
                  {
                    value: "HYBRID",
                    label: "Hybrid",
                    icon: RefreshCw,
                    desc: "Combined online feeds & physical events",
                  },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = formik.values.communityType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        handleInputChange("communityType", type.value)
                      }
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

            {/* Joining Terms */}
            <div className="space-y-1.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
              <PolarisLabel required>Membership Admission Terms</PolarisLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange("joiningTerms", "ANYONE_CAN_JOIN")
                  }
                  className={cn(
                    "relative flex items-start gap-2.5 p-3 rounded-[6px] border text-left transition-all cursor-pointer",
                    formik.values.joiningTerms === "ANYONE_CAN_JOIN"
                      ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors",
                      formik.values.joiningTerms === "ANYONE_CAN_JOIN"
                        ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                        : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                    )}
                  >
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                      Direct Enrollment
                    </span>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
                      Members can instantly join with a single click without
                      moderation bottlenecks.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleInputChange("joiningTerms", "ADMIN_ONLY_ADD")
                  }
                  className={cn(
                    "relative flex items-start gap-2.5 p-3 rounded-[6px] border text-left transition-all cursor-pointer",
                    formik.values.joiningTerms === "ADMIN_ONLY_ADD"
                      ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                  )}
                >
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors",
                      formik.values.joiningTerms === "ADMIN_ONLY_ADD"
                        ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                        : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                    )}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                      Admin Invitation Only
                    </span>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
                      Only ecosystem managers and community admins can assign
                      members.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </PolarisFormCard>

          {/* Step 3: Permissions & Feature Controls */}
          <PolarisFormCard
            step={3}
            title="Feature Toggles & Moderation"
            description="Enable specialized modules and enforce post moderation safeguards."
            badge="Features"
          >
            <div className="space-y-2.5">
              {/* Post Approval Toggle */}
              <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                    Require admin review for new member posts
                  </span>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Submitted discussion threads and media will queue in
                    moderation before going live.
                  </p>
                </div>
                <Switch
                  checked={formik.values.requireAdminApprovalForPosts}
                  onCheckedChange={(checked) =>
                    handleInputChange("requireAdminApprovalForPosts", checked)
                  }
                />
              </div>

              {/* Member Invites Toggle */}
              <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                    Allow members to send peer invitations
                  </span>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Existing participants can invite colleagues and contacts to
                    join.
                  </p>
                </div>
                <Switch
                  checked={formik.values.allowMemberInvites}
                  onCheckedChange={(checked) =>
                    handleInputChange("allowMemberInvites", checked)
                  }
                />
              </div>

              {/* Events Toggle */}
              <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                    Enable dedicated {singularName.toLowerCase()} calendar &
                    events
                  </span>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Host webinars, meetups, and workshops scoped specifically to
                    this group.
                  </p>
                </div>
                <Switch
                  checked={formik.values.enableEvents}
                  onCheckedChange={(checked) =>
                    handleInputChange("enableEvents", checked)
                  }
                />
              </div>

              {/* Ratings and Reviews Toggle */}
              <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                    Enable ratings and member reviews
                  </span>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Allow participants to submit peer reviews and public
                    feedback.
                  </p>
                </div>
                <Switch
                  checked={formik.values.enableRatingsAndReviews}
                  onCheckedChange={(checked) =>
                    handleInputChange("enableRatingsAndReviews", checked)
                  }
                />
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
            title={`Unsaved ${singularName}`}
            description="You have modified the form configuration."
            buttonText={`Create ${singularName}`}
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
