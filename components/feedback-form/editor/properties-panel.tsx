"use client";

import { useFormStore } from "@/store/useFormStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function PropertiesPanel() {
  const {
    questions,
    selectedQuestionId,
    updateQuestion,
    updateOption,
    addOption,
    removeQuestion,
  } = useFormStore();

  const question = questions.find((q) => q.id === selectedQuestionId);

  if (!question) {
    return (
      <div className="w-[300px] border-l h-full p-6 bg-white flex items-center justify-center text-muted-foreground text-sm">
        Select a question to edit properties
      </div>
    );
  }

  return (
    <div className="w-[300px] border-l h-full flex flex-col bg-white overflow-y-auto">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
          Question Settings
        </h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                question "{question.question || "Untitled Question"}" from your
                form.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => removeQuestion(question.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="p-6 space-y-6">
        {/* Question Title */}
        <div className="space-y-2">
          <Label>Question</Label>
          <Textarea
            placeholder="Type your question here"
            className="resize-none font-medium"
            rows={2}
            value={question.question || ""}
            onChange={(e) =>
              updateQuestion(question.id, "question", e.target.value)
            }
          />
        </div>

        {/* Question Type */}
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={question.type}
            onValueChange={(val) =>
              updateQuestion(question.id, "type", val as any)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.key} value={opt.key}>
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
        <div className="flex items-center justify-between">
          <Label htmlFor="required">Required</Label>
          <Switch
            id="required"
            checked={question.required}
            onCheckedChange={(checked) =>
              updateQuestion(question.id, "required", checked)
            }
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Add a description/subtitle"
            className="resize-none"
            rows={2}
            value={question.description || ""}
            onChange={(e) =>
              updateQuestion(question.id, "description", e.target.value)
            }
          />
        </div>

        {/* Dynamic Options based on type */}
        {(question.type === "MULTIPLE_CHOICE" ||
          question.type === "DROPDOWN" ||
          question.type === "ISOPTION") && (
          <div className="space-y-3 pt-4 border-t">
            <Label>Options</Label>
            <div className="space-y-2">
              {question.options?.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
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
                className="w-full border-dashed"
                onClick={() => addOption(String(question.id))}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Option
              </Button>
            </div>
          </div>
        )}

        {/* Opinion Scale Settings */}
        {question.type === "OPINION_SCALE" && (
          <div className="space-y-4 pt-4 border-t">
            <Label>Scale Settings</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Max Value
                </Label>
                <Input
                  type="number"
                  min={2}
                  max={10}
                  value={question.max || 10}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (val > 10) val = 10;
                    if (val < 2) val = 2; // Also enforce min safety
                    updateQuestion(question.id, "max", val);
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Start Label (Left)
              </Label>
              <Input
                value={question.labels?.start || ""}
                placeholder="e.g. Not Likely"
                onChange={(e) =>
                  updateQuestion(question.id, "labels", {
                    ...question.labels,
                    start: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                End Label (Right)
              </Label>
              <Input
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
          </div>
        )}
      </div>
    </div>
  );
}
