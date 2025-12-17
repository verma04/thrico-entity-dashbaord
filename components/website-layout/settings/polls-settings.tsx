"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface PollsSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const PollsSettings = ({
  content,
  onChange,
  layout,
}: PollsSettingsProps) => {
  const polls = content.polls || [];

  const addPoll = () => {
    const newPolls = [
      ...polls,
      {
        question: "",
        description: "",
        options: [{ text: "", votes: 0 }],
        totalVotes: 0,
        endDate: "",
      },
    ];
    onChange({ polls: newPolls });
  };

  const updatePoll = (index: number, field: string, value: any) => {
    const newPolls = [...polls];
    newPolls[index] = { ...newPolls[index], [field]: value };
    onChange({ polls: newPolls });
  };

  const deletePoll = (index: number) => {
    const newPolls = polls.filter((_: any, i: number) => i !== index);
    onChange({ polls: newPolls });
  };

  const addOption = (pollIndex: number) => {
    const newPolls = [...polls];
    newPolls[pollIndex].options = [
      ...(newPolls[pollIndex].options || []),
      { text: "", votes: 0 },
    ];
    onChange({ polls: newPolls });
  };

  const updateOption = (
    pollIndex: number,
    optionIndex: number,
    field: string,
    value: any
  ) => {
    const newPolls = [...polls];
    newPolls[pollIndex].options[optionIndex] = {
      ...newPolls[pollIndex].options[optionIndex],
      [field]: value,
    };
    onChange({ polls: newPolls });
  };

  const deleteOption = (pollIndex: number, optionIndex: number) => {
    const newPolls = [...polls];
    newPolls[pollIndex].options = newPolls[pollIndex].options.filter(
      (_: any, i: number) => i !== optionIndex
    );
    onChange({ polls: newPolls });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(polls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ polls: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Polls
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPoll}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Poll
          </Button>
        </div>

        <Droppable droppableId="polls-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {polls.map((poll: any, index: number) => (
                <Draggable
                  key={`poll-${index}`}
                  draggableId={`poll-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "space-y-2 p-3 bg-muted/10 rounded border transition-shadow",
                        snapshot.isDragging && "shadow-lg ring-2 ring-primary/20"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                          </div>
                          <span className="text-xs font-bold">Poll {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deletePoll(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Question</Label>
                        <Input
                          value={poll.question || ""}
                          onChange={(e) => updatePoll(index, "question", e.target.value)}
                          placeholder="What is your favorite feature?"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={poll.description || ""}
                          onChange={(e) => updatePoll(index, "description", e.target.value)}
                          placeholder="Optional description..."
                          className="text-xs min-h-[40px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="text-[10px] text-muted-foreground">Options</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addOption(index)}
                            className="h-6 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Option
                          </Button>
                        </div>
                        {(poll.options || []).map((option: any, optIdx: number) => (
                          <div key={optIdx} className="flex gap-2 items-center">
                            <Input
                              value={option.text || ""}
                              onChange={(e) =>
                                updateOption(index, optIdx, "text", e.target.value)
                              }
                              placeholder={`Option ${optIdx + 1}`}
                              className="h-7 text-xs flex-1"
                            />
                            <Input
                              type="number"
                              value={option.votes || 0}
                              onChange={(e) =>
                                updateOption(
                                  index,
                                  optIdx,
                                  "votes",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="Votes"
                              className="h-7 text-xs w-20"
                            />
                            <button
                              onClick={() => deleteOption(index, optIdx)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Total Votes</Label>
                          <Input
                            type="number"
                            value={poll.totalVotes || 0}
                            onChange={(e) =>
                              updatePoll(index, "totalVotes", parseInt(e.target.value) || 0)
                            }
                            placeholder="0"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">End Date</Label>
                          <Input
                            type="date"
                            value={poll.endDate || ""}
                            onChange={(e) => updatePoll(index, "endDate", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {polls.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No polls yet. Click "Add Poll" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
