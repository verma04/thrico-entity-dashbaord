import { Copy, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { ReactNode } from "react";
import {
  AddOptionFn,
  DuplicateQuestionFn,
  RemoveQuestionFn,
  UpdateOptionFn,
  UpdateQuestionFn,
} from "../../../../store/ts-types";

type NewType = {
  key: string;
  label: string;
  icon: ReactNode;
};

export function Sidebar({
  question,
  index,
  updateQuestion,
  duplicateQuestion,
  removeQuestion,
  options,
}: {
  question: any;
  index: number;
  updateQuestion: UpdateQuestionFn;
  updateOption: UpdateOptionFn;
  addOption: AddOptionFn;
  duplicateQuestion: DuplicateQuestionFn;
  removeQuestion: RemoveQuestionFn;
  options: NewType[];
}) {
  return (
    <Card className="mb-2 border shadow-sm">
      <div className="flex items-center justify-between p-3">
        <Badge variant="secondary" className="flex items-center gap-2">
          {options.find((opt) => opt.key === question.type)?.icon}
          <span>{index + 1}</span>
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => duplicateQuestion(question.id)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => removeQuestion(question.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
