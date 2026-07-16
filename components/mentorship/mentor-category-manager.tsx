"use client";

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
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { MentorCategoryDialog } from "./mentor-category-dialog";
import { toast } from "sonner";
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

export function MentorCategoriesManager() {
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
      toast.success("Category created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) =>
      toast.error(error.message || "Failed to create category"),
  });

  const [updateCategory, { loading: updating }] = useUpdateMentorshipCategory({
    onCompleted: () => {
      toast.success("Category updated successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update category"),
  });

  const [deleteCategory, { loading: deleting }] = useDeleteMentorshipCategory({
    onCompleted: () => {
      toast.success("Category deleted successfully");
      setCategoryToDelete(null);
      refetch();
    },
    onError: (error) =>
      toast.error(error.message || "Failed to delete category"),
  });

  const handleSave = async (values: { title: string }) => {
    try {
      if (editingCategory) {
        await updateCategory({
          variables: {
            input: {
              id: editingCategory.id,
              title: values.title,
            },
          },
        });
      } else {
        await createCategory({
          variables: { input: values },
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (category: MentorCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory({
        variables: { input: { id: categoryToDelete.id } },
      });
    } catch (error) {
      // Error handled in onError
    }
  };

  const categories = data?.getMentorCategories || [];
  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: ColumnDef<MentorCategory>[] = [
    {
      accessorKey: "title",
      header: "Category Title",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.title}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => handleEdit(row.original)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            onClick={() => setCategoryToDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search categories..."
            className="bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingCategory(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredCategories}
        isLoading={loading}
        skeletonCount={3}
        rowClassName="h-14 group"
      />

      <MentorCategoryDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingCategory={editingCategory}
        isLoading={creating || updating}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category{" "}
              <span className="font-bold text-foreground">
                "{categoryToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
