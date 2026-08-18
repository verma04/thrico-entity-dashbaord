"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  Images,
  Plus,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Upload,
  RefreshCw,
} from "lucide-react";
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
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { Pagination } from "@/components/shared/admin-table/admin-table";
import { InlineAlert } from "@/components/ui/inline-alert";

import {
  useGetMediaGalleryAlbums,
  useCreateMediaGalleryAlbum,
  useUpdateMediaGalleryAlbum,
  useDeleteMediaGalleryAlbum,
  useReorderMediaGalleryAlbums,
} from "@/graphql/actions/mediaGallery";
import {
  FILTER_TABS,
  SORT_OPTIONS,
  SectionHeader,
  ContentArea,
} from "./albums-manage-ui";
import { getAlbumTableColumns } from "./albums-list";
import { ExportAlbumsModal } from "./export-albums-modal";
import { AlbumFormDialog } from "./album-form-dialog";

export function AlbumsManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Update URL parameters helper ──────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "all" ||
          value === "0" ||
          value === "grid" ||
          value === "custom"
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // ── Derive state from URL search params ───────────────────────────────────
  const page = Number(searchParams.get("page") || "1");
  const limit = 24;
  const offset = (page - 1) * limit;

  const filter = searchParams.get("filter") || "ALL";
  const sortBy = searchParams.get("sort") || "custom";
  const view = (searchParams.get("view") as "grid" | "list") || "grid";

  // Search input state with debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  // Modal & Dialog states
  const [showExportModal, setShowExportModal] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Column visibility for List view
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    album: true,
    photos: true,
    featured: true,
    actions: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ── Setters ───────────────────────────────────────────────────────────────
  const setFilter = (v: string) =>
    updateParams({ filter: v === "ALL" ? null : v, page: null });

  const setSortBy = (v: string) =>
    updateParams({ sort: v === "custom" ? null : v, page: null });

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const setPage = (p: number) =>
    updateParams({ page: p <= 1 ? null : String(p) });

  // ── Fetch Albums & Mutations ──────────────────────────────────────────────
  const { data, loading, refetch } = useGetMediaGalleryAlbums();
  const [createAlbum] = useCreateMediaGalleryAlbum();
  const [updateAlbum] = useUpdateMediaGalleryAlbum();
  const [deleteAlbum] = useDeleteMediaGalleryAlbum();
  const [reorderAlbums] = useReorderMediaGalleryAlbums();

  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    if (data?.getMediaGalleryAlbums) {
      setAlbums([...data.getMediaGalleryAlbums]);
    }
  }, [data]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = albums.findIndex((a) => a.id === active.id);
    const newIndex = albums.findIndex((a) => a.id === over.id);
    const newAlbums = arrayMove(albums, oldIndex, newIndex);
    setAlbums(newAlbums);

    try {
      await reorderAlbums({
        variables: {
          input: newAlbums.map((a, i) => ({ id: a.id, order: i })),
        },
      });
      toast.success("Album order updated");
    } catch {
      toast.error("Failed to save order");
      refetch();
    }
  };

  // ── Filter and Sort Albums ────────────────────────────────────────────────
  const filteredAlbums = useMemo(() => {
    let list = [...albums];

    // Filter
    if (filter === "FEATURED") {
      list = list.filter((a) => a.isFeatured);
    } else if (filter === "REGULAR") {
      list = list.filter((a) => !a.isFeatured);
    }

    // Search filter
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.id?.toLowerCase().includes(q),
      );
    }

    // Sorting
    if (sortBy === "title") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "images-desc") {
      list.sort((a, b) => {
        const countA = a.imageCount ?? a.imagesCount ?? a.images?.length ?? 0;
        const countB = b.imageCount ?? b.imagesCount ?? b.images?.length ?? 0;
        return countB - countA;
      });
    } else if (sortBy === "images-asc") {
      list.sort((a, b) => {
        const countA = a.imageCount ?? a.imagesCount ?? a.images?.length ?? 0;
        const countB = b.imageCount ?? b.imagesCount ?? b.images?.length ?? 0;
        return countA - countB;
      });
    }

    return list;
  }, [albums, filter, debouncedSearch, sortBy]);

  // Paginated slice for current page
  const paginatedAlbums = useMemo(() => {
    return filteredAlbums.slice(offset, offset + limit);
  }, [filteredAlbums, offset, limit]);

  const handleCreate = async (input: any) => {
    await createAlbum({ variables: { input } });
    refetch();
  };

  const handleUpdate = async (id: string, input: any) => {
    await updateAlbum({ variables: { id, input } });
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAlbum({ variables: { id: deleteId } });
      toast.success("Album deleted successfully");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete album");
    } finally {
      setDeleteId(null);
    }
  };

  const handleClickAlbum = (albumId: string) => {
    router.push(`/media-gallery/${albumId}`);
  };

  const handleEditAlbum = (album: any) => {
    setEditingAlbum(album);
    setIsFormOpen(true);
  };

  const handleDeleteAlbum = (id: string) => {
    setDeleteId(id);
  };

  const isDragActive = sortBy === "custom" && view === "grid" && !debouncedSearch && filter === "ALL";

  const availableColumns = useMemo(
    () => getAlbumTableColumns(handleEditAlbum, handleDeleteAlbum, handleClickAlbum),
    [],
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Media Gallery"
        badgeText="Visual Hub"
        description="Manage photo albums, upload event photography, and curate visual community highlights."
        icon={Images}
        breadcrumbs={[{ label: "Media Gallery", href: "/media-gallery" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </Button>
            <CtaButton
              onClick={() => {
                setEditingAlbum(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Album
            </CtaButton>
          </div>
        }
      />

      {/* ── Notice Alert ─────────────────────────────────────────────────── */}
      <div className="space-y-4 px-3">
        <InlineAlert
          variant="alert"
          message="Albums organize high-resolution event media and community photography. Drag cards in Custom Order mode to reposition them in the public gallery carousel."
          className="rounded-xl"
        />
      </div>

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search albums by title…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Filters Group */}
        <EcosystemActionBar.Group>
          {/* Filter Dropdown */}
          <EcosystemActionBar.Item>
            <Select
              value={filter}
              onValueChange={(v) => setFilter(v)}
            >
              <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <div className="flex items-center gap-2">
                  {FILTER_TABS.find((t) => t.value === filter)?.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        FILTER_TABS.find((t) => t.value === filter)?.dot,
                      )}
                    />
                  )}
                  <SelectValue placeholder="Filter" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                {FILTER_TABS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {opt.dot && (
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            opt.dot,
                          )}
                        />
                      )}
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          {/* Sort Filter */}
          <EcosystemActionBar.Item>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v)}
            >
              <SelectTrigger className="w-[160px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[170px]">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-sm text-xs font-medium py-1 px-2 cursor-pointer"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        {/* Right controls */}
        <EcosystemActionBar.Group align="right">
          {/* Columns Toggle for List View */}
          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableColumns
                  .filter((c) => c.key !== "actions")
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={visibleColumns[col.key] !== false}
                      onCheckedChange={() => toggleColumn(col.key)}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {typeof col.header === "string" ? col.header : col.key}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Button */}
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>

          {/* View Toggle */}
          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />

          {/* New Album CTA Button */}
          <CtaButton
            onClick={() => {
              setEditingAlbum(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Album
          </CtaButton>

          <EcosystemActionBar.Separator />

          {/* Live Status Count */}
          <EcosystemActionBar.Status active={filteredAlbums.length > 0}>
            Showing {filteredAlbums.length} of {albums.length} Albums
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Container ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        {/* Section Header (appears when filtered by non-ALL filter) */}
        <SectionHeader
          filter={filter}
          count={filteredAlbums.length}
          loading={loading}
        />

        {/* Content Area (Grid vs List with Motion + Optional DnD) */}
        {isDragActive ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <ContentArea
              view={view}
              loading={loading}
              albums={paginatedAlbums}
              onEdit={handleEditAlbum}
              onDelete={handleDeleteAlbum}
              onClick={handleClickAlbum}
              enableDrag={true}
              visibleColumns={visibleColumns}
              offset={offset}
            />
          </DndContext>
        ) : (
          <ContentArea
            view={view}
            loading={loading}
            albums={paginatedAlbums}
            onEdit={handleEditAlbum}
            onDelete={handleDeleteAlbum}
            onClick={handleClickAlbum}
            enableDrag={false}
            visibleColumns={visibleColumns}
            offset={offset}
          />
        )}

        {/* Pagination Controls */}
        {!loading && filteredAlbums.length > limit && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredAlbums.length / limit)}
              totalItems={filteredAlbums.length}
              pageSize={limit}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </EcosystemContainer>

      {/* ── Create / Edit Album Form Dialog ───────────────────────────────── */}
      <AlbumFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingAlbum={editingAlbum}
        albumCount={albums.length}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {/* ── Delete Confirmation Dialog ────────────────────────────────────── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Album?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the album,
              its associated photos, and comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Delete Album
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Export CSV Modal ──────────────────────────────────────────────── */}
      <ExportAlbumsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        albums={filteredAlbums}
        totalCount={albums.length}
        matchingCount={
          debouncedSearch.trim() || filter !== "ALL"
            ? filteredAlbums.length
            : undefined
        }
      />
    </EcosystemWrapper>
  );
}

export default AlbumsManager;
