"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React, { useState } from "react";
import { Mentor } from "@/types/mentor-types";
import { MentorEditor } from "@/components/mentorship/mentor-editor";
import { MentorshipHeader } from "@/components/mentorship/mentorship-header";
import { MentorsTable } from "@/components/mentorship/mentors-table";
import { useMentorStore } from "@/store/useMentorStore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function AdminMentorsPage() {
  const { getAdminMentorsCount, getFilteredMentors } = useMentorStore();
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const adminCount = getAdminMentorsCount();

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

  return (
    <div className="space-y-6">
      <MentorshipHeader />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Admin Mentors</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {adminCount} admin-created mentors
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Mentor
        </Button>
      </div>

      <MentorsTable
        mentors={getFilteredMentors().filter((m) => m.source === "admin")}
        isLoading={false}
        onRefetch={() => {}}
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

export default withSubscriptionCheck(
  withModulePermission(AdminMentorsPage, "MENTORSHIP", "canEdit"),
  "mentorship"
);
