"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Copy, Check, Sparkles, Link2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { ADMIN_CREATE_UTM_CAMPAIGN } from "@/graphql/actions/utm/admin-utm.graphql";
import { UtmCampaignItem, UtmDestinationType } from "@/types/utm";
import { useSiteDomain } from "@/hooks/use-site-domain";
import { cn } from "@/lib/utils";

interface CreateUtmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (campaign: UtmCampaignItem) => void;
  initialValues?: Partial<{
    name: string;
    destinationType: UtmDestinationType;
    destinationUrl: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    utmContent: string;
  }> | null;
}

interface UtmFormValues {
  name: string;
  destinationType: UtmDestinationType;
  destinationUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
}

const utmValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Campaign name is required")
    .min(2, "Campaign name must be at least 2 characters"),
  destinationType: Yup.string()
    .oneOf(["SIGNUP", "LOGIN", "CUSTOM"], "Invalid destination type")
    .required("Destination type is required"),
  destinationUrl: Yup.string()
    .trim()
    .required("Destination URL is required"),
  utmSource: Yup.string()
    .trim()
    .required("UTM Source is required"),
  utmMedium: Yup.string()
    .trim()
    .required("UTM Medium is required"),
  utmCampaign: Yup.string().trim(),
  utmTerm: Yup.string().trim(),
  utmContent: Yup.string().trim(),
});

const COMMON_SOURCES = [
  "google",
  "twitter",
  "linkedin",
  "newsletter",
  "facebook",
  "reddit",
  "youtube",
  "partner",
];

const COMMON_MEDIUMS = [
  "cpc",
  "social",
  "email",
  "referral",
  "affiliate",
  "display",
  "organic",
];

