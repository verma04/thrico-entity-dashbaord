/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useId } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import {
  MessageSquare,
  MessageSquarePlus,
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
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PolarisFormCard,
  PolarisModeTile,
  PolarisQuickChip,
  PolarisInfoBanner,
} from "@/components/gamification/shared/polaris-form-ui";
import { useGetEntity } from "@/graphql/actions";
import { useAddFeed } from "@/graphql/actions/feed";
import UserAvatar from "@/components/layout/user-avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Form Validation Schema (Mandatory Formik + Yup)
// ─────────────────────────────────────────────────────────────────────────────

const feedPostSchema = Yup.object().shape({
  postType: Yup.string()
    .oneOf(["general", "poll"], "Invalid post type")
    .required(),
  description: Yup.string().when("postType", {
    is: "poll",
    then: (schema) =>
      schema
        .trim()
        .max(3000, "Post content cannot exceed 3,000 characters"),
    otherwise: (schema) =>
      schema
        .trim()
        .required("Please write something for your post")
        .min(2, "Post content must be at least 2 characters")
        .max(3000, "Post content cannot exceed 3,000 characters"),
  }),
  privacy: Yup.string().oneOf(["PUBLIC", "CONNECTIONS"]).required(),
  isPinned: Yup.boolean().required(),
  poll: Yup.object().when("postType", {
    is: "poll",
    then: (schema) =>
      schema.shape({
        title: Yup.string().trim().max(100, "Title must be under 100 characters"),
        question: Yup.string()
          .trim()
          .required("Poll question is required")
          .min(3, "Question must be at least 3 characters")
          .max(255, "Question must be under 255 characters"),
        options: Yup.array()
          .of(
            Yup.object().shape({
              text: Yup.string()
                .trim()
                .required("Option text is required")
                .min(1, "Option cannot be empty"),
            }),
          )
          .min(2, "Poll must have at least 2 options")
          .max(6, "Maximum 6 options allowed"),
        durationDays: Yup.number().default(7),
        resultVisibility: Yup.string().default("ALWAYS"),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface UploadedMediaItem {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
}

export interface QuickCreateFeedDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: "general" | "poll";
  onSuccess?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick Create Feed Drawer (Polaris Pattern B: 3-Tier Slide-Over)
// ─────────────────────────────────────────────────────────────────────────────

export function QuickCreateFeedDrawer({
  open,
  onOpenChange,
  initialType = "general",
  onSuccess,
}: QuickCreateFeedDrawerProps) {
  const { data: entityData } = useGetEntity();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const dropzoneInputId = useId();

  const [addFeed, { loading: isSubmittingFeed }] = useAddFeed({
    onCompleted: () => {
      toast.success("Post published successfully", {
        description: "Your post is now live and distributed to the community feed.",
      });
      formik.resetForm();
      setMediaList([]);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: Error) => {
      toast.error("Failed to publish post", {
        description: err.message || "An unexpected error occurred. Please try again.",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      postType: initialType,
      description: "",
      privacy: "PUBLIC" as "PUBLIC" | "CONNECTIONS",
      isPinned: false,
      poll: {
        title: "",
        question: "",
        options: [{ text: "" }, { text: "" }],
        durationDays: 7,
        resultVisibility: "ALWAYS",
      },
    },
    validationSchema: feedPostSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const isPoll = values.postType === "poll";
        const descriptionText =
          values.description.trim() ||
          (isPoll ? values.poll?.question?.trim() : "") ||
          "Community Post";

        const input: Record<string, unknown> = {
          description: descriptionText,
          privacy: values.privacy,
          isPinned: values.isPinned,
          source: isPoll ? "poll" : "admin",
        };

        const mediaFiles = mediaList.map((m) => m.file);
        if (mediaFiles.length > 0) {
          input.media = mediaFiles;
        }

        if (isPoll && values.poll) {
          const validOptions = values.poll.options
            .map((opt) => opt.text.trim())
            .filter(Boolean)
            .map((optText) => ({ option: optText }));

          const durationDays = Number(values.poll.durationDays) || 7;
          const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
          const question = values.poll.question.trim() || descriptionText;
          const title = values.poll.title.trim() || question || "Community Poll";

          input.poll = {
            title,
            question,
            options: validOptions,
            resultVisibility: values.poll.resultVisibility || "ALWAYS",
            endDate: endDate.toISOString(),
          };
          input.source = "poll";
        }

        await addFeed({
          variables: {
            input,
          },
        });
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Submission failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: UploadedMediaItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    setMediaList((prev) => [...prev, ...newItems]);
  };

  const removeMedia = (id: string) => {
    setMediaList((prev) => prev.filter((item) => item.id !== id));
  };

  const isPoll = formik.values.postType === "poll";
  const entityName = entityData?.getEntity?.name || "Community Management";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col justify-between overflow-hidden border-l border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7] dark:bg-zinc-950"
      >
        <FormikProvider value={formik}>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col h-full justify-between overflow-hidden"
          >
            {/* ── 1. Sticky Header ────────────────────────────────────────── */}
            <div className="p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900/90 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                  <MessageSquarePlus className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100 truncate">
                      Create Ecosystem Post
                    </SheetTitle>
                    <Badge
                      variant="outline"
                      className="text-[9.5px] font-semibold px-1.5 py-0 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                    >
                      {isPoll ? "Poll" : "Update"}
                    </Badge>
                  </div>
                  <SheetDescription className="text-[11px] text-[#616161] dark:text-zinc-400 truncate mt-0.5">
                    Publish updates, announcements, media, or polls to members
                  </SheetDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* ── 2. Scrollable Body ──────────────────────────────────────── */}
            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              {/* Card 1: Post Format & Audience */}
              <PolarisFormCard
                step={1}
                title="Post Format & Audience"
                description="Select whether you are sharing a discussion or an interactive community poll"
              >
                <div className="space-y-3">
                  {/* Post Type Selector Tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <PolarisModeTile
                      label="General Post"
                      description="Share news, text updates, media, and stories"
                      icon={MessageSquare}
                      selected={!isPoll}
                      onClick={() => formik.setFieldValue("postType", "general")}
                    />
                    <PolarisModeTile
                      label="Interactive Poll"
                      description="Collect member votes and survey opinions"
                      icon={BarChart2}
                      badge="Engage"
                      selected={isPoll}
                      onClick={() => formik.setFieldValue("postType", "poll")}
                    />
                  </div>

                  {/* Privacy Selector */}
                  <div className="space-y-1.5 pt-1">
                    <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100 flex items-center gap-1.5">
                      Audience Visibility
                    </Label>
                    <Select
                      value={formik.values.privacy}
                      onValueChange={(val) => formik.setFieldValue("privacy", val)}
                    >
                      <SelectTrigger className="h-9 text-xs border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-[#d2d5d9] dark:border-zinc-800">
                        <SelectItem value="PUBLIC" className="text-xs font-medium cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Public — Visible to all community members</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="CONNECTIONS" className="text-xs font-medium cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Connections Only — Restricted to member network</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                        {isPoll ? "Context / Description (Optional)" : "Post Content *"}
                      </Label>
                      <span className="text-[10.5px] font-mono text-[#616161] dark:text-zinc-400">
                        {formik.values.description.length} / 3000
                      </span>
                    </div>
                    <Textarea
                      name="description"
                      placeholder={
                        isPoll
                          ? "Add context or background information about this poll..."
                          : `What's happening in ${entityName}? Share news, discussions, or achievements...`
                      }
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows={4}
                      className={cn(
                        "text-xs resize-none border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 leading-relaxed",
                        formik.touched.description &&
                          formik.errors.description &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {formik.touched.description && formik.errors.description && (
                      <p className="text-[11px] text-destructive font-medium mt-1">
                        {formik.errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </PolarisFormCard>

              {/* Card 2: Creative & Media Attachments (General Post only) */}
              {!isPoll && (
                <PolarisFormCard
                  step={2}
                  icon={ImageIcon}
                  title="Creative & Media Attachments"
                  description="Attach photos, banners, or graphics to your update (JPEG, PNG, WebP)"
                >
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id={dropzoneInputId}
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />

                    {/* Dropzone Container */}
                    <label
                      htmlFor={dropzoneInputId}
                      className="block rounded-lg border border-dashed border-[#d2d5d9] dark:border-zinc-700 bg-[#f9fafb] dark:bg-zinc-900/40 p-4 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/20 transition-all duration-150"
                    >
                      <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2 border border-indigo-100 dark:border-indigo-900/40">
                        <UploadCloud className="h-4.5 w-4.5" />
                      </div>
                      <p className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                        Click to upload photos or graphics
                      </p>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5">
                        Free dimensions and banner ratios supported
                      </p>
                    </label>

                    {/* Uploaded media previews */}
                    {mediaList.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {mediaList.map((item) => (
                          <div
                            key={item.id}
                            className="relative group rounded-md overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 bg-black/5 aspect-video"
                          >
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeMedia(item.id)}
                              className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 hover:bg-destructive text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Remove media"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </PolarisFormCard>
              )}

              {/* Card 3: Poll Configuration (Poll mode only) */}
              {isPoll && (
                <PolarisFormCard
                  step={2}
                  icon={BarChart2}
                  title="Poll Questions & Choices"
                  description="Configure the poll inquiry, voting choices, and result visibility"
                >
                  <div className="space-y-3.5">
                    {/* Poll Question */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                        Inquiry Question *
                      </Label>
                      <Input
                        name="poll.question"
                        placeholder="e.g. Which keynote topic would you prefer at next month's meetup?"
                        value={formik.values.poll.question}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={cn(
                          "h-9 text-xs border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900",
                          formik.touched.poll?.question &&
                            formik.errors.poll?.question &&
                            "border-destructive focus-visible:ring-destructive",
                        )}
                      />
                      {formik.touched.poll?.question && formik.errors.poll?.question && (
                        <p className="text-[11px] text-destructive font-medium mt-1">
                          {formik.errors.poll.question}
                        </p>
                      )}
                    </div>

                    {/* Poll Options List */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                        Voting Options (2 – 6 choices)
                      </Label>
                      <FieldArray
                        name="poll.options"
                        render={(arrayHelpers) => (
                          <div className="space-y-2">
                            {formik.values.poll.options.map((option, index) => {
                              const optTouched =
                                formik.touched.poll?.options?.[index]?.text;
                              const optError =
                                typeof formik.errors.poll?.options?.[index] ===
                                "object"
                                  ? (formik.errors.poll.options[index] as {
                                      text?: string;
                                    })?.text
                                  : undefined;

                              return (
                                <div key={index} className="flex items-center gap-2">
                                  <span className="h-6 w-6 rounded-md bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 flex items-center justify-center text-[10px] font-bold text-[#616161] dark:text-zinc-400 shrink-0">
                                    {String.fromCharCode(65 + index)}
                                  </span>
                                  <Input
                                    name={`poll.options.${index}.text`}
                                    placeholder={`Option ${index + 1}`}
                                    value={option.text}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={cn(
                                      "h-8.5 text-xs flex-1 border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900",
                                      optTouched &&
                                        optError &&
                                        "border-destructive focus-visible:ring-destructive",
                                    )}
                                  />
                                  {formik.values.poll.options.length > 2 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => arrayHelpers.remove(index)}
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              );
                            })}

                            {formik.values.poll.options.length < 6 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => arrayHelpers.push({ text: "" })}
                                className="h-8 text-xs font-semibold gap-1.5 border-dashed border-[#d2d5d9] dark:border-zinc-700 w-full mt-1 cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Choice
                              </Button>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    {/* Poll Duration Chips */}
                    <div className="space-y-1.5 pt-1">
                      <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                        Poll Duration
                      </Label>
                      <div className="flex flex-wrap gap-1.5">
                        {[1, 3, 7, 14, 30].map((days) => (
                          <PolarisQuickChip
                            key={days}
                            label={`${days} ${days === 1 ? "Day" : "Days"}`}
                            active={formik.values.poll.durationDays === days}
                            onClick={() => formik.setFieldValue("poll.durationDays", days)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </PolarisFormCard>
              )}

              {/* Card 4: Announcement & Priority Settings */}
              <PolarisFormCard
                step={isPoll ? 3 : 3}
                icon={Pin}
                title="Announcement & Priority"
                description="Highlight important updates at the top of the feed"
              >
                <div className="flex items-center justify-between p-3 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/40">
                  <div>
                    <h4 className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                      Pin to Top of Feed
                    </h4>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                      Keep this post featured above regular chronological posts
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.isPinned}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("isPinned", checked)
                    }
                  />
                </div>
              </PolarisFormCard>

              {/* Polaris Info Callout */}
              <PolarisInfoBanner
                title="Instant Ecosystem Distribution"
                description="Posts published here appear in real-time across the Global Feed, mobile member apps, and web portals."
                icon={Sparkles}
              />
            </div>

            {/* ── 3. Sticky Footer ────────────────────────────────────────── */}
            <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900/90 flex items-center justify-between shrink-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs h-8.5 font-semibold text-[#616161] hover:text-[#303030] gap-1 cursor-pointer"
              >
                <Link href="/feed/create">
                  Full Page Builder
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="h-8.5 px-3 text-xs font-medium border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-200 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingFeed}
                  className="h-8.5 px-4 text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xs cursor-pointer gap-1.5"
                >
                  {isSubmittingFeed && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>{isSubmittingFeed ? "Publishing..." : "Publish Post"}</span>
                </Button>
              </div>
            </div>
          </form>
        </FormikProvider>
      </SheetContent>
    </Sheet>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Polaris Quick Feed Composer Card (Mounted at top of /feed/all)
// ─────────────────────────────────────────────────────────────────────────────

export interface FeedQuickComposerProps {
  onSuccess?: () => void;
}

export function FeedQuickComposer({ onSuccess }: FeedQuickComposerProps) {
  const { data: entityData } = useGetEntity();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [composerType, setComposerType] = useState<"general" | "poll">("general");

  const openDrawerWithMode = (type: "general" | "poll") => {
    setComposerType(type);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3.5 transition-all duration-150">
        <div className="flex items-center gap-3">
          <UserAvatar
            size={36}
            src={entityData?.getEntity?.logo}
            className="rounded-lg border border-[#d2d5d9] dark:border-zinc-700 bg-white shrink-0 shadow-2xs"
          />

          <button
            type="button"
            onClick={() => openDrawerWithMode("general")}
            className="flex-1 flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#f6f6f7] dark:bg-zinc-800/60 border border-[#d2d5d9] dark:border-zinc-700/80 text-left hover:border-[#aeb4b9] dark:hover:border-zinc-600 hover:bg-[#f0f1f2] dark:hover:bg-zinc-800 transition-all cursor-pointer group"
          >
            <span className="text-xs font-medium text-[#616161] dark:text-zinc-400 group-hover:text-[#303030] dark:group-hover:text-zinc-200 truncate">
              Share an update, announcement, or poll with your ecosystem…
            </span>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-400 shrink-0 ml-2"
            >
              Draft
            </Badge>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-[#e1e3e5]/60 dark:border-zinc-800/80">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openDrawerWithMode("general")}
              className="h-7.5 px-2.5 rounded-md text-xs font-semibold text-[#616161] dark:text-zinc-300 hover:text-[#303030] dark:hover:text-zinc-100 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 gap-1.5 cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Share Post</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openDrawerWithMode("general")}
              className="h-7.5 px-2.5 rounded-md text-xs font-semibold text-[#616161] dark:text-zinc-300 hover:text-[#303030] dark:hover:text-zinc-100 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 gap-1.5 cursor-pointer"
            >
              <ImageIcon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Photo / Media</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openDrawerWithMode("poll")}
              className="h-7.5 px-2.5 rounded-md text-xs font-semibold text-[#616161] dark:text-zinc-300 hover:text-[#303030] dark:hover:text-zinc-100 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 gap-1.5 cursor-pointer"
            >
              <BarChart2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Create Poll</span>
            </Button>
          </div>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7.5 px-2 text-[11px] font-semibold text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-100 gap-1 cursor-pointer shrink-0"
          >
            <Link href="/feed/create">
              <span>Full Creator</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>

      <QuickCreateFeedDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialType={composerType}
        onSuccess={onSuccess}
      />
    </>
  );
}

// Default export for backwards compatibility
export default function PostModal() {
  return <FeedQuickComposer />;
}
