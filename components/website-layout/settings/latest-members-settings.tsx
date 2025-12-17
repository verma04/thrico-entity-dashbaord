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

interface LatestMembersSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const LatestMembersSettings = ({
  content,
  onChange,
  layout,
}: LatestMembersSettingsProps) => {
  const members = content.members || [];

  const addMember = () => {
    const newMembers = [
      ...members,
      {
        name: "",
        role: "",
        image: "",
        joinedDate: "",
        badge: "",
      },
    ];
    onChange({ members: newMembers });
  };

  const updateMember = (index: number, field: string, value: any) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    onChange({ members: newMembers });
  };

  const deleteMember = (index: number) => {
    const newMembers = members.filter((_: any, i: number) => i !== index);
    onChange({ members: newMembers });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(members);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ members: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Latest Members
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMember}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Member
          </Button>
        </div>

        <Droppable droppableId="members-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {members.map((member: any, index: number) => (
                <Draggable
                  key={`member-${index}`}
                  draggableId={`member-${index}`}
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
                              <Label className="text-xs">Name</Label>
                              <Input
                                value={member.name || ""}
                                onChange={(e) =>
                                  updateMember(index, "name", e.target.value)
                                }
                                placeholder="John Doe"
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Role</Label>
                              <Input
                                value={member.role || ""}
                                onChange={(e) =>
                                  updateMember(index, "role", e.target.value)
                                }
                                placeholder="Developer"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Image URL</Label>
                              <Input
                                value={member.image || ""}
                                onChange={(e) =>
                                  updateMember(index, "image", e.target.value)
                                }
                                placeholder="https://..."
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Joined Date</Label>
                              <Input
                                value={member.joinedDate || ""}
                                onChange={(e) =>
                                  updateMember(index, "joinedDate", e.target.value)
                                }
                                placeholder="Dec 2024"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Badge (Optional)</Label>
                            <Input
                              value={member.badge || ""}
                              onChange={(e) =>
                                updateMember(index, "badge", e.target.value)
                              }
                              placeholder="New, Featured, etc."
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMember(index)}
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

        {members.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              No members added yet
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMember}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add First Member
            </Button>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};
