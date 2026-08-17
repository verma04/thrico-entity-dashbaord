"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List as ListIcon, Users, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";

import { getCommunities } from "@/graphql/actions/group";
import TableLoading from "@/components/layout/table-loading";
import { Button } from "@/components/ui/button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { cn } from "@/lib/utils";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { useModuleStore } from "@/store/useModuleStore";

import { CommunitiesList } from "./communities-list";
import { CommunityCard } from "./community-card";

// ─────────────────────────────────────────────────────────────────────────────
// Status options
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "ALL", label: "All", dot: "" },
  { value: "APPROVED", label: "Approved", dot: "bg-emerald-500" },
  { value: "PENDING", label: "Pending", dot: "bg-amber-500" },
  { value: "DISABLED", label: "Disabled", dot: "bg-orange-500" },
  { value: "REJECTED", label: "Rejected", dot: "bg-red-500" },
  { value: "PAUSED", label: "Paused", dot: "bg-slate-400" },
];

export interface CommunitiesManageProps {
  status?: string;
}

export function CommunitiesManage({
  status: initialStatus,
}: CommunitiesManageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "0"
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

  const status = searchParams.get("status") || initialStatus || "ALL";
  const setStatus = (v: string) => updateParams({ status: v, page: null });

  const view = (searchParams.get("view") as "grid" | "table") || "table";
  const setView = (v: "grid" | "table") =>
    updateParams({ view: v === "table" ? null : v });

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(search, 500);
  const [showExportModal, setShowExportModal] = useState(false);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null, page: null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const { data, loading, refetch } = getCommunities({
    variables: {
      input: {
        status: status === "ALL" ? undefined : status,
      },
    },
  });

  const communities =
    data?.getCommunities?.data ||
    (Array.isArray(data?.getCommunities) ? data.getCommunities : []);
  const totalCount = data?.getCommunities?.total ?? communities.length;

  const filteredCommunities = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return communities;
    return communities.filter(
      (c: any) =>
        c.title?.toLowerCase().includes(q) ||
        c.tagline?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q),
    );
  }, [communities, debouncedSearch]);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText={`${singularName} List`}
        description={
          loading
            ? `Loading ${moduleName.toLowerCase()}…`
            : `Manage and view all ${communities.length} ${moduleName.toLowerCase()}.`
        }
        icon={Users}
        breadcrumbs={[
          { label: moduleName, href: "/communities/all" },
          { label: "All" },
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
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by name, tagline…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={status}
              onValueChange={setStatus}
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
          <EcosystemActionBar.Item>
            <EcosystemActionBar.ViewToggle
              value={view}
              onChange={(val) => setView(val as "grid" | "table")}
              options={[
                { id: "grid", label: "Grid", icon: LayoutGrid },
                { id: "table", label: "Table", icon: ListIcon },
              ]}
            />
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredCommunities.length > 0}>
            Showing {filteredCommunities.length} of {communities.length}{" "}
            {moduleName}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TableLoading />
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCommunities.map((community: any) => (
                    <CommunityCard key={community.id} record={community} />
                  ))}
                  {filteredCommunities.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl bg-muted/20">
                      <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3 text-muted-foreground/40">
                        <Users className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        No results found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <CommunitiesList data={filteredCommunities} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={moduleName.toLowerCase()}
        description={`Export communities and groups as CSV. Includes title, description, privacy, member count, and status.`}
        totalCount={communities.length}
        matchingCount={
          debouncedSearch.trim() || status !== "ALL"
            ? filteredCommunities.length
            : undefined
        }
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredCommunities;
          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: `No ${moduleName.toLowerCase()} found.`,
            });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Title", getValue: (c: any) => c.title || "" },
            {
              header: "Description",
              getValue: (c: any) => c.description || "",
            },
            {
              header: "Privacy",
              getValue: (c: any) =>
                c.privacy || (c.isPrivate ? "Private" : "Public"),
            },
            { header: "Status", getValue: (c: any) => c.status || "" },
            {
              header: "Members Count",
              getValue: (c: any) =>
                c.numberOfUser ?? c.membersCount ?? (c.members?.length || 0),
            },
            {
              header: "Created At",
              getValue: (c: any) =>
                c.createdAt
                  ? new Date(c.createdAt).toISOString().slice(0, 10)
                  : "",
            },
          ]);
          downloadCsv(
            csv,
            `communities-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          toast.success("Export ready", {
            description: `${rows.length} ${moduleName.toLowerCase()} exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}

export default CommunitiesManage;
