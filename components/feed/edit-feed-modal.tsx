"use client";

import React, { useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Pencil,
  Loader2,
  Check,
  Sparkles,
  BarChart2,
  Briefcase,
  ShoppingBag,
  Play,
  MessageSquare,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/layout/user-avatar";
import { useEditFeed } from "@/graphql/actions/feed";
import { useGetEntity } from "@/graphql/actions";
import type { FeedProps } from "./types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import moment from "moment";
import type { ApolloCache } from "@apollo/client";

// ─────────────────────────────────────────────────────────────────────────────
// Form Validation Schema (Mandatory Formik + Yup)
// ─────────────────────────────────────────────────────────────────────────────

const editFeedValidationSchema = Yup.object().shape({
  description: Yup.string()
    .trim()
    .required("Post caption cannot be empty")
    .max(3000, "Caption cannot exceed 3,000 characters"),
});

export interface EditFeedModalProps {
  feed: FeedProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditFeedModal({
  feed,
  open,
  onOpenChange,
  onSuccess,
}: EditFeedModalProps) {
  const { data: entityData } = useGetEntity();

  const [editFeedMutation, { loading: isSaving }] = useEditFeed();

  const initialDescription =
    feed?.description || feed?.moment?.caption || "";

  const formik = useFormik({
    initialValues: {
      description: initialDescription,
    },
    validationSchema: editFeedValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!feed) return;
      try {
        await editFeedMutation({
          variables: {
            input: {
              id: feed.id.toString(),
              description: values.description.trim(),
            },
          },
          update(cache: ApolloCache<unknown>, { data }: { data?: { editFeed?: { id: string; description: string; moment?: { id: string; caption: string } } } }) {
            if (data?.editFeed) {
              const updated = data.editFeed;
              cache.modify({
                id: cache.identify({ __typename: "Feed", id: feed.id }),
                fields: {
                  description() {
                    return updated.description;
                  },
                  moment(existingMoment: Record<string, unknown> | null) {
                    if (updated.moment && existingMoment) {
                      return {
                        ...existingMoment,
                        caption: updated.moment.caption,
                      };
                    }
                    return existingMoment;
                  },
                },
              });
            }
          },
        });

        toast.success("Caption updated", {
          description: "The post caption has been saved successfully.",
          icon: <Check className="h-4 w-4 text-emerald-500" />,
        });

        onOpenChange(false);
        onSuccess?.();
      } catch (err: unknown) {
        toast.error("Failed to update caption", {
          description:
            (err as Error).message ||
            "An error occurred while updating the post caption.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle Cmd+Enter / Ctrl+Enter shortcut to save
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        formik.handleSubmit();
      }
    },
    [formik]
  );

  // Reset form errors when modal closes
  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!feed) return null;

  const isEntity = feed.addedBy === "ENTITY";
  const authorName = isEntity
    ? entityData?.getEntity?.name || "Official Admin"
    : `${feed.user?.firstName || ""} ${feed.user?.lastName || ""}`.trim() ||
      "Community Member";
  const authorAvatar = isEntity
    ? entityData?.getEntity?.logo
    : feed.user?.avatar;

  const charCount = formik.values.description.length;
  const isNearLimit = charCount > 2700;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-xl border border-border/80 bg-background shadow-2xl">
        {/* Sticky Header with Polaris icon badge */}
        <div className="p-5 pb-4 border-b border-border/60 bg-muted/20">
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs">
              <Pencil className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground tracking-tight">
                Edit Post Caption
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Update the caption and text content for this community post.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={formik.handleSubmit} className="p-5 space-y-4">
          {/* Post Context Preview Strip */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <UserAvatar
                size={34}
                src={authorAvatar}
                className="rounded-lg border border-border/70 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {authorName}
                </p>
                <p className="text-[11px] text-muted-foreground leading-none">
                  {moment(feed.createdAt).format("MMM D, YYYY • h:mm A")}
                </p>
              </div>
            </div>

            {/* Post Type Badge */}
            <div className="shrink-0">
              {feed.moment && (
                <Badge
                  variant="outline"
                  className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-[10px] font-semibold gap-1 px-2 py-0.5"
                >
                  <Play className="h-3 w-3" /> Moment
                </Badge>
              )}
              {feed.poll && (
                <Badge
                  variant="outline"
                  className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-[10px] font-semibold gap-1 px-2 py-0.5"
                >
                  <BarChart2 className="h-3 w-3" /> Poll
                </Badge>
              )}
              {feed.job && (
                <Badge
                  variant="outline"
                  className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-[10px] font-semibold gap-1 px-2 py-0.5"
                >
                  <Briefcase className="h-3 w-3" /> Job
                </Badge>
              )}
              {feed.marketPlace && (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold gap-1 px-2 py-0.5"
                >
                  <ShoppingBag className="h-3 w-3" /> Listing
                </Badge>
              )}
              {feed.celebration && (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-semibold gap-1 px-2 py-0.5"
                >
                  <Sparkles className="h-3 w-3" /> Celebration
                </Badge>
              )}
              {!feed.moment &&
                !feed.poll &&
                !feed.job &&
                !feed.marketPlace &&
                !feed.celebration && (
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground border-border/70 text-[10px] font-semibold gap-1 px-2 py-0.5"
                  >
                    <MessageSquare className="h-3 w-3" /> Post
                  </Badge>
                )}
            </div>
          </div>

          {/* Section Card: Grouped Input Standard */}
          <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  1
                </span>
                <Label
                  htmlFor="feed-caption-input"
                  className="text-xs font-bold uppercase tracking-wide text-foreground"
                >
                  Post Caption & Content
                </Label>
              </div>

              {/* Character counter */}
              <span
                className={cn(
                  "text-[11px] font-mono",
                  isNearLimit
                    ? "text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {charCount.toLocaleString()} / 3,000
              </span>
            </div>

            <Textarea
              id="feed-caption-input"
              name="description"
              rows={6}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="Write the caption or description for this post..."
              className={cn(
                "min-h-[140px] max-h-[300px] text-xs resize-y font-normal leading-relaxed transition-colors",
                formik.touched.description && formik.errors.description
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border/70"
              )}
            />

            {/* Inline validation error message */}
            {formik.touched.description && formik.errors.description && (
              <p className="text-[11px] text-destructive font-medium mt-1">
                {formik.errors.description}
              </p>
            )}

            {/* Helpful tips banner */}
            <div className="flex items-start gap-2 pt-1 text-[11px] text-muted-foreground leading-snug">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground/70" />
              <span>
                URLs, hashtags (<code>#tag</code>), and mentions (
                <code>@user</code>) will automatically be highlighted and linked
                across the feed.
              </span>
            </div>
          </div>

          {/* Sticky-Style Footer */}
          <DialogFooter className="pt-2 sm:justify-between items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px] font-mono">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px] font-mono">Enter</kbd> to save
            </span>

            <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
                className="h-9 text-xs font-medium rounded-lg cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isSaving || !formik.isValid || !formik.dirty}
                className="h-9 px-4 text-xs font-medium rounded-lg bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-2xs cursor-pointer gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Save Caption</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditFeedModal;
