"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState } from "react";
import {
  useGetMentorCategories,
  MentorCategory,
} from "@/graphql/mentorship/mentorship-quiries";
import {
  useAddMentorshipCategory,
  useUpdateMentorshipCategory,
  useDeleteMentorshipCategory,
} from "@/graphql/mentorship/mentoship-muation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Search,
  Filter,
  FolderTree,
  GraduationCap,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { notify } from "@/lib/notify";
import { Input } from "@/components/ui/input";

// ── Color palette for categories ──
const CATEGORY_COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#f43f5e",
  "#3b82f6",
  "#f97316",
  "#ec4899",
];

function getCategoryColor(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}

// ── Add/Edit Dialog ──
function CategoryDialog({
  open,
  onOpenChange,
  editingCategory,
  isLoading,
  onSave,
  singularName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: MentorCategory | null;
  isLoading: boolean;
  onSave: (values: { title: string }) => void;
  singularName: string;
}) {
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle(editingCategory?.title || "");
    }
  }, [open, editingCategory]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="font-bold text-slate-800">
            {editingCategory ? "Edit Category" : `Add ${singularName} Category`}
          </DialogTitle>
          <DialogDescription className="font-medium text-slate-500">
            {editingCategory
              ? "Update the category name"
              : `Create a new category to organize your ${singularName.toLowerCase()}s`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="cat-title"
              className="text-sm font-semibold text-slate-700"
            >
              Category Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cat-title"
              placeholder="e.g., Engineering, Design, Marketing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-slate-200 focus-visible:ring-indigo-500/20"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            className="rounded-lg font-semibold border-slate-200"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            className="rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingCategory ? "Update" : "Save Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Categories Grid ──
function CategoriesGrid({
  categories,
  isLoading,
  onEdit,
  onDelete,
  moduleName,
  singularName,
}: {
  categories: MentorCategory[];
  isLoading: boolean;
  onEdit: (cat: MentorCategory) => void;
  onDelete: (cat: MentorCategory) => void;
  moduleName: string;
  singularName: string;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Card
              key={i}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <Skeleton className="h-1.5 w-full" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-xl border border-slate-200 border-dashed m-4">
        <Tag className="h-10 w-10 text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
          No categories found
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-sm">
          Try adding a new category or adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {categories.map((category, index) => {
        const color = getCategoryColor(index);
        return (
          <Card
            key={category.id}
            className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden rounded-xl hover:border-indigo-500/20 hover:-translate-y-1 bg-white cursor-pointer"
          >
            {/* Color bar */}
            <div
              className="h-1.5 w-full opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: color }}
            />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                      {moduleName}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(category);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(category);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-slate-600 font-medium mt-4 line-clamp-2 leading-relaxed">
                {singularName} expertise classification node
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

import { useModuleStore } from "@/store/useModuleStore";

// ── Main Page ──
function MentorCategoriesPage() {
  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);
  const { data, loading, refetch } = useGetMentorCategories();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MentorCategory | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] =
    useState<MentorCategory | null>(null);

  const [createCategory, { loading: creating }] = useAddMentorshipCategory({
    onCompleted: () => {
      notify.success("Category created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to create category"),
  });

  const [updateCategory, { loading: updating }] = useUpdateMentorshipCategory({
    onCompleted: () => {
      notify.success("Category updated successfully");
      setIsDialogOpen(false);
      setEditingCategory(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to update category"),
  });

  const [deleteCategory, { loading: deleting }] = useDeleteMentorshipCategory({
    onCompleted: () => {
      notify.success("Category deleted successfully");
      setCategoryToDelete(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to delete category"),
  });

  const handleSave = async (values: { title: string }) => {
    if (editingCategory) {
      await updateCategory({
        variables: { input: { id: editingCategory.id, title: values.title } },
      });
    } else {
      await createCategory({
        variables: { input: values },
      });
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory({
      variables: { input: { id: categoryToDelete.id } },
    });
  };

  const categories = data?.getMentorCategories || [];
  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <EcosystemWrapper anonymized-1="mentorship-categories">
      <EcosystemHeader
        title={`${singularName} Categories`}
        badgeText="Organization"
        description={`Organize ${singularName.toLowerCase()}s by expertise for better discovery and matching.`}
        icon={FolderTree}
        actions={
          <Button
            className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2"
            onClick={() => {
              setEditingCategory(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-[400px]">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search categories..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-border bg-card text-muted-foreground hover:text-foreground shadow-none"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredCategories.length > 0}>
            {filteredCategories.length} Categories
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <CategoriesGrid
          categories={filteredCategories}
          isLoading={loading}
          onEdit={(cat) => {
            setEditingCategory(cat);
            setIsDialogOpen(true);
          }}
          onDelete={(cat) => setCategoryToDelete(cat)}
          moduleName={moduleName}
          singularName={singularName}
        />
      </EcosystemContainer>

      {/* Add/Edit Dialog */}
      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingCategory={editingCategory}
        isLoading={creating || updating}
        onSave={handleSave}
        singularName={singularName}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-slate-800">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              This will permanently delete the category{" "}
              <span className="font-bold text-slate-700">
                "{categoryToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-lg font-semibold border-slate-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(MentorCategoriesPage, "MENTORSHIP", "canRead"),
  "mentorship",
);
