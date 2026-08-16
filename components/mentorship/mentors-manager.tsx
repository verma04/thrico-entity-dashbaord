"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import {
  useGetAllMentor,
  useGetMentorCategories,
  useUpdateMentorshipStatus,
  Mentor,
} from "@/graphql/mentorship/mentorship-quiries";
import { MentorsTable } from "./mentors-table";
import { MentorEditor } from "./mentor-editor";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import {
  Plus,
  Search,
  LayoutGrid,
  GraduationCap,
  X,
  CheckCircle2,
  Clock,
  Ban,
  RefreshCw,
  Upload,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useModuleStore } from "@/store/useModuleStore";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Status", icon: LayoutGrid, dot: "" },
  {
    value: "APPROVED",
    label: "Approved",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
  },
  { value: "PENDING", label: "Pending", icon: Clock, dot: "bg-amber-500" },
  { value: "REJECTED", label: "Rejected", icon: Ban, dot: "bg-rose-500" },
];

export function MentorsManager() {
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

  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);

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

  // Queries
  const {
    data: mentorsData,
    loading: mentorsLoading,
    refetch: refetchMentors,
  } = useGetAllMentor({
    variables: {
      input: {
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
        searchQuery: debouncedSearch.trim() || undefined,
        category: selectedCategory === "all" ? undefined : selectedCategory,
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

  const mentorsRaw = mentorsData?.getAllMentor || [];

  const mentors = useMemo(() => {
    return mentorsRaw.map((m: any) => ({
      ...m,
      name:
        m.displayName ||
        `${m.mentorUser?.user?.firstName || ""} ${m.mentorUser?.user?.lastName || ""}`.trim() ||
        "Anonymous",
      image: m.mentorUser?.user?.avatar
        ? `https://cdn.thrico.network/${m.mentorUser?.user?.avatar}`
        : undefined,
      title: m.intro || "Mentor",
      categoryName: m.category?.title || "Uncategorized",
      status: m.isApproved ? "approved" : m.isRequested ? "pending" : "inactive",
      expertise: m.skills || [],
    }));
  }, [mentorsRaw]);

  const categories = categoriesData?.getMentorCategories || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${moduleName} Program`}
        badgeText="Expert Network"
        description={`Oversee and manage the ${singularName.toLowerCase()}s in your ecosystem, approve applications, and feature top performers.`}
        icon={GraduationCap}
        breadcrumbs={[
          { label: moduleName, href: "/mentorship/all" },
          { label: "Mentors" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchMentors?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", mentorsLoading && "animate-spin")}
              />
            </Button>
            <Link href="/mentorship/add-mentor">
              <CtaButton>
                <Plus className="h-3.5 w-3.5" />
                Onboard {singularName}
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
              placeholder={`Search ${singularName.toLowerCase()}s by name…`}
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
          <EcosystemActionBar.Status active={mentors.length > 0}>
            Showing {mentors.length} {singularName}s
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <MentorsTable
          mentors={mentors}
          isLoading={mentorsLoading}
          onEdit={handleEdit}
          onRefetch={refetchMentors}
        />
      </EcosystemContainer>

      {/* Editor Modal */}
      <MentorEditor
        mentor={editingMentor}
        open={isEditorOpen}
        onOpenChange={(open) => {
          setIsEditorOpen(open);
          if (!open) setEditingMentor(null);
        }}
        onRefetch={refetchMentors}
      />

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName={singularName.toLowerCase() + "s"}
        description={`Export ${singularName.toLowerCase()}s directory as CSV. Includes name, email, title, category, status, and expertise.`}
        totalCount={mentorsRaw.length}
        matchingCount={debouncedSearch.trim() || selectedCategory !== "all" || selectedStatus !== "ALL" ? mentors.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = mentors;
          if (rows.length === 0) {
            toast.error("Nothing to export", { description: `No ${singularName.toLowerCase()}s found.` });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Name", getValue: (m) => m.name || "" },
            { header: "Email", getValue: (m) => m.mentorUser?.user?.email || "" },
            { header: "Title / Intro", getValue: (m) => m.intro || m.title || "" },
            { header: "Category", getValue: (m) => m.categoryName || "" },
            { header: "Status", getValue: (m) => m.status || "" },
            { header: "Expertise", getValue: (m) => (m.expertise || []).join("; ") },
          ]);
          downloadCsv(csv, `mentors-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${rows.length} ${singularName.toLowerCase()}${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
