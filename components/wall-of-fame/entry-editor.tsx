"use client";

import React from "react";
import { WallOfFameEntry } from "@/types/wall-of-fame-types";
import { useWallOfFameStore } from "@/store/useWallOfFameStore";
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
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useToast } from "@/hooks/use-toast";
import { X, Plus, Save, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

interface EntryEditorProps {
  entry?: WallOfFameEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const entrySchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  title: Yup.string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  category: Yup.string().required("Category is required"),
  achievement: Yup.string(),
  year: Yup.string().matches(/^\d{4}$/, "Must be a valid year"),
  socialLinks: Yup.object().shape({
    linkedin: Yup.string().url("Must be a valid URL"),
    twitter: Yup.string().url("Must be a valid URL"),
    website: Yup.string().url("Must be a valid URL"),
  }),
});

export const EntryEditor: React.FC<EntryEditorProps> = ({ entry, open, onOpenChange }) => {
  const { addEntry, updateEntry, categories, addCategory } = useWallOfFameStore();
  const { toast } = useToast();
  const [newCategoryInput, setNewCategoryInput] = React.useState("");

  const formik = useFormik({
    initialValues: {
      name: entry?.name || "",
      title: entry?.title || "",
      description: entry?.description || "",
      image: entry?.image || "",
      category: entry?.category || "",
      achievement: entry?.achievement || "",
      year: entry?.year || "",
      socialLinks: {
        linkedin: entry?.socialLinks?.linkedin || "",
        twitter: entry?.socialLinks?.twitter || "",
        website: entry?.socialLinks?.website || "",
      },
      tags: entry?.tags || [],
      isFeatured: entry?.isFeatured || false,
      isActive: entry?.isActive ?? true,
    },
    validationSchema: entrySchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const now = new Date().toISOString();

      const entryData: WallOfFameEntry = {
        id: entry?.id || `wof-${Date.now()}`,
        name: values.name,
        title: values.title,
        description: values.description,
        image: values.image || undefined,
        category: values.category,
        achievement: values.achievement || undefined,
        year: values.year || undefined,
        socialLinks: {
          linkedin: values.socialLinks.linkedin || undefined,
          twitter: values.socialLinks.twitter || undefined,
          website: values.socialLinks.website || undefined,
        },
        tags: values.tags,
        isFeatured: values.isFeatured,
        isActive: values.isActive,
        order: entry?.order || 0,
        createdAt: entry?.createdAt || now,
        updatedAt: now,
      };

      if (entry) {
        updateEntry(entry.id, entryData);
        toast({
          title: "Entry Updated",
          description: `"${values.name}" has been updated.`,
        });
      } else {
        addEntry(entryData);
        toast({
          title: "Entry Created",
          description: `"${values.name}" has been added to Wall of Fame.`,
        });
      }

      handleClose();
    },
  });

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

  const handleClose = () => {
    if (formik.dirty && !confirm("Discard unsaved changes?")) return;
    formik.resetForm();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>{entry ? "Edit Entry" : "Add to Wall of Fame"}</SheetTitle>
          <SheetDescription>
            {entry ? "Update entry details." : "Add a new featured entry."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 py-6 px-6">
          {/* Image */}
          <ImageUploadWithCrop
            label="Profile Image"
            currentImage={formik.values.image}
            onImageUpdate={(url) => formik.setFieldValue("image", url)}
            recommendedWidth={400}
            recommendedHeight={400}
            aspectRatio={1}
            maxFileSize={2}
          />

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...formik.getFieldProps("name")}
              className={cn(formik.touched.name && formik.errors.name && "border-destructive")}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-destructive">{formik.errors.name}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title/Role <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...formik.getFieldProps("title")}
              placeholder="e.g., CEO, Founder, Award Winner"
              className={cn(formik.touched.title && formik.errors.title && "border-destructive")}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-destructive">{formik.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              {...formik.getFieldProps("description")}
              rows={4}
              className={cn(
                formik.touched.description && formik.errors.description && "border-destructive"
              )}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-destructive">{formik.errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
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
              <Input
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                placeholder="New"
                className="w-24"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
              />
              <Button type="button" variant="outline" size="icon" onClick={handleAddCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Achievement & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="achievement">Achievement</Label>
              <Input id="achievement" {...formik.getFieldProps("achievement")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" {...formik.getFieldProps("year")} placeholder="2024" />
              {formik.touched.year && formik.errors.year && (
                <p className="text-sm text-destructive">{formik.errors.year}</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <Label>Social Links</Label>
            <Input
              {...formik.getFieldProps("socialLinks.linkedin")}
              placeholder="LinkedIn URL"
            />
            <Input
              {...formik.getFieldProps("socialLinks.twitter")}
              placeholder="Twitter URL"
            />
            <Input
              {...formik.getFieldProps("socialLinks.website")}
              placeholder="Website URL"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formik.values.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(i)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input
              placeholder="Add tag (press Enter)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formik.values.isFeatured}
                onChange={(e) => formik.setFieldValue("isFeatured", e.target.checked)}
              />
              <Label htmlFor="isFeatured" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Featured Entry
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formik.values.isActive}
                onChange={(e) => formik.setFieldValue("isActive", e.target.checked)}
              />
              <Label htmlFor="isActive">Active (visible to users)</Label>
            </div>
          </div>

          <SheetFooter className="gap-2 flex-row justify-end px-0 py-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid}>
              <Save className="h-4 w-4 mr-2" />
              {entry ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
