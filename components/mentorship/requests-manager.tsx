"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  useMentorshipRequests,
  useGetMentorCategories,
  Mentor,
} from "@/graphql/mentorship/mentorship-quiries";
import { RequestsTable } from "./requests-table";
import { MentorEditor } from "./mentor-editor";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import {
  Search,
  LayoutGrid,
  GraduationCap,
  CheckCircle2,
  Clock,
  Ban,
  RefreshCw,
  Upload,
  UserCheck,
  Settings2,
  AlertCircle,
  Users,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";
import { useEntitySettings } from "@/graphql/actions";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Requests", icon: LayoutGrid, dot: "" },
  { value: "PENDING", label: "Pending Review", icon: Clock, dot: "bg-amber-500" },
  {
    value: "APPROVED",
    label: "Approved",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
  },
  { value: "REJECTED", label: "Rejected", icon: Ban, dot: "bg-rose-500" },
];

export function RequestsManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);

  const { data: settingsData } = useEntitySettings();
  const autoApprove = settingsData?.getEntitySettings?.autoApproveMentorship;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === null ||
          value === "" ||
          value === "ALL" ||
          value === "all" ||
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

  const selectedCategory = searchParams.get("category") || "all";
  const setSelectedCategory = (v: string) =>
    updateParams({ category: v === "all" ? null : v });

  const selectedStatus = searchParams.get("status") || "ALL";
  const setSelectedStatus = (v: string) =>
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

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch Requests
  const {
    data: requestsData,
    loading: requestsLoading,
    refetch: refetchRequests,
  } = useMentorshipRequests({
    variables: {
      input: {
        limit: 100,
        offset: 0,
      },
    },
    fetchPolicy: "network-only",
  });

  const { data: categoriesData } = useGetMentorCategories();

  const handleEdit = (mentor: Mentor) => {
    setEditingMentor(mentor);
    setIsEditorOpen(true);
  };

  const requestsRaw = requestsData?.mentorshipRequests || [];

  // Normalize raw data
  const normalizedRequests = useMemo(() => {
    return requestsRaw.map((m: any) => ({
      ...m,
      name:
        m.displayName ||
        `${m.mentorUser?.user?.firstName || ""} ${m.mentorUser?.user?.lastName || ""}`.trim() ||
        "Anonymous",
      email: m.mentorUser?.user?.email || "",
      avatar: m.mentorUser?.user?.avatar,
      image: m.mentorUser?.user?.avatar
        ? `https://cdn.thrico.network/${m.mentorUser?.user?.avatar}`
        : undefined,
      title: m.intro || m.about || "Mentor Applicant",
      categoryName: m.category?.title || "Uncategorized",
      categoryId: m.category?.id,
      status: m.isApproved
        ? "approved"
        : m.isRequested
        ? "pending"
        : "rejected",
      expertise: m.skills || [],
    }));
  }, [requestsRaw]);

  // Client-side filtering based on search, category, and status
  const filteredRequests = useMemo(() => {
    return normalizedRequests.filter((item: any) => {
      // Category filter
      if (selectedCategory !== "all" && item.categoryId !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "ALL") {
        if (selectedStatus.toLowerCase() !== item.status.toLowerCase()) {
          return false;
        }
      }

      // Search filter
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesEmail = item.email.toLowerCase().includes(query);
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesCategory = item.categoryName.toLowerCase().includes(query);
        const matchesSkills = (item.expertise || []).some((s: string) =>
          s.toLowerCase().includes(query),
        );

        if (!matchesName && !matchesEmail && !matchesTitle && !matchesCategory && !matchesSkills) {
          return false;
        }
      }

      return true;
    });
  }, [normalizedRequests, selectedCategory, selectedStatus, debouncedSearch]);

  const categories = categoriesData?.getMentorCategories || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${singularName} Requests`}
        badgeText="Review Queue"
        description={`Review and manage incoming ${singularName.toLowerCase()} applications, inspect candidate qualifications, and approve or reject submissions.`}
        icon={UserCheck}
        breadcrumbs={[
          { label: moduleName, href: "/mentorship/all" },
          { label: "Requests" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchRequests?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", requestsLoading && "animate-spin")}
              />
            </Button>
            <Link href="/mentorship/all">
              <Button
                variant="outline"
                className="h-9 gap-1.5 rounded-lg border-border text-xs font-medium"
              >
                <Users className="h-3.5 w-3.5" />
                All {moduleName}
              </Button>
            </Link>
            <Link href="/mentorship/settings">
              <Button
                variant="outline"
                className="h-9 gap-1.5 rounded-lg border-border text-xs font-medium"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Settings
              </Button>
            </Link>
          </div>
        }
      />

      {autoApprove && (
        <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200">
          <Settings2 className="h-4 w-4 stroke-amber-600 dark:stroke-amber-400" />
          <AlertTitle className="font-semibold text-amber-900 dark:text-amber-200">
            Auto-Approval Enabled
          </AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-300 text-xs mt-1 leading-relaxed">
            Your system is configured to <strong>automatically approve</strong> all {singularName.toLowerCase()} applications. New requests will not queue here as they bypass manual review. 
            To require manual approval, adjust this setting in{" "}
            <Link href="/mentorship/settings" className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-100">
              {moduleName} Settings
            </Link>.
          </AlertDescription>
        </Alert>
      )}

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder={`Search ${singularName.toLowerCase()} requests…`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              placeholder="All Categories"
              options={[
                { value: "all", label: "All Categories", icon: LayoutGrid },
                ...categories.map((cat: any) => ({
                  value: cat.id,
                  label: cat.title,
                })),
              ]}
            />
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              placeholder="Status"
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
                icon: opt.icon,
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
          <EcosystemActionBar.Status active={filteredRequests.length > 0}>
            Showing {filteredRequests.length} {singularName} Request{filteredRequests.length !== 1 ? "s" : ""}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <RequestsTable
          requests={filteredRequests}
          isLoading={requestsLoading}
          onEdit={handleEdit}
          onRefetch={refetchRequests}
        />
      </EcosystemContainer>

      {/* Review / Edit Modal */}
      <MentorEditor
        mentor={editingMentor}
        open={isEditorOpen}
        onOpenChange={(open) => {
          setIsEditorOpen(open);
          if (!open) setEditingMentor(null);
        }}
        onRefetch={refetchRequests}
      />

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={`${singularName.toLowerCase()} requests`}
        description={`Export ${singularName.toLowerCase()} requests list as CSV. Includes name, email, category, title, status, and expertise.`}
        totalCount={requestsRaw.length}
        matchingCount={
          debouncedSearch.trim() || selectedCategory !== "all" || selectedStatus !== "ALL"
            ? filteredRequests.length
            : undefined
        }
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredRequests;
          if (rows.length === 0) {
            toast.error("Nothing to export", {
              description: `No ${singularName.toLowerCase()} requests found.`,
            });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Applicant Name", getValue: (r) => r.name || "" },
            { header: "Email", getValue: (r) => r.email || "" },
            { header: "Title / Intro", getValue: (r) => r.title || "" },
            { header: "Category", getValue: (r) => r.categoryName || "" },
            { header: "Status", getValue: (r) => r.status || "" },
            { header: "Expertise / Skills", getValue: (r) => (r.expertise || []).join("; ") },
            { header: "Submitted Date", getValue: (r) => r.createdAt || "" },
          ]);
          downloadCsv(
            csv,
            `mentor-requests-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          toast.success("Export ready", {
            description: `${rows.length} ${singularName.toLowerCase()} request${
              rows.length !== 1 ? "s" : ""
            } exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
