"use client";

import React, { useEffect } from "react";
import { NewsArticle } from "@/types/news-types";
import { generateSlug, calculateReadTime } from "@/lib/news-utils";
import { useNewsStore } from "@/store/useNewsStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Tag, User, X, Plus, Star, Save, Send } from "lucide-react";
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
    if (newCategoryInput.trim() && !categories.includes(newCategoryInput.trim())) {
      addCategory(newCategoryInput.trim());
      formik.setFieldValue("category", newCategoryInput.trim());
      setNewCategoryInput("");
    }
  };

  const handleSave = async (status: "draft" | "published") => {
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
        description: `"${formik.values.title}" has been ${status === "published" ? "published" : "saved as draft"}.`,
      });
    } else {
      addArticle(articleData);
      toast({
        title: "Article Created",
        description: `"${formik.values.title}" has been ${status === "published" ? "published" : "saved as draft"}.`,
      });
    }

    onSave?.(articleData);
    onOpenChange(false);
    formik.resetForm();
  };

  const handleClose = () => {
    if (formik.dirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to close without saving?")
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
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>{article ? "Edit Article" : "Create New Article"}</SheetTitle>
          <SheetDescription>
            {article
              ? "Make changes to your article below."
              : "Write and publish a new article for your community."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6 px-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
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
                formik.touched.title && formik.errors.title && "border-destructive"
              )}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-destructive">{formik.errors.title}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formik.values.title.length}/200 characters
            </p>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug (URL) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="article-url-slug"
              className={cn(
                formik.touched.slug && formik.errors.slug && "border-destructive"
              )}
            />
            {formik.touched.slug && formik.errors.slug && (
              <p className="text-sm text-destructive">{formik.errors.slug}</p>
            )}
            <p className="text-xs text-muted-foreground">
              URL-friendly version (lowercase, hyphens only)
            </p>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <ImageUploadWithCrop
              label="Featured Image"
              currentImage={formik.values.featuredImage}
              onImageUpdate={(url) => formik.setFieldValue("featuredImage", url)}
              recommendedWidth={1200}
              recommendedHeight={630}
              aspectRatio={1200 / 630}
              maxFileSize={5}
              showDimensions={true}
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">
              Excerpt <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formik.values.excerpt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Brief description of the article..."
              rows={3}
              className={cn(
                formik.touched.excerpt && formik.errors.excerpt && "border-destructive"
              )}
            />
            {formik.touched.excerpt && formik.errors.excerpt && (
              <p className="text-sm text-destructive">{formik.errors.excerpt}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formik.values.excerpt.length}/500 characters
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>
              Content <span className="text-destructive">*</span>
            </Label>
            <RichTextEditor
              value={formik.values.content}
              onChange={(value) => formik.setFieldValue("content", value)}
              placeholder="Write your article content here..."
              minHeight="400px"
            />
            {formik.touched.content && formik.errors.content && (
              <p className="text-sm text-destructive">{formik.errors.content}</p>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                name="author"
                value={formik.values.author}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Author name"
                className={cn(
                  formik.touched.author && formik.errors.author && "border-destructive"
                )}
              />
              {formik.touched.author && formik.errors.author && (
                <p className="text-sm text-destructive">{formik.errors.author}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  formik.touched.date && formik.errors.date && "border-destructive"
                )}
              />
              {formik.touched.date && formik.errors.date && (
                <p className="text-sm text-destructive">{formik.errors.date}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Select
                value={formik.values.category}
                onValueChange={(value) => formik.setFieldValue("category", value)}
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
                  onChange={(e) => setNewCategoryInput(e.target.value)}
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
            {formik.touched.category && formik.errors.category && (
              <p className="text-sm text-destructive">{formik.errors.category}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formik.values.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tags (press Enter)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
                className="flex-1"
              />
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={formik.values.featured}
              onChange={(e) => formik.setFieldValue("featured", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="featured" className="flex items-center gap-1 cursor-pointer">
              <Star className="h-3 w-3" />
              Mark as Featured Article
            </Label>
          </div>
        </div>

        <SheetFooter className="gap-2 flex-row justify-end px-6 py-4 border-t bg-muted/30">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSave("draft")}
            disabled={!formik.isValid}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button onClick={() => handleSave("published")} disabled={!formik.isValid}>
            <Send className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
