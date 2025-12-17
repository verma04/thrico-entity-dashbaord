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

interface RoadmapSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const RoadmapSettings = ({
  content,
  onChange,
  layout,
}: RoadmapSettingsProps) => {
  const items = content.items || [];

  const addItem = () => {
    const newItems = [
      ...items,
      {
        title: "",
        description: "",
        quarter: "",
        status: "planned",
      },
    ];
    onChange({ items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ items: newItems });
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    onChange({ items: newItems });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const itemsArray = Array.from(items);
    const [reorderedItem] = itemsArray.splice(result.source.index, 1);
    itemsArray.splice(result.destination.index, 0, reorderedItem);

    onChange({ items: itemsArray });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Roadmap Items
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Item
          </Button>
        </div>

        <Droppable droppableId="roadmap-items-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {items.map((item: any, index: number) => (
                <Draggable
                  key={`item-${index}`}
                  draggableId={`item-${index}`}
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
                          <span className="text-xs font-bold">Item {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteItem(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Title</Label>
                        <Input
                          value={item.title || ""}
                          onChange={(e) => updateItem(index, "title", e.target.value)}
                          placeholder="New Feature Launch"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={item.description || ""}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                          placeholder="Feature description..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Quarter</Label>
                          <Input
                            value={item.quarter || ""}
                            onChange={(e) => updateItem(index, "quarter", e.target.value)}
                            placeholder="Q1 2024"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Status</Label>
                          <Input
                            value={item.status || ""}
                            onChange={(e) => updateItem(index, "status", e.target.value)}
                            placeholder="planned, in-progress, completed"
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

        {items.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No roadmap items yet. Click "Add Item" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
