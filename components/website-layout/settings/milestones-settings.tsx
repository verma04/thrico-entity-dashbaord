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

interface MilestonesSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const MilestonesSettings = ({
  content,
  onChange,
  layout,
}: MilestonesSettingsProps) => {
  const milestones = content.milestones || [];

  const addMilestone = () => {
    const newMilestones = [
      ...milestones,
      {
        title: "",
        description: "",
        date: "",
        status: "completed",
      },
    ];
    onChange({ milestones: newMilestones });
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    onChange({ milestones: newMilestones });
  };

  const deleteMilestone = (index: number) => {
    const newMilestones = milestones.filter((_: any, i: number) => i !== index);
    onChange({ milestones: newMilestones });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(milestones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ milestones: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Milestones
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMilestone}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Milestone
          </Button>
        </div>

        <Droppable droppableId="milestones-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {milestones.map((milestone: any, index: number) => (
                <Draggable
                  key={`milestone-${index}`}
                  draggableId={`milestone-${index}`}
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
                          <span className="text-xs font-bold">Milestone {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteMilestone(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Title</Label>
                        <Input
                          value={milestone.title || ""}
                          onChange={(e) => updateMilestone(index, "title", e.target.value)}
                          placeholder="Company Founded"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={milestone.description || ""}
                          onChange={(e) => updateMilestone(index, "description", e.target.value)}
                          placeholder="Milestone description..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Date</Label>
                          <Input
                            type="date"
                            value={milestone.date || ""}
                            onChange={(e) => updateMilestone(index, "date", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Status</Label>
                          <Input
                            value={milestone.status || ""}
                            onChange={(e) => updateMilestone(index, "status", e.target.value)}
                            placeholder="completed, in-progress"
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

        {milestones.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No milestones yet. Click "Add Milestone" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
