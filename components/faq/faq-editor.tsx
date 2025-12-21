"use client";

import React from "react";
import { FaqItem } from "@/types/faq-types";
import { useFaqStore } from "@/store/useFaqStore";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { Tag, X, Plus, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

interface FaqEditorProps {
  faq?: FaqItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const faqSchema = Yup.object().shape({
  question: Yup.string()
    .required("Question is required")
    .min(10, "Question must be at least 10 characters")
    .max(500, "Question must be less than 500 characters"),
  answer: Yup.string()
    .required("Answer is required")
    .min(20, "Answer must be at least 20 characters"),
  categoryId: Yup.string().required("Category is required"),
  tags: Yup.array().of(Yup.string()),
});

export const FaqEditor: React.FC<FaqEditorProps> = ({ faq, open, onOpenChange }) => {
  const { addFaq, updateFaq, categories } = useFaqStore();
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      question: faq?.question || "",
      answer: faq?.answer || "",
      categoryId: faq?.categoryId || "",
      tags: faq?.tags || [],
      isActive: faq?.isActive ?? true,
    },
    validationSchema: faqSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const now = new Date().toISOString();

      const faqData: FaqItem = {
        id: faq?.id || `faq-${Date.now()}`,
        question: values.question,
        answer: values.answer,
        categoryId: values.categoryId,
        categoryName: categories.find((c) => c.id === values.categoryId)?.name,
        tags: values.tags,
        order: faq?.order || 0,
        isActive: values.isActive,
        helpful: faq?.helpful || 0,
        notHelpful: faq?.notHelpful || 0,
        createdAt: faq?.createdAt || now,
        updatedAt: now,
      };

      if (faq) {
        updateFaq(faq.id, faqData);
        toast({
          title: "FAQ Updated",
          description: `"${values.question}" has been updated.`,
        });
      } else {
        addFaq(faqData);
        toast({
          title: "FAQ Created",
          description: `"${values.question}" has been created.`,
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
          <SheetTitle>{faq ? "Edit FAQ" : "Create New FAQ"}</SheetTitle>
          <SheetDescription>
            {faq
              ? "Update the FAQ question and answer below."
              : "Add a new frequently asked question."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 py-6 px-6">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">
              Question <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question"
              name="question"
              value={formik.values.question}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="What is your question?"
              className={cn(
                "text-lg font-semibold",
                formik.touched.question && formik.errors.question && "border-destructive"
              )}
            />
            {formik.touched.question && formik.errors.question && (
              <p className="text-sm text-destructive">{formik.errors.question}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formik.values.question.length}/500 characters
            </p>
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label>
              Answer <span className="text-destructive">*</span>
            </Label>
            <RichTextEditor
              value={formik.values.answer}
              onChange={(value) => formik.setFieldValue("answer", value)}
              placeholder="Provide a detailed answer..."
              minHeight="300px"
            />
            {formik.touched.answer && formik.errors.answer && (
              <p className="text-sm text-destructive">{formik.errors.answer}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formik.values.categoryId}
              onValueChange={(value) => formik.setFieldValue("categoryId", value)}
            >
              <SelectTrigger
                className={cn(
                  formik.touched.categoryId &&
                    formik.errors.categoryId &&
                    "border-destructive"
                )}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.isActive)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <p className="text-sm text-destructive">{formik.errors.categoryId}</p>
            )}
            {categories.filter((c) => c.isActive).length === 0 && (
              <p className="text-sm text-muted-foreground">
                Please create an active category first.
              </p>
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

          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formik.values.isActive}
              onChange={(e) => formik.setFieldValue("isActive", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Make this FAQ active (visible to users)
            </Label>
          </div>

          <SheetFooter className="gap-2 flex-row justify-end px-0 py-4 border-t bg-muted/30">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formik.isValid}>
              <Save className="h-4 w-4 mr-2" />
              {faq ? "Update" : "Create"} FAQ
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
