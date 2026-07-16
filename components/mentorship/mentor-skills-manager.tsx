"use client";

import React, { useState } from "react";
import {
  useGetMentorSkills,
  MentorSkill,
} from "@/graphql/mentorship/mentorship-quiries";
import {
  useAddMentorshipSkills,
  useUpdateMentorshipSkills,
  useDeleteMentorshipSkills,
} from "@/graphql/mentorship/mentoship-muation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { MentorSkillDialog } from "./mentor-skill-dialog";
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

export function MentorSkillsManager() {
  const { data, loading, refetch } = useGetMentorSkills();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<MentorSkill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<MentorSkill | null>(null);

  const [createSkill, { loading: creating }] = useAddMentorshipSkills({
    onCompleted: () => {
      toast.success("Skill created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => toast.error(error.message || "Failed to create skill"),
  });

  const [updateSkill, { loading: updating }] = useUpdateMentorshipSkills({
    onCompleted: () => {
      toast.success("Skill updated successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => toast.error(error.message || "Failed to update skill"),
  });

  const [deleteSkill, { loading: deleting }] = useDeleteMentorshipSkills({
    onCompleted: () => {
      toast.success("Skill deleted successfully");
      setSkillToDelete(null);
      refetch();
    },
    onError: (error) => toast.error(error.message || "Failed to delete skill"),
  });

  const handleSave = async (values: { title: string }) => {
    try {
      if (editingSkill) {
        await updateSkill({
          variables: {
            input: {
              id: editingSkill.id,
              title: values.title,
            },
          },
        });
      } else {
        await createSkill({
          variables: { input: values },
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (skill: MentorSkill) => {
    setEditingSkill(skill);
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;

    try {
      await deleteSkill({
        variables: { input: { id: skillToDelete.id } },
      });
    } catch (error) {
      // Error handled in onError
    }
  };

  const skills = data?.getMentorSkills || [];
  const filteredSkills = skills.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: ColumnDef<MentorSkill>[] = [
    {
      accessorKey: "title",
      header: "Skill Title",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.title}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => handleEdit(row.original)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            onClick={() => setSkillToDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search skills..."
            className="bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingSkill(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredSkills}
        isLoading={loading}
        skeletonCount={3}
        rowClassName="h-14 group"
      />

      <MentorSkillDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingSkill={editingSkill}
        isLoading={creating || updating}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!skillToDelete}
        onOpenChange={(open) => !open && setSkillToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the skill{" "}
              <span className="font-bold text-foreground">
                "{skillToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Skill"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
