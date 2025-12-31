"use client";

import React, { useEffect } from "react";
import { NewsArticle } from "@/types/news-types";
import { generateSlug, calculateReadTime } from "@/lib/news-utils";
import { useNewsStore } from "@/store/useNewsStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Tag,
  User,
  X,
  Plus,
  Star,
  Save,
  Send,
  Newspaper,
  ChevronRight,
  FileText,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

interface NewsEditorProps {
  article?: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (article: NewsArticle) => void;
}

// Yup validation schema
const newsArticleSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  slug: Yup.string()
    .required("Slug is required")
    .matches(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  content: Yup.string()
    .required("Content is required")
    .min(50, "Content must be at least 50 characters"),
  excerpt: Yup.string()
    .required("Excerpt is required")
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt must be less than 500 characters"),
  author: Yup.string()
    .required("Author is required")
    .min(2, "Author name must be at least 2 characters"),
  date: Yup.string().required("Date is required"),
  category: Yup.string().required("Category is required"),
  tags: Yup.array().of(Yup.string()),
  featuredImage: Yup.string().url("Must be a valid URL").nullable(),
  featured: Yup.boolean(),
});

export const NewsEditor: React.FC<NewsEditorProps> = ({
  article,
  open,
  onOpenChange,
  onSave,
}) => {
  const { addArticle, updateArticle, categories, addCategory } = useNewsStore();
  const { toast } = useToast();
  const [newCategoryInput, setNewCategoryInput] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      title: article?.title || "",
      slug: article?.slug || "",
      content: article?.content || "",
      excerpt: article?.excerpt || "",
      author: article?.author || "",
      date: article?.date || new Date().toISOString().split("T")[0],
      category: article?.category || categories[0] || "",
      tags: article?.tags || [],
      featuredImage: article?.featuredImage || "",
      featured: article?.featured || false,
    },
    validationSchema: newsArticleSchema,
    enableReinitialize: true,
    onSubmit: () => {}, // Handled in handleSave
  });

  // Auto-generate slug from title for new articles
  useEffect(() => {
    if (!article && formik.values.title) {
      formik.setFieldValue("slug", generateSlug(formik.values.title));
    }
  }, [formik.values.title, article]);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !formik.values.tags.includes(tag.trim())) {
      formik.setFieldValue("tags", [...formik.values.tags, tag.trim()]);
    }
  };

  const handleRemoveTag = (index: number) => {
    formik.setFieldValue(
      "tags",
      formik.values.tags.filter((_, i) => i !== index)
    );
  };

  const handleAddCategory = () => {
    if (
      newCategoryInput.trim() &&
      !categories.includes(newCategoryInput.trim())
    ) {
      addCategory(newCategoryInput.trim());
      formik.setFieldValue("category", newCategoryInput.trim());
      setNewCategoryInput("");
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    setIsSaving(true);
    // Trigger validation
    const errors = await formik.validateForm();
    formik.setTouched({
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      author: true,
      date: true,
      category: true,
    });

    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    const readTime = calculateReadTime(formik.values.content);
    const now = new Date().toISOString();

    const articleData: NewsArticle = {
      id: article?.id || `news-${Date.now()}`,
      title: formik.values.title,
      slug: formik.values.slug,
      content: formik.values.content,
      excerpt: formik.values.excerpt,
      author: formik.values.author,
      date: formik.values.date,
      category: formik.values.category,
      tags: formik.values.tags,
      status,
      featuredImage: formik.values.featuredImage || undefined,
      readTime,
      featured: formik.values.featured,
      createdAt: article?.createdAt || now,
      updatedAt: now,
    };

    if (article) {
      updateArticle(article.id, articleData);
      toast({
        title: "Article Updated",
        description: `"${formik.values.title}" has been ${
          status === "published" ? "published" : "saved as draft"
        }.`,
      });
    } else {
      addArticle(articleData);
      toast({
        title: "Article Created",
        description: `"${formik.values.title}" has been ${
          status === "published" ? "published" : "saved as draft"
        }.`,
      });
    }

    onSave?.(articleData);
    onOpenChange(false);
    formik.resetForm();
    setIsSaving(false);
  };

  const handleClose = () => {
    if (formik.dirty) {
      if (
        confirm(
          "You have unsaved changes. Are you sure you want to close without saving?"
        )
      ) {
        formik.resetForm();
        onOpenChange(false);
      }
    } else {
      formik.resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="bottom"
        className="h-screen p-0 border-none flex flex-col"
      >
        <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
          {/* Header section - Sticky */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Newspaper className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {article ? "Edit Article" : "Create New Article"}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
                  <span>News</span>
                  <ChevronRight className="h-3 w-3" />
                  <span>{article ? "Edit" : "Create New"}</span>
                </div>
              </div>
              <div className="hidden sm:flex gap-3">
                <Button
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSave("draft")}
                  disabled={!formik.isValid || isSaving}
                  className="shadow-sm"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Draft
                    </div>
                  )}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSave("published")}
                  disabled={!formik.isValid || isSaving}
                  className="shadow-sm border-primary/20"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Publishing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Publish
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  <form className="space-y-8">
                    {/* Title & Slug */}
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">
                          Article Details
                        </CardTitle>
                        <CardDescription>
                          Title and URL slug for your article
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="title"
                            className="text-sm font-medium"
                          >
                            Title <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter article title"
                            className={cn(
                              "text-lg font-semibold",
                              formik.touched.title &&
                                formik.errors.title &&
                                "border-destructive"
                            )}
                          />
                          {formik.touched.title && formik.errors.title && (
                            <p className="text-xs text-destructive">
                              {formik.errors.title}
                            </p>
                          )}
                          <p className="text-[11px] text-muted-foreground text-right italic">
                            {formik.values.title.length}/200 characters
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="slug" className="text-sm font-medium">
                            Slug (URL){" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="slug"
                            name="slug"
                            value={formik.values.slug}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="article-url-slug"
                            className={cn(
                              formik.touched.slug &&
                                formik.errors.slug &&
                                "border-destructive"
                            )}
                          />
                          {formik.touched.slug && formik.errors.slug && (
                            <p className="text-xs text-destructive">
                              {formik.errors.slug}
                            </p>
                          )}
                          <p className="text-[11px] text-muted-foreground italic">
                            URL-friendly version (lowercase, hyphens only)
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Featured Image */}
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">
                          Featured Image
                        </CardTitle>
                        <CardDescription>
                          Upload a cover image for your article (1200x630px
                          recommended)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ImageUploadWithCrop
                          label=""
                          currentImage={formik.values.featuredImage}
                          onImageUpdate={(url) =>
                            formik.setFieldValue("featuredImage", url)
                          }
                          recommendedWidth={1200}
                          recommendedHeight={630}
                          aspectRatio={1200 / 630}
                          maxFileSize={5}
                          showDimensions={true}
                        />
                      </CardContent>
                    </Card>

                    {/* Excerpt */}
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">Excerpt</CardTitle>
                        <CardDescription>
                          Brief summary that appears in article listings
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-2">
                        <Textarea
                          id="excerpt"
                          name="excerpt"
                          value={formik.values.excerpt}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Brief description of the article..."
                          rows={3}
                          className={cn(
                            "resize-none",
                            formik.touched.excerpt &&
                              formik.errors.excerpt &&
                              "border-destructive"
                          )}
                        />
                        {formik.touched.excerpt && formik.errors.excerpt && (
                          <p className="text-xs text-destructive">
                            {formik.errors.excerpt}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground text-right italic">
                          {formik.values.excerpt.length}/500 characters
                        </p>
                      </CardContent>
                    </Card>

                    {/* Content */}
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">
                          Article Content
                        </CardTitle>
                        <CardDescription>
                          Write your full article content here
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-2">
                        <RichTextEditor
                          value={formik.values.content}
                          onChange={(value) =>
                            formik.setFieldValue("content", value)
                          }
                          placeholder="Write your article content here..."
                          minHeight="400px"
                        />
                        {formik.touched.content && formik.errors.content && (
                          <p className="text-xs text-destructive">
                            {formik.errors.content}
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl">Metadata</CardTitle>
                        <CardDescription>
                          Author, date, category, and tags
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="author"
                              className="text-sm font-medium"
                            >
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Author{" "}
                                <span className="text-destructive">*</span>
                              </div>
                            </Label>
                            <Input
                              id="author"
                              name="author"
                              value={formik.values.author}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              placeholder="Author name"
                              className={cn(
                                formik.touched.author &&
                                  formik.errors.author &&
                                  "border-destructive"
                              )}
                            />
                            {formik.touched.author && formik.errors.author && (
                              <p className="text-xs text-destructive">
                                {formik.errors.author}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="date"
                              className="text-sm font-medium"
                            >
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Date <span className="text-destructive">*</span>
                              </div>
                            </Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              value={formik.values.date}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              className={cn(
                                formik.touched.date &&
                                  formik.errors.date &&
                                  "border-destructive"
                              )}
                            />
                            {formik.touched.date && formik.errors.date && (
                              <p className="text-xs text-destructive">
                                {formik.errors.date}
                              </p>
                            )}
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label
                            htmlFor="category"
                            className="text-sm font-medium"
                          >
                            Category <span className="text-destructive">*</span>
                          </Label>
                          <div className="flex gap-2">
                            <Select
                              value={formik.values.category}
                              onValueChange={(value) =>
                                formik.setFieldValue("category", value)
                              }
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                              <Input
                                value={newCategoryInput}
                                onChange={(e) =>
                                  setNewCategoryInput(e.target.value)
                                }
                                placeholder="New category"
                                className="w-32"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddCategory();
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleAddCategory}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {formik.touched.category &&
                            formik.errors.category && (
                              <p className="text-xs text-destructive">
                                {formik.errors.category}
                              </p>
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Tags
                            </div>
                          </Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formik.values.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="pl-2 pr-1 py-1"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(index)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <Input
                            placeholder="Add tags (press Enter)"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag(e.currentTarget.value);
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                          <Checkbox
                            id="featured"
                            checked={formik.values.featured}
                            onCheckedChange={(checked) =>
                              formik.setFieldValue("featured", checked)
                            }
                          />
                          <Label
                            htmlFor="featured"
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <Star className="h-4 w-4 text-yellow-500" />
                            <div>
                              <div className="font-medium">
                                Featured Article
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Display this article prominently
                              </div>
                            </div>
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                </div>

                {/* Live Preview Sidebar */}
                <div className="lg:col-span-4">
                  <div className="sticky top-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Article Preview</h3>
                      <Badge
                        variant="outline"
                        className="bg-green-500/5 text-green-600 border-green-500/20"
                      >
                        Live Preview
                      </Badge>
                    </div>

                    <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
                      <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
                      <CardContent className="pt-6 space-y-6">
                        {/* Image Preview */}
                        <div className="aspect-[1200/630] rounded-lg bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                          {formik.values.featuredImage ? (
                            <img
                              src={formik.values.featuredImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                No image uploaded
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-lg leading-tight flex-1">
                              {formik.values.title || "Article Title"}
                            </h4>
                            {formik.values.featured && (
                              <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {formik.values.category && (
                            <Badge
                              variant="secondary"
                              className="bg-primary/5 text-primary border-primary/10"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {formik.values.category}
                            </Badge>
                          )}
                          {formik.values.author && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-500/5 text-blue-600 border-blue-500/10"
                            >
                              <User className="h-3 w-3 mr-1" />
                              {formik.values.author}
                            </Badge>
                          )}
                          {formik.values.date && (
                            <Badge
                              variant="secondary"
                              className="bg-green-500/5 text-green-600 border-green-500/10"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(
                                formik.values.date
                              ).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>

                        {formik.values.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {formik.values.tags.map((tag, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Separator className="opacity-50" />

                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                            Excerpt
                          </h5>
                          <p className="text-sm line-clamp-3 text-foreground/80 leading-relaxed">
                            {formik.values.excerpt ||
                              "Brief description of the article..."}
                          </p>
                        </div>

                        {formik.values.content && (
                          <div>
                            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Read Time
                            </h5>
                            <p className="text-sm text-foreground/80">
                              {calculateReadTime(formik.values.content)} min
                              read
                            </p>
                          </div>
                        )}

                        <Button className="w-full mt-4" disabled>
                          Read Article
                        </Button>

                        <p className="text-[10px] text-center text-muted-foreground italic">
                          Preview version - Final layout may vary slightly
                        </p>
                      </CardContent>
                    </Card>

                    <div className="p-4 rounded-xl bg-muted/30 border border-dashed border-border flex items-start gap-4">
                      <div className="mt-1 p-1 bg-primary/20 rounded-full">
                        <Newspaper className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Make sure your title is compelling and your excerpt
                        clearly summarizes the article to attract more readers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
