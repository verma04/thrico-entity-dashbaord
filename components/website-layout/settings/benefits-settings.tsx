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

interface BenefitsSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const BenefitsSettings = ({
  content,
  onChange,
  layout,
}: BenefitsSettingsProps) => {
  const benefits = content.benefits || [];

  const addBenefit = () => {
    const newBenefits = [
      ...benefits,
      {
        title: "",
        description: "",
        icon: "",
        features: [],
      },
    ];
    onChange({ benefits: newBenefits });
  };

  const updateBenefit = (index: number, field: string, value: any) => {
    const newBenefits = [...benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    onChange({ benefits: newBenefits });
  };

  const deleteBenefit = (index: number) => {
    const newBenefits = benefits.filter((_: any, i: number) => i !== index);
    onChange({ benefits: newBenefits });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(benefits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ benefits: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Membership Benefits
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBenefit}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Benefit
          </Button>
        </div>

        <Droppable droppableId="benefits-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {benefits.map((benefit: any, index: number) => (
                <Draggable
                  key={`benefit-${index}`}
                  draggableId={`benefit-${index}`}
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
                          <span className="text-xs font-bold">Benefit {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteBenefit(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Title</Label>
                        <Input
                          value={benefit.title || ""}
                          onChange={(e) => updateBenefit(index, "title", e.target.value)}
                          placeholder="Exclusive Access"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={benefit.description || ""}
                          onChange={(e) => updateBenefit(index, "description", e.target.value)}
                          placeholder="Describe the benefit..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Icon Name</Label>
                        <Input
                          value={benefit.icon || ""}
                          onChange={(e) => updateBenefit(index, "icon", e.target.value)}
                          placeholder="Star, Shield, Award"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Features (comma-separated)</Label>
                        <Textarea
                          value={(benefit.features || []).join(", ")}
                          onChange={(e) => {
                            const features = e.target.value
                              .split(",")
                              .map((f) => f.trim())
                              .filter(Boolean);
                            updateBenefit(index, "features", features);
                          }}
                          placeholder="Feature 1, Feature 2, Feature 3"
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {benefits.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No benefits yet. Click "Add Benefit" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
