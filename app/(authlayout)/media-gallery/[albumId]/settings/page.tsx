"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Share2,
  Repeat,
  Download,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Linkedin, Instagram } from "@/components/ui/brand-icons";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  EcosystemWrapper,
  EcosystemContainer,
} from "@/components/layout/ecosystem";
import {
  useGetMediaGalleryAlbum,
  useGetMediaGalleryAlbumSettings,
  useUpdateMediaGalleryAlbumSettings,
} from "@/graphql/actions/mediaGallery";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaGalleryAlbumSettingsValues {
  allowDownload: boolean;
  allowPlatformRepost: boolean;
  allowPlatformRepostWithThoughts: boolean;
  allowSocialShare: boolean;
  allowLinkedinShare: boolean;
  allowLinkedinNative: boolean;
  allowLinkedinCopyLink: boolean;
  allowInstagramShare: boolean;
  allowInstagramNative: boolean;
  allowInstagramCopyLink: boolean;
  allowWhatsappShare: boolean;
  allowWhatsappNative: boolean;
  allowWhatsappCopyLink: boolean;
  allowWhatsappStoryShare: boolean;
  allowComments: boolean;
  socialShareCustomMessage: string;
}

const validationSchema = Yup.object().shape({
  allowDownload: Yup.boolean().required(),
  allowPlatformRepost: Yup.boolean().required(),
  allowPlatformRepostWithThoughts: Yup.boolean().required(),
  allowSocialShare: Yup.boolean().required(),
  allowLinkedinShare: Yup.boolean().required(),
  allowLinkedinNative: Yup.boolean().required(),
  allowLinkedinCopyLink: Yup.boolean().required(),
  allowInstagramShare: Yup.boolean().required(),
  allowInstagramNative: Yup.boolean().required(),
  allowInstagramCopyLink: Yup.boolean().required(),
  allowWhatsappShare: Yup.boolean().required(),
  allowWhatsappNative: Yup.boolean().required(),
  allowWhatsappCopyLink: Yup.boolean().required(),
  allowWhatsappStoryShare: Yup.boolean().required(),
  allowComments: Yup.boolean().required(),
  socialShareCustomMessage: Yup.string()
    .trim()
    .max(500, "Message cannot exceed 500 characters"),
});

