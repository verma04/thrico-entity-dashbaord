"use client";

import React, { useState, useEffect } from "react";
import { Plus, GripVertical, Pencil, Trash2, List } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetSponsorCategories,
  useUpdateSponsorCategory,
  useDeleteSponsorCategory,
  useReorderSponsorCategories,
  useCreateSponsorCategory,
} from "@/graphql/actions/sponsorCategories";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SortableCategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: any;
  onEdit: (category: any) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 mb-2 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-2 hover:bg-gray-100 rounded-md"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {category.title}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(category)}
          className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(category.id)}
          className="text-gray-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function SponsorCategoriesPage() {
  const { data, loading, error, refetch } = useGetSponsorCategories();
  const [createCategory] = useCreateSponsorCategory();
  const [updateCategory] = useUpdateSponsorCategory();
  const [deleteCategory] = useDeleteSponsorCategory();
  const [reorderCategories] = useReorderSponsorCategories();

  const [categories, setCategories] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formTitle, setFormTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (data?.getSponsorCategories) {
      setCategories([...data.getSponsorCategories]);
    }
  }, [data]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);

      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);

      try {
        const reorderInput = newCategories.map((c, index) => ({
          id: c.id,
          displayOrder: index,
        }));
        await reorderCategories({ variables: { input: reorderInput } });
        toast.success("Order saved");
      } catch (err: any) {
        toast.error(err.message || "Failed to save order");
        refetch();
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory({ variables: { id: deleteId } });
      toast.success("Category deleted");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormTitle("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: any) => {
    setEditingCategory(category);
    setFormTitle(category.title);
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    if (!formTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    
    try {
      if (editingCategory) {
        await updateCategory({
          variables: {
            id: editingCategory.id,
            input: { title: formTitle },
          },
        });
        toast.success("Category updated");
      } else {
        await createCategory({
          variables: {
            input: { 
              title: formTitle,
              displayOrder: categories.length,
            },
          },
        });
        toast.success("Category created");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load sponsor categories
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader
          icon={List}
          title="Sponsor Categories"
          description="Manage and organize your sponsors into categories"
        />
        <Button onClick={handleOpenCreateModal} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="p-1 sm:p-6 bg-transparent border-0 shadow-none">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <h3 className="text-lg font-medium text-gray-900">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started by creating your first sponsor category.
            </p>
            <Button
              onClick={handleOpenCreateModal}
              variant="outline"
              className="mt-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categories.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {categories.map((category) => (
                  <SortableCategoryRow
                    key={category.id}
                    category={category}
                    onEdit={handleOpenEditModal}
                    onDelete={(id) => {
                      setDeleteId(id);
                      setIsDeleteDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              sponsor category. Sponsors assigned to this category will have their category cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category Title</Label>
              <Input
                placeholder="e.g., Platinum Sponsors"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveModal}>
              {editingCategory ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
