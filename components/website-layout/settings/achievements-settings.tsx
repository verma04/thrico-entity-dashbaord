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

interface AchievementsSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const AchievementsSettings = ({
  content,
  onChange,
  layout,
}: AchievementsSettingsProps) => {
  const achievements = content.achievements || [];

  const addAchievement = () => {
    const newAchievements = [
      ...achievements,
      {
        title: "",
        description: "",
        icon: "",
        image: "",
        date: "",
        category: "",
      },
    ];
    onChange({ achievements: newAchievements });
  };

  const updateAchievement = (index: number, field: string, value: any) => {
    const newAchievements = [...achievements];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    onChange({ achievements: newAchievements });
  };

  const deleteAchievement = (index: number) => {
    const newAchievements = achievements.filter((_: any, i: number) => i !== index);
    onChange({ achievements: newAchievements });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(achievements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ achievements: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Achievements & Awards
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAchievement}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Achievement
          </Button>
        </div>

        <Droppable droppableId="achievements-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {achievements.map((achievement: any, index: number) => (
                <Draggable
                  key={`achievement-${index}`}
                  draggableId={`achievement-${index}`}
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
                          <span className="text-xs font-bold">Achievement {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteAchievement(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Title</Label>
                        <Input
                          value={achievement.title || ""}
                          onChange={(e) => updateAchievement(index, "title", e.target.value)}
                          placeholder="Best Innovation Award 2024"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={achievement.description || ""}
                          onChange={(e) => updateAchievement(index, "description", e.target.value)}
                          placeholder="Description of the achievement..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <ImageUploadWithCrop
                            label="Icon/Badge"
                            currentImage={achievement.icon}
                            onImageUpdate={(imageUrl: string) =>
                              updateAchievement(index, "icon", imageUrl)
                            }
                            recommendedWidth={200}
                            recommendedHeight={200}
                            aspectRatio={1}
                            maxFileSize={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <ImageUploadWithCrop
                            label="Achievement Image"
                            currentImage={achievement.image}
                            onImageUpdate={(imageUrl: string) =>
                              updateAchievement(index, "image", imageUrl)
                            }
                            recommendedWidth={600}
                            recommendedHeight={400}
                            aspectRatio={3 / 2}
                            maxFileSize={3}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Date</Label>
                          <Input
                            type="date"
                            value={achievement.date || ""}
                            onChange={(e) => updateAchievement(index, "date", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Category</Label>
                          <Input
                            value={achievement.category || ""}
                            onChange={(e) => updateAchievement(index, "category", e.target.value)}
                            placeholder="Innovation"
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

        {achievements.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No achievements yet. Click "Add Achievement" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
