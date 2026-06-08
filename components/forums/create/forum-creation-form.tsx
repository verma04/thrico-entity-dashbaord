"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Info, ChevronRight, Hash } from "lucide-react";
import { ForumPreview } from "./forum-preview";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";

// Assuming you have a query to get categories
import { getDiscussionForumCategory } from "@/graphql/actions/discussion-form";

interface ForumCreationFormProps {
  initialValues?: Record<string, any>;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
}

const forumSchema = Yup.object().shape({
  title: Yup.string()
    .required("Discussion title is required")
    .max(100, "Max 100 characters"),
  content: Yup.string()
    .required("Discussion content is required")
    .min(20, "Content must be at least 20 characters"),
  category: Yup.string().required("Category is required"),
  isAnonymous: Yup.boolean(),
});

export function ForumCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: ForumCreationFormProps) {
  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      content: initialValues?.content || "",
      category: initialValues?.category || "",
      isAnonymous: initialValues?.isAnonymous || false,
    },
    validationSchema: forumSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const { data: categoriesData, loading: categoriesLoading } =
    getDiscussionForumCategory({
      variables: {
        input: {
          status: "ACTIVE",
        },
      },
    });

  const categories = categoriesData?.getDiscussionForumCategory || [];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
      {/* Header section - Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                {initialValues?.title ? "Edit Discussion" : "Start a Discussion"}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Forums</span>
              <ChevronRight className="h-3 w-3" />
              <span>
                {initialValues?.title ? "Edit Topic" : "Create New Topic"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <form className="space-y-8">
                {/* Basic Info */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Discussion Details</CardTitle>
                    <CardDescription>
                      Share your thoughts, ask questions, or start a conversation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Topic Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., What are the best practices for React performance?"
                        className={cn(
                          formik.touched.title &&
                            formik.errors.title &&
                            "border-destructive",
                        )}
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        maxLength={100}
                      />
                      {formik.touched.title && formik.errors.title && (
                        <p className="text-xs text-destructive">
                          {String(formik.errors.title)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          formik.setFieldValue("category", value)
                        }
                        value={formik.values.category}
                      >
                        <SelectTrigger
                          id="category"
                          className={cn(
                            formik.touched.category &&
                              formik.errors.category &&
                              "border-destructive",
                          )}
                        >
                          <SelectValue
                            placeholder={
                              categoriesLoading
                                ? "Loading categories..."
                                : "Select a category"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.category && formik.errors.category && (
                        <p className="text-xs text-destructive">
                          {String(formik.errors.category)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content" className="text-sm font-medium">
                        Content <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="content"
                        name="content"
                        placeholder="Provide more details to start the discussion..."
                        className={cn(
                          "min-h-[200px] resize-y",
                          formik.touched.content &&
                            formik.errors.content &&
                            "border-destructive",
                        )}
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.content && formik.errors.content && (
                        <p className="text-xs text-destructive">
                          {String(formik.errors.content)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Settings */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Settings</CardTitle>
                    <CardDescription>
                      Configure how you want to post this discussion
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-0.5 flex-1">
                        <Label
                          htmlFor="isAnonymous"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          Post Anonymously
                          <Badge variant="outline" className="text-[10px]">
                            Optional
                          </Badge>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Hide your identity from other members when posting this discussion. Admins can still see your identity.
                        </p>
                      </div>
                      <Switch
                        id="isAnonymous"
                        checked={formik.values.isAnonymous}
                        onCheckedChange={(checked) =>
                          formik.setFieldValue("isAnonymous", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Live Preview Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Post Preview</h3>
                  <Badge
                    variant="outline"
                    className="bg-green-500/5 text-green-600 border-green-500/20"
                  >
                    Live Preview
                  </Badge>
                </div>

                <ForumPreview formData={formik.values} categories={categories} />

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Info className="h-5 w-5 text-primary" />
                      Tips for a great post
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span className="text-muted-foreground">
                          Keep your title clear and concise
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span className="text-muted-foreground">
                          Provide enough context in the description
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span className="text-muted-foreground">
                          Choose the most relevant category
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span className="text-muted-foreground">
                          Be respectful and follow community guidelines
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={false}
        isSaving={loading}
        onSave={() => formik.handleSubmit()}
        onReset={() => {
          formik.resetForm();
          if (onCancel) onCancel();
          else window.history.back();
        }}
        title="Unsaved Discussion"
        description="You have unfilled form data."
        buttonText="Post Discussion"
      />
    </div>
  );
}
