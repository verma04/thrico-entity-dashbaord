"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { SortableBannerRow } from "./banner-row";

interface ShopBanner {
  id: string;
  title: string;
  image: string;
  linkedProduct?: {
    id: string;
    title: string;
  } | null;
  isActive: boolean;
}

interface BannerListProps {
  banners: ShopBanner[];
  loading: boolean;
  onRemove: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onEdit: (id: string) => void;
}

export function BannerList({
  banners,
  loading,
  onRemove,
  onReorder,
  onEdit,
}: BannerListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const handleRemoveClick = (id: string) => {
    setIdToDelete(id);
  };

  const confirmDelete = () => {
    if (idToDelete) {
      onRemove(idToDelete);
      setIdToDelete(null);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Active Banners</CardTitle>
        <CardDescription>
          Drag and drop to reorder the banners in your shop carousel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Headline</TableHead>
                  <TableHead>Linked Product</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground font-medium">
                          Loading banners...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : banners.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground italic"
                    >
                      No banners found. Start by adding one above!
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext
                    items={banners.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {banners.map((banner) => (
                      <SortableBannerRow
                        key={banner.id}
                        banner={banner}
                        onRemove={handleRemoveClick}
                        onEdit={onEdit}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </CardContent>
      <AlertDialog
        open={!!idToDelete}
        onOpenChange={(open) => !open && setIdToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              shop banner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
