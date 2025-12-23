"use client";

import { useFormStore } from "@/store/useFormStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, ChevronsUpDown, Check } from "lucide-react";
import { options } from "../options";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

export function QuestionListSidebar() {
  const {
    questions,
    selectedQuestionId,
    selectQuestion,
    reorderQuestions,
    addQuestion,
  } = useFormStore();
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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-black text-white hover:bg-gray-800 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Plus size={16} />
                Add Question
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search question type..." />
              <CommandList className="h-[300px]">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {options.map((option) => (
                    <CommandItem
                      key={option.key}
                      onSelect={() => {
                        addQuestion(option.key as any);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {option.icon && (
                        <span className="mr-2 opacity-70">{option.icon}</span>
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
                            : "bg-white border-border"
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
