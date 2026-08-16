"use client";

import React, { useState } from "react";
import {
  useGetSkills,
  useAddSkill,
  useUpdateSkill,
  useDeleteSkill,
  Skill,
  useBulkAddSkills,
} from "@/graphql/quries/skills/skill-queries";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, LayoutGrid, Network, Upload } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
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
import { ClassificationActionBar } from "../../../../../components/classfications/shared/classification-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { notify } from "@/lib/notify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CtaButton } from "@/components/ui/cta-button";

import { SkillDialog } from "../../../../../components/classfications/skills/skill-dialog";
import { SkillsListView } from "../../../../../components/classfications/skills/skills-list-view";
import { SkillsGraphView } from "../../../../../components/classfications/skills/skills-graph-view";
import { RECOMMENDED_SKILLS } from "../../../../../components/classfications/skills/recommended-skills";

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, loading, refetch } = useGetSkills({
    variables: { search: debouncedSearch, limit: 100 },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [showExportModal, setShowExportModal] = useState(false);

  const [addSkill, { loading: creating }] = useAddSkill({
    onCompleted: () => {
      notify.success("Skill created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => notify.error(error.message || "Failed to create skill"),
  });

  const [updateSkill, { loading: updating }] = useUpdateSkill({
    onCompleted: () => {
      notify.success("Skill updated successfully");
      setIsDialogOpen(false);
      setEditingSkill(null);
      refetch();
    },
    onError: (error) => notify.error(error.message || "Failed to update skill"),
  });

  const [deleteSkill, { loading: deleting }] = useDeleteSkill({
    onCompleted: () => {
      notify.success("Skill deleted successfully");
      setSkillToDelete(null);
      refetch();
    },
    onError: (error) => notify.error(error.message || "Failed to delete skill"),
  });

  const [bulkAddSkills, { loading: bulkAdding }] = useBulkAddSkills({
    onCompleted: (res) => {
      const addedCount = res.bulkAddSkills?.length || 0;
      if (addedCount > 0) {
        notify.success(`Successfully added ${addedCount} skills`);
      } else {
        notify.info("All recommended skills already exist");
      }
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to bulk add skills"),
  });

  const handleSave = async (values: { title: string }) => {
    if (editingSkill) {
      await updateSkill({
        variables: { input: { id: editingSkill.id, title: values.title } },
      });
    } else {
      await addSkill({
        variables: { input: values },
      });
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    await deleteSkill({
      variables: { input: { id: skillToDelete.id } },
    });
  };

  const handleBulkAdd = async () => {
    await bulkAddSkills({
      variables: { input: { titles: RECOMMENDED_SKILLS } },
    });
  };

  const skills = data?.getSkills || [];

  return (
    <>
      <ClassificationActionBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search skills..."
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <>
            <CtaButton
              variant="outline"
              onClick={handleBulkAdd}
              disabled={bulkAdding}
            >
              {bulkAdding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Add Recommended
            </CtaButton>
            <CtaButton
              onClick={() => {
                setEditingSkill(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Skill
            </CtaButton>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </>
        }
        statusText={`${skills.length} Skills`}
        statusActive={skills.length > 0}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <SkillsListView
            skills={skills}
            isLoading={loading}
            onEdit={(skill) => {
              setEditingSkill(skill);
              setIsDialogOpen(true);
            }}
            onDelete={(skill) => setSkillToDelete(skill)}
          />
        ) : (
          <SkillsGraphView />
        )}
      </EcosystemContainer>

      {/* Add/Edit Dialog */}
      <SkillDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingSkill={editingSkill}
        isLoading={creating || updating}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!skillToDelete}
        onOpenChange={(open) => !open && setSkillToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-foreground">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently delete the skill{" "}
              <span className="font-bold text-foreground">
                "{skillToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-lg font-semibold border-border"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Skill"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="skills"
        description="Export community member skill classifications as CSV."
        totalCount={skills.length}
        matchingCount={debouncedSearch.trim() ? skills.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          if (skills.length === 0) {
            toast.error("Nothing to export", { description: "No skills found." });
            return;
          }
          const csv = buildCsv(skills, [
            { header: "Skill Title", getValue: (s) => s.title || "" },
            { header: "Created At", getValue: (s) => s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 10) : "" },
            { header: "Updated At", getValue: (s) => s.updatedAt ? new Date(s.updatedAt).toISOString().slice(0, 10) : "" },
          ]);
          downloadCsv(csv, `skills-${new Date().toISOString().slice(0, 10)}`, format);
          toast.success("Export ready", { description: `${skills.length} skill${skills.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </>
  );
}
