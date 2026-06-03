"use client";

import React from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Info, Megaphone, ChevronRight } from "lucide-react";
import { AnnouncementPreview } from "./announcement-preview";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function AnnouncementCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: any) {
  const schema = Yup.object({
    subject: Yup.string().required("Subject is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      subject: initialValues?.subject || "",
      description: initialValues?.description || "",
      category: initialValues?.category || "ANNOUNCEMENT",
      isActive: initialValues?.isActive ?? true,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <FormikProvider value={formik}>
      <>
        <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
          {/* Header section - Sticky */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Megaphone className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {initialValues?.subject ? "Edit Announcement" : "Create Announcement"}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
                  <span>Trust Center</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>Announcements</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>{initialValues?.subject ? "Edit" : "Create New"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">
                          Announcement Details
                        </CardTitle>
                        <CardDescription>
                          Configure the content and category of your announcement.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        {/* Subject Field */}
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-sm font-medium">
                            Subject <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="Enter announcement subject"
                            value={formik.values.subject}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={cn(
                              formik.touched.subject && formik.errors.subject ? "border-destructive" : ""
                            )}
                          />
                          {formik.touched.subject && formik.errors.subject && (
                            <p className="text-xs text-destructive">
                              {formik.errors.subject as string}
                            </p>
                          )}
                        </div>

                        {/* Category Field */}
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-medium">
                            Category <span className="text-destructive">*</span>
                          </Label>
                          <select
                            id="category"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={cn(
                              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                              formik.touched.category && formik.errors.category ? "border-destructive" : ""
                            )}
                          >
                            <option value="ANNOUNCEMENT">Announcement</option>
                            <option value="POLICY_UPDATES">Policy Updates</option>
                            <option value="SECURITY_NOTICES">Security Notices</option>
                          </select>
                          {formik.touched.category && formik.errors.category && (
                            <p className="text-xs text-destructive">
                              {formik.errors.category as string}
                            </p>
                          )}
                        </div>

                        {/* Active Status Field */}
                        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <Label className="text-base">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                              Draft announcements will not be visible to users.
                            </p>
                          </div>
                          <Switch
                            checked={formik.values.isActive}
                            onCheckedChange={(checked) => formik.setFieldValue("isActive", checked)}
                          />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-sm font-medium">
                            Description <span className="text-destructive">*</span>
                          </Label>
                          <div className={cn(
                            formik.touched.description && formik.errors.description ? "ring-1 ring-destructive rounded-md" : ""
                          )}>
                            <RichTextEditor
                              value={formik.values.description}
                              onChange={(val) => formik.setFieldValue("description", val)}
                              placeholder="Enter announcement description..."
                              minHeight="200px"
                            />
                          </div>
                          {formik.touched.description && formik.errors.description && (
                            <p className="text-xs text-destructive">
                              {formik.errors.description as string}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                </div>

                {/* Live Preview Sidebar */}
                <div className="lg:col-span-5">
                  <div className="sticky top-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Live Preview</h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/5 text-green-600 border-green-500/20"
                      >
                        Preview
                      </Badge>
                    </div>

                    <AnnouncementPreview formData={formik.values} />

                    <Card className="border-none shadow-sm ring-1 ring-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Info className="h-5 w-5" />
                          Tips for Success
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 text-sm">
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>Keep the subject clear and concise.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>Use formatting to make the description readable.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>Select the most appropriate category for better reach.</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <FloatingSavePanel
          hasChanged={!initialValues?.subject || formik.dirty}
          saved={false}
          isSaving={loading}
          onSave={handleSubmit}
          onReset={() => {
            formik.resetForm();
            if (onCancel) onCancel();
            else window.history.back();
          }}
          title="Unsaved Announcement"
          description="You have unsaved changes."
          buttonText={initialValues?.subject ? "Save Changes" : "Create Announcement"}
        />
      </>
    </FormikProvider>
  );
}
