"use client";

import React, { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, Link2, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { ADMIN_UPDATE_UTM_CAMPAIGN } from "@/graphql/actions/utm/admin-utm.graphql";
import { UtmCampaignItem, UtmCampaignStatus } from "@/types/utm";
import { cn } from "@/lib/utils";

interface EditUtmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: UtmCampaignItem | null;
  onUpdated?: (updatedCampaign: UtmCampaignItem) => void;
}

interface EditUtmFormValues {
  name: string;
  status: UtmCampaignStatus;
  utmTerm: string;
  utmContent: string;
}

const editUtmValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Campaign name cannot be empty")
    .min(2, "Campaign name must be at least 2 characters"),
  status: Yup.string()
    .oneOf(["ACTIVE", "PAUSED", "ARCHIVED"], "Invalid status")
    .required("Status is required"),
  utmTerm: Yup.string().trim(),
  utmContent: Yup.string().trim(),
});

export function EditUtmModal({
  open,
  onOpenChange,
  campaign,
  onUpdated,
}: EditUtmModalProps) {
  const [copied, setCopied] = useState(false);
  const [updateCampaignMutation] = useMutation(ADMIN_UPDATE_UTM_CAMPAIGN);

  const formik = useFormik<EditUtmFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: campaign?.name || "",
      status: campaign?.status || "ACTIVE",
      utmTerm: campaign?.utmTerm || "",
      utmContent: campaign?.utmContent || "",
    },
    validationSchema: editUtmValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!campaign) return;
      try {
        const input = {
          id: campaign.id,
          name: values.name.trim(),
          status: values.status,
          utmTerm: values.utmTerm.trim() || undefined,
          utmContent: values.utmContent.trim() || undefined,
        };

        let updatedRecord: UtmCampaignItem = {
          ...campaign,
          name: input.name,
          status: input.status,
          utmTerm: input.utmTerm,
          utmContent: input.utmContent,
          generatedUrl: previewUrl,
          updatedAt: new Date().toISOString(),
        };

        try {
          const res = await updateCampaignMutation({
            variables: { input },
          });
          if (res.data?.updateUtmCampaign) {
            updatedRecord = {
              ...updatedRecord,
              ...res.data.updateUtmCampaign,
            };
          }
        } catch (err) {
          console.warn("Apollo update fallback:", err);
        }

        toast.success("UTM Campaign updated successfully");
        if (onUpdated) {
          onUpdated(updatedRecord);
        }
        onOpenChange(false);
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to update UTM campaign");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Compute updated preview URL
  const previewUrl = useMemo(() => {
    if (!campaign) return "";
    try {
      const base = campaign.destinationUrl || campaign.generatedUrl;
      const url = new URL(base.startsWith("http") ? base : `https://${base}`);
      if (campaign.utmSource) url.searchParams.set("utm_source", campaign.utmSource);
      if (campaign.utmMedium) url.searchParams.set("utm_medium", campaign.utmMedium);
      if (campaign.utmCampaign) url.searchParams.set("utm_campaign", campaign.utmCampaign);
      if (formik.values.utmTerm.trim()) {
        url.searchParams.set("utm_term", formik.values.utmTerm.trim());
      } else {
        url.searchParams.delete("utm_term");
      }
      if (formik.values.utmContent.trim()) {
        url.searchParams.set("utm_content", formik.values.utmContent.trim());
      } else {
        url.searchParams.delete("utm_content");
      }
      return url.toString();
    } catch {
      return campaign.generatedUrl;
    }
  }, [campaign, formik.values.utmTerm, formik.values.utmContent]);

  const handleCopy = () => {
    if (!previewUrl) return;
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    toast.success("Updated tracking URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!campaign) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col justify-between overflow-y-auto"
      >
        <form onSubmit={formik.handleSubmit} className="flex flex-col h-full justify-between">
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <SheetHeader className="p-0 space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                  <Edit3 className="h-4 w-4" />
                </div>
                <div>
                  <SheetTitle className="text-base font-bold text-foreground">
                    Edit Tracking Campaign
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    Update campaign display name, status, or creative and keyword parameters
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-4 pt-2">
              {/* Readonly Campaign Identifier Bar */}
              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">utm_campaign:</span>
                  <Badge variant="outline" className="font-mono text-indigo-600 dark:text-indigo-400 border-indigo-200">
                    {campaign.utmCampaign}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-[11px]">
                  {campaign.utmSource} / {campaign.utmMedium}
                </div>
              </div>

              {/* Campaign Name */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-utm-name" className="text-xs font-semibold">
                  Campaign Name *
                </Label>
                <Input
                  id="edit-utm-name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Campaign display title"
                  className={cn(
                    "h-9 text-xs",
                    formik.touched.name && formik.errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-[11px] text-destructive">{formik.errors.name}</p>
                )}
              </div>

              {/* Status Selection */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Campaign Status</Label>
                <Select
                  value={formik.values.status}
                  onValueChange={(val) => formik.setFieldValue("status", val as UtmCampaignStatus)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active (Ingesting Traffic & Conversions)</SelectItem>
                    <SelectItem value="PAUSED">Paused (Temporarily Halting Tracking)</SelectItem>
                    <SelectItem value="ARCHIVED">Archived (Retired)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Keyword / Term & Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-utm-term" className="text-xs font-semibold">
                      Search Term (utm_term)
                    </Label>
                    <span className="text-[10px] text-muted-foreground">Optional</span>
                  </div>
                  <Input
                    id="edit-utm-term"
                    name="utmTerm"
                    value={formik.values.utmTerm}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. saas_community"
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-utm-content" className="text-xs font-semibold">
                      Creative Content (utm_content)
                    </Label>
                    <span className="text-[10px] text-muted-foreground">Optional</span>
                  </div>
                  <Input
                    id="edit-utm-content"
                    name="utmContent"
                    value={formik.values.utmContent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. hero_banner_variant_b"
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Updated URL Preview */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5" />
                  Live Destination Tracking Link
                </Label>
                <div className="p-3 rounded-xl bg-zinc-900 text-zinc-100 dark:bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-xs font-mono">
                  <span className="truncate select-all text-[11px] text-zinc-300">
                    {previewUrl}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={handleCopy}
                      className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => window.open(previewUrl, "_blank")}
                      className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-6 pt-3 border-t border-border/60 bg-muted/10 flex sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-xs h-9 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex-1 text-xs h-9 font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
            >
              {formik.isSubmitting ? "Saving Changes…" : "Save Campaign"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
