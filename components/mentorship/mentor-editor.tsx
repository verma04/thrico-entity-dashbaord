"use client";

import React from "react";
import { Mentor, MentorSource } from "@/types/mentor-types";
import { useMentorStore } from "@/store/useMentorStore";
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
import { Save, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

interface MentorEditorProps {
  mentor?: Mentor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: MentorSource;
}

const mentorSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  bio: Yup.string()
    .required("Bio is required")
    .min(50, "Bio must be at least 50 characters"),
  categoryId: Yup.string().required("Category is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Must be a valid email"),
  linkedin: Yup.string().url("Must be a valid URL"),
  website: Yup.string().url("Must be a valid URL"),
  expertise: Yup.string().required("At least one expertise area is required"),
  yearsOfExperience: Yup.number().min(0, "Must be 0 or greater"),
});

export const MentorEditor: React.FC<MentorEditorProps> = ({
  mentor,
  open,
  onOpenChange,
  source = "admin",
}) => {
  const { addMentor, updateMentor, categories } = useMentorStore();
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      name: mentor?.name || "",
      title: mentor?.title || "",
      bio: mentor?.bio || "",
      image: mentor?.image || "",
      categoryId: mentor?.categoryId || "",
      email: mentor?.email || "",
      linkedin: mentor?.linkedin || "",
      website: mentor?.website || "",
      expertise: mentor?.expertise?.join(", ") || "",
      yearsOfExperience: mentor?.yearsOfExperience || 0,
      availability: mentor?.availability || "Available",
      isFeatured: mentor?.isFeatured || false,
      isTrending: mentor?.isTrending || false,
    },
    validationSchema: mentorSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const now = new Date().toISOString();

      const mentorData: Mentor = {
        id: mentor?.id || `mentor-${Date.now()}`,
        ...values,
        expertise: values.expertise.split(",").map((e) => e.trim()).filter(Boolean),
        categoryName: categories.find((c) => c.id === values.categoryId)?.name,
        status: mentor?.status || (source === "admin" ? "approved" : "pending"),
        source: mentor?.source || source,
        addedBy: mentor?.addedBy || (source === "admin" ? "admin" : "user-123"),
        isActive: mentor?.isActive ?? true,
        createdAt: mentor?.createdAt || now,
        updatedAt: now,
      };

      if (mentor) {
        updateMentor(mentor.id, mentorData);
        toast({
          title: "Mentor Updated",
          description: `"${values.name}" has been updated.`,
        });
      } else {
        addMentor(mentorData);
        toast({
          title: "Mentor Created",
          description: `"${values.name}" has been ${source === "admin" ? "created" : "submitted for approval"}.`,
        });
      }

      handleClose();
    },
  });

  const handleClose = () => {
    if (formik.dirty && !confirm("Discard unsaved changes?")) return;
    formik.resetForm();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>{mentor ? "Edit Mentor" : "Create New Mentor"}</SheetTitle>
          <SheetDescription>
            {mentor ? "Update mentor details." : "Add a new mentor to the platform."}
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
              placeholder="e.g., John Doe"
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
              placeholder="e.g., Senior Software Engineer"
              className={cn(formik.touched.title && formik.errors.title && "border-destructive")}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-sm text-destructive">{formik.errors.title}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">
              Bio <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="bio"
              {...formik.getFieldProps("bio")}
              rows={4}
              placeholder="Tell us about your experience and what you can help with..."
              className={cn(
                formik.touched.bio && formik.errors.bio && "border-destructive"
              )}
            />
            {formik.touched.bio && formik.errors.bio && (
              <p className="text-sm text-destructive">{formik.errors.bio}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formik.values.categoryId}
              onValueChange={(value) => formik.setFieldValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.isActive)
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="text-sm text-destructive">{formik.errors.categoryId}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="john@example.com"
              className={cn(formik.touched.email && formik.errors.email && "border-destructive")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-destructive">{formik.errors.email}</p>
            )}
          </div>

          {/* LinkedIn & Website */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                {...formik.getFieldProps("linkedin")}
                placeholder="https://linkedin.com/in/..."
                type="url"
              />
              {formik.touched.linkedin && formik.errors.linkedin && (
                <p className="text-sm text-destructive">{formik.errors.linkedin}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                {...formik.getFieldProps("website")}
                placeholder="https://example.com"
                type="url"
              />
              {formik.touched.website && formik.errors.website && (
                <p className="text-sm text-destructive">{formik.errors.website}</p>
              )}
            </div>
          </div>

          {/* Expertise */}
          <div className="space-y-2">
            <Label htmlFor="expertise">
              Expertise Areas <span className="text-destructive">*</span>
            </Label>
            <Input
              id="expertise"
              {...formik.getFieldProps("expertise")}
              placeholder="e.g., React, Node.js, System Design (comma-separated)"
              className={cn(formik.touched.expertise && formik.errors.expertise && "border-destructive")}
            />
            {formik.touched.expertise && formik.errors.expertise && (
              <p className="text-sm text-destructive">{formik.errors.expertise}</p>
            )}
            <p className="text-xs text-muted-foreground">Separate multiple areas with commas</p>
          </div>

          {/* Years of Experience & Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                {...formik.getFieldProps("yearsOfExperience")}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                {...formik.getFieldProps("availability")}
                placeholder="Available"
              />
            </div>
          </div>

          {/* Toggles (Admin only) */}
          {source === "admin" && (
            <div className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formik.values.isFeatured}
                  onChange={(e) => formik.setFieldValue("isFeatured", e.target.checked)}
                />
                <Label htmlFor="isFeatured" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Featured Mentor
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isTrending"
                  checked={formik.values.isTrending}
                  onChange={(e) => formik.setFieldValue("isTrending", e.target.checked)}
                />
                <Label htmlFor="isTrending" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Trending Mentor
                </Label>
              </div>
            </div>
          )}

          <SheetFooter className="gap-2 flex-row justify-end px-0 py-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid}>
              <Save className="h-4 w-4 mr-2" />
              {mentor ? "Update" : source === "admin" ? "Create" : "Submit"} Mentor
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
