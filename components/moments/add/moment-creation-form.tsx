"use client";

import React, { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Video,
  Image as ImageIcon,
  FileVideo,
  CloudUpload,
  Sparkles,
  Trash2,
} from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useModuleStore } from "@/store/useModuleStore";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

export function MomentCreationForm({
  loading,
  onFinish,
  onCancel,
  onUploadAssets,
  step = 1,
  uploadedAssets = null,
  uploadProgress = 0,
  uploadStatus = null,
}: any) {
  const singularName = useModuleStore((state) => state.momentSingularName);
  const { toast } = useToast();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    uploadedAssets?.thumbnailUrl || null,
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const momentSchema = Yup.object({
    caption: Yup.string().when("step", {
      is: 2,
      then: (schema) =>
        schema.required("Caption is required").max(500, "Max 500 characters"),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      caption: "",
      isAiContent: false,
      shareInFeed: true,
    },
    validationSchema: momentSchema,
    onSubmit: (values) => {
      if (step === 1) {
        if (!videoFile) {
          toast({
            title: "Missing Video Asset",
            description: `Please select a vertical video file for your ${singularName.toLowerCase()}.`,
            variant: "destructive",
          });
          return;
        }
        onUploadAssets({ videoFile, thumbnailFile });
      } else {
        onFinish({ ...values, ...uploadedAssets });
      }
    },
  });

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid MP4, MOV, or WebM video file.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File exceeds limit",
          description: "Maximum supported video size is 100MB.",
          variant: "destructive",
        });
        return;
      }
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleThumbnailSelect = async (file: File) => {
    setThumbnailFile(file);
    const url = URL.createObjectURL(file);
    setThumbnailUrl(url);
    return url;
  };

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live 9:16 Vertical Story Preview */}
            <PolarisSidebarCard
              title={`${singularName} Preview`}
              badge="Live Story"
              icon={Sparkles}
            >
              <div className="aspect-[9/16] relative bg-zinc-950 rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 overflow-hidden group shadow-xs flex flex-col justify-between">
                {videoPreviewUrl ? (
                  <video
                    src={videoPreviewUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : thumbnailUrl ? (
                  <Image
                    src={thumbnailUrl}
                    alt="Story cover"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-zinc-500">
                    <Video className="h-10 w-10 opacity-30" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Story Player
                    </span>
                  </div>
                )}

                {/* Top Status Bar */}
                <div className="relative z-10 p-3.5 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center text-white text-[10px] font-bold">
                      {singularName.charAt(0)}
                    </div>
                    <span className="text-[12px] font-semibold text-white truncate max-w-[120px]">
                      {singularName}
                    </span>
                  </div>
                  {formik.values.isAiContent && (
                    <span className="px-2 py-0.5 rounded-[4px] bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold flex items-center gap-1 border border-white/10">
                      <Sparkles className="h-2.5 w-2.5" />
                      AI
                    </span>
                  )}
                </div>

                {/* Bottom Caption Overlay */}
                <div className="relative z-10 p-3.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent space-y-2">
                  <p className="text-[12px] font-medium text-white/95 line-clamp-3 leading-[16px]">
                    {formik.values.caption ||
                      "Narrative hook and caption preview..."}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-white/60 pt-1 border-t border-white/10">
                    <span>
                      {formik.values.shareInFeed
                        ? "Visible in Feed"
                        : "Direct Link"}
                    </span>
                    <span>9:16 Vertical</span>
                  </div>
                </div>
              </div>

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Video Asset"
                  value={
                    <span className="truncate max-w-[140px] inline-block font-semibold">
                      {videoFile ? videoFile.name : "Not selected"}
                    </span>
                  }
                />
                {videoFile && (
                  <PolarisSummaryRow
                    label="File Size"
                    value={`${(videoFile.size / (1024 * 1024)).toFixed(2)} MB`}
                  />
                )}
                <PolarisSummaryRow
                  label="Cover Frame"
                  value={thumbnailUrl ? "Custom Cover" : "Auto-generated"}
                />
                <PolarisSummaryRow
                  label="Feed Distribution"
                  value={formik.values.shareInFeed ? "Enabled" : "Disabled"}
                />
                <PolarisSummaryRow
                  label="AI Content"
                  value={formik.values.isAiContent ? "Flagged" : "No"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Content Retention Tip */}
            <PolarisTipCard title={`${singularName} Creation Tip`}>
              Vertical short-form stories with compelling opening frames retain
              viewer attention 4.2× longer within the first 3 seconds.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {step === 1 ? (
            /* Step 1: Video Package & Cover Asset */
            <PolarisFormCard
              step={1}
              title="Media Binary & Cover Asset"
              description={`Select your high-resolution 9:16 vertical video package and optional custom thumbnail.`}
              badge="Required"
            >
              {/* Video Upload Box */}
              <div className="space-y-2">
                <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                  Video File (9:16 Vertical){" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                {!videoFile ? (
                  <div className="relative group">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[8px] py-10 flex flex-col items-center justify-center gap-2 bg-[#f6f6f7]/60 dark:bg-zinc-900/50 group-hover:bg-[#f6f6f7] dark:group-hover:bg-zinc-800/50 transition-all cursor-pointer">
                      <div className="h-10 w-10 rounded-[8px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] flex items-center justify-center text-[#616161] dark:text-zinc-400">
                        <CloudUpload className="h-5 w-5" />
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-[#303030] dark:text-zinc-200">
                          Click to upload video or drag and drop
                        </p>
                        <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5">
                          MP4, MOV or WebM (up to 100MB · vertical 9:16
                          recommended)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-[6px] bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
                        <FileVideo className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 truncate max-w-[280px]">
                          {videoFile.name}
                        </p>
                        <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 font-medium">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB ·
                          Ready for staging
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#616161] hover:text-[#d72c0d] hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer rounded-[6px]"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreviewUrl(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Cover Asset Selection */}
              <div className="space-y-2 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                  Custom Static Cover Frame (Optional)
                </label>
                <div className="flex items-start gap-4 p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/30">
                  <div className="w-20 aspect-[9/16] rounded-[6px] bg-[#e1e3e5] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center overflow-hidden relative group shrink-0">
                    {thumbnailUrl ? (
                      <Image
                        src={thumbnailUrl}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-[#8c9196]" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageUploadWithCrop
                        currentImage={thumbnailUrl || ""}
                        onImageUpdate={setThumbnailUrl}
                        customUploadHandler={handleThumbnailSelect}
                        label=""
                        aspectRatio={9 / 16}
                        className="p-0"
                        dropzoneClassName="h-7 w-7 rounded-full bg-white text-zinc-900 flex items-center justify-center p-0 cursor-pointer shadow-md"
                        previewClassName="hidden"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
                      </ImageUploadWithCrop>
                    </div>
                  </div>
                  <div className="flex-1 space-y-0.5 pt-1">
                    <p className="text-[13px] font-semibold text-[#303030] dark:text-zinc-200">
                      Feed Snapshot Frame
                    </p>
                    <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                      Custom static covers appear in community feeds and
                      notifications. If omitted, the video initial keyframe will
                      be extracted automatically.
                    </p>
                  </div>
                </div>
              </div>
            </PolarisFormCard>
          ) : (
            /* Step 2: Narrative Hook & Feed Distribution */
            <PolarisFormCard
              step={2}
              title="Narrative Hook & Distribution Policy"
              description="Craft the narrative caption and manage feed visibility and AI tagging."
              badge="Finalize"
            >
              {/* Caption Textarea */}
              <div className="space-y-1.5">
                <label
                  htmlFor="caption"
                  className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                >
                  Story Caption & Context{" "}
                  <span className="text-[#d72c0d] ml-0.5">*</span>
                </label>
                <Textarea
                  id="caption"
                  name="caption"
                  placeholder={`Describe this ${singularName.toLowerCase()}, share thoughts, or pose questions to your community...`}
                  value={formik.values.caption}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoFocus
                  className="min-h-[120px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[14px] text-[#303030] dark:text-zinc-100 rounded-[8px] p-3 resize-none shadow-none"
                />
                <div className="flex items-center justify-between">
                  {formik.touched.caption && formik.errors.caption ? (
                    <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                      {formik.errors.caption as string}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p className="text-[11.5px] text-[#616161] font-medium">
                    {formik.values.caption.length} / 500 characters
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                  Distribution Settings
                </label>

                {/* Feed Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50">
                  <div className="space-y-0.5">
                    <span className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                      Share in Community Feed
                    </span>
                    <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                      Broadcast to the global feed for all community members to
                      discover.
                    </p>
                  </div>
                  <Switch
                    id="shareInFeed"
                    checked={formik.values.shareInFeed}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("shareInFeed", checked)
                    }
                  />
                </div>

                {/* AI Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50">
                  <div className="space-y-0.5">
                    <span className="text-[13.5px] font-semibold text-[#303030] dark:text-zinc-100 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#616161]" />
                      AI-Generated Content Label
                    </span>
                    <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                      Mark content synthesized or heavily generated by AI
                      algorithms.
                    </p>
                  </div>
                  <Switch
                    id="isAiContent"
                    checked={formik.values.isAiContent}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("isAiContent", checked)
                    }
                  />
                </div>
              </div>
            </PolarisFormCard>
          )}

          {/* Floating Action Bar */}
          <FloatingSavePanel
            hasChanged={formik.dirty || !!videoFile}
            saved={false}
            isSaving={loading}
            onSave={() => formik.handleSubmit()}
            onReset={() => {
              formik.resetForm();
              setVideoFile(null);
              setVideoPreviewUrl(null);
              setThumbnailFile(null);
              setThumbnailUrl(null);
              if (onCancel) onCancel();
              else window.history.back();
            }}
            title={
              step === 1
                ? `Broadcast ${singularName}`
                : `Finalize ${singularName}`
            }
            description={
              step === 1
                ? "Video package ready to transmit."
                : "Configure captions before publishing."
            }
            buttonText={
              step === 1 ? "Upload & Continue" : `Publish ${singularName}`
            }
          />
        </form>
      </PolarisFormLayout>

      {/* Monochromatic Upload / Processing Modal */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="w-full max-w-sm px-8 flex flex-col items-center text-center">
            <div className="relative mb-6 h-16 w-16">
              <div className="absolute inset-0 h-16 w-16 border-2 border-white/20 rounded-2xl" />
              <div className="absolute inset-0 h-16 w-16 border-t-2 border-white rounded-2xl animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
            </div>

            <h2 className="text-base font-bold text-white tracking-tight">
              {uploadStatus || `Broadcasting ${singularName}...`}
            </h2>

            {uploadProgress > 0 && uploadProgress <= 100 && (
              <div className="w-full mt-5 space-y-1.5">
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                    Transmitting
                  </span>
                  <span className="text-[10px] font-bold text-white">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </FormikProvider>
  );
}
