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
import { Plus, Filter, Loader2, LayoutGrid, Network } from "lucide-react";
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { notify } from "@/lib/notify";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SkillDialog } from "../../../../../components/classfications/skills/skill-dialog";
import { SkillUsersSheet } from "../../../../../components/classfications/skills/skill-users-sheet";
import { SkillsGrid } from "../../../../../components/classfications/skills/skills-grid";
import { SkillsGraphView } from "../../../../../components/classfications/skills/skills-graph-view";
import { RECOMMENDED_SKILLS } from "../../../../../components/classfications/skills/recommended-skills";

export default function SkillsPage() {
  const { data, loading, refetch } = useGetSkills();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [viewingSkill, setViewingSkill] = useState<Skill | null>(null);
  const [activeTab, setActiveTab] = useState("list");

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
  const filteredSkills = skills.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <EcosystemActionBar
        shadow="none"
        className="rounded-xl border border-border"
      >
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-[360px]">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search skills..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          {/* View toggle */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-9 p-0.5 bg-muted/60 rounded-lg">
              <TabsTrigger
                value="list"
                className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                List
              </TabsTrigger>
              <TabsTrigger
                value="graph"
                className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Network className="h-3.5 w-3.5" />
                Graph
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <EcosystemActionBar.Separator />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="font-semibold text-xs px-4 h-9 rounded-lg shadow-sm gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
              onClick={handleBulkAdd}
              disabled={bulkAdding}
            >
              {bulkAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Recommended
            </Button>
            <Button
              className="font-semibold text-xs px-6 h-9 rounded-lg shadow-sm gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                setEditingSkill(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </Button>
          </div>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-border bg-card text-muted-foreground hover:text-foreground shadow-none"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredSkills.length > 0}>
            {filteredSkills.length} Skills
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        {activeTab === "list" ? (
          <SkillsGrid
            skills={filteredSkills}
            isLoading={loading}
            onEdit={(skill) => {
              setEditingSkill(skill);
              setIsDialogOpen(true);
            }}
            onDelete={(skill) => setSkillToDelete(skill)}
            onViewUsers={(skill) => setViewingSkill(skill)}
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

      {/* View Users Sheet */}
      <SkillUsersSheet
        skill={viewingSkill}
        open={!!viewingSkill}
        onOpenChange={(open) => !open && setViewingSkill(null)}
      />
    </>
  );
}
