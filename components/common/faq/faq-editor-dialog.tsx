import React from "react";
import { Edit, Save, Loader2 } from "lucide-react";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { CtaButton } from "@/components/ui/cta-button";

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
      <DialogContent className="max-w-3xl flex flex-col p-0 rounded-[24px] border-0 shadow-2xl overflow-hidden">
        <DialogHeader className="px-8 py-6 border-b bg-zinc-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-zinc-900 flex items-center justify-center text-white">
              <Edit size={20} strokeWidth={1.5} />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight text-zinc-900 leading-none mb-1">
                {editingFaq ? "Refine FAQ Entry" : "New FAQ Entry"}
              </DialogTitle>
              <DialogDescription className="text-zinc-400 font-medium text-[13px] tracking-tight">
                Precisely define information for your module's end-users.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-6 bg-white overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            <Label
              htmlFor="question"
              className="text-[11px] font-bold uppercase tracking-wider text-zinc-400"
            >
              The Question
            </Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What exactly is being asked?"
              className="h-12 px-4 text-md font-medium tracking-tight text-zinc-900 rounded-[12px] bg-zinc-50/80 border-transparent focus-visible:bg-white focus-visible:border-zinc-200 transition-all placeholder:text-zinc-300"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              The Solution
            </Label>
            <div className="rounded-[16px] border border-zinc-100 overflow-hidden shadow-inner bg-zinc-50/20">
              <RichTextEditor
                value={answer}
                onChange={setAnswer}
                placeholder="Provide clarity..."
                minHeight="300px"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-8 py-6 border-t bg-zinc-50/50">
          <div className="flex w-full items-center justify-between">
            <div className="text-[10px] font-medium text-zinc-400 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              DRAFT SECURE
            </div>
            <div className="flex gap-3">
              <CtaButton
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-8 px-4 text-[12px]"
              >
                Discard
              </CtaButton>
              <CtaButton
                onClick={onSave}
                disabled={isSaving}
                className="h-8 px-4 text-[12px]"
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                )}
                {editingFaq ? "Update" : "Publish"}
              </CtaButton>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
