"use client";

import React, { useState } from "react";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ShieldCheck,
  Briefcase,
  ShoppingBag,
  Heart,
  Share2,
  Smartphone,
  Monitor,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  source: Yup.string().required("Target feed channel is required"),
  privacy: Yup.string().required("Privacy is required"),
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
            })
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
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
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
        media: mediaList.map((m) => m.url),
      });
    },
  });

  const { values, errors, touched, setFieldValue, isSubmitting } = formik;

  // Handle file uploads for media
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newItems: MediaPreviewItem[] = files.map((file) => ({
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

  const charCount = values.description.length;
  const isDirty = formik.dirty || mediaList.length > 0;

  // Renders the feed card preview UI used in both sidebar and full preview modal
  const renderFeedCardPreview = (isModal = false) => (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm transition-all",
        previewDevice === "mobile" && !isModal && "max-w-[320px] mx-auto text-xs"
      )}
    >
      {/* Author Header */}
      <div className="flex items-center gap-3">
        <UserAvatar
          size={isModal ? 44 : 38}
          src={entity?.logo}
          className="rounded-xl border border-border bg-white shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-foreground truncate text-sm">
              {entity?.name || "Your Organization"}
            </span>
            <Badge
              variant="secondary"
              className="text-[10px] h-4 px-1.5 font-semibold bg-primary/10 text-primary border-transparent"
            >
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
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
            className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 px-2 py-0.5"
          >
            <Pin className="h-3 w-3 fill-amber-500" />
            Pinned
          </Badge>
        )}
      </div>

      {/* Description Content */}
      <div className="text-foreground/90 whitespace-pre-line leading-relaxed text-sm">
        {values.description ? (
          values.description
        ) : (
          <span className="text-muted-foreground italic text-xs">
            Start typing your post content to preview live here...
          </span>
        )}
      </div>

      {/* Media Gallery Preview */}
      {mediaList.length > 0 && (
        <div
          className={cn(
            "rounded-xl overflow-hidden border border-border/80 bg-muted/30 grid gap-1.5",
            mediaList.length === 1
              ? "grid-cols-1"
              : mediaList.length === 2
              ? "grid-cols-2"
              : "grid-cols-2 sm:grid-cols-3"
          )}
        >
          {mediaList.slice(0, 4).map((m, idx) => (
            <div key={m.id} className="relative aspect-video bg-muted overflow-hidden">
              <img
                src={m.url}
                alt={m.name}
                className="w-full h-full object-cover"
              />
              {idx === 3 && mediaList.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
                  +{mediaList.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Poll Options Preview */}
      {values.postType === "poll" && (
        <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-emerald-500" />
            <h4 className="text-sm font-bold text-foreground">
              {values.poll.question || "Poll Question"}
            </h4>
          </div>
          <div className="space-y-2">
            {values.poll.options.map((opt, i) => (
              <div
                key={i}
                className="group relative flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-card hover:border-primary/50 text-xs font-semibold text-foreground transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border border-border bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt.text || `Option ${i + 1}`}</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">0%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <span>0 votes</span>
            <span>Duration: {values.poll.durationDays} days</span>
          </div>
        </div>
      )}

      {/* Engagement Actions Preview */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-muted-foreground">
        <div className="flex items-center gap-4">
          <button type="button" className="flex items-center gap-1.5 text-xs font-medium hover:text-foreground">
            <Heart className="h-4 w-4" />
            <span>0</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 text-xs font-medium hover:text-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>0</span>
          </button>
          <button type="button" className="flex items-center gap-1.5 text-xs font-medium hover:text-foreground">
            <Share2 className="h-4 w-4" />
            <span>0</span>
          </button>
        </div>
        <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wider">
          {values.source}
        </Badge>
      </div>
    </div>
  );

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit}>
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* Live Card Preview with Device Switcher */}
              <PolarisSidebarCard
                title="Live Preview"
                badge="Real-time"
                badgeVariant="outline"
              >
                <div className="space-y-3">
                  {/* Device and Fullscreen Toggle Controls */}
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg border border-border/60">
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("desktop")}
                        className={cn(
                          "p-1 rounded-md text-xs font-semibold transition-all",
                          previewDevice === "desktop"
                            ? "bg-card text-foreground shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        title="Desktop view"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice("mobile")}
                        className={cn(
                          "p-1 rounded-md text-xs font-semibold transition-all",
                          previewDevice === "mobile"
                            ? "bg-card text-foreground shadow-2xs"
                            : "text-muted-foreground hover:text-foreground"
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
                      className="h-7 px-2 text-[11px] font-semibold gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Maximize2 className="h-3 w-3" />
                      Fullscreen
                    </Button>
                  </div>

                  {/* The Rendered Preview Card */}
                  {renderFeedCardPreview(false)}
                </div>
              </PolarisSidebarCard>

              {/* Post Summary Details */}
              <PolarisSidebarCard title="Publishing Summary">
                <div className="space-y-1 divide-y divide-border/40">
                  <PolarisSummaryRow
                    label="Target Channel"
                    value={
                      values.source === "feed"
                        ? "Global Feed"
                        : values.source === "admin"
                        ? "Admin"
                        : values.source === "jobs"
                        ? "Jobs"
                        : "Marketplace"
                    }
                  />
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
                    label="Visibility"
                    value={values.privacy === "PUBLIC" ? "Public" : "Connections"}
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
                    highlight={values.isPinned}
                  />
                </div>
              </PolarisSidebarCard>

              {/* Best Practices Tip Card */}
              <PolarisTipCard
                title="Engagement Tips"
                tips={[
                  "Posts with images or media achieve 2.5x more community reactions.",
                  "Use polls to gather fast feedback on upcoming events or topics.",
                  "Pinned posts remain prominently visible at the top of the feed stream.",
                ]}
              />
            </div>
          }
        >
          {/* ── LEFT COLUMN: MAIN FORM (8 Cols) ────────────────────────── */}
          <div className="space-y-6">
            {/* Top Quick Actions Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-card shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">New Post Draft</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Target: <span className="font-semibold text-foreground capitalize">{values.source} Feed</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullPreviewModal(true)}
                  className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 border-border shadow-2xs text-foreground bg-card hover:bg-muted"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  Preview Post
                </Button>
              </div>
            </div>

            {/* Author / Entity Identity Banner */}
            <PolarisInfoBanner
              variant="default"
              title="Publishing as Community Admin"
              description={`This post will be published officially under ${entity?.name || "your organization"} and distributed according to the selected channel.`}
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
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">
                  Post Format
                </Label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setFieldValue("postType", "general")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all",
                      values.postType === "general"
                        ? "bg-card text-foreground shadow-xs border border-border/80"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    )}
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Text & Media</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFieldValue("postType", "poll")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all",
                      values.postType === "poll"
                        ? "bg-card text-foreground shadow-xs border border-border/80"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    )}
                  >
                    <BarChart2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Poll & Vote</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFieldValue("postType", "celebration")}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all",
                      values.postType === "celebration"
                        ? "bg-card text-foreground shadow-xs border border-border/80"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Celebration</span>
                  </button>
                </div>
              </div>

              {/* Textarea Description */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="description"
                    className="text-xs font-semibold text-foreground"
                  >
                    Message Body <span className="text-destructive">*</span>
                  </Label>
                  <span
                    className={cn(
                      "text-[11px] font-mono",
                      charCount > 1800
                        ? "text-amber-500 font-bold"
                        : "text-muted-foreground"
                    )}
                  >
                    {charCount} / 2000
                  </span>
                </div>
                <Textarea
                  id="description"
                  name="description"
                  rows={6}
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
                  className={cn(
                    "text-sm resize-y rounded-xl border-border bg-card leading-relaxed focus-visible:ring-primary/20",
                    touched.description && errors.description && "border-destructive"
                  )}
                />
                {touched.description && errors.description && (
                  <p className="text-[11px] font-medium text-destructive mt-1">
                    {errors.description}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Markdown links and external URLs will automatically display rich card previews.
                </p>
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
                <div className="space-y-1.5">
                  <Label
                    htmlFor="poll.question"
                    className="text-xs font-semibold text-foreground"
                  >
                    Poll Question <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="poll.question"
                    name="poll.question"
                    placeholder="e.g. Which community workshop topic would you prefer next?"
                    value={values.poll.question}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="rounded-xl border-border h-10 text-sm"
                  />
                  {touched.poll?.question && errors.poll?.question && (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.poll.question}
                    </p>
                  )}
                </div>

                {/* Poll Options List */}
                <div className="space-y-3 pt-2">
                  <Label className="text-xs font-semibold text-foreground">
                    Poll Options (Min. 2, Max. 6)
                  </Label>
                  <FieldArray name="poll.options">
                    {({ push, remove }) => (
                      <div className="space-y-2.5">
                        {values.poll.options.map((opt, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground shrink-0">
                              {index + 1}
                            </span>
                            <Input
                              name={`poll.options.${index}.text`}
                              placeholder={`Option ${index + 1} text...`}
                              value={opt.text}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className="rounded-xl border-border h-9 text-xs flex-1"
                            />
                            {values.poll.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
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
                            className="rounded-xl h-8 px-3 text-xs font-semibold gap-1.5 border-dashed border-border/80"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Option
                          </Button>
                        )}
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Poll Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Poll Duration
                    </Label>
                    <Select
                      value={String(values.poll.durationDays)}
                      onValueChange={(val) =>
                        setFieldValue("poll.durationDays", Number(val))
                      }
                    >
                      <SelectTrigger className="h-9 rounded-xl border-border text-xs">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border">
                        <SelectItem value="1" className="text-xs">1 Day</SelectItem>
                        <SelectItem value="3" className="text-xs">3 Days</SelectItem>
                        <SelectItem value="7" className="text-xs">1 Week (Default)</SelectItem>
                        <SelectItem value="14" className="text-xs">2 Weeks</SelectItem>
                        <SelectItem value="30" className="text-xs">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                <div className="space-y-4">
                  <label
                    htmlFor="media-file-upload"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/80 rounded-2xl bg-muted/10 hover:bg-muted/30 cursor-pointer transition-colors group"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold text-foreground">
                      Click or drag photos to upload
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
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
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {mediaList.map((item) => (
                        <div
                          key={item.id}
                          className="group/img relative rounded-xl overflow-hidden border border-border bg-card aspect-square shadow-2xs"
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(item.id)}
                            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-[10px] text-white truncate">
                            {item.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PolarisFormCard>
            )}

            {/* Step 3: Distribution & Settings Card */}
            <PolarisFormCard
              step={3}
              icon={Globe}
              title="Distribution & Target Feed"
              description="Choose which community feed channel this post will be categorized into."
              badge="Audience"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Channel */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Target Channel / Tab
                  </Label>
                  <Select
                    value={values.source}
                    onValueChange={(val) => setFieldValue("source", val)}
                  >
                    <SelectTrigger className="h-10 rounded-xl border-border text-xs">
                      <SelectValue placeholder="Select target feed" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="feed" className="text-xs">
                        <div className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-indigo-500" />
                          <span>Global Community Feed</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin" className="text-xs">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                          <span>Admin Announcement</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="jobs" className="text-xs">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Job & Career Opportunity</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="marketPlace" className="text-xs">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
                          <span>Marketplace Listing</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Audience Privacy */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Audience Privacy
                  </Label>
                  <Select
                    value={values.privacy}
                    onValueChange={(val) => setFieldValue("privacy", val)}
                  >
                    <SelectTrigger className="h-10 rounded-xl border-border text-xs">
                      <SelectValue placeholder="Select privacy" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="PUBLIC" className="text-xs">
                        <div className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Public (All Ecosystem Members)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="CONNECTIONS" className="text-xs">
                        <div className="flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Connections Only</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pin to top switch */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-muted/20 mt-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Pin className="h-4 w-4 text-amber-500" />
                    <Label className="text-xs font-semibold text-foreground cursor-pointer">
                      Pin Announcement to Top
                    </Label>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Highlighted with a pinned badge and kept at the top of the feed stream.
                  </p>
                </div>
                <Switch
                  checked={values.isPinned}
                  onCheckedChange={(val) => setFieldValue("isPinned", val)}
                />
              </div>
            </PolarisFormCard>
          </div>
        </PolarisFormLayout>

        {/* ── Sticky Bottom Action Bar with Preview ──────────────────── */}
        <AnimatePresence>
          {(isDirty || isSubmitting) && (
            <motion.div
              key="feed-floating-bar"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] w-[92%] sm:w-[65%] md:w-[50%] lg:w-[40%] min-w-[340px] max-w-[580px] pointer-events-auto"
            >
              <div className="w-full bg-[#212121]/95 dark:bg-[#1c1c1c]/95 backdrop-blur-md border border-[#383838] dark:border-[#333] rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xl shadow-black/50">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                  <span className="text-[13px] font-medium text-neutral-100 truncate tracking-tight">
                    Unpublished post draft
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      formik.resetForm();
                      setMediaList([]);
                    }}
                    disabled={loading || isSubmitting}
                    className="h-8 px-3 rounded-lg text-[12.5px] font-medium text-neutral-300 bg-[#2f2f2f] hover:bg-[#3a3a3a] active:bg-[#444444] border border-[#424242] transition-all duration-150 disabled:opacity-40 cursor-pointer"
                  >
                    Discard
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFullPreviewModal(true)}
                    className="h-8 px-3 rounded-lg text-[12.5px] font-medium text-neutral-200 bg-[#2f2f2f] hover:bg-[#3a3a3a] active:bg-[#444444] border border-[#424242] transition-all duration-150 cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => formik.submitForm()}
                    disabled={loading || isSubmitting}
                    className="h-8 px-3.5 rounded-lg text-[12.5px] font-semibold text-white bg-primary hover:bg-primary/90 border border-primary/40 transition-all duration-150 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    {(loading || isSubmitting) && (
                      <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    <span>Publish Post</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Fullscreen Preview Modal ──────────────────────────────── */}
        <Dialog open={showFullPreviewModal} onOpenChange={setShowFullPreviewModal}>
          <DialogContent className="max-w-xl p-6 rounded-3xl border-border bg-card">
            <DialogHeader className="pb-3 border-b border-border/50">
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span>Full Feed Post Preview</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                How members will experience this post on the community feed stream.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              {renderFeedCardPreview(true)}
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </FormikProvider>
  );
}

export default PostCreationForm;
