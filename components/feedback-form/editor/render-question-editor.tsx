import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import {
  AddOptionFn,
  Question,
  UpdateOptionFn,
} from "../../../../store/ts-types";

export const RenderQuestionEditor = (
  question: Question,
  updateQuestion: any,
  updateOption: UpdateOptionFn,
  addOption: AddOptionFn,
) => {
  switch (question.type) {
    case "SHORT_TEXT":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>
              Question{" "}
              {question.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={`question-${question.id}`}
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, "question", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`maxlength-${question.id}`}>Max Length</Label>
            <Input
              id={`maxlength-${question.id}`}
              type="number"
              value={question.maxLength || 255}
              onChange={(e) =>
                updateQuestion(question.id, "maxLength", Number(e.target.value))
              }
            />
          </div>
        </div>
      );

    case "LONG_TEXT":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>
              Question{" "}
              {question.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={`question-${question.id}`}
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, "question", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`maxlength-${question.id}`}>Max Length</Label>
            <Input
              id={`maxlength-${question.id}`}
              type="number"
              value={question.maxLength || 4000}
              onChange={(e) =>
                updateQuestion(question.id, "maxLength", Number(e.target.value))
              }
            />
          </div>
        </div>
      );

    case "EMAIL":
    case "PHONE":
    case "WEBSITE":
    case "NUMBER":
    case "DATE":
    case "TIME":
    case "YES_NO":
      return (
        <div className="space-y-2">
          <Label htmlFor={`question-${question.id}`}>Question</Label>
          <Input
            id={`question-${question.id}`}
            value={question.question}
            onChange={(e) =>
              updateQuestion(question.id, "question", e.target.value)
            }
          />
        </div>
      );

    case "OPINION_SCALE":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>Question</Label>
            <Input
              id={`question-${question.id}`}
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, "question", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`min-${question.id}`}>Min Value</Label>
              <Input
                id={`min-${question.id}`}
                type="number"
                max={1}
                value={question.min || 1}
                onChange={(e) =>
                  updateQuestion(question.id, "min", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`max-${question.id}`}>Max Value</Label>
              <Input
                id={`max-${question.id}`}
                type="number"
                value={question.max ?? 10}
                min={1}
                max={10}
                onChange={(e) =>
                  updateQuestion(
                    question.id,
                    "max",
                    Math.min(10, Math.max(1, Number(e.target.value))),
                  )
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`start-label-${question.id}`}>Start Label</Label>
              <Input
                id={`start-label-${question.id}`}
                value={question.labels?.start || "Not at all likely"}
                onChange={(e) =>
                  updateQuestion(question.id, "labels", {
                    ...question.labels,
                    start: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`end-label-${question.id}`}>End Label</Label>
              <Input
                id={`end-label-${question.id}`}
                value={question.labels?.end || "Extremely likely"}
                onChange={(e) =>
                  updateQuestion(question.id, "labels", {
                    ...question.labels,
                    end: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
      );

    case "MULTIPLE_CHOICE":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>Question</Label>
            <Input
              id={`question-${question.id}`}
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, "question", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Options</Label>
            {question?.options?.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) =>
                    updateOption(question?.id, index, e.target.value)
                  }
                  className="flex-1"
                />
                {(question?.options?.length ?? 0) > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newOptions = question?.options?.filter(
                        (_, i) => i !== index,
                      );
                      updateQuestion(question.id, "options", newOptions);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => addOption(question?.id)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`allow-multiple-${question.id}`}
              checked={question.allowMultiple}
              onCheckedChange={(checked) =>
                updateQuestion(question.id, "allowMultiple", checked)
              }
            />
            <Label
              htmlFor={`allow-multiple-${question.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              Allow multiple selections
            </Label>
          </div>
        </div>
      );

    case "ISOPTION":
    case "DROPDOWN":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>Question</Label>
            <Input
              id={`question-${question.id}`}
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, "question", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Options</Label>
            {question?.options?.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) =>
                    updateOption(question.id, index, e.target.value)
                  }
                  className="flex-1"
                />
                {(question?.options?.length ?? 0) > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newOptions = question?.options?.filter(
                        (_, i) => i !== index,
                      );
                      updateQuestion(question.id, "options", newOptions);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => addOption(question.id)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        </div>
      );

    case "RATING":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>Question</Label>
            <Input
              id={`question-${question.id}`}
              value={question.question}
              onChange={(e) =>
                updateQuestion(question.id, "question", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`scale-${question.id}`}>Scale</Label>
            <Select
              value={question.scale?.toString() || "5"}
              onValueChange={(value) =>
                updateQuestion(question.id, "scale", Number.parseInt(value))
              }
            >
              <SelectTrigger id={`scale-${question.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">1-5</SelectItem>
                <SelectItem value="10">1-10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    default:
      return null;
  }
};
