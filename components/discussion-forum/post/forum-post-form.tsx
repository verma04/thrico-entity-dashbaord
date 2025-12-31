"use client";

import { useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProvider,
  useFormik,
} from "formik";
import * as Yup from "yup";
import {
  Lock,
  X,
  Send,
  Eye,
  Settings2,
  RotateCcw,
  MessageSquare,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { discussionCategory } from "../ts-types";

const postSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Max 100 characters"),
  content: Yup.string()
    .required("Content is required")
    .max(500, "Max 500 characters"),
  category: Yup.string().required("Category is required"),
  isAnonymous: Yup.boolean(),
});

interface ForumPostFormProps {
  categories: discussionCategory[];
  categoriesLoading: boolean;
  loading: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export function ForumPostForm({
  categories,
  categoriesLoading,
  loading,
  onSubmit,
  onCancel,
}: ForumPostFormProps) {
  const [activeTab, setActiveTab] = useState("edit");

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      category: "",
      isAnonymous: false,
    },
    validationSchema: postSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const canSubmit = formik.isValid && formik.dirty && !loading;

  return (
    <FormikProvider value={formik}>
      <Form
        onSubmit={formik.handleSubmit}
        className="flex flex-col h-full bg-background overflow-hidden"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-2xl">Create a Discussion Post</SheetTitle>
          <SheetDescription>
            Share your thoughts with the community and engage in discussions
          </SheetDescription>
        </SheetHeader>

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
                    Provide a clear title and detailed content for your
                    discussion
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
                      placeholder="e.g., How to improve community engagement?"
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
                      placeholder="Write your thoughts here..."
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
                    Select a category to help others find your post
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
                          Your identity will be hidden from other community
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
                      Discussion Post Preview
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
                      {formik.values.title || "Your Post Title"}
                    </h3>
                    <div className="text-lg text-muted-foreground whitespace-pre-wrap">
                      {formik.values.content ||
                        "Your post content will appear here..."}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm text-muted-foreground text-center">
                  This is how your post will look to other community members.
                  Review it carefully before publishing.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Separator />

        <SheetFooter className="px-6 py-4 bg-muted/30">
          <div className="flex items-center justify-between w-full">
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
                Reset
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit}
                className="gap-2 px-6"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </Form>
    </FormikProvider>
  );
}
