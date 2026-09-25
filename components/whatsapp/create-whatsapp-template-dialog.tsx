"use client";

import React, { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppTemplatePreview } from "./whatsapp-template-preview";
import { useCreateInAppWhatsAppTemplate } from "@/graphql/actions";
import { toast } from "sonner";
import { Plus, Loader2, Sparkles, X } from "lucide-react";
import type { WhatsAppTemplateComponent } from "./types";

export interface WhatsAppTemplateFormValues {
  name: string;
  category: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  language: string;
  headerText: string;
  bodyText: string;
  footerText: string;
  buttonType: "NONE" | "URL" | "QUICK_REPLY";
  buttonText: string;
  buttonUrl: string;
}

export interface CreateWhatsAppTemplateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialValues?: {
    name?: string;
    category?: "UTILITY" | "MARKETING" | "AUTHENTICATION";
    language?: string;
    headerText?: string;
    bodyText?: string;
    footerText?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
}

export type CreateWhatsAppTemplateDialogProps = CreateWhatsAppTemplateDrawerProps;

const whatsappTemplateValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Template name is required")
    .matches(
      /^[a-z0-9_]+$/,
      "Template name can only contain lowercase letters, numbers, and underscores"
    )
    .max(512, "Template name cannot exceed 512 characters"),
  category: Yup.string()
    .oneOf(["UTILITY", "MARKETING", "AUTHENTICATION"], "Invalid category")
    .required("Category is required"),
  language: Yup.string().required("Language is required"),
  headerText: Yup.string()
    .trim()
    .max(60, "Header text cannot exceed 60 characters"),
  bodyText: Yup.string()
    .trim()
    .required("Body text is required")
    .max(1024, "Body text cannot exceed 1024 characters"),
  footerText: Yup.string()
    .trim()
    .max(60, "Footer text cannot exceed 60 characters"),
  buttonType: Yup.string().oneOf(["NONE", "URL", "QUICK_REPLY"]),
  buttonText: Yup.string()
    .trim()
    .when("buttonType", {
      is: (val: string) => val === "URL" || val === "QUICK_REPLY",
      then: (schema) =>
        schema
          .required("Button label is required")
          .max(25, "Button label cannot exceed 25 characters"),
      otherwise: (schema) => schema.optional(),
    }),
  buttonUrl: Yup.string()
    .trim()
    .when("buttonType", {
      is: "URL",
      then: (schema) =>
        schema
          .required("Button URL is required")
          .url("Enter a valid URL (e.g. https://example.com)"),
      otherwise: (schema) => schema.optional(),
    }),
});

