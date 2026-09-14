"use client";

import React from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  MessageSquare,
  Sparkles,
  ShieldCheck,
  FolderTree,
  HelpCircle,
  Eye,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisTipCard,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ForumPreview } from "./forum-preview";
import { getDiscussionForumCategory } from "@/graphql/actions/discussion-form";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

interface ForumCreationFormProps {
  initialValues?: Record<string, any>;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
}

const forumSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title cannot exceed 120 characters"),
  category: Yup.string().required("Please select a discussion category"),
  content: Yup.string()
    .required("Discussion content is required")
    .min(20, "Content must be at least 20 characters")
    .max(2500, "Content cannot exceed 2500 characters"),
  isAnonymous: Yup.boolean().default(false),
});

export function ForumCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: ForumCreationFormProps) {
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const { data: categoriesData, loading: categoriesLoading } =
    getDiscussionForumCategory({
      variables: {
        input: {
          status: "ACTIVE",
        },
      },
    });

  const categories = categoriesData?.getDiscussionForumCategory || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: initialValues?.title || "",
      category: initialValues?.category || "",
      content: initialValues?.content || "",
      isAnonymous: initialValues?.isAnonymous || false,
    },
    validationSchema: forumSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const selectedCategory = categories.find(
    (c: any) => c.id === formik.values.category,
  );

  const handleSubmit = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched(
        Object.keys(errors).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {},
        ),
      );
      const firstKey = Object.keys(errors)[0];
      const firstError = (errors as any)[firstKey];
      toast.error(
        typeof firstError === "string"
          ? firstError
          : `Please fill in the required fields (${firstKey})`,
      );
      const el =
        document.getElementById(firstKey) ||
        document.querySelector(`[name="${firstKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    formik.handleSubmit();
  };

  const err = (field: string) => {
    const isTouched = Boolean((formik.touched as any)[field]);
    const errorMsg = (formik.errors as any)[field];
    if (isTouched && errorMsg) {
      return (
        <p className="text-[12px] text-[#d72c0d] font-normal mt-0.5 leading-[16px]">
          {String(errorMsg)}
        </p>
      );
    }
    return null;
  };

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-3.5">
            {/* Live Preview Sidebar Card */}
            <PolarisSidebarCard
              title={`${singularName} Preview`}
              badge="Live Simulation"
              icon={Eye}
            >
              <ForumPreview
                formData={formik.values}
                categories={categories}
                singularName={singularName}
              />
            </PolarisSidebarCard>

            {/* Selected Category Details */}
            {selectedCategory && (
              <PolarisSidebarCard
                title="Channel Details"
                badge="Active"
                icon={FolderTree}
              >
                <div className="space-y-1.5 text-[11.5px]">
                  <PolarisSummaryRow
                    label="Category"
                    value={selectedCategory.name}
                  />
                  {selectedCategory.description && (
                    <div className="pt-1 text-[#616161] dark:text-zinc-400 leading-relaxed text-[11px]">
                      {selectedCategory.description}
                    </div>
                  )}
                </div>
              </PolarisSidebarCard>
            )}

            {/* Engagement Tips */}
            <PolarisTipCard
              title="Spark Great Conversations"
              icon={Sparkles}
              tips={[
                "Ask open-ended questions that invite diverse perspectives.",
                "Provide brief context or background so readers can engage quickly.",
                "Choose the most relevant channel to reach the right audience.",
                "Follow community etiquette and guidelines.",
              ]}
            />
          </div>
        }
      >
        {/* Discussion Details Card */}
        <PolarisFormCard
          title={`${singularName} Details`}
          description={`Provide a concise subject and detailed content for your new ${singularName.toLowerCase()}.`}
          icon={MessageSquare}
        >
          {/* Title Input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <PolarisLabel required>{singularName} Title</PolarisLabel>
              <span
                className={cn(
                  "text-[10px] font-mono",
                  formik.values.title.length > 110
                    ? "text-[#d72c0d]"
                    : "text-[#616161] dark:text-zinc-400",
                )}
              >
                {formik.values.title.length}/120
              </span>
            </div>
            <PolarisInput
              id="title"
              name="title"
              placeholder="e.g., What are your favorite tools and strategies for scaling customer feedback?"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              hasError={Boolean(formik.touched.title && formik.errors.title)}
            />
            {err("title")}
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <PolarisLabel required>Category / Topic Channel</PolarisLabel>
              {categories.length > 0 && (
                <span className="text-[10.5px] text-[#616161] dark:text-zinc-400">
                  {categories.length} channels available
                </span>
              )}
            </div>
            <Select
              value={formik.values.category}
              onValueChange={(val) => formik.setFieldValue("category", val)}
            >
              <SelectTrigger
                id="category"
                className={cn(
                  "h-9 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[12.5px] font-medium text-[#303030] dark:text-zinc-100 shadow-2xs focus:ring-1 focus:ring-ring",
                  formik.touched.category &&
                    formik.errors.category &&
                    "border-[#d72c0d] dark:border-[#d72c0d]",
                )}
              >
                <SelectValue
                  placeholder={
                    categoriesLoading
                      ? "Loading channels…"
                      : "Select a channel for this discussion"
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-[#d2d5d9] dark:border-zinc-800 shadow-md p-1 min-w-[200px]">
                {categories.map((cat: any) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className="rounded-sm text-xs font-medium py-1.5 px-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FolderTree className="h-3.5 w-3.5 text-[#616161] shrink-0" />
                      <span>{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {err("category")}
          </div>

          {/* Content Textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <PolarisLabel required>Discussion Body & Context</PolarisLabel>
              <span
                className={cn(
                  "text-[10px] font-mono",
                  formik.values.content.length > 2400
                    ? "text-[#d72c0d]"
                    : "text-[#616161] dark:text-zinc-400",
                )}
              >
                {formik.values.content.length}/2500
              </span>
            </div>
            <PolarisTextarea
              id="content"
              name="content"
              rows={8}
              placeholder={`Share background, thoughts, context, or specific questions to start a productive dialogue in ${moduleName.toLowerCase()}…`}
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              hasError={Boolean(formik.touched.content && formik.errors.content)}
            />
            {err("content")}
            <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-1">
              Supports multiline text and clear formatting. Minimum 20
              characters required.
            </p>
          </div>
        </PolarisFormCard>

        {/* Posting & Privacy Preferences Card */}
        <PolarisFormCard
          title="Privacy & Publishing Options"
          description="Control how your identity and attribution are displayed across the community."
          icon={ShieldCheck}
        >
          <div className="flex items-start justify-between gap-4 p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <PolarisLabel className="cursor-pointer">
                  Post Anonymously
                </PolarisLabel>
                <Badge
                  variant="outline"
                  className="bg-white dark:bg-zinc-800 text-[#616161] dark:text-zinc-300 border-[#d2d5d9] dark:border-zinc-700 text-[10px] font-medium px-1.5 py-0 rounded-[3px]"
                >
                  Optional
                </Badge>
              </div>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-relaxed">
                When enabled, your name and avatar are masked from fellow
                community members. Platform administrators will still retain
                moderation visibility.
              </p>
            </div>
            <Switch
              id="isAnonymous"
              checked={formik.values.isAnonymous}
              onCheckedChange={(checked) =>
                formik.setFieldValue("isAnonymous", checked)
              }
              className="mt-0.5 shrink-0"
            />
          </div>
        </PolarisFormCard>

        {/* Bottom Floating Save / Discard Bar */}
        <FloatingSavePanel
          hasChanged={formik.dirty}
          saved={false}
          isSaving={loading}
          onSave={handleSubmit}
          onReset={() => {
            formik.resetForm();
            if (onCancel) onCancel();
          }}
          title={`Unsaved ${singularName}`}
          saveButtonText={`Post ${singularName}`}
          discardButtonText="Cancel"
        />
      </PolarisFormLayout>
    </FormikProvider>
  );
}
