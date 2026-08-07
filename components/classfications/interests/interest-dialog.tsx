"use client";

import React from "react";
import { Interest } from "@/graphql/quries/interests/interest-queries";
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

export function InterestDialog({
  open,
  onOpenChange,
  editingInterest,
  isLoading,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingInterest: Interest | null;
  isLoading: boolean;
  onSave: (values: { title: string }) => void;
}) {
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle(editingInterest?.title || "");
    }
  }, [open, editingInterest]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="font-bold text-foreground">
            {editingInterest ? "Edit Interest" : "Add Interest"}
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            {editingInterest
              ? "Update the interest name"
              : "Create a new interest to classify your members' hobbies, topics, or areas of passion"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="interest-title"
              className="text-sm font-semibold text-foreground"
            >
              Interest Name <span className="text-zinc-500">*</span>
            </Label>
            <Input
              id="interest-title"
              placeholder="e.g., Photography, Travel, Gardening"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-border focus-visible:ring-zinc-500/20"
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
            className="rounded-lg font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingInterest ? "Update" : "Save Interest"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
