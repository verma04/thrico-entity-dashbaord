"use client";

import React, { useState } from "react";
import { Mentor } from "@/types/mentor-types";
import { MentorEditor } from "@/components/mentorship/mentor-editor";
import { MentorshipHeader } from "@/components/mentorship/mentorship-header";
import { MentorFilters } from "@/components/mentorship/mentor-filters";
import { MentorsTable } from "@/components/mentorship/mentors-table";
import { useMentorStore } from "@/store/useMentorStore";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useGetAllMentor } from "@/graphql/mentorship/mentorship-quiries";

export default function AllMentorsPage() {
  const { filters, setFilters, resetFilters, categories, getPendingCount } =
    useMentorStore();
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const pendingCount = getPendingCount();

  const mappedStatus =
    filters.status === "all" ? "ALL" : (filters.status.toUpperCase() as any);

  const { data, loading, error, refetch } = useGetAllMentor({
    variables: {
      input: {
        status: mappedStatus,
        limit: 50,
        offset: 0,
      },
    },
  });

  const mentors = (data?.getAllMentor || []).map((m: any) => ({
    ...m,
    name:
      m.displayName ||
      `${m.user?.user?.firstName || ""} ${m.user?.user?.lastName || ""}`.trim() ||
      "Anonymous",
    image: m.user?.user?.avatar,
    title: m.intro || "Mentor",
    bio: m.about,
    categoryId: m.category?.id,
    status: m.isApproved ? "approved" : m.isRequested ? "pending" : "inactive",
    categoryName: m.category?.title || "Uncategorized",
  }));

  const handleEdit = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedMentor(null);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedMentor(null);
  };

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending", count: pendingCount },
    { value: "rejected", label: "Rejected" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <div className="space-y-6">
      <MentorshipHeader />

      <MentorFilters
        filters={filters as any}
        setFilters={setFilters as any}
        resetFilters={resetFilters}
        categories={categories.map((c: any) => ({
          id: c.id,
          name: c.name || c.title,
        }))}
        statusOptions={statusOptions}
      />

      <MentorsTable
        mentors={mentors}
        isLoading={loading}
        onRefetch={refetch}
        onEdit={handleEdit}
      />

      <MentorEditor
        mentor={selectedMentor}
        open={isEditorOpen}
        onOpenChange={handleCloseEditor}
      />
    </div>
  );
}
