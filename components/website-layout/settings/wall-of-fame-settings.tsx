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
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface WallOfFameSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const WallOfFameSettings = ({
  content,
  onChange,
  layout,
}: WallOfFameSettingsProps) => {
  const honorees = content.honorees || [];

  const addHonoree = () => {
    const newHonorees = [
      ...honorees,
      {
        name: "",
        achievement: "",
        image: "",
        year: "",
        description: "",
      },
    ];
    onChange({ honorees: newHonorees });
  };

  const updateHonoree = (index: number, field: string, value: any) => {
    const newHonorees = [...honorees];
    newHonorees[index] = { ...newHonorees[index], [field]: value };
    onChange({ honorees: newHonorees });
  };

  const deleteHonoree = (index: number) => {
    const newHonorees = honorees.filter((_: any, i: number) => i !== index);
    onChange({ honorees: newHonorees });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(honorees);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ honorees: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Wall of Fame Honorees
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addHonoree}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Honoree
          </Button>
        </div>

        <Droppable droppableId="honorees-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {honorees.map((honoree: any, index: number) => (
                <Draggable
                  key={`honoree-${index}`}
                  draggableId={`honoree-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "bg-card border rounded-lg p-3 space-y-2",
                        snapshot.isDragging && "shadow-lg ring-2 ring-primary",
                        index < 3 && "border-amber-300 bg-amber-50/50"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          {...provided.dragHandleProps}
                          className="mt-2 cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-2">
                          {index < 3 && (
                            <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
                              {index === 0 && "🥇 1st Place"}
                              {index === 1 && "🥈 2nd Place"}
                              {index === 2 && "🥉 3rd Place"}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Name</Label>
                              <Input
                                value={honoree.name || ""}
                                onChange={(e) =>
                                  updateHonoree(index, "name", e.target.value)
                                }
                                placeholder="Jane Smith"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Year (Optional)</Label>
                              <Input
                                value={honoree.year || ""}
                                onChange={(e) =>
                                  updateHonoree(index, "year", e.target.value)
                                }
                                placeholder="2024"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Achievement</Label>
                            <Input
                              value={honoree.achievement || ""}
                              onChange={(e) =>
                                updateHonoree(index, "achievement", e.target.value)
                              }
                              placeholder="Community Leader of the Year"
                              className="h-8 text-xs"
                            />
                          </div>
                          {/* Image Upload */}
                          <div>
                            <ImageUploadWithCrop
                              currentImage={honoree.image || ""}
                              onImageUpdate={(url) => updateHonoree(index, "image", url)}
                              label="Honoree Photo"
                              recommendedWidth={400}
                              recommendedHeight={400}
                              aspectRatio={1}
                              maxFileSize={3}
                              showDimensions={true}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Description (Optional)</Label>
                            <Textarea
                              value={honoree.description || ""}
                              onChange={(e) =>
                                updateHonoree(index, "description", e.target.value)
                              }
                              placeholder="Outstanding contribution to community growth and engagement..."
                              className="text-xs min-h-[60px]"
                              rows={2}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHonoree(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {honorees.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              No honorees added yet
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addHonoree}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add First Honoree
            </Button>
          </div>
        )}

        {honorees.length > 0 && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            💡 <strong>Tip:</strong> The first 3 honorees will be displayed on the podium (1st, 2nd, 3rd place). Drag to reorder.
          </div>
        )}
      </div>
    </DragDropContext>
  );
};
