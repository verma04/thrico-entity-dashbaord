"use client";

import { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Video,
  ChevronRight,
  Plus,
  Play,
  Image as ImageIcon,
  Type,
  FileVideo,
  Send,
  CloudUpload,
  AlertCircle,
  Settings2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useModuleStore } from "@/store/useModuleStore";

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
            title: "Missing Video",
            description: `Please upload a video file for your ${singularName.toLowerCase()}`,
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
          description: "Please select a valid video file",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Max size is 100MB",
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
      <>
        <div className="flex flex-col h-full bg-slate-50/50 overflow-hidden">
          {/* Sober Editorial Header */}
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
            <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-xl bg-slate-900/5 ring-1 ring-slate-900/10 text-slate-900">
                    <Video className="h-5 w-5" />
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    {step === 1 ? `Broadcast ${singularName}` : "Finalize Manifest"}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                  <span
                    className={cn(
                      step === 1 ? "text-indigo-600" : "text-emerald-600",
                    )}
                  >
                    01 Asset
                  </span>
                  <ChevronRight className="h-3 w-3" />
                  <span
                    className={cn(
                      step === 2 ? "text-indigo-600" : "text-slate-400",
                    )}
                  >
                    02 Details
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-6 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  {step === 1 ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <Card className="border-slate-200 shadow-none rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-base font-bold text-slate-900">
                            Media Package
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Select your vertical story binary
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {!videoFile ? (
                            <div className="relative group">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className="border-2 border-dashed border-slate-100 rounded-2xl py-12 flex flex-col items-center justify-center gap-3 bg-slate-50/50 group-hover:bg-slate-50 transition-all">
                                <CloudUpload className="h-8 w-8 text-slate-300" />
                                <div className="text-center">
                                  <p className="text-xs font-bold text-slate-600">
                                    Drop video or click to browse
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">
                                    MP4, MOV up to 100MB
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/30">
                              <div className="flex items-center gap-3">
                                <FileVideo className="h-5 w-5 text-indigo-600" />
                                <div>
                                  <p className="text-xs font-bold text-slate-900 line-clamp-1">
                                    {videoFile.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-medium uppercase">
                                    {(videoFile.size / (1024 * 1024)).toFixed(
                                      2,
                                    )}{" "}
                                    MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-rose-500"
                                onClick={() => {
                                  setVideoFile(null);
                                  setVideoPreviewUrl(null);
                                }}
                              >
                                <Plus className="h-4 w-4 rotate-45" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-slate-200 shadow-none rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-base font-bold text-slate-900">
                            Cover Asset
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Static frame for feed distribution
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-24 aspect-[2/3] rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group shrink-0">
                              {thumbnailUrl ? (
                                <Image
                                  src={thumbnailUrl}
                                  alt="Thumbnail"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-slate-300" />
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageUploadWithCrop
                                  currentImage={thumbnailUrl || ""}
                                  onImageUpdate={setThumbnailUrl}
                                  customUploadHandler={handleThumbnailSelect}
                                  label=""
                                  aspectRatio={9 / 16}
                                  className="p-0"
                                  dropzoneClassName="h-8 w-8 rounded-full bg-white flex items-center justify-center p-0"
                                  previewClassName="hidden"
                                >
                                  <Plus className="h-4 w-4 text-slate-900" />
                                </ImageUploadWithCrop>
                              </div>
                            </div>
                            <div className="flex-1 pt-2">
                              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Custom covers increase ecosystem click-through
                                rates. If omitted, the initial manifest frame
                                will be used as the default.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <Card className="border-slate-200 shadow-none rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-base font-bold text-slate-900">
                            Narrative Hook
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Define the context for this community event
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-700">
                              Caption Content
                            </Label>
                            <Textarea
                              placeholder={`Describe your ${singularName.toLowerCase()}...`}
                              className="min-h-[120px] rounded-xl border-slate-200 focus:ring-1 focus:ring-slate-900/5 transition-all resize-none text-sm"
                              value={formik.values.caption}
                              onChange={formik.handleChange}
                              name="caption"
                              autoFocus
                            />
                          </div>

                          <div className="pt-4 border-t border-slate-50 space-y-4">
                            <Label className="text-xs font-bold text-slate-700">
                              Visibility & Configuration
                            </Label>

                            <div className="space-y-2">
                              {/* Feed Switch */}
                              <div
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                                  formik.values.shareInFeed
                                    ? "border-slate-200 bg-slate-50/50"
                                    : "border-slate-100",
                                )}
                                onClick={() =>
                                  formik.setFieldValue(
                                    "shareInFeed",
                                    !formik.values.shareInFeed,
                                  )
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                    <ChevronRight
                                      className={cn(
                                        "h-4 w-4 transition-transform",
                                        formik.values.shareInFeed &&
                                          "rotate-90 text-slate-900",
                                      )}
                                    />
                                  </div>
                                  <span className="text-xs font-bold text-slate-700">
                                    Share in Feed
                                  </span>
                                </div>
                                <div
                                  className={cn(
                                    "h-5 w-10 rounded-full p-1 transition-colors relative",
                                    formik.values.shareInFeed
                                      ? "bg-slate-900"
                                      : "bg-slate-200",
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "h-3 w-3 rounded-full bg-white transition-all",
                                      formik.values.shareInFeed
                                        ? "ml-5"
                                        : "ml-0",
                                    )}
                                  />
                                </div>
                              </div>

                              {/* AI Switch */}
                              <div
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                                  formik.values.isAiContent
                                    ? "border-slate-200 bg-slate-50/30"
                                    : "border-slate-100",
                                )}
                                onClick={() =>
                                  formik.setFieldValue(
                                    "isAiContent",
                                    !formik.values.isAiContent,
                                  )
                                }
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                    <Sparkles
                                      className={cn(
                                        "h-3.5 w-3.5",
                                        formik.values.isAiContent &&
                                          "text-indigo-600",
                                      )}
                                    />
                                  </div>
                                  <span className="text-xs font-bold text-slate-700">
                                    AI Content Label
                                  </span>
                                </div>
                                <div
                                  className={cn(
                                    "h-5 w-10 rounded-full p-1 transition-colors relative",
                                    formik.values.isAiContent
                                      ? "bg-indigo-600"
                                      : "bg-slate-200",
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "h-3 w-3 rounded-full bg-white transition-all",
                                      formik.values.isAiContent
                                        ? "ml-5"
                                        : "ml-0",
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                {/* Sidebar Preview - Sober but high-quality */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="sticky top-24 space-y-6">
                    <div className="aspect-[9/16] relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden group shadow-sm">
                      {videoPreviewUrl ? (
                        <video
                          src={videoPreviewUrl}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
                          <Video className="h-10 w-10 opacity-20" />
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                            Feed Preview
                          </span>
                        </div>
                      )}

                      {/* Subdued Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-5 bg-linear-to-t from-black/60 to-transparent">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-md" />
                            <div className="h-2 w-16 bg-white/30 rounded-full" />
                          </div>
                          <p className="text-[11px] font-medium text-white/90 line-clamp-2 leading-relaxed italic">
                            {formik.values.caption ||
                              "Narrative placeholder..."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Card className="border-slate-100 shadow-none bg-slate-50/50 rounded-2xl overflow-hidden">
                      <CardContent className="p-4 flex items-start gap-3">
                        <Settings2 className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-400">
                            Processing Node
                          </p>
                          <p className="text-xs font-medium text-slate-600 leading-relaxed">
                            Assets will be optimized for multi-device delivery
                            and secure portal distribution.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Sober Upload Overlay - "SaaS 2026" Style */}
        {loading && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-sm px-8 flex flex-col items-center">
              <div className="relative mb-8 h-20 w-20">
                <div className="absolute inset-0 h-20 w-20 border-2 border-slate-100 rounded-[2rem]" />
                <div className="absolute inset-0 h-20 w-20 border-t-2 border-slate-900 rounded-[2rem] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-6 w-6 text-slate-900" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {uploadStatus || `Broadcasting ${singularName}`}
              </h2>

              {uploadProgress > 0 && uploadProgress <= 100 && (
                <div className="w-full mt-6 space-y-2">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Manifesting
                    </span>
                    <span className="text-[10px] font-black text-slate-900">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-12 p-5 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20 max-w-[280px]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-3.5 w-3.5 text-slate-900" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Transmission Guard
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  High-fidelity processing in progress. Keep the dashboard
                  active for uninterrupted ecosystem synchronization.
                </p>
              </div>
            </div>
          </div>
        )}

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
          title={`Unsaved ${singularName}`}
          description="You have unfilled form data."
          buttonText={step === 1 ? "Continue" : `Publish ${singularName}`}
        />
      </>
    </FormikProvider>
  );
}
