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

interface MemberSpotlightSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const MemberSpotlightSettings = ({
  content,
  onChange,
  layout,
}: MemberSpotlightSettingsProps) => {
  const members = content.members || [];

  const addMember = () => {
    const newMembers = [
      ...members,
      {
        name: "",
        role: "",
        bio: "",
        image: "",
        achievements: "",
        social: { linkedin: "", twitter: "", email: "" },
      },
    ];
    onChange({ members: newMembers });
  };

  const updateMember = (index: number, field: string, value: any) => {
    const newMembers = [...members];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      newMembers[index] = {
        ...newMembers[index],
        [parent]: { ...newMembers[index][parent], [child]: value },
      };
    } else {
      newMembers[index] = { ...newMembers[index], [field]: value };
    }
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
            Featured Members
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
                        "space-y-3 p-3 bg-muted/10 rounded border transition-shadow",
                        snapshot.isDragging && "shadow-lg ring-2 ring-primary/20"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                          </div>
                          <span className="text-xs font-bold">Member {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteMember(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Name</Label>
                        <Input
                          value={member.name || ""}
                          onChange={(e) => updateMember(index, "name", e.target.value)}
                          placeholder="John Doe"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Role/Title</Label>
                        <Input
                          value={member.role || ""}
                          onChange={(e) => updateMember(index, "role", e.target.value)}
                          placeholder="Community Leader"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Bio</Label>
                        <Textarea
                          value={member.bio || ""}
                          onChange={(e) => updateMember(index, "bio", e.target.value)}
                          placeholder="Brief biography..."
                          className="text-xs min-h-[60px]"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Achievements</Label>
                        <Textarea
                          value={member.achievements || ""}
                          onChange={(e) => updateMember(index, "achievements", e.target.value)}
                          placeholder="Key achievements..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Image URL</Label>
                        <Input
                          value={member.image || ""}
                          onChange={(e) => updateMember(index, "image", e.target.value)}
                          placeholder="https://..."
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">LinkedIn</Label>
                          <Input
                            value={member.social?.linkedin || ""}
                            onChange={(e) => updateMember(index, "social.linkedin", e.target.value)}
                            placeholder="linkedin.com/in/..."
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Twitter</Label>
                          <Input
                            value={member.social?.twitter || ""}
                            onChange={(e) => updateMember(index, "social.twitter", e.target.value)}
                            placeholder="@username"
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

        {members.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No members yet. Click "Add Member" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
