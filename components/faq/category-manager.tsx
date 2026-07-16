"use client";

import React, { useState } from "react";
import { FaqCategory } from "@/types/faq-types";
import { useFaqStore } from "@/store/useFaqStore";
import { generateSlug } from "@/lib/news-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, GripVertical, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  slug: Yup.string()
    .required("Slug is required")
    .matches(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: Yup.string().max(500, "Description must be less than 500 characters"),
});

export const CategoryManager: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    getFaqsByCategory,
  } = useFaqStore();
  const { toast } = useToast();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<FaqCategory | null>(null);

  const formik = useFormik({
    initialValues: {
      name: selectedCategory?.name || "",
      slug: selectedCategory?.slug || "",
      description: selectedCategory?.description || "",
    },
    validationSchema: categorySchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const now = new Date().toISOString();

      if (selectedCategory) {
        // Update existing
        updateCategory(selectedCategory.id, {
          name: values.name,
          slug: values.slug,
          description: values.description,
        });
        toast({
          title: "Category Updated",
          description: `"${values.name}" has been updated.`,
        });
      } else {
        // Create new
        const newCategory: FaqCategory = {
          id: `cat-${Date.now()}`,
          name: values.name,
          slug: values.slug,
          description: values.description,
          order: categories.length,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        };
        addCategory(newCategory);
        toast({
          title: "Category Created",
          description: `"${values.name}" has been created.`,
        });
      }

      handleCloseEditor();
    },
  });

  // Auto-generate slug from name for new categories
  React.useEffect(() => {
    if (!selectedCategory && formik.values.name) {
      formik.setFieldValue("slug", generateSlug(formik.values.name));
    }
  }, [formik.values.name, selectedCategory]);

  const handleEdit = (category: FaqCategory) => {
    setSelectedCategory(category);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    formik.resetForm();
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedCategory(null);
    formik.resetForm();
  };

  const handleDeleteClick = (category: FaqCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      toast({
        title: "Category Deleted",
        description: `"${categoryToDelete.name}" and its FAQs have been deleted.`,
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleToggleStatus = (category: FaqCategory) => {
    toggleCategoryStatus(category.id);
    toast({
      title: category.isActive ? "Category Deactivated" : "Category Activated",
      description: `"${category.name}" is now ${category.isActive ? "inactive" : "active"}.`,
    });
  };

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">FAQ Categories</h3>
            <p className="text-sm text-muted-foreground">
              Organize your FAQs into categories
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg bg-muted/10">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
            Create your first category to start organizing FAQs
          </p>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Category
          </Button>
        </div>

        {/* Editor Sheet */}
        <Sheet open={isEditorOpen} onOpenChange={handleCloseEditor}>
          <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader className="pb-4">
              <SheetTitle>
                {selectedCategory ? "Edit Category" : "Create Category"}
              </SheetTitle>
              <SheetDescription>
                {selectedCategory
                  ? "Update category details below."
                  : "Add a new category to organize your FAQs."}
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={formik.handleSubmit} className="space-y-6 py-6 px-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Getting Started"
                  className={cn(
                    formik.touched.name && formik.errors.name && "border-destructive"
                  )}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-destructive">{formik.errors.name}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="getting-started"
                  className={cn(
                    formik.touched.slug && formik.errors.slug && "border-destructive"
                  )}
                />
                {formik.touched.slug && formik.errors.slug && (
                  <p className="text-sm text-destructive">{formik.errors.slug}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (lowercase, hyphens only)
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Brief description of this category..."
                  rows={3}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-sm text-destructive">{formik.errors.description}</p>
                )}
              </div>

              <SheetFooter className="gap-2 flex-row justify-end px-0 py-4 border-t">
                <Button type="button" variant="outline" onClick={handleCloseEditor}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!formik.isValid || !formik.dirty}>
                  {selectedCategory ? "Update" : "Create"} Category
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">FAQ Categories</h3>
          <p className="text-sm text-muted-foreground">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Category
        </Button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => {
          const faqCount = getFaqsByCategory(category.id).length;

          return (
            <div
              key={category.id}
              className="flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{category.name}</h4>
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{faqCount} FAQs</Badge>
                </div>
                {category.description && (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`status-${category.id}`} className="text-sm sr-only">
                    Active
                  </Label>
                  <Switch
                    id={`status-${category.id}`}
                    checked={category.isActive}
                    onCheckedChange={() => handleToggleStatus(category)}
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(category)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Sheet */}
      <Sheet open={isEditorOpen} onOpenChange={handleCloseEditor}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>
              {selectedCategory ? "Edit Category" : "Create Category"}
            </SheetTitle>
            <SheetDescription>
              {selectedCategory
                ? "Update category details below."
                : "Add a new category to organize your FAQs."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-6 py-6 px-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., Getting Started"
                className={cn(
                  formik.touched.name && formik.errors.name && "border-destructive"
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-destructive">{formik.errors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="getting-started"
                className={cn(
                  formik.touched.slug && formik.errors.slug && "border-destructive"
                )}
              />
              {formik.touched.slug && formik.errors.slug && (
                <p className="text-sm text-destructive">{formik.errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier (lowercase, hyphens only)
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Brief description of this category..."
                rows={3}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-destructive">{formik.errors.description}</p>
              )}
            </div>

            <SheetFooter className="gap-2 flex-row justify-end px-0 py-4 border-t">
              <Button type="button" variant="outline" onClick={handleCloseEditor}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formik.isValid || !formik.dirty}>
                {selectedCategory ? "Update" : "Create"} Category
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{categoryToDelete?.name}"? This will also
              delete all FAQs in this category. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
