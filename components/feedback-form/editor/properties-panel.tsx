"use client";

import { useFormStore } from "@/store/useFormStore";
import { useSurveyEditor } from "../hooks/use-survey-editor";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { options } from "../options";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";

export function PropertiesPanel() {
  const { questions, selectedQuestionId } = useFormStore();
  const {
    updateQuestion,
    updateOption,
    addOption,
    deleteQuestion,
    isDeletingQuestion,
  } = useSurveyEditor();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const question = questions.find((q) => q.id === selectedQuestionId);

  if (!question) {
    return (
      <div className="w-[300px] border-l border-[#e1e3e5] dark:border-zinc-800 h-full p-6 bg-white dark:bg-zinc-900 flex items-center justify-center text-[#8c9196] text-[12.5px]">
        Select a question to edit properties
      </div>
    );
  }

  return (
    <div className="w-[300px] border-l border-[#e1e3e5] dark:border-zinc-800 h-full flex flex-col bg-white dark:bg-zinc-900 overflow-y-auto">
      <div className="p-3.5 border-b border-[#e1e3e5] dark:border-zinc-800 flex items-center justify-between">
        <h3 className="font-semibold text-[11.5px] uppercase tracking-wider text-[#616161]">
          Question Settings
        </h3>
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[#616161] hover:text-[#d72c0d] hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-[4px] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[8px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[14px]">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-[12px]">
                This action cannot be undone. This will permanently delete the
                question &quot;{question.question || "Untitled Question"}&quot; from your form.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingQuestion} className="h-[34px] text-[12.5px] rounded-[6px]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async (e) => {
                  e.preventDefault();
                  await deleteQuestion(question.id);
                  setIsDeleteDialogOpen(false);
                }}
                className="h-[34px] text-[12.5px] rounded-[6px] bg-[#d72c0d] hover:bg-[#b02209] text-white gap-2"
                disabled={isDeletingQuestion}
              >
                {isDeletingQuestion && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                {isDeletingQuestion ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="p-4 space-y-4">
        {/* Question Title */}
        <PolarisTextarea
          label="Question Prompt"
          required
          rows={2}
          placeholder="Type your question here..."
          value={question.question || ""}
          onChange={(e) =>
            updateQuestion(question.id, "question", e.target.value)
          }
        />

        {/* Question Type */}
        <div className="space-y-1">
          <PolarisLabel>Type</PolarisLabel>
          <Select
            value={question.type}
            onValueChange={(val) =>
              updateQuestion(question.id, "type", val as any)
            }
          >
            <SelectTrigger className="h-[34px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12.5px] text-[#303030] dark:text-zinc-100 rounded-[6px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.key} value={opt.key} className="text-[12.5px]">
                  <div className="flex items-center gap-2">
                    {opt.icon}
                    {opt.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Required Toggle */}
        <div className="flex items-center justify-between p-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40">
          <PolarisLabel htmlFor="required">Required Answer</PolarisLabel>
          <Switch
            id="required"
            checked={question.required}
            onCheckedChange={(checked) =>
              updateQuestion(question.id, "required", checked)
            }
          />
        </div>

        {/* Description */}
        <PolarisTextarea
          label="Description / Subtitle"
          rows={2}
          placeholder="Add optional helper text..."
          value={question.description || ""}
          onChange={(e) =>
            updateQuestion(question.id, "description", e.target.value)
          }
        />

        {/* Dynamic Options based on type */}
        {(question.type === "MULTIPLE_CHOICE" ||
          question.type === "DROPDOWN" ||
          question.type === "ISOPTION") && (
          <div className="space-y-2 pt-3 border-t border-[#e1e3e5] dark:border-zinc-800">
            <PolarisLabel>Choice Options</PolarisLabel>
            <div className="space-y-1.5">
              {question.options?.map((opt, idx) => (
                <div key={idx} className="flex gap-1.5">
                  <PolarisInput
                    value={opt}
                    onChange={(e) =>
                      updateOption(question.id, idx, e.target.value)
                    }
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full h-[32px] border-dashed border-[#aeb4b9] text-[11.5px] rounded-[6px] cursor-pointer"
                onClick={() => addOption(String(question.id))}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Option
              </Button>
            </div>
          </div>
        )}

        {/* Opinion Scale Settings */}
        {question.type === "OPINION_SCALE" && (
          <div className="space-y-3 pt-3 border-t border-[#e1e3e5] dark:border-zinc-800">
            <PolarisLabel>Scale Settings</PolarisLabel>
            <PolarisInput
              type="number"
              min={2}
              max={10}
              label="Max Value (2-10)"
              value={question.max || 10}
              onChange={(e) => {
                let val = Number(e.target.value);
                if (val > 10) val = 10;
                if (val < 2) val = 2;
                updateQuestion(question.id, "max", val);
              }}
            />
            <PolarisInput
              label="Start Label (Left)"
              value={question.labels?.start || ""}
              placeholder="e.g. Not Likely"
              onChange={(e) =>
                updateQuestion(question.id, "labels", {
                  ...question.labels,
                  start: e.target.value,
                })
              }
            />
            <PolarisInput
              label="End Label (Right)"
              value={question.labels?.end || ""}
              placeholder="e.g. Very Likely"
              onChange={(e) =>
                updateQuestion(question.id, "labels", {
                  ...question.labels,
                  end: e.target.value,
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
