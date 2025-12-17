"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface MembersAroundWorldSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const MembersAroundWorldSettings = ({
  content,
  onChange,
  layout,
}: MembersAroundWorldSettingsProps) => {
  const locations = content.locations || [];

  const addLocation = () => {
    const newLocations = [
      ...locations,
      {
        country: "",
        city: "",
        flag: "",
        memberCount: 0,
        growth: "",
        link: "",
      },
    ];
    onChange({ locations: newLocations });
  };

  const updateLocation = (index: number, field: string, value: any) => {
    const newLocations = [...locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    onChange({ locations: newLocations });
  };

  const deleteLocation = (index: number) => {
    const newLocations = locations.filter((_: any, i: number) => i !== index);
    onChange({ locations: newLocations });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(locations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ locations: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Global Locations
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLocation}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Location
          </Button>
        </div>

        <Droppable droppableId="locations-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {locations.map((location: any, index: number) => (
                <Draggable
                  key={`location-${index}`}
                  draggableId={`location-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "bg-card border rounded-lg p-3 space-y-2",
                        snapshot.isDragging && "shadow-lg ring-2 ring-primary"
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
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Country</Label>
                              <Input
                                value={location.country || ""}
                                onChange={(e) =>
                                  updateLocation(index, "country", e.target.value)
                                }
                                placeholder="United States"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">City (Optional)</Label>
                              <Input
                                value={location.city || ""}
                                onChange={(e) =>
                                  updateLocation(index, "city", e.target.value)
                                }
                                placeholder="New York"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Link (Optional)</Label>
                            <Input
                              value={location.link || ""}
                              onChange={(e) =>
                                updateLocation(index, "link", e.target.value)
                              }
                              placeholder="https://example.com"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs">Flag Emoji</Label>
                              <Input
                                value={location.flag || ""}
                                onChange={(e) =>
                                  updateLocation(index, "flag", e.target.value)
                                }
                                placeholder="🇺🇸"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Member Count</Label>
                              <Input
                                type="number"
                                value={location.memberCount || 0}
                                onChange={(e) =>
                                  updateLocation(
                                    index,
                                    "memberCount",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                placeholder="100"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Growth % (Optional)</Label>
                              <Input
                                value={location.growth || ""}
                                onChange={(e) =>
                                  updateLocation(index, "growth", e.target.value)
                                }
                                placeholder="15"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLocation(index)}
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

        {locations.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              No locations added yet
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLocation}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add First Location
            </Button>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};