export function CreateWhatsAppTemplateDrawer({
  open,
  onOpenChange,
  onSuccess,
  initialValues,
}: CreateWhatsAppTemplateDrawerProps) {
  const [createTemplate, { loading }] = useCreateInAppWhatsAppTemplate();

  const formik = useFormik<WhatsAppTemplateFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: initialValues?.name || "",
      category: initialValues?.category || "UTILITY",
      language: initialValues?.language || "en_US",
      headerText: initialValues?.headerText || "",
      bodyText: initialValues?.bodyText || "",
      footerText: initialValues?.footerText || "",
      buttonType: initialValues?.buttonText
        ? initialValues?.buttonUrl
          ? "URL"
          : "QUICK_REPLY"
        : "NONE",
      buttonText: initialValues?.buttonText || "",
      buttonUrl: initialValues?.buttonUrl || "",
    },
    validationSchema: whatsappTemplateValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const comps: WhatsAppTemplateComponent[] = [];
        if (values.headerText.trim()) {
          comps.push({
            type: "HEADER",
            format: "TEXT",
            text: values.headerText.trim(),
          });
        }
        if (values.bodyText.trim()) {
          comps.push({
            type: "BODY",
            text: values.bodyText.trim(),
          });
        }
        if (values.footerText.trim()) {
          comps.push({
            type: "FOOTER",
            text: values.footerText.trim(),
          });
        }
        if (values.buttonType !== "NONE" && values.buttonText.trim()) {
          comps.push({
            type: "BUTTONS",
            buttons: [
              values.buttonType === "URL" && values.buttonUrl.trim()
                ? {
                    type: "URL",
                    text: values.buttonText.trim(),
                    url: values.buttonUrl.trim(),
                  }
                : {
                    type: "QUICK_REPLY",
                    text: values.buttonText.trim(),
                  },
            ],
          });
        }

        await createTemplate({
          variables: {
            input: {
              name: values.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_"),
              category: values.category,
              language: values.language,
              components: comps,
            },
          },
        });

        toast.success("Template submitted for Meta review!");
        resetForm();
        onOpenChange(false);
        onSuccess?.();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to create template";
        toast.error(msg);
      }
    },
  });

  // Dynamically compute preview components from Formik values in real-time
  const previewComponents: WhatsAppTemplateComponent[] = useMemo(() => {
    const comps: WhatsAppTemplateComponent[] = [];
    if (formik.values.headerText.trim()) {
      comps.push({
        type: "HEADER",
        format: "TEXT",
        text: formik.values.headerText.trim(),
      });
    }
    if (formik.values.bodyText.trim()) {
      comps.push({
        type: "BODY",
        text: formik.values.bodyText.trim(),
      });
    }
    if (formik.values.footerText.trim()) {
      comps.push({
        type: "FOOTER",
        text: formik.values.footerText.trim(),
      });
    }
    if (formik.values.buttonType !== "NONE" && formik.values.buttonText.trim()) {
      comps.push({
        type: "BUTTONS",
        buttons: [
          formik.values.buttonType === "URL" && formik.values.buttonUrl.trim()
            ? {
                type: "URL",
                text: formik.values.buttonText.trim(),
                url: formik.values.buttonUrl.trim(),
              }
            : {
                type: "QUICK_REPLY",
                text: formik.values.buttonText.trim(),
              },
        ],
      });
    }
    return comps;
  }, [
    formik.values.headerText,
    formik.values.bodyText,
    formik.values.footerText,
    formik.values.buttonType,
    formik.values.buttonText,
    formik.values.buttonUrl,
  ]);

  const insertVariable = (variableToken: string) => {
    const current = formik.values.bodyText;
    formik.setFieldValue("bodyText", current ? `${current} ${variableToken}` : variableToken);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[880px] sm:max-w-[880px] p-0 flex flex-col h-full bg-white dark:bg-zinc-900 border-l border-[#d2d5d9] dark:border-zinc-800 z-[150] shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between shrink-0 bg-muted/10">
          <SheetHeader className="p-0 text-left space-y-1">
            <SheetTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
              <Plus className="w-4 h-4 text-[#25D366]" />
              New WhatsApp Message Template
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              Configure template components and submit to Meta Graph API for review and approval.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Drawer Scrollable Body: 2-column layout */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Formik Form (7 cols) */}
            <div className="lg:col-span-7">
              <form id="whatsapp-template-form" onSubmit={formik.handleSubmit} className="space-y-4 text-xs">
                {/* Template Name */}
                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Template Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="name"
                    placeholder="e.g. member_welcome_alert"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-8 text-xs font-mono rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className="text-[11px] text-red-500">{formik.errors.name}</p>
                  ) : (
                    <span className="text-[10px] text-muted-foreground block">
                      Lowercase letters, numbers, and underscores only.
                    </span>
                  )}
                </div>

                {/* Category & Language */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Category</Label>
                    <Select
                      value={formik.values.category}
                      onValueChange={(val) => formik.setFieldValue("category", val)}
                    >
                      <SelectTrigger className="h-8 text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTILITY">Utility</SelectItem>
                        <SelectItem value="MARKETING">Marketing</SelectItem>
                        <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <p className="text-[11px] text-red-500">{formik.errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Language</Label>
                    <Select
                      value={formik.values.language}
                      onValueChange={(val) => formik.setFieldValue("language", val)}
                    >
                      <SelectTrigger className="h-8 text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en_US">English (US)</SelectItem>
                        <SelectItem value="en_GB">English (UK)</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="pt_BR">Portuguese (BR)</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.language && formik.errors.language && (
                      <p className="text-[11px] text-red-500">{formik.errors.language}</p>
                    )}
                  </div>
                </div>

                {/* Header Text */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Header (Optional)</Label>
                    <span className="text-[10px] text-muted-foreground">
                      {formik.values.headerText.length}/60
                    </span>
                  </div>
                  <Input
                    name="headerText"
                    placeholder="e.g. Important Announcement"
                    value={formik.values.headerText}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    maxLength={60}
                    className="h-8 text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs"
                  />
                  {formik.touched.headerText && formik.errors.headerText && (
                    <p className="text-[11px] text-red-500">{formik.errors.headerText}</p>
                  )}
                </div>

                {/* Body Text */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">
                      Body Text <span className="text-red-500">*</span>
                    </Label>
                    <span className="text-[10px] text-muted-foreground">
                      {formik.values.bodyText.length}/1024
                    </span>
                  </div>
                  <Textarea
                    name="bodyText"
                    placeholder="Hi {{1}}, your event starts at {{2}}..."
                    value={formik.values.bodyText}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    maxLength={1024}
                    className="text-xs min-h-[110px] rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs resize-none"
                  />
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">Insert:</span>
                      <button
                        type="button"
                        onClick={() => insertVariable("{{1}}")}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground font-mono transition cursor-pointer"
                      >
                        {"{{1}}"}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertVariable("{{2}}")}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground font-mono transition cursor-pointer"
                      >
                        {"{{2}}"}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertVariable("{{3}}")}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-foreground font-mono transition cursor-pointer"
                      >
                        {"{{3}}"}
                      </button>
                    </div>
                  </div>
                  {formik.touched.bodyText && formik.errors.bodyText && (
                    <p className="text-[11px] text-red-500">{formik.errors.bodyText}</p>
                  )}
                </div>

                {/* Footer Text */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Footer (Optional)</Label>
                    <span className="text-[10px] text-muted-foreground">
                      {formik.values.footerText.length}/60
                    </span>
                  </div>
                  <Input
                    name="footerText"
                    placeholder="Reply STOP to unsubscribe"
                    value={formik.values.footerText}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    maxLength={60}
                    className="h-8 text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs"
                  />
                  {formik.touched.footerText && formik.errors.footerText && (
                    <p className="text-[11px] text-red-500">{formik.errors.footerText}</p>
                  )}
                </div>

                {/* Buttons Configuration */}
                <div className="space-y-2.5 p-3 rounded-[6px] bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Interactive Button</Label>
                    <Select
                      value={formik.values.buttonType}
                      onValueChange={(val) => {
                        formik.setFieldValue("buttonType", val);
                        if (val === "NONE") {
                          formik.setFieldValue("buttonText", "");
                          formik.setFieldValue("buttonUrl", "");
                        }
                      }}
                    >
                      <SelectTrigger className="h-7 w-36 text-[11px] rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE" className="text-xs">No Button</SelectItem>
                        <SelectItem value="QUICK_REPLY" className="text-xs">Quick Reply</SelectItem>
                        <SelectItem value="URL" className="text-xs">Call To Action (URL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formik.values.buttonType !== "NONE" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-medium">
                          Button Label <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          name="buttonText"
                          placeholder="e.g. View Details"
                          value={formik.values.buttonText}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          maxLength={25}
                          className="h-8 text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs"
                        />
                        {formik.touched.buttonText && formik.errors.buttonText && (
                          <p className="text-[11px] text-red-500">{formik.errors.buttonText}</p>
                        )}
                      </div>

                      {formik.values.buttonType === "URL" && (
                        <div className="space-y-1">
                          <Label className="text-[11px] font-medium">
                            Target URL <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            name="buttonUrl"
                            placeholder="https://..."
                            value={formik.values.buttonUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="h-8 text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs"
                          />
                          {formik.touched.buttonUrl && formik.errors.buttonUrl && (
                            <p className="text-[11px] text-red-500">{formik.errors.buttonUrl}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Right: Live WhatsApp Bubble Preview (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-0 flex flex-col items-center">
              <div className="w-full flex flex-col items-center p-4 bg-muted/30 rounded-xl border border-dashed border-border/80">
                <div className="flex items-center gap-1.5 mb-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-[#25D366]" />
                  <span>Live WhatsApp Preview</span>
                </div>
                <WhatsAppTemplatePreview
                  components={
                    previewComponents.length > 0
                      ? previewComponents
                      : [
                          {
                            type: "BODY",
                            text: "Start typing your template message on the left to see the live WhatsApp bubble preview...",
                          },
                        ]
                  }
                  variables={{ "1": "Alex", "2": "Friday 5:00 PM", "3": "Main Hall" }}
                />
                <span className="text-[10px] text-muted-foreground/70 mt-3 text-center">
                  Preview shows simulated variables for {"{{1}}"}, {"{{2}}"}, {"{{3}}"}.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3.5 border-t border-border/50 flex items-center justify-between shrink-0 bg-muted/10">
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Submitted templates are typically reviewed within minutes by Meta.
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="whatsapp-template-form"
              size="sm"
              disabled={loading || formik.isSubmitting}
              className="h-8 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 rounded-[4px] shadow-2xs cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Submit Template
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Backward-compatible alias
export const CreateWhatsAppTemplateDialog = CreateWhatsAppTemplateDrawer;
