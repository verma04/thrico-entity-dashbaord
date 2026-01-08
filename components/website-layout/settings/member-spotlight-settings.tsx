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
        quote: "",
        image: "",
        location: "",
        memberSince: "",
        title: "", // Professional title or achievement
        link: "",
      },
    ];
    onChange({ members: newMembers });
  };

  const updateMember = (index: number, field: string, value: any) => {
    const newMembers = [...members];
    // Simple top-level update since we flattened the structure mostly
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
                        "space-y-4 p-4 bg-muted/10 rounded border transition-shadow",
                        snapshot.isDragging &&
                          "shadow-lg ring-2 ring-primary/20"
                      )}
                    >
                      <div className="flex justify-between items-center bg-muted/20 -m-4 mb-4 p-2 px-4 rounded-t">
                        <div className="flex items-center gap-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                          </div>
                          <span className="text-xs font-bold">
                            Member {index + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteMember(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <ImageUploadWithCrop
                          label="Member Photo"
                          currentImage={member.image}
                          onImageUpdate={(url) =>
                            updateMember(index, "image", url)
                          }
                          aspectRatio={1}
                          circularCrop={true}
                          recommendedWidth={400}
                          recommendedHeight={400}
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label className="text-[10px] text-muted-foreground">
                              Name
                            </Label>
                            <Input
                              value={member.name || ""}
                              onChange={(e) =>
                                updateMember(index, "name", e.target.value)
                              }
                              placeholder="John Doe"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] text-muted-foreground">
                              Role
                            </Label>
                            <Input
                              value={member.role || ""}
                              onChange={(e) =>
                                updateMember(index, "role", e.target.value)
                              }
                              placeholder="Community Leader"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">
                            Quote
                          </Label>
                          <Textarea
                            value={member.quote || ""}
                            onChange={(e) =>
                              updateMember(index, "quote", e.target.value)
                            }
                            placeholder="The best place to be..."
                            className="text-xs min-h-[60px]"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label className="text-[10px] text-muted-foreground">
                              Location
                            </Label>
                            <Input
                              value={member.location || ""}
                              onChange={(e) =>
                                updateMember(index, "location", e.target.value)
                              }
                              placeholder="New York, USA"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] text-muted-foreground">
                              Member Since
                            </Label>
                            <Input
                              value={member.memberSince || ""}
                              onChange={(e) =>
                                updateMember(
                                  index,
                                  "memberSince",
                                  e.target.value
                                )
                              }
                              placeholder="2023"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label className="text-[10px] text-muted-foreground">
                              Extra Title / Badge
                            </Label>
                            <Input
                              value={member.title || ""}
                              onChange={(e) =>
                                updateMember(index, "title", e.target.value)
                              }
                              placeholder="Top Contributor"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] text-muted-foreground">
                              Profile Link
                            </Label>
                            <Input
                              value={member.link || ""}
                              onChange={(e) =>
                                updateMember(index, "link", e.target.value)
                              }
                              placeholder="https://..."
                              className="h-8 text-xs"
                            />
                          </div>
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
          <div className="text-center py-8 border-2 border-dashed rounded-xl bg-slate-50">
            <p className="text-sm text-muted-foreground mb-2">
              No members featured yet
            </p>
            <Button size="sm" variant="secondary" onClick={addMember}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Member
            </Button>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};
