"use client";

import { useFormStore } from "@/store/useFormStore";
import { useSurveyEditor } from "../hooks/use-survey-editor";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { options } from "../options";
import { QuestionTypeModal } from "./question-type-modal";
import { useState } from "react";

export function QuestionListSidebar() {
  const { questions, selectedQuestionId, selectQuestion } = useFormStore();
  const { addQuestion, reorderQuestions, isAddingQuestion } = useSurveyEditor();
  const [open, setOpen] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const oldIndex = result.source.index;
    const newIndex = result.destination.index;
    if (oldIndex !== newIndex) {
      reorderQuestions(oldIndex, newIndex);
    }
  };

  return (
    <div className="w-[250px] border-r h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <Button
          variant="outline"
          className="w-full justify-between bg-black text-white hover:bg-gray-800 hover:text-white mb-2"
          disabled={isAddingQuestion}
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-2">
            {isAddingQuestion ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {isAddingQuestion ? "Adding..." : "Add Question"}
          </div>
        </Button>

        <QuestionTypeModal
          open={open}
          onOpenChange={setOpen}
          onSelect={(type: string) => addQuestion(type)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sidebar-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {questions.map((q, index) => (
                  <Draggable
                    key={q.id}
                    draggableId={String(q.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => selectQuestion(q.id)}
                        className={cn(
                          "p-3 rounded-md border text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition-colors",
                          selectedQuestionId === q.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "bg-white border-border",
                        )}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs font-medium text-gray-500">
                          {index + 1}
                        </div>
                        <div className="truncate flex-1 font-medium text-gray-700">
                          {q.question || "Untitled"}
                        </div>
                        <div className="text-gray-400">
                          {options.find((o) => o.key === q.type)?.icon}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
