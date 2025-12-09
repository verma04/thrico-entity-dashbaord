"use client";

import React, { useState } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addDiscussionForumCategory } from "../../../graphql/actions/discussion-form";

const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name must be less than 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  isActive: Yup.boolean(),
});

const Add = () => {
  const [open, setOpen] = useState(false);

  const onCompleted = () => {
    setOpen(false);
    formik.resetForm();
  };

  const [add, { loading }] = addDiscussionForumCategory({
    onCompleted,
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      isActive: true,
    },
    validationSchema: categorySchema,
    onSubmit: (values) => {
      add({
        variables: {
          input: {
            ...values,
          },
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new discussion category for your community
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Programming, Design, Marketing"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.name && formik.errors.name
                  ? "border-destructive"
                  : ""
              }
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm text-destructive">{formik.errors.name}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formik.values.name.length}/50 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe what this category is about and what type of discussions belong here..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.description && formik.errors.description
                  ? "border-destructive"
                  : ""
              }
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-sm text-destructive">
                {formik.errors.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {formik.values.description.length}/500 characters
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Category Status
              </Label>
              <p className="text-sm text-muted-foreground">
                {formik.values.isActive
                  ? "Category is active and visible to users"
                  : "Category is inactive and hidden from users"}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formik.values.isActive}
              onCheckedChange={(checked) =>
                formik.setFieldValue("isActive", checked)
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                formik.resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formik.isValid}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Add;
