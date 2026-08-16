"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  useGetAllMoments,
  useAdminDeleteMoment,
  Moment,
} from "@/graphql/actions/moments";
import { toast } from "sonner";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { MomentCard } from "@/components/moments/moment-card";
import { MomentPreviewDialog } from "@/components/moments/moment-preview-dialog";
import { MomentsEmptyState } from "@/components/moments/moments-empty-state";
import { MomentsLoadingState } from "@/components/moments/moments-loading-state";
import { useModuleStore } from "@/store/useModuleStore";
import { PlaySquare, Plus, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import Link from "next/link";
import { cn } from "@/lib/utils";

function MomentsListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const { deleteMoment } = useAdminDeleteMoment();

  const {
    data: momentsData,
    loading: momentsLoading,
    error: momentsError,
    refetch: refetchMoments,
  } = useGetAllMoments({
    pagination: { page: 1, limit: 100 },
  });

  const moments = momentsData?.getAllMoments?.data || [];

  const filteredMoments = useMemo(() => {
    if (!debouncedSearch.trim()) return moments;
    const q = debouncedSearch.toLowerCase().trim();
    return moments.filter(
      (m) =>
        m.caption?.toLowerCase().includes(q) ||
        `${m.owner?.firstName} ${m.owner?.lastName}`.toLowerCase().includes(q),
    );
  }, [moments, debouncedSearch]);

  const handleDelete = async (id: string) => {
    try {
      const { data } = await deleteMoment({
        variables: { adminDeleteMomentId: id },
      });
      if (data?.adminDeleteMoment) {
        toast.success(`${singularName} deleted successfully`);
        refetchMoments();
      } else {
        toast.error(`Failed to delete ${singularName.toLowerCase()}`);
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting");
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText="Media"
        description={`Manage and view all ${moduleName.toLowerCase()}.`}
        icon={PlaySquare}
        breadcrumbs={[
          { label: moduleName, href: "/moments" },
          { label: "All" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchMoments?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", momentsLoading && "animate-spin")}
              />
            </Button>
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={`Search ${moduleName.toLowerCase()}…`}
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
          <EcosystemActionBar.Item>
            <Link href="/moments/create">
              <CtaButton>
                <Plus className="h-3.5 w-3.5" />
                Create
              </CtaButton>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredMoments.length > 0}>
            Showing {filteredMoments.length} of {moments.length} {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        {momentsError ? (
          <div className="p-8 bg-destructive/5 border border-destructive/20 rounded-3xl text-center">
            <p className="text-destructive font-bold">
              Failed to load {moduleName.toLowerCase()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {momentsError.message}
            </p>
          </div>
        ) : momentsLoading ? (
          <MomentsLoadingState />
        ) : filteredMoments.length === 0 ? (
          <MomentsEmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
            {filteredMoments.map((moment) => (
              <MomentCard
                key={moment?.id}
                moment={moment}
                onClick={() => setSelectedMoment(moment)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <MomentPreviewDialog
          moment={selectedMoment}
          onClose={() => setSelectedMoment(null)}
        />
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={moduleName.toLowerCase()}
        description={`Export short video moments as CSV. Includes caption, tags, creator, views, likes, and comments.`}
        totalCount={moments.length}
        matchingCount={debouncedSearch.trim() ? filteredMoments.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredMoments;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: `No ${moduleName.toLowerCase()} found.` });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Caption", getValue: (m) => m.caption || "" },
            { header: "Creator", getValue: (m) => m.user ? `${m.user.firstName || ""} ${m.user.lastName || ""}`.trim() : "" },
            { header: "Tags", getValue: (m) => (m.tags || []).join(", ") },
            { header: "Views", getValue: (m) => m.viewsCount ?? 0 },
            { header: "Likes", getValue: (m) => m.likesCount ?? 0 },
            { header: "Comments", getValue: (m) => m.commentsCount ?? 0 },
            { header: "Created At", getValue: (m) => m.createdAt ? new Date(m.createdAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `moments-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} ${moduleName.toLowerCase()} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(MomentsListPage, "MOMENTS", "canRead"),
  "moments",
);
