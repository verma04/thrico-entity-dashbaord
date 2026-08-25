"use client";

import React, { useState, useCallback } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Image as ImageIcon,
  BarChart2,
  Sparkles,
  Globe,
  Lock,
  Pin,
  Plus,
  Trash2,
  UploadCloud,
  X,
  Eye,
  Heart,
  Share2,
  Smartphone,
  Monitor,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInfoBanner,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
  PolarisSelect,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useGetEntity } from "@/graphql/actions";
import UserAvatar from "@/components/layout/user-avatar";
import { cn } from "@/lib/utils";

interface MediaPreviewItem {
  id: string;
  file?: File;
  url: string;
  name: string;
  size: number;
  bgColor?: string;
}

interface PostCreationFormProps {
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel: () => void;
}

const postSchema = Yup.object().shape({
  description: Yup.string()
    .required("Please enter post content")
    .min(2, "Post content must be at least 2 characters")
    .max(2000, "Post content cannot exceed 2000 characters"),
  source: Yup.string().optional(),
  privacy: Yup.string().optional(),
  isPinned: Yup.boolean(),
  postType: Yup.string().oneOf(["general", "poll", "celebration"]),
  poll: Yup.object().when("postType", {
    is: "poll",
    then: () =>
      Yup.object().shape({
        question: Yup.string()
          .required("Poll question is required")
          .min(3, "Question must be at least 3 characters")
          .max(200, "Question must be under 200 characters"),
        options: Yup.array()
          .of(
            Yup.object().shape({
              text: Yup.string().required("Option text is required"),
            }),
          )
          .min(2, "Poll must have at least 2 options")
          .max(6, "Maximum 6 options allowed"),
        durationDays: Yup.number().default(7),
      }),
    otherwise: () => Yup.object().notRequired(),
  }),
});

