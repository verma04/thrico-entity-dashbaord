"use client";

import { useState, useEffect } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  Lock,
  X,
  Save,
  Eye,
  Settings2,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { discussionCategory } from "../ts-types";
import { useModuleStore } from "@/store/useModuleStore";

const postSchema = Yup.object().shape({
  title: Yup.string()
    .required("Please enter a title for your post")
    .max(100, "Title must be 100 characters or less"),
  content: Yup.string()
    .required("Please enter content for your post")
    .max(500, "Content must be 500 characters or less"),
  category: Yup.string().required("Please select a category"),
  isAnonymous: Yup.boolean(),
});

interface ForumEditFormProps {
  initialValues: {
    title: string;
    content: string;
    category: string;
    isAnonymous: boolean;
  };
  categories: discussionCategory[];
  categoriesLoading: boolean;
  loading: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export function ForumEditForm({
  initialValues,
  categories,
  categoriesLoading,
  loading,
  onSubmit,
  onCancel,
}: ForumEditFormProps) {
  const singularName = useModuleStore((state) => state.forumSingularName);
  const [activeTab, setActiveTab] = useState("edit");

  const formik = useFormik({
    initialValues,
    validationSchema: postSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  const hasChanges = formik.dirty;
  const canSubmit = formik.isValid && hasChanges && !loading;

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col h-full bg-background overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Edit {singularName} Post</h2>
            {hasChanges && (
              <Badge variant="secondary" className="animate-pulse">
                Unsaved Changes
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Update your {singularName.toLowerCase()} content and customize visibility settings
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-6 pt-4 border-b bg-background">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="edit" className="gap-2">
                <Settings2 className="h-4 w-4" />
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <TabsContent value="edit" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>
                    Update the title and content of your {singularName.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Updated community engagement tips"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="text-lg font-semibold"
                    />
                    <div className="flex justify-between items-center">
                      {formik.touched.title && formik.errors.title ? (
                        <p className="text-xs text-destructive">
                          {formik.errors.title}
                        </p>
                      ) : (
                        <div />
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formik.values.title.length}/100 characters
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">
                      Content <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      rows={6}
                      placeholder="Share your updated thoughts..."
                      value={formik.values.content}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="resize-none"
                    />
                    <div className="flex justify-between items-center">
                      {formik.touched.content && formik.errors.content ? (
                        <p className="text-xs text-destructive">
                          {formik.errors.content}
                        </p>
                      ) : (
                        <div />
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formik.values.content.length}/500 characters
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Classification</CardTitle>
                  <CardDescription>
                    Organize your {singularName.toLowerCase()} into the most relevant category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formik.values.category}
                      onValueChange={(v) => formik.setFieldValue("category", v)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            Loading categories...
                          </div>
                        ) : (
                          categories.map((cat: discussionCategory) => (
                            <SelectItem key={cat.id} value={cat.id || ""}>
                              {cat.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <p className="text-xs text-destructive">
                        {formik.errors.category}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-muted">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <Label htmlFor="isAnonymous" className="font-medium">
                          Post Anonymously
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Your identity remains hidden from other community
                          members
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="isAnonymous"
                      checked={formik.values.isAnonymous}
                      onCheckedChange={(v) =>
                        formik.setFieldValue("isAnonymous", v)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <Card className="overflow-hidden border-2 border-primary/10">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex items-center gap-2 text-primary">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      Live Preview
                    </span>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {categories.find((c) => c.id === formik.values.category)
                          ?.name || "Uncategorized"}
                      </Badge>
                      {formik.values.isAnonymous && (
                        <Badge variant="outline" className="gap-1">
                          <Lock className="h-3 w-3" />
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold leading-tight">
                      {formik.values.title || "Untitled Post"}
                    </h3>
                    <div className="text-lg text-muted-foreground whitespace-pre-wrap">
                      {formik.values.content ||
                        `Your ${singularName.toLowerCase()} content preview will show up here...`}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground text-center">
                  Review your changes. This is how the updated {singularName.toLowerCase()} will appear
                  to the community.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Separator />

        <div className="px-6 py-4 bg-muted/30 flex items-center justify-between w-full">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => formik.resetForm()}
              disabled={!formik.dirty || loading}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Changes
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="gap-2 px-6"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </FormikProvider>
  );
}
