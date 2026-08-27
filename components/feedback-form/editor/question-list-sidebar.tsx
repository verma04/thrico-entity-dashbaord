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
    <div className="w-[215px] border-r border-border h-full flex flex-col bg-card/60 backdrop-blur-xs shrink-0">
      <div className="p-2.5 border-b border-border">
        <Button
          variant="outline"
          className="w-full justify-between h-7 bg-foreground text-background hover:bg-foreground/90 hover:text-background text-xs px-2.5 rounded-md cursor-pointer shadow-2xs"
          disabled={isAddingQuestion}
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-1.5">
            {isAddingQuestion ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus size={13} />
            )}
            <span className="text-[11.5px] font-medium">
              {isAddingQuestion ? "Adding..." : "Add Question"}
            </span>
          </div>
        </Button>

        <QuestionTypeModal
          open={open}
          onOpenChange={setOpen}
          onSelect={(type: string) => addQuestion(type)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sidebar-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-1"
              >
                {questions.map((q, index) => (
                  <Draggable
                    key={q.id || `q-${index}`}
                    draggableId={String(q.id || `q-${index}`)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => selectQuestion(q.id)}
                        className={cn(
                          "p-2 rounded-md border text-xs cursor-pointer flex items-center gap-2 transition-all",
                          selectedQuestionId === q.id
                            ? "border-primary/50 bg-primary/8 ring-1 ring-primary/30 text-foreground font-medium"
                            : "bg-card hover:bg-accent/60 border-border/80 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <div className="flex items-center justify-center w-5 h-5 rounded bg-muted text-[10px] font-semibold text-muted-foreground shrink-0">
                          {index + 1}
                        </div>
                        <div className="truncate flex-1 text-[11.5px] leading-tight">
                          {q.question || "Untitled"}
                        </div>
                        <div className="text-muted-foreground/70 shrink-0 scale-85">
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
