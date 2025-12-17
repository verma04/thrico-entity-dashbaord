import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { RenderQuestionEditor } from "./render-question-editor";
import {
  AddOptionFn,
  RemoveQuestionFn,
  UpdateOptionFn,
  UpdateQuestionFn,
} from "../../../../store/ts-types";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

export function SortableQuestionItem({
  question,
  index,
  updateQuestion,
  updateOption,
  addOption,
  removeQuestion,
  options,
  dragHandleProps,
}: {
  question: any;
  index: number;
  updateQuestion: UpdateQuestionFn;
  updateOption: UpdateOptionFn;
  addOption: AddOptionFn;
  removeQuestion: RemoveQuestionFn;
  options: { key: string; label: string }[];
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}) {
  return (
    <Card className="mb-4 border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            <Select
              value={question.type}
              onValueChange={(value) =>
                updateQuestion(question.id, "type", value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.key} value={opt.key}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div
              {...dragHandleProps}
              className="cursor-grab p-2 rounded hover:bg-muted transition-colors"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this question.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => removeQuestion(question.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) =>
                  updateQuestion(question.id, "required", checked)
                }
              />
              <Label
                htmlFor={`required-${question.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                Required
              </Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {RenderQuestionEditor(
          question,
          updateQuestion,
          updateOption,
          addOption
        )}
      </CardContent>
    </Card>
  );
}
