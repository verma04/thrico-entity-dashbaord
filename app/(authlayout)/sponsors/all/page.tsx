"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, GripVertical, Pencil, Trash2, Globe } from "lucide-react";
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
import { CtaButton } from "@/components/ui/cta-button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  useGetSponsors,
  useUpdateSponsor,
  useDeleteSponsor,
  useReorderSponsors,
} from "@/graphql/actions/sponsors";
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
import Image from "next/image";

// Sortable Row Component
function SortableSponsorRow({
  sponsor,
  onToggleStatus,
  onDelete,
}: {
  sponsor: any;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sponsor.id });

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

      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border">
        {sponsor.image ? (
          <Image
            src={sponsor.image.startsWith("http") ? sponsor.image : `${process.env.NEXT_PUBLIC_CDN_URL}/${sponsor.image}`}
            alt={sponsor.title}
            fill
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {sponsor.title}
        </h3>
        {sponsor.description && (
          <p className="text-sm text-gray-500 truncate">
            {sponsor.description}
          </p>
        )}
        {sponsor.externalUrl && (
          <a
            href={sponsor.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
          >
            <Globe className="w-3 h-3" />
            {sponsor.externalUrl}
          </a>
        )}
      </div>

      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {sponsor.isActive ? "Active" : "Inactive"}
          </span>
          <Switch
            checked={sponsor.isActive}
            onCheckedChange={() => onToggleStatus(sponsor.id, sponsor.isActive)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/sponsors/${sponsor.id}/edit`}>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(sponsor.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManageSponsorsPage() {
  const { data, loading, error } = useGetSponsors();
  const [updateSponsor] = useUpdateSponsor();
  const [deleteSponsor] = useDeleteSponsor();
  const [reorderSponsors] = useReorderSponsors();

  const [sponsors, setSponsors] = useState<any[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (data?.getSponsors) {
      // Sort them by displayOrder initially
      const sorted = [...data.getSponsors].sort(
        (a, b) => a.displayOrder - b.displayOrder,
      );
      setSponsors(sorted);
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSponsors((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Prepare input for reorder mutation
        const reorderInput = newItems.map((item, index) => ({
          id: item.id,
          displayOrder: index,
        }));

        // Execute mutation in background
        reorderSponsors({ variables: { input: reorderInput } }).catch((err) => {
          toast.error("Failed to reorder sponsors");
          console.error(err);
        });

        return newItems;
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateSponsor({
        variables: {
          id,
          input: { isActive: !currentStatus },
        },
      });
      toast.success(
        `Sponsor marked as ${!currentStatus ? "active" : "inactive"}`,
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteSponsor({ variables: { id: deleteConfirmId } });
      toast.success("Sponsor deleted successfully");
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error("Failed to delete sponsor");
    }
  };

  if (loading) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          icon={Globe}
          title="Manage Sponsors"
          description="Loading sponsors..."
          badgeText="Sponsors"
          breadcrumbs={[
            { label: "Sponsors", href: "/sponsors/all" },
            { label: "Manage" }
          ]}
        />
        <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
          <div className="space-y-4 px-6 py-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading sponsors.</div>;
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        icon={Globe}
        title="Manage Sponsors"
        description="Drag and drop to reorder how sponsors appear on your entity portal."
        badgeText="Sponsors"
        breadcrumbs={[
          { label: "Sponsors", href: "/sponsors/all" },
          { label: "Manage" }
        ]}
        actions={
          <EcosystemActionBar shadow="none" className="p-0 border-none bg-transparent gap-2">
            <EcosystemActionBar.Group align="right">
              <Link href="/sponsors/create">
                <CtaButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sponsor
                </CtaButton>
              </Link>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-4">
          <Card className="p-4 bg-gray-50/50">
        {sponsors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No sponsors added yet. Click "Add Sponsor" to create one.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sponsors.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sponsors.map((sponsor) => (
                  <SortableSponsorRow
                    key={sponsor.id}
                    sponsor={sponsor}
                    onToggleStatus={handleToggleStatus}
                    onDelete={setDeleteConfirmId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              sponsor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