export function PostCreationForm({
  loading = false,
  onFinish,
  onCancel,
}: PostCreationFormProps) {
  const router = useRouter();
  const { data: entityData } = useGetEntity();
  const [mediaList, setMediaList] = useState<MediaPreviewItem[]>([]);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [showFullPreviewModal, setShowFullPreviewModal] = useState(false);

  const entity = entityData?.getEntity;

  const formik = useFormik({
    initialValues: {
      description: "",
      source: "feed",
      privacy: "PUBLIC",
      isPinned: false,
      postType: "general" as "general" | "poll" | "celebration",
      poll: {
        question: "",
        options: [{ text: "" }, { text: "" }],
        durationDays: 7,
      },
    },
    validationSchema: postSchema,
    onSubmit: (values) => {
      onFinish({
        ...values,
        media: mediaList.map((m) => m.file).filter(Boolean),
      });
    },
  });

  const { values, errors, touched, setFieldValue, isSubmitting } = formik;

  const extractDominantColor = useCallback(
    (imageUrl: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve("rgba(120,120,120,0.15)");
              return;
            }
            canvas.width = 8;
            canvas.height = 8;
            ctx.drawImage(img, 0, 0, 8, 8);
            const data = ctx.getImageData(0, 0, 8, 8).data;
            let r = 0,
              g = 0,
              b = 0,
              count = 0;
            for (let i = 0; i < data.length; i += 4) {
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              count++;
            }
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            resolve(`rgba(${r},${g},${b},0.18)`);
          } catch {
            resolve("rgba(120,120,120,0.15)");
          }
        };
        img.onerror = () => resolve("rgba(120,120,120,0.15)");
        img.src = imageUrl;
      });
    },
    [],
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newItems: MediaPreviewItem[] = await Promise.all(
      files.map(async (file) => {
        const url = URL.createObjectURL(file);
        const bgColor = await extractDominantColor(url);
        return {
          id: Math.random().toString(36).substring(7),
          file,
          url,
          name: file.name,
          size: file.size,
          bgColor,
        };
      }),
    );
    setMediaList((prev) => [...prev, ...newItems]);
  };

  const removeMedia = (id: string) => {
    setMediaList((prev) => prev.filter((item) => item.id !== id));
  };

  const charCount = values.description.length;
  const isDirty = formik.dirty || mediaList.length > 0;

  const renderFeedCardPreview = (isModal = false) => (
    <div
      className={cn(
        "rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3 shadow-xs transition-all",
        previewDevice === "mobile" &&
          !isModal &&
          "max-w-[300px] mx-auto text-xs",
      )}
    >
      {/* Author Header */}
      <div className="flex items-center gap-2.5">
        <UserAvatar
          size={isModal ? 40 : 36}
          src={entity?.logo}
          className="rounded-[6px] border border-[#d2d5d9] bg-white shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[#303030] dark:text-zinc-100 truncate text-[13px]">
              {entity?.name || "Your Organization"}
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] h-4 px-1.5 font-bold bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border border-[#d2d5d9] rounded-[4px]"
            >
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5">
            <span>Just now</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {values.privacy === "PUBLIC" ? (
                <Globe className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {values.privacy === "PUBLIC" ? "Public" : "Connections"}
            </span>
          </div>
        </div>

        {values.isPinned && (
          <Badge
            variant="outline"
            className="text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 px-1.5 py-0.2 rounded-[4px]"
          >
            <Pin className="h-3 w-3 fill-amber-500" />
            Pinned
          </Badge>
        )}
      </div>

      {/* Description Content */}
      <div className="text-[#303030] dark:text-zinc-200 whitespace-pre-line leading-[18px] text-[13px]">
        {values.description ? (
          values.description
        ) : (
          <span className="text-[#8c9196] italic text-[12px]">
            Start typing your post content to preview live here...
          </span>
        )}
      </div>

      {/* Media Gallery Preview */}
      {mediaList.length > 0 && (
        <div
          className={cn(
            "rounded-[6px] overflow-hidden border border-[#d2d5d9] grid gap-1",
            mediaList.length === 1
              ? "grid-cols-1"
              : mediaList.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 sm:grid-cols-3",
          )}
        >
          {mediaList.slice(0, 4).map((m, idx) => (
            <div
              key={m.id}
              className="relative aspect-video overflow-hidden rounded-[4px]"
              style={{
                backgroundColor: m.bgColor || "rgba(120,120,120,0.15)",
              }}
            >
              <img
                src={m.url}
                alt={m.name}
                className="w-full h-full object-contain"
              />
              {idx === 3 && mediaList.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-[12px]">
                  +{mediaList.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Poll Options Preview */}
      {values.postType === "poll" && (
        <div className="p-3 rounded-[6px] border border-[#d2d5d9] bg-white dark:bg-zinc-800 space-y-2">
          <div className="flex items-center gap-1.5">
            <BarChart2 className="h-3.5 w-3.5 text-emerald-600" />
            <h4 className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100">
              {values.poll.question || "Poll Question"}
            </h4>
          </div>
          <div className="space-y-1.5">
            {values.poll.options.map((opt, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-[4px] border border-[#d2d5d9] bg-[#f6f6f7]/60 text-[12px] font-semibold text-[#303030] dark:text-zinc-200"
              >
                <div className="flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded-full border border-[#d2d5d9] bg-white flex items-center justify-center text-[9px] text-[#616161]">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt.text || `Option ${i + 1}`}</span>
                </div>
                <span className="text-[10px] text-[#8c9196] font-mono">0%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#616161] pt-1">
            <span>0 votes</span>
            <span>Duration: {values.poll.durationDays} days</span>
          </div>
        </div>
      )}

      {/* Engagement Actions Preview */}
      <div className="flex items-center justify-between pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 text-[#616161]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px]">
            <Heart className="h-3.5 w-3.5" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <Share2 className="h-3.5 w-3.5" />
            <span>0</span>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-[9px] font-bold uppercase tracking-wider rounded-[2px]"
        >
          Feed
        </Badge>
      </div>
    </div>
  );

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              {/* Live Card Preview with Device Switcher */}
              <PolarisSidebarCard
                title="Feed Preview"
                badge="Live Stream"
                icon={Sparkles}
              >
                <div className="space-y-2.5">
                  {/* Device and Fullscreen Toggle Controls */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#e1e3e5] dark:border-zinc-800">
                    <div className="flex items-center gap-0.5 p-0.5 bg-white dark:bg-zinc-800 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("desktop")}
                        className={cn(
                          "p-1 rounded-[4px] text-[11px] font-semibold transition-all cursor-pointer",
                          previewDevice === "desktop"
                            ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                            : "text-[#616161] hover:text-[#303030]",
                        )}
                        title="Desktop view"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("mobile")}
                        className={cn(
                          "p-1 rounded-[4px] text-[11px] font-semibold transition-all cursor-pointer",
                          previewDevice === "mobile"
                            ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                            : "text-[#616161] hover:text-[#303030]",
                        )}
                        title="Mobile view"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullPreviewModal(true)}
                      className="h-7 px-2 text-[11.5px] font-semibold gap-1 text-[#616161] hover:text-[#303030]"
                    >
                      <Maximize2 className="h-3 w-3" />
                      Fullscreen
                    </Button>
                  </div>

                  {/* The Rendered Preview Card */}
                  {renderFeedCardPreview(false)}
                </div>

                {/* Structured Configuration Breakdown */}
                <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                  <PolarisSummaryRow
                    label="Post Format"
                    value={
                      values.postType === "poll"
                        ? "Interactive Poll"
                        : values.postType === "celebration"
                          ? "Celebration"
                          : "Standard Post"
                    }
                  />
                  <PolarisSummaryRow
                    label="Attachments"
                    value={
                      values.postType === "poll"
                        ? `${values.poll.options.length} options`
                        : `${mediaList.length} photos`
                    }
                  />
                  <PolarisSummaryRow
                    label="Pinned to Top"
                    value={values.isPinned ? "Yes" : "No"}
                    isLast
                  />
                </div>
              </PolarisSidebarCard>

              {/* Best Practices Tip Card */}
              <PolarisTipCard title="Engagement Tips">
                Posts with visual media achieve 2.5x more community reactions.
                Pinned announcements remain prominently highlighted at the top
                of the stream.
              </PolarisTipCard>
            </div>
          }
        >
          {/* ── LEFT COLUMN: MAIN FORM ────────────────────────── */}
          <div className="space-y-4">
            {/* Author / Entity Identity Banner */}
            <PolarisInfoBanner
              variant="default"
              title="Publishing as Community Admin"
              description={`This post will be published officially under ${entity?.name || "your organization"} and shared with your community.`}
            />

            {/* Post Format & Content Card */}
            <PolarisFormCard
              step={1}
              icon={MessageSquare}
              title="Post Content"
              description="Write your message, format announcements, and select the post format."
              badge={
                values.postType === "poll"
                  ? "Interactive Poll"
                  : values.postType === "celebration"
                    ? "Milestone / Celebration"
                    : "Standard Post"
              }
            >
              {/* Post Type Selector Tabs */}
              <div className="space-y-1.5">
                <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block">
                  Post Format
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#f6f6f7] dark:bg-zinc-800 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setFieldValue("postType", "general")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-[6px] text-[12.5px] font-semibold transition-all cursor-pointer",
                      values.postType === "general"
                        ? "bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-100 shadow-xs border border-[#d2d5d9] dark:border-zinc-700"
                        : "text-[#616161] hover:text-[#303030]",
                    )}
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Text & Media</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFieldValue("postType", "poll")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-[6px] text-[12.5px] font-semibold transition-all cursor-pointer",
                      values.postType === "poll"
                        ? "bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-100 shadow-xs border border-[#d2d5d9] dark:border-zinc-700"
                        : "text-[#616161] hover:text-[#303030]",
                    )}
                  >
                    <BarChart2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Poll & Vote</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFieldValue("postType", "celebration")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-[6px] text-[12.5px] font-semibold transition-all cursor-pointer",
                      values.postType === "celebration"
                        ? "bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-100 shadow-xs border border-[#d2d5d9] dark:border-zinc-700"
                        : "text-[#616161] hover:text-[#303030]",
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>Celebration</span>
                  </button>
                </div>
              </div>

              {/* Textarea Description */}
              <div className="pt-2">
                <PolarisTextarea
                  id="description"
                  name="description"
                  label="Message Body"
                  required
                  rows={4}
                  placeholder={
                    values.postType === "poll"
                      ? "Add background context or instructions for your poll..."
                      : values.postType === "celebration"
                        ? "Share a special milestone, welcome a member, or celebrate an achievement..."
                        : "Share an update, news, article summary, or announcement with your community. Mention @members or add #hashtags..."
                  }
                  value={values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={touched.description && errors.description ? errors.description : undefined}
                  labelAction={
                    <span
                      className={cn(
                        "text-[11px] font-mono",
                        charCount > 1800
                          ? "text-amber-600 font-bold"
                          : "text-[#616161]",
                      )}
                    >
                      {charCount} / 2000
                    </span>
                  }
                />
              </div>

              {/* Pin to top switch */}
              <div className="flex items-center justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 mt-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Pin className="h-3.5 w-3.5 text-amber-600" />
                    <label className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-200 cursor-pointer">
                      Pin Announcement to Top
                    </label>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                    Highlight this announcement prominently at the top of the
                    community feed stream.
                  </p>
                </div>
                <Switch
                  checked={values.isPinned}
                  onCheckedChange={(val) => setFieldValue("isPinned", val)}
                />
              </div>
            </PolarisFormCard>

            {/* Step 2: Format-Specific Attachments Card */}
            {values.postType === "poll" ? (
              <PolarisFormCard
                step={2}
                icon={BarChart2}
                title="Poll Questions & Options"
                description="Set the question members will vote on and configure response choices."
                badge="Voting Setup"
              >
                {/* Poll Question */}
                <PolarisInput
                  id="poll-question"
                  name="poll.question"
                  label="Poll Question"
                  required
                  placeholder="e.g. Which community workshop topic would you prefer next?"
                  value={values.poll.question}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={touched.poll?.question && errors.poll?.question ? errors.poll.question : undefined}
                />

                {/* Poll Options List */}
                <div className="space-y-2 pt-2">
                  <PolarisLabel>Poll Options (Min. 2, Max. 6)</PolarisLabel>
                  <FieldArray name="poll.options">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.poll.options.map((opt, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2"
                          >
                            <span className="h-7 w-7 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] flex items-center justify-center text-[11px] font-bold text-[#616161] shrink-0">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <PolarisInput
                                id={`poll-opt-${index}`}
                                name={`poll.options.${index}.text`}
                                placeholder={`Option ${index + 1} text...`}
                                value={opt.text}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </div>
                            {values.poll.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-7 w-7 text-[#616161] hover:text-[#d72c0d] shrink-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        ))}

                        {values.poll.options.length < 6 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => push({ text: "" })}
                            className="h-7 px-2.5 rounded-[5px] text-[11.5px] font-semibold gap-1.5 border-dashed border-[#aeb4b9] text-[#303030] bg-white hover:bg-[#f6f6f7]"
                          >
                            <Plus className="h-3 w-3" />
                            Add Option
                          </Button>
                        )}
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Poll Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                  <PolarisSelect
                    id="poll-duration"
                    label="Poll Duration"
                    value={String(values.poll.durationDays)}
                    onChange={(val) =>
                      setFieldValue("poll.durationDays", Number(val))
                    }
                    options={[
                      { value: "1", label: "1 Day" },
                      { value: "3", label: "3 Days" },
                      { value: "7", label: "1 Week (Default)" },
                      { value: "14", label: "2 Weeks" },
                      { value: "30", label: "1 Month" },
                    ]}
                  />
                </div>
              </PolarisFormCard>
            ) : (
              <PolarisFormCard
                step={2}
                icon={ImageIcon}
                title="Media & Attachments"
                description="Upload images, infographics, or photos to accompany your post."
                badge="Optional Media"
              >
                {/* Media Dropzone */}
                <div className="space-y-3">
                  <label
                    htmlFor="media-file-upload"
                    className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#d2d5d9] hover:border-[#aeb4b9] rounded-[8px] bg-[#f6f6f7]/50 hover:bg-[#f6f6f7] cursor-pointer transition-colors group"
                  >
                    <div className="h-10 w-10 rounded-[6px] bg-white border border-[#d2d5d9] text-[#303030] flex items-center justify-center mb-2 shadow-xs">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <p className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Click or drag photos to upload
                    </p>
                    <p className="text-[11px] text-[#616161] mt-0.5">
                      PNG, JPG, WEBP, GIF up to 10MB each
                    </p>
                  </label>
                  <input
                    id="media-file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Uploaded Media Previews */}
                  {mediaList.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {mediaList.map((item) => (
                        <div
                          key={item.id}
                          className="group/img relative rounded-[6px] overflow-hidden border border-[#d2d5d9] aspect-square shadow-xs"
                          style={{
                            backgroundColor:
                              item.bgColor || "rgba(120,120,120,0.15)",
                          }}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(item.id)}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-[10px] text-white truncate">
                            {item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PolarisFormCard>
            )}
          </div>
        </PolarisFormLayout>

        {/* ── Sticky Bottom Action Bar with Preview ──────────────────── */}
        <FloatingSavePanel
          hasChanged={isDirty}
          saved={false}
          isSaving={loading || isSubmitting}
          onSave={() => formik.submitForm()}
          onReset={() => {
            formik.resetForm();
            setMediaList([]);
            onCancel();
          }}
          title="Unpublished post draft"
          description="Ready to broadcast this announcement to your community?"
          buttonText="Publish Post"
        />

        {/* ── Fullscreen Preview Modal ──────────────────────────────── */}
        <Dialog
          open={showFullPreviewModal}
          onOpenChange={setShowFullPreviewModal}
        >
          <DialogContent className="max-w-xl p-5 rounded-[12px] border border-[#d2d5d9] bg-white dark:bg-zinc-900 shadow-xl">
            <DialogHeader className="pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
              <DialogTitle className="text-[15px] font-semibold flex items-center gap-2 text-[#303030] dark:text-zinc-100">
                <Eye className="h-4 w-4" />
                <span>Full Feed Post Preview</span>
              </DialogTitle>
              <DialogDescription className="text-[12px] text-[#616161]">
                How members will experience this post on the community feed
                stream.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">{renderFeedCardPreview(true)}</div>
          </DialogContent>
        </Dialog>
      </form>
    </FormikProvider>
  );
}

export default PostCreationForm;
