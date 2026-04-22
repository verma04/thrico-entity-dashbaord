"use client";

import React from "react";
import { Mentor as GqlMentor } from "@/graphql/mentorship/mentorship-quiries";
import { 
  useGetMentorCategories, 
  useGetMentorshipStats 
} from "@/graphql/mentorship/mentorship-quiries";
import { useUpdateMentor } from "@/graphql/mentorship/mentoship-muation";
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
  mentor?: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefetch?: () => void;
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
  onRefetch,
}) => {
  const { data: categoriesData } = useGetMentorCategories();
  const [updateMentorGql, { loading: updating }] = useUpdateMentor();
  const { toast: sonnerToast } = useToast();

  const categories = categoriesData?.getMentorCategories || [];

  const formik = useFormik({
    initialValues: {
      name: mentor?.displayName || mentor?.name || "",
      title: mentor?.intro || mentor?.title || "",
      bio: mentor?.about || mentor?.bio || "",
      image: mentor?.mentorUser?.user?.avatar || mentor?.image || "",
      categoryId: mentor?.category?.id || mentor?.categoryId || "",
      email: mentor?.mentorUser?.user?.email || mentor?.email || "",
      expertise: (mentor?.skills ? mentor?.skills.join(", ") : (mentor?.expertise?.join(", ") || "")),
      isFeatured: mentor?.isFeatured || false,
      isTopMentor: mentor?.isTopMentor || mentor?.isTrending || false,
    },
    validationSchema: mentorSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (mentor) {
          await updateMentorGql({
            variables: {
              input: {
                id: mentor.id,
                displayName: values.name,
                category: values.categoryId,
                skills: values.expertise.split(",").map(s => s.trim()).filter(Boolean),
                intro: values.title,
                about: values.bio,
                isFeatured: values.isFeatured,
                isTopMentor: values.isTopMentor,
              }
            }
          });
          
          sonnerToast({
            title: "Mentor Updated",
            description: `"${values.name}" has been synchronized with the registry.`,
          });
          
          if (onRefetch) onRefetch();
        } else {
          // Add logic would go here if implemented
          sonnerToast({
            title: "Not Implemented",
            description: "Direct creation via dashboard is coming soon. Please use user application flow.",
            variant: "destructive"
          });
        }
        
        handleClose();
      } catch (error: any) {
        sonnerToast({
          title: "Update Failed",
          description: error.message || "An unexpected error occurred during synchronization.",
          variant: "destructive"
        });
      }
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
                  .map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
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

          {/* Availability (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="availability">Availability Profile</Label>
            <Input
              id="availability"
              disabled
              value="Managed by System"
              className="bg-zinc-50"
            />
          </div>

          {/* Toggles (Admin only) */}
          <div className="space-y-3 p-4 border rounded-xl bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600"
                checked={formik.values.isFeatured}
                onChange={(e) => formik.setFieldValue("isFeatured", e.target.checked)}
              />
              <Label htmlFor="isFeatured" className="flex items-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-wider text-zinc-600">
                <Star className={cn("h-4 w-4", formik.values.isFeatured ? "fill-amber-400 text-amber-400" : "text-zinc-400")} />
                Featured Node
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isTopMentor"
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600"
                checked={formik.values.isTopMentor}
                onChange={(e) => formik.setFieldValue("isTopMentor", e.target.checked)}
              />
              <Label htmlFor="isTopMentor" className="flex items-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-wider text-zinc-600">
                <TrendingUp className={cn("h-4 w-4", formik.values.isTopMentor ? "text-emerald-500" : "text-zinc-400")} />
                Elite Tier (Top Mentor)
              </Label>
            </div>
          </div>

          <SheetFooter className="gap-2 flex-row justify-end px-0 py-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid || updating} className="bg-indigo-600 hover:bg-indigo-700">
              {updating ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {mentor ? "Sync Updates" : "Onboard Mentor"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
