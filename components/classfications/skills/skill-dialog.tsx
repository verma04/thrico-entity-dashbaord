"use client";

import React from "react";
import { Skill } from "@/graphql/quries/skills/skill-queries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SkillDialog({
  open,
  onOpenChange,
  editingSkill,
  isLoading,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSkill: Skill | null;
  isLoading: boolean;
  onSave: (values: { title: string }) => void;
}) {
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle(editingSkill?.title || "");
    }
  }, [open, editingSkill]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="font-bold text-foreground">
            {editingSkill ? "Edit Skill" : "Add Skill"}
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            {editingSkill
              ? "Update the skill name"
              : "Create a new professional skill to classify your members' areas of expertise"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="skill-title"
              className="text-sm font-semibold text-foreground"
            >
              Skill Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="skill-title"
              placeholder="e.g., React, TypeScript, Product Strategy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-border focus-visible:ring-indigo-500/20"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            className="rounded-lg font-semibold border-border"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            className="rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingSkill ? "Update" : "Save Skill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