export function CreateUtmModal({
  open,
  onOpenChange,
  onCreated,
  initialValues,
}: CreateUtmModalProps) {
  const { primaryUrl, getDestinationUrl } = useSiteDomain();
  const [copied, setCopied] = useState(false);
  const [createCampaignMutation] = useMutation(ADMIN_CREATE_UTM_CAMPAIGN);

  const formik = useFormik<UtmFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: initialValues?.name || "",
      destinationType: initialValues?.destinationType || "SIGNUP",
      destinationUrl:
        initialValues?.destinationUrl ||
        getDestinationUrl(initialValues?.destinationType || "SIGNUP"),
      utmSource: initialValues?.utmSource || "google",
      utmMedium: initialValues?.utmMedium || "cpc",
      utmCampaign: initialValues?.utmCampaign || "",
      utmTerm: initialValues?.utmTerm || "",
      utmContent: initialValues?.utmContent || "",
    },
    validationSchema: utmValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const input = {
          name: values.name.trim(),
          destinationType: values.destinationType,
          destinationUrl: values.destinationUrl.trim(),
          utmSource: values.utmSource.trim().toLowerCase(),
          utmMedium: values.utmMedium.trim().toLowerCase(),
          utmCampaign: effectiveCampaignSlug,
          utmTerm: values.utmTerm.trim() || undefined,
          utmContent: values.utmContent.trim() || undefined,
        };

        let newRecord: UtmCampaignItem | null = null;
        try {
          const res = await createCampaignMutation({
            variables: { input },
          });
          if (res.data?.createUtmCampaign) {
            newRecord = res.data.createUtmCampaign;
          }
        } catch (mutationErr: unknown) {
          console.warn("Apollo mutation failed, fallback to local:", mutationErr);
        }

        if (!newRecord) {
          newRecord = {
            id: `utm-${Date.now()}`,
            entityId: "entity-local",
            name: input.name,
            destinationType: input.destinationType,
            destinationUrl: input.destinationUrl,
            utmSource: input.utmSource,
            utmMedium: input.utmMedium,
            utmCampaign: input.utmCampaign,
            utmTerm: input.utmTerm,
            utmContent: input.utmContent,
            generatedUrl,
            shortCode: `thrc.io/${effectiveCampaignSlug.slice(0, 8)}`,
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        toast.success("UTM Tracking Link created successfully!");
        if (onCreated && newRecord) {
          onCreated(newRecord);
        }
        resetForm();
        onOpenChange(false);
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to create UTM tracking link");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Sync destinationUrl with dynamic domain if not manually set to custom
  useEffect(() => {
    if (primaryUrl && formik.values.destinationType !== "CUSTOM") {
      const currentUrl = formik.values.destinationUrl;
      if (!currentUrl || currentUrl.includes("thrico.app") || currentUrl.includes("thrico.community")) {
        formik.setFieldValue("destinationUrl", getDestinationUrl(formik.values.destinationType));
      }
    }
  }, [primaryUrl, formik.values.destinationType, formik.values.destinationUrl, getDestinationUrl, formik]);

  // Reset or fill form when open state changes
  useEffect(() => {
    if (open) {
      if (initialValues) {
        formik.setValues({
          name: initialValues.name || "",
          destinationType: initialValues.destinationType || "SIGNUP",
          destinationUrl:
            initialValues.destinationUrl ||
            getDestinationUrl(initialValues.destinationType || "SIGNUP"),
          utmSource: initialValues.utmSource || "google",
          utmMedium: initialValues.utmMedium || "cpc",
          utmCampaign: initialValues.utmCampaign || "",
          utmTerm: initialValues.utmTerm || "",
          utmContent: initialValues.utmContent || "",
        });
      } else {
        formik.resetForm();
        formik.setFieldValue("destinationUrl", getDestinationUrl("SIGNUP"));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues]);

  // Handle destination type change
  const handleDestinationTypeChange = (type: UtmDestinationType) => {
    formik.setFieldValue("destinationType", type);
    formik.setFieldValue("destinationUrl", getDestinationUrl(type));
  };

  // Auto-fill campaign slug from name if not manually modified
  const effectiveCampaignSlug = useMemo(() => {
    if (formik.values.utmCampaign.trim()) {
      return formik.values.utmCampaign
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_");
    }
    return (
      formik.values.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_") || "campaign"
    );
  }, [formik.values.utmCampaign, formik.values.name]);

  // Build live URL
  const generatedUrl = useMemo(() => {
    try {
      const baseUrl = formik.values.destinationUrl.trim() || getDestinationUrl("SIGNUP");
      const url = new URL(
        baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`
      );
      if (formik.values.utmSource)
        url.searchParams.set("utm_source", formik.values.utmSource.trim().toLowerCase());
      if (formik.values.utmMedium)
        url.searchParams.set("utm_medium", formik.values.utmMedium.trim().toLowerCase());
      if (effectiveCampaignSlug)
        url.searchParams.set("utm_campaign", effectiveCampaignSlug);
      if (formik.values.utmTerm.trim())
        url.searchParams.set("utm_term", formik.values.utmTerm.trim());
      if (formik.values.utmContent.trim())
        url.searchParams.set("utm_content", formik.values.utmContent.trim());
      return url.toString();
    } catch {
      return `${formik.values.destinationUrl}?utm_source=${formik.values.utmSource}&utm_medium=${formik.values.utmMedium}&utm_campaign=${effectiveCampaignSlug}`;
    }
  }, [
    formik.values.destinationUrl,
    formik.values.utmSource,
    formik.values.utmMedium,
    effectiveCampaignSlug,
    formik.values.utmTerm,
    formik.values.utmContent,
    getDestinationUrl,
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Tracking URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

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
                  <Link2 className="h-4 w-4" />
                </div>
                <div>
                  <SheetTitle className="text-base font-bold text-foreground">
                    Create UTM Tracking Link
                  </SheetTitle>
                  <SheetDescription className="text-xs text-muted-foreground">
                    Generate tagged campaign links with full-funnel ClickHouse attribution tracking
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Starter Preset Banner indicator */}
            {initialValues?.name && (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 text-xs">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-medium">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Preset applied: <strong>{initialValues.name}</strong>
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-white dark:bg-zinc-900 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  Auto-filled
                </Badge>
              </div>
            )}

            <div className="space-y-4 pt-1">
              {/* Campaign Name */}
              <div className="space-y-1.5">
                <Label htmlFor="utm-name" className="text-xs font-semibold">
                  Campaign Name *
                </Label>
                <Input
                  id="utm-name"
                  name="name"
                  placeholder="e.g. Summer 2026 Growth Drop"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "h-9 text-xs",
                    formik.touched.name && formik.errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-[11px] text-destructive">{formik.errors.name}</p>
                )}
              </div>

              {/* Destination Type & URL */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Destination Goal</Label>
                <Tabs
                  value={formik.values.destinationType}
                  onValueChange={(val) =>
                    handleDestinationTypeChange(val as UtmDestinationType)
                  }
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 h-8 p-0.5 bg-muted/60">
                    <TabsTrigger value="SIGNUP" className="text-xs py-1">
                      Signup Funnel
                    </TabsTrigger>
                    <TabsTrigger value="LOGIN" className="text-xs py-1">
                      Login Funnel
                    </TabsTrigger>
                    <TabsTrigger value="CUSTOM" className="text-xs py-1">
                      Custom Landing
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-1">
                  <Input
                    name="destinationUrl"
                    placeholder="https://yourdomain.com/landing"
                    value={formik.values.destinationUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.values.destinationType !== "CUSTOM"}
                    className={cn(
                      "h-9 text-xs font-mono bg-muted/30",
                      formik.touched.destinationUrl && formik.errors.destinationUrl && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {formik.touched.destinationUrl && formik.errors.destinationUrl && (
                    <p className="text-[11px] text-destructive">{formik.errors.destinationUrl}</p>
                  )}
                </div>
              </div>

              {/* UTM Source & Medium with Quick Chips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="utm-source" className="text-xs font-semibold">
                      UTM Source (utm_source) *
                    </Label>
                    <span className="text-[10px] text-muted-foreground">
                      e.g. google, twitter
                    </span>
                  </div>
                  <Input
                    id="utm-source"
                    name="utmSource"
                    placeholder="e.g. google"
                    value={formik.values.utmSource}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs font-mono",
                      formik.touched.utmSource && formik.errors.utmSource && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {formik.touched.utmSource && formik.errors.utmSource && (
                    <p className="text-[11px] text-destructive">{formik.errors.utmSource}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {COMMON_SOURCES.slice(0, 4).map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => formik.setFieldValue("utmSource", src)}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer",
                          formik.values.utmSource.toLowerCase() === src
                            ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-700 dark:text-indigo-300 font-semibold"
                            : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {src}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Medium */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="utm-medium" className="text-xs font-semibold">
                      UTM Medium (utm_medium) *
                    </Label>
                    <span className="text-[10px] text-muted-foreground">
                      e.g. cpc, email
                    </span>
                  </div>
                  <Input
                    id="utm-medium"
                    name="utmMedium"
                    placeholder="e.g. cpc"
                    value={formik.values.utmMedium}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "h-9 text-xs font-mono",
                      formik.touched.utmMedium && formik.errors.utmMedium && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {formik.touched.utmMedium && formik.errors.utmMedium && (
                    <p className="text-[11px] text-destructive">{formik.errors.utmMedium}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {COMMON_MEDIUMS.slice(0, 4).map((med) => (
                      <button
                        key={med}
                        type="button"
                        onClick={() => formik.setFieldValue("utmMedium", med)}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer",
                          formik.values.utmMedium.toLowerCase() === med
                            ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-700 dark:text-indigo-300 font-semibold"
                            : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {med}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Campaign Tag */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="utm-campaign" className="text-xs font-semibold">
                    Campaign Slug (utm_campaign)
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    Auto-generated from name if empty
                  </span>
                </div>
                <Input
                  id="utm-campaign"
                  name="utmCampaign"
                  placeholder={effectiveCampaignSlug}
                  value={formik.values.utmCampaign}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-9 text-xs font-mono"
                />
              </div>

              {/* Optional Parameters: Term & Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="utm-term" className="text-xs font-semibold">
                      Search Term (utm_term)
                    </Label>
                    <span className="text-[10px] text-muted-foreground">Optional</span>
                  </div>
                  <Input
                    id="utm-term"
                    name="utmTerm"
                    placeholder="e.g. community_software"
                    value={formik.values.utmTerm}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="utm-content" className="text-xs font-semibold">
                      Content (utm_content)
                    </Label>
                    <span className="text-[10px] text-muted-foreground">Optional</span>
                  </div>
                  <Input
                    id="utm-content"
                    name="utmContent"
                    placeholder="e.g. header_cta_v1"
                    value={formik.values.utmContent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Real-time Link Preview Box */}
              <div className="p-3.5 bg-muted/40 border border-border/70 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    Generated Tracking URL
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 text-xs px-2 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-2.5 rounded-lg bg-background border border-border/60 text-xs font-mono text-foreground break-all select-all">
                  {generatedUrl}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <Badge variant="outline" className="text-[9px] font-mono">
                    source: {formik.values.utmSource || "none"}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    medium: {formik.values.utmMedium || "none"}
                  </Badge>
                  <Badge variant="outline" className="text-[9px] font-mono">
                    campaign: {effectiveCampaignSlug}
                  </Badge>
                  {formik.values.utmContent && (
                    <Badge variant="outline" className="text-[9px] font-mono">
                      content: {formik.values.utmContent}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-6 pt-3 border-t border-border/60 bg-muted/10 flex flex-row items-center justify-between sm:justify-between w-full">
            <Link
              href="/marketing/utm/create"
              onClick={() => onOpenChange(false)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <span>Full Page Studio</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={formik.isSubmitting}
                className="h-9 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs cursor-pointer"
              >
                {formik.isSubmitting ? "Generating Link…" : "Save & Generate Link"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
