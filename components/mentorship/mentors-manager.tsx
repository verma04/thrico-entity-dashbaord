"use client";

import React, { useState } from "react";
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
import {
  Plus,
  Search,
  LayoutGrid,
  GraduationCap,
  X,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

import { useModuleStore } from "@/store/useModuleStore";

export function MentorsManager() {
  const moduleName = useModuleStore((state) => state.mentorshipModuleName);
  const singularName = useModuleStore((state) => state.mentorshipSingularName);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);

  // Queries
  const {
    data: mentorsData,
    loading: mentorsLoading,
    refetch: refetchMentors,
  } = useGetAllMentor({
    variables: {
      input: {
        status: selectedStatus === "ALL" ? undefined : selectedStatus,
        searchQuery: search || undefined,
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

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedStatus("ALL");
  };

  const mentorsRaw = mentorsData?.getAllMentor || [];

  const mentors = mentorsRaw.map((m: any) => ({
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

  const categories = categoriesData?.getMentorCategories || [];
  const currentStatus =
    STATUS_OPTIONS.find((opt) => opt.value === selectedStatus) ||
    STATUS_OPTIONS[0];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${moduleName} Program`}
        badgeText="Expert Network"
        description={`Oversee and manage the ${singularName.toLowerCase()}s in your ecosystem, approve applications, and feature top performers.`}
        icon={GraduationCap}
        breadcrumbs={[
          { label: "Mentorship", href: "/mentorship/all" },
          { label: "Mentors" },
        ]}
        actions={
          <Link href="/mentorship/add-mentor">
            <CtaButton>
              <Plus className="h-4 w-4 mr-1.5" />
              Onboard {singularName}
            </CtaButton>
          </Link>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder={`Search ${singularName.toLowerCase()}s by name...`}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring/20">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="All Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                <SelectItem
                  value="all"
                  className="rounded-lg text-sm font-medium py-2"
                >
                  All Categories
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className="rounded-lg text-sm font-medium py-2"
                  >
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px] h-9 rounded-lg border-border bg-card text-sm font-medium text-foreground focus:ring-2 focus:ring-ring/20 shadow-none">
                <div className="flex items-center gap-2">
                  {currentStatus.dot && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        currentStatus.dot,
                      )}
                    />
                  )}
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-lg p-1">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="rounded-lg text-sm font-medium py-2"
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
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={mentors.length > 0}>
            {mentors.length} Active {singularName}s
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
    </EcosystemWrapper>
  );
}
