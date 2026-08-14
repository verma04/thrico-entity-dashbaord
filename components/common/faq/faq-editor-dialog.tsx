"use client";

import React from "react";
import { Edit, Save, Loader2, MessageCircleQuestion } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface FaqEditorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingFaq: boolean;
  question: string;
  setQuestion: (q: string) => void;
  answer: string;
  setAnswer: (a: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const FaqEditorDialog = ({
  isOpen,
  onOpenChange,
  editingFaq,
  question,
  setQuestion,
  answer,
  setAnswer,
  onSave,
  isSaving,
}: FaqEditorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl flex flex-col p-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center">
              <MessageCircleQuestion className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                {editingFaq ? "Edit FAQ Entry" : "Create FAQ Entry"}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Define the question prompt and detailed formatted solution.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4 bg-white dark:bg-zinc-950 overflow-y-auto max-h-[60vh]">
          <div className="space-y-1.5">
            <Label
              htmlFor="question"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Inquiry Question <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., How do I earn points and unlock reward tiers?"
              className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Formatted Solution & Guidance <span className="text-rose-500">*</span>
            </Label>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50/20 dark:bg-zinc-900/20">
              <RichTextEditor
                value={answer}
                onChange={setAnswer}
                placeholder="Provide a clear, formatted explanation..."
                minHeight="220px"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 text-xs font-semibold border-zinc-200 dark:border-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="h-9 px-4 text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 flex items-center gap-1.5"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {editingFaq ? "Update Entry" : "Save Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
