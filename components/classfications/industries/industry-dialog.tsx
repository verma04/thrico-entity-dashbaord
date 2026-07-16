"use client";

import React from "react";
import { Industry } from "@/graphql/quries/industries/industry-queries";
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

export function IndustryDialog({
  open,
  onOpenChange,
  editingIndustry,
  isLoading,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIndustry: Industry | null;
  isLoading: boolean;
  onSave: (values: { title: string }) => void;
}) {
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle(editingIndustry?.title || "");
    }
  }, [open, editingIndustry]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="font-bold text-foreground">
            {editingIndustry ? "Edit Industry" : "Add Industry"}
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            {editingIndustry
              ? "Update the industry name"
              : "Create a new industry to classify your members"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="industry-title"
              className="text-sm font-semibold text-foreground"
            >
              Industry Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="industry-title"
              placeholder="e.g., Technology, Finance, Healthcare"
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
            {editingIndustry ? "Update" : "Save Industry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
