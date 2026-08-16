"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Plus, GripVertical, Pencil, Trash2, Globe, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
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
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Status", dot: "" },
  { value: "ACTIVE", label: "Active", dot: "bg-emerald-500" },
  { value: "INACTIVE", label: "Inactive", dot: "bg-zinc-400" },
];

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
      className="flex items-center gap-4 p-4 mb-2 bg-white dark:bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-2 hover:bg-muted rounded-md"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground/60" />
      </div>

      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
        {sponsor.image ? (
          <Image
            src={
              sponsor.image.startsWith("http")
                ? sponsor.image
                : `https://cdn.thrico.network/${sponsor.image}`
            }
            alt={sponsor.title}
            fill
            className="object-contain p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 font-bold text-lg">
            {sponsor.title.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground truncate text-sm">
            {sponsor.title}
          </h3>
          {sponsor.badge && (
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
              {sponsor.badge}
            </span>
          )}
        </div>
        {sponsor.tagline && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {sponsor.tagline}
          </p>
        )}
        {sponsor.url && (
          <a
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-primary/80 hover:underline flex items-center gap-1 mt-1 truncate"
          >
            <Globe className="w-3 h-3 shrink-0" />
            <span className="truncate">{sponsor.url}</span>
          </a>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const statusFilter = searchParams.get("status") || "ALL";
  const setStatusFilter = (v: string) =>
    updateParams({ status: v === "ALL" ? null : v });

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const { data, loading, error, refetch } = useGetSponsors();
  const [updateSponsor] = useUpdateSponsor();
  const [deleteSponsor] = useDeleteSponsor();
  const [reorderSponsors] = useReorderSponsors();

  const [sponsors, setSponsors] = useState<any[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (data?.getSponsors) {
      const sorted = [...data.getSponsors].sort(
        (a, b) => a.displayOrder - b.displayOrder,
      );
      setSponsors(sorted);
    }
  }, [data]);

  const filteredSponsors = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return sponsors.filter((sponsor) => {
      const matchesSearch =
        !q ||
        sponsor.title?.toLowerCase().includes(q) ||
        sponsor.tagline?.toLowerCase().includes(q) ||
        sponsor.url?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? sponsor.isActive : !sponsor.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [sponsors, debouncedSearch, statusFilter]);

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

        const reorderInput = newItems.map((item, index) => ({
          id: item.id,
          displayOrder: index,
        }));

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
      refetch?.();
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
      refetch?.();
    } catch (err) {
      toast.error("Failed to delete sponsor");
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        icon={Globe}
        title="Manage Sponsors"
        description="Drag and drop to reorder how sponsors appear on your entity portal."
        badgeText="Sponsors"
        breadcrumbs={[
          { label: "Sponsors", href: "/sponsors/all" },
          { label: "Manage" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
            </Button>
            <Link href="/sponsors/create">
              <CtaButton>
                <Plus className="w-3.5 h-3.5" />
                Add Sponsor
              </CtaButton>
            </Link>
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search sponsors by title…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              placeholder="Status"
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
                dot: opt.dot || undefined,
              }))}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredSponsors.length > 0}>
            Showing {filteredSponsors.length} of {sponsors.length} Sponsors
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-red-500 text-sm">Error loading sponsors.</div>
          ) : (
            <Card className="p-4 bg-card border-border">
              {filteredSponsors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  {sponsors.length === 0
                    ? "No sponsors added yet. Click 'Add Sponsor' to create one."
                    : "No sponsors match your current search and filters."}
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={filteredSponsors.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {filteredSponsors.map((sponsor) => (
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
          )}

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

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="sponsors"
        description="Export sponsors list as CSV. Includes title, tagline, website URL, badge, and active status."
        totalCount={sponsors.length}
        matchingCount={debouncedSearch.trim() || statusFilter !== "ALL" ? filteredSponsors.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredSponsors;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: "No sponsors found." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Title", getValue: (s) => s.title || "" },
            { header: "Tagline", getValue: (s) => s.tagline || "" },
            { header: "URL", getValue: (s) => s.url || "" },
            { header: "Badge", getValue: (s) => s.badge || "" },
            { header: "Status", getValue: (s) => s.isActive ? "Active" : "Inactive" },
            { header: "Display Order", getValue: (s) => s.displayOrder ?? "" },
          ]);
          downloadCsv(csv, `sponsors-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} sponsor${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