export default function IndividualAlbumSettingsPage() {
  const params = useParams();
  const albumId = params.albumId as string;

  const { data: albumData } = useGetMediaGalleryAlbum(albumId);
  const { data: settingsData, refetch } = useGetMediaGalleryAlbumSettings(albumId);
  const [updateSettings] = useUpdateMediaGalleryAlbumSettings(albumId);

  const album = albumData?.getMediaGalleryAlbum;

  const initialValues: MediaGalleryAlbumSettingsValues = useMemo(() => {
    const s = settingsData?.getMediaGalleryAlbumSettings;
    return {
      allowDownload: s?.allowDownload ?? true,
      allowPlatformRepost: s?.allowPlatformRepost ?? true,
      allowPlatformRepostWithThoughts: s?.allowPlatformRepostWithThoughts ?? true,
      allowSocialShare: s?.allowSocialShare ?? true,
      allowLinkedinShare: s?.allowLinkedinShare ?? true,
      allowLinkedinNative: s?.allowLinkedinNative ?? true,
      allowLinkedinCopyLink: s?.allowLinkedinCopyLink ?? true,
      allowInstagramShare: s?.allowInstagramShare ?? true,
      allowInstagramNative: s?.allowInstagramNative ?? true,
      allowInstagramCopyLink: s?.allowInstagramCopyLink ?? true,
      allowWhatsappShare: s?.allowWhatsappShare ?? true,
      allowWhatsappNative: s?.allowWhatsappNative ?? true,
      allowWhatsappCopyLink: s?.allowWhatsappCopyLink ?? true,
      allowWhatsappStoryShare: s?.allowWhatsappStoryShare ?? true,
      allowComments: s?.allowComments ?? true,
      socialShareCustomMessage: s?.socialShareCustomMessage ?? "",
    };
  }, [settingsData]);

  const formik = useFormik<MediaGalleryAlbumSettingsValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateSettings({
          variables: {
            albumId,
            input: {
              allowDownload: values.allowDownload,
              allowPlatformRepost: values.allowPlatformRepost,
              allowPlatformRepostWithThoughts:
                values.allowPlatformRepostWithThoughts,
              allowSocialShare: values.allowSocialShare,
              allowLinkedinShare:
                values.allowLinkedinNative || values.allowLinkedinCopyLink,
              allowLinkedinNative: values.allowLinkedinNative,
              allowLinkedinCopyLink: values.allowLinkedinCopyLink,
              allowInstagramShare:
                values.allowInstagramNative || values.allowInstagramCopyLink,
              allowInstagramNative: values.allowInstagramNative,
              allowInstagramCopyLink: values.allowInstagramCopyLink,
              allowWhatsappShare:
                values.allowWhatsappNative ||
                values.allowWhatsappCopyLink ||
                values.allowWhatsappStoryShare,
              allowWhatsappNative: values.allowWhatsappNative,
              allowWhatsappCopyLink: values.allowWhatsappCopyLink,
              allowWhatsappStoryShare: values.allowWhatsappStoryShare,
              allowComments: values.allowComments,
              socialShareCustomMessage:
                values.socialShareCustomMessage.trim() || null,
            },
          },
        });
        toast.success("Gallery settings saved successfully");
        refetch?.();
      } catch (err: unknown) {
        toast.error(
          (err as Error)?.message || "Failed to update gallery settings",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <EcosystemWrapper>
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <form onSubmit={formik.handleSubmit}>
          <PolarisFormLayout
            sidebar={
              <div className="space-y-4">
                {/* Sidebar Live Status Card */}
                <PolarisSidebarCard
                  title="Active Protocols"
                  badge="Live State"
                  icon={Sparkles}
                >
                  <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 truncate max-w-[150px]">
                        {album?.title ?? "Gallery Album"}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9.5px] font-bold px-1.5 py-0 rounded-[3px]",
                          formik.values.allowSocialShare
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formik.values.allowSocialShare
                          ? "Social Open"
                          : "Social Locked"}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-[11px] text-[#616161] dark:text-zinc-400">
                      <div className="flex items-center justify-between">
                        <span>Source Downloads:</span>
                        <span className="font-semibold text-[#303030] dark:text-zinc-200">
                          {formik.values.allowDownload ? "Permitted" : "Restricted"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Platform Repost:</span>
                        <span className="font-semibold text-[#303030] dark:text-zinc-200">
                          {formik.values.allowPlatformRepost
                            ? "1-Click"
                            : "Disabled"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Repost with Thoughts:</span>
                        <span className="font-semibold text-[#303030] dark:text-zinc-200">
                          {formik.values.allowPlatformRepostWithThoughts
                            ? "Allowed"
                            : "Off"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>LinkedIn Share:</span>
                        <span className="font-semibold text-[#303030] dark:text-zinc-200">
                          {formik.values.allowLinkedinNative ||
                          formik.values.allowLinkedinCopyLink
                            ? "Active"
                            : "Disabled"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Instagram Share:</span>
                        <span className="font-semibold text-[#303030] dark:text-zinc-200">
                          {formik.values.allowInstagramNative ||
                          formik.values.allowInstagramCopyLink
                            ? "Active"
                            : "Disabled"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>WhatsApp Share:</span>
                        <span className="font-semibold text-[#303030] dark:text-zinc-200">
                          {formik.values.allowWhatsappNative ||
                          formik.values.allowWhatsappCopyLink ||
                          formik.values.allowWhatsappStoryShare
                            ? "Active"
                            : "Disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#e1e3e5]/70 dark:border-zinc-800">
                    <PolarisSummaryRow
                      label="File Download"
                      value={formik.values.allowDownload ? "Open" : "Protected"}
                      highlight={formik.values.allowDownload}
                    />
                    <PolarisSummaryRow
                      label="Platform Repost"
                      value={
                        formik.values.allowPlatformRepost ? "Active" : "Disabled"
                      }
                      highlight={formik.values.allowPlatformRepost}
                    />
                    <PolarisSummaryRow
                      label="External Social"
                      value={
                        formik.values.allowSocialShare ? "Enabled" : "Disabled"
                      }
                      highlight={formik.values.allowSocialShare}
                    />
                    <PolarisSummaryRow
                      label="Member Comments"
                      value={formik.values.allowComments ? "Enabled" : "Disabled"}
                      highlight={formik.values.allowComments}
                      isLast
                    />
                  </div>
                </PolarisSidebarCard>

                <PolarisTipCard title="Gallery Viral Growth">
                  Enabling 1-Click Repost and Social Share lets members share high-res photos to their personal LinkedIn feeds and WhatsApp chats, generating organic discovery.
                </PolarisTipCard>

                <div className="p-3 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                      Security & Privacy
                    </span>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-snug">
                    When direct downloads are restricted, members can only view watermarked or responsive resolutions in browser.
                  </p>
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              {/* ── SECTION 1: SOCIAL SHARE ───────────────────────────────────────── */}
              <PolarisFormCard
                step={1}
                icon={Share2}
                title="Social Share Channels (External Distribution)"
                description="Configure social network connect APIs and copy-by-link distribution."
                badge="Social Share"
                badgeVariant="indigo"
              >
                <div className="space-y-3">
                  {/* Master Switch */}
                  <div className="flex items-start justify-between p-3 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb]/50 dark:bg-zinc-900/40">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                          Enable External Social Sharing
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                            formik.values.allowSocialShare
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                          )}
                        >
                          {formik.values.allowSocialShare
                            ? "Enabled"
                            : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                        Master switch for social sharing buttons and external distribution on media in this album.
                      </p>
                    </div>
                    <Switch
                      checked={formik.values.allowSocialShare}
                      onCheckedChange={(checked) =>
                        formik.setFieldValue("allowSocialShare", checked)
                      }
                    />
                  </div>

                  {formik.values.allowSocialShare && (
                    <div className="space-y-3 pt-1">
                      {/* LinkedIn */}
                      <div className="p-3.5 rounded-lg border border-blue-500/20 bg-blue-500/[0.02] space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-blue-500/10">
                          <div className="h-6 w-6 rounded bg-[#0077b5] text-white flex items-center justify-center">
                            <Linkedin className="h-3.5 w-3.5 fill-current" />
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            LinkedIn Options
                          </span>
                        </div>

                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5 pr-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-foreground">
                                Native Connect APIs
                              </span>
                              <Badge className="text-[9px] bg-blue-500/10 text-blue-600 border-blue-500/20">
                                API
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Share to member LinkedIn feed via connected OAuth account.
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.allowLinkedinNative}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue("allowLinkedinNative", checked)
                            }
                          />
                        </div>

                        <div className="flex items-start justify-between pt-2 border-t border-border/40">
                          <div className="space-y-0.5 pr-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-foreground">
                                Copy by Link (Direct Inline Feed)
                              </span>
                              <Badge variant="outline" className="text-[9px]">
                                1-Click Link
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Generate link configured to share directly into LinkedIn feed.
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.allowLinkedinCopyLink}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue(
                                "allowLinkedinCopyLink",
                                checked,
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Instagram */}
                      <div className="p-3.5 rounded-lg border border-pink-500/20 bg-pink-500/[0.02] space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-pink-500/10">
                          <div className="h-6 w-6 rounded bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center">
                            <Instagram className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            Instagram Options
                          </span>
                        </div>

                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5 pr-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-foreground">
                                Native Connect APIs
                              </span>
                              <Badge className="text-[9px] bg-pink-500/10 text-pink-600 border-pink-500/20">
                                API
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Publish directly via Instagram Content Publishing API.
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.allowInstagramNative}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue(
                                "allowInstagramNative",
                                checked,
                              )
                            }
                          />
                        </div>

                        <div className="flex items-start justify-between pt-2 border-t border-border/40">
                          <div className="space-y-0.5 pr-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-foreground">
                                Copy by Link (Feed & Story Deep-Link)
                              </span>
                              <Badge variant="outline" className="text-[9px]">
                                Deep Link
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Direct on inlined feed or story composer deep-link.
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.allowInstagramCopyLink}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue(
                                "allowInstagramCopyLink",
                                checked,
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* WhatsApp */}
                      <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.02] space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/10">
                          <div className="h-6 w-6 rounded bg-[#25D366] text-white flex items-center justify-center">
                            <WhatsAppIcon size={14} />
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            WhatsApp Options
                          </span>
                        </div>

                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5 pr-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-foreground">
                                Native Connect APIs
                              </span>
                              <Badge className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                API
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Broadcast via connected WhatsApp Cloud API service.
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.allowWhatsappNative}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue("allowWhatsappNative", checked)
                            }
                          />
                        </div>

                        <div className="flex items-start justify-between pt-2 border-t border-border/40">
                          <div className="space-y-0.5 pr-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-foreground">
                                Copy by Link (Direct Chat Share)
                              </span>
                              <Badge variant="outline" className="text-[9px]">
                                Direct Link
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Launch direct chat share with pre-filled message.
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.allowWhatsappCopyLink}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue(
                                "allowWhatsappCopyLink",
                                checked,
                              )
                            }
                          />
                        </div>

                        <div className="flex items-start justify-between pt-2 border-t border-border/40">
                          <div className="space-y-0.5 pr-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium text-foreground">
                                Share to Story / Status
                              </span>
                              <Badge variant="outline" className="text-[9px]">
                                Status Intent
                              </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              1-click intent to share media straight to WhatsApp Status.
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.allowWhatsappStoryShare}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue(
                                "allowWhatsappStoryShare",
                                checked,
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Custom Message */}
                      <div className="space-y-1.5 p-3 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="socialShareCustomMessage"
                            className="text-xs font-semibold text-[#303030] dark:text-zinc-100"
                          >
                            Custom Pre-filled Social Share Message
                          </Label>
                          <span className="text-[11px] text-[#616161] dark:text-zinc-400 font-mono">
                            {formik.values.socialShareCustomMessage.length}/500
                          </span>
                        </div>
                        <Input
                          id="socialShareCustomMessage"
                          name="socialShareCustomMessage"
                          value={formik.values.socialShareCustomMessage}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="e.g. Check out these moments from our gallery! 🌟"
                          className={cn(
                            "text-xs h-9",
                            formik.touched.socialShareCustomMessage &&
                              formik.errors.socialShareCustomMessage &&
                              "border-destructive focus-visible:ring-destructive",
                          )}
                        />
                        {formik.touched.socialShareCustomMessage &&
                          formik.errors.socialShareCustomMessage && (
                            <p className="text-[11px] text-destructive font-medium mt-1">
                              {formik.errors.socialShareCustomMessage}
                            </p>
                          )}
                        <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-snug">
                          Default text attached when members share media from this album to social channels.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </PolarisFormCard>

              {/* ── SECTION 2: PLATFORM REPOST ───────────────────────────────────── */}
              <PolarisFormCard
                step={2}
                icon={Repeat}
                title="Platform Share & Reposting"
                description="Control how community members share and repost this media internally to the community feed."
                badge="Community Feed"
                badgeVariant="indigo"
              >
                <div className="space-y-2.5">
                  {/* 1-Click Repost */}
                  <div className="flex items-start justify-between p-3 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb]/50 dark:bg-zinc-900/40">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                          1-Click Direct Repost
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                            formik.values.allowPlatformRepost
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                              : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                          )}
                        >
                          {formik.values.allowPlatformRepost
                            ? "Allowed"
                            : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                        Allows members to instantly re-share media from this album to their community feed profile.
                      </p>
                    </div>
                    <Switch
                      checked={formik.values.allowPlatformRepost}
                      onCheckedChange={(checked) =>
                        formik.setFieldValue("allowPlatformRepost", checked)
                      }
                    />
                  </div>

                  {/* Repost with Thoughts */}
                  <div className="flex items-start justify-between p-3 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb]/50 dark:bg-zinc-900/40">
                    <div className="space-y-0.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                          Repost with Thoughts (Quote Post)
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                            formik.values.allowPlatformRepostWithThoughts
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                              : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                          )}
                        >
                          {formik.values.allowPlatformRepostWithThoughts
                            ? "Allowed"
                            : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                        Permits members to write additional commentary when reposting this media to the feed.
                      </p>
                    </div>
                    <Switch
                      checked={formik.values.allowPlatformRepostWithThoughts}
                      onCheckedChange={(checked) =>
                        formik.setFieldValue(
                          "allowPlatformRepostWithThoughts",
                          checked,
                        )
                      }
                    />
                  </div>
                </div>
              </PolarisFormCard>

              {/* ── SECTION 3: NORMAL DOWNLOAD ───────────────────────────────────── */}
              <PolarisFormCard
                step={3}
                icon={Download}
                title="Media Download Policy"
                description="Control whether original resolution photos and video files can be downloaded."
                badge="Downloads"
                badgeVariant="indigo"
              >
                <div className="flex items-start justify-between p-3 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb]/50 dark:bg-zinc-900/40">
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                        Allow Direct File Download
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formik.values.allowDownload
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formik.values.allowDownload
                          ? "Open Download"
                          : "Protected"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      When enabled, members can download full-size files. Disable if media is confidential or exclusive.
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.allowDownload}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("allowDownload", checked)
                    }
                  />
                </div>
              </PolarisFormCard>

              {/* ── SECTION 4: COMMENTS ─────────────────────────────────────────── */}
              <PolarisFormCard
                step={4}
                icon={MessageSquare}
                title="Commentary & Member Discussion"
                description="Control whether members can post comments under items in this album."
                badge="Comments"
                badgeVariant="indigo"
              >
                <div className="flex items-start justify-between p-3 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb]/50 dark:bg-zinc-900/40">
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                        Allow Member Comments
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formik.values.allowComments
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formik.values.allowComments ? "Allowed" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Permits community members to participate in conversations under photos and videos in this album.
                    </p>
                  </div>
                  <Switch
                    checked={formik.values.allowComments}
                    onCheckedChange={(checked) =>
                      formik.setFieldValue("allowComments", checked)
                    }
                  />
                </div>
              </PolarisFormCard>
            </div>
          </PolarisFormLayout>

          {/* Floating Save Panel Dock */}
          <FloatingSavePanel
            hasChanged={formik.dirty}
            saved={!formik.dirty}
            isSaving={formik.isSubmitting}
            onSave={formik.handleSubmit}
            onReset={() => formik.resetForm()}
            saveButtonText="Save Settings"
            discardButtonText="Discard Changes"
          />
        </form>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
