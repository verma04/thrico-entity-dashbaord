"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import List from "./forum-list";
import { getDiscussionForum } from "../../../graphql/actions/discussion-form";
import { discussionForumStatus } from "../ts-types";
import TableLoading from "@/components/layout/table-loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List as ListIcon,
  MessageSquare,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import ForumCard from "./forum-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import Post from "@/components/forums/post/forum-post";
import { useModuleStore } from "@/store/useModuleStore";

// ─────────────────────────────────────────────────────────────────────────────
// Status & Filter options
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "ALL", label: "All", dot: "" },
  { value: "APPROVED", label: "Approved", dot: "bg-emerald-500" },
  { value: "PENDING", label: "Pending", dot: "bg-amber-500" },
  { value: "DISABLED", label: "Disabled", dot: "bg-orange-500" },
  { value: "REJECTED", label: "Rejected", dot: "bg-red-500" },
];

const VERIFICATION_OPTIONS = [
  { value: "ALL", label: "All Posts" },
  { value: "VERIFIED", label: "Verified" },
  { value: "UNVERIFIED", label: "Unverified" },
];

interface ForumProps {
  status?: discussionForumStatus;
}

export default function Forum({ status: initialStatus }: ForumProps) {
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

  const status =
    (searchParams.get("status") as discussionForumStatus) ||
    initialStatus ||
    "ALL";
  const setStatus = (v: discussionForumStatus) =>
    updateParams({ status: v === "ALL" ? null : v });

  const verificationFilter = searchParams.get("verification") || "ALL";
  const setVerificationFilter = (v: string) =>
    updateParams({ verification: v === "ALL" ? null : v });

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
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const { data, loading, refetch } = getDiscussionForum({
    variables: {
      input: {
        status: status === "ALL" ? undefined : status,
      },
    },
  });

  const forums = data?.getDiscussionForum || [];

  const filteredForums = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return forums.filter((f: any) => {
      // Apply Search Filter
      const matchesSearch =
        !q ||
        f.title?.toLowerCase().includes(q) ||
        f.content?.toLowerCase().includes(q);

      // Apply Verification Filter
      const isVerified = f.verification?.isVerified || false;
      const matchesVerification =
        verificationFilter === "ALL"
          ? true
          : verificationFilter === "VERIFIED"
            ? isVerified
            : !isVerified;

      return matchesSearch && matchesVerification;
    });
  }, [forums, debouncedSearch, verificationFilter]);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={moduleName}
        badgeText="Community Dialogues"
        description={
          loading
            ? `Loading ${moduleName.toLowerCase()}…`
            : `Monitor, moderate, and engage with ${forums.length} ${moduleName.toLowerCase()}.`
        }
        icon={MessageSquare}
        breadcrumbs={[{ label: moduleName, href: "/forums" }, { label: "All" }]}
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
              placeholder={`Search ${moduleName.toLowerCase()}…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={status}
              onValueChange={(val: any) => setStatus(val)}
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
                dot: opt.dot || undefined,
              }))}
              placeholder="Status"
            />
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={verificationFilter}
              onValueChange={setVerificationFilter}
              options={VERIFICATION_OPTIONS}
              placeholder="Verification"
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
              onChange={(val: string) => setView(val as "grid" | "table")}
              options={[
                { id: "grid", label: "Grid", icon: LayoutGrid },
                { id: "table", label: "Table", icon: ListIcon },
              ]}
            />
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Post />
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredForums.length > 0}>
            Showing {filteredForums.length} of {forums.length} {moduleName}
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
                  {filteredForums.map((forum: any) => (
                    <ForumCard key={forum.id} record={forum} />
                  ))}
                  {filteredForums.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl bg-muted/20">
                      <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3 text-muted-foreground/40">
                        <MessageSquare className="h-6 w-6" />
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
                <List data={filteredForums} loading={loading} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </EcosystemContainer>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={moduleName.toLowerCase()}
        description={`Export forum discussions and posts as CSV. Includes title, content, author, status, and verification.`}
        totalCount={forums.length}
        matchingCount={debouncedSearch.trim() || statusParam !== "ALL" || verificationParam !== "ALL" ? filteredForums.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredForums;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: `No ${moduleName.toLowerCase()} found.` });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Title", getValue: (f) => f.title || "" },
            { header: "Content", getValue: (f) => f.description || f.content || "" },
            { header: "Author", getValue: (f) => f.creator ? `${f.creator.firstName || ""} ${f.creator.lastName || ""}`.trim() : "" },
            { header: "Status", getValue: (f) => f.status || "" },
            { header: "Verified", getValue: (f) => f.isVerified ? "Yes" : "No" },
            { header: "Created At", getValue: (f) => f.createdAt ? new Date(f.createdAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `forums-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} ${moduleName.toLowerCase()} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
