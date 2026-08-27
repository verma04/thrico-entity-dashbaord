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
      <div className="w-[260px] border-l border-border h-full p-4 bg-card/60 flex items-center justify-center text-muted-foreground text-xs shrink-0">
        Select a question to edit properties
      </div>
    );
  }

  return (
    <div className="w-[260px] border-l border-border h-full flex flex-col bg-card/60 backdrop-blur-xs overflow-y-auto shrink-0">
      <div className="p-2.5 px-3 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-[10.5px] uppercase tracking-wider text-muted-foreground">
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
              className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-lg max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-sm">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                This action cannot be undone. This will permanently delete the
                question &quot;{question.question || "Untitled Question"}&quot; from your form.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingQuestion} className="h-7 text-xs rounded-md">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async (e) => {
                  e.preventDefault();
                  await deleteQuestion(question.id);
                  setIsDeleteDialogOpen(false);
                }}
                className="h-7 text-xs rounded-md bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-1.5"
                disabled={isDeletingQuestion}
              >
                {isDeletingQuestion && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {isDeletingQuestion ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="p-3 space-y-3">
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
          <PolarisLabel className="text-[11px]">Type</PolarisLabel>
          <Select
            value={question.type}
            onValueChange={(val) =>
              updateQuestion(question.id, "type", val as any)
            }
          >
            <SelectTrigger className="h-7 bg-background border-border text-xs rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.key} value={opt.key} className="text-xs">
                  <div className="flex items-center gap-1.5">
                    {opt.icon}
                    <span>{opt.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Required Toggle */}
        <div className="flex items-center justify-between p-2 rounded-md border border-border bg-muted/30">
          <PolarisLabel htmlFor="required" className="text-[11.5px] cursor-pointer">
            Required Answer
          </PolarisLabel>
          <Switch
            id="required"
            className="scale-85"
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
          <div className="space-y-2 pt-2 border-t border-border">
            <PolarisLabel className="text-[11px]">Choice Options</PolarisLabel>
            <div className="space-y-1">
              {question.options?.map((opt, idx) => (
                <div key={idx} className="flex gap-1">
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
                className="w-full h-7 border-dashed border-border text-[11px] rounded-md cursor-pointer hover:bg-muted"
                onClick={() => addOption(String(question.id))}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Option
              </Button>
            </div>
          </div>
        )}

        {/* Opinion Scale Settings */}
        {question.type === "OPINION_SCALE" && (
          <div className="space-y-2.5 pt-2 border-t border-border">
            <PolarisLabel className="text-[11px]">Scale Settings</PolarisLabel>
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
