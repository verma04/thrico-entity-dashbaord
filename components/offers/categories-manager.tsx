"use client";

import React, { useState } from "react";
import {
  useGetOfferCategories,
  OfferCategory,
  useCreateOfferCategory,
  useUpdateOfferCategory,
  useDeleteOfferCategory,
  GET_OFFER_CATEGORIES,
} from "@/graphql/actions/offers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, FolderTree, Search } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { CategoryDialog } from "./category-dialog";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";

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

export function CategoriesManager() {
  const moduleName = useModuleStore((state) => state.offerModuleName);
  const singularName = useModuleStore((state) => state.offerSingularName);
  const { data, loading } = useGetOfferCategories();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<OfferCategory | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] =
    useState<OfferCategory | null>(null);

  const [createCategory, { loading: creating }] = useCreateOfferCategory({
    onCompleted: () => {
      toast.success("Category created successfully");
      setIsDialogOpen(false);
    },
    refetchQueries: [{ query: GET_OFFER_CATEGORIES }],
  });

  const [updateCategory, { loading: updating }] = useUpdateOfferCategory({
    onCompleted: () => {
      toast.success("Category updated successfully");
      setIsDialogOpen(false);
    },
    refetchQueries: [{ query: GET_OFFER_CATEGORIES }],
  });

  const [deleteCategory, { loading: deleting }] = useDeleteOfferCategory({
    onCompleted: () => {
      toast.success("Category deleted successfully");
      setCategoryToDelete(null);
    },
    refetchQueries: [{ query: GET_OFFER_CATEGORIES }],
  });

  const handleSave = async (values: {
    name: string;
    color: string;
    isActive: boolean;
  }) => {
    try {
      if (editingCategory) {
        await updateCategory({
          variables: {
            updateOfferCategoryId: editingCategory.id,
            input: values,
          },
        });
      } else {
        await createCategory({
          variables: { input: values },
        });
      }
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleEdit = (category: OfferCategory) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory({
        variables: { deleteOfferCategoryId: categoryToDelete.id },
      });
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const categories = data?.getOfferCategories || [];
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: ColumnDef<OfferCategory>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{row.original.name}</span>
          <span className="text-[10px] text-muted-foreground">
            Created {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "color",
      header: "Color Preview",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full shadow-sm border border-black/5"
            style={{ backgroundColor: row.original.color }}
          />
          <code className="text-[10px] text-muted-foreground uppercase font-mono">
            {row.original.color}
          </code>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? "default" : "secondary"}
          className="font-mono text-[10px]"
        >
          {row.original.isActive ? "ACTIVE" : "INACTIVE"}
        </Badge>
      ),
    },
    {
      accessorKey: "offersCount",
      header: moduleName,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold">
            {row.original.offersCount}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            Items
          </span>
        </div>
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
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${singularName} Categories`}
        badgeText="Organization"
        description={`Manage categories to organize your ${moduleName.toLowerCase()} and improve discoverability.`}
        icon={FolderTree}
        actions={
          <Button
            onClick={() => {
              setEditingCategory(null);
              setIsDialogOpen(true);
            }}
            className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        }
      />

      <EcosystemActionBar>
        <div className="flex items-center gap-2 relative z-10 w-full md:max-w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search categories..."
            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400 border shadow-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 pr-4 ml-auto">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap shadow-inner">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {filteredCategories.length} Categories
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <DataTable
          columns={columns}
          data={filteredCategories}
          isLoading={loading}
          skeletonCount={3}
          rowClassName="h-16 group"
        />
      </EcosystemContainer>

      <CategoryDialog
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
                "{categoryToDelete?.name}"
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
    </EcosystemWrapper>
  );
}
