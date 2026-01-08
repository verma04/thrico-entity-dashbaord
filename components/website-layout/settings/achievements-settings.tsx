"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { IconPicker } from "./icon-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const {
    achievements = [],
    title = "Our Achievements",
    description = "Celebrating excellence and industry recognition.",
  } = content;

  const addAchievement = () => {
    const newAchievements = [
      ...achievements,
      {
        title: "New Achievement",
        description: "For outstanding contribution...",
        icon: "Trophy",
        date: "2024",
        category: "Industry",
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
    const newAchievements = achievements.filter(
      (_: any, i: number) => i !== index
    );
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
    <div className="space-y-6 pb-20">
      {/* Top Level Settings */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Section Title</Label>
          <Input
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Our Achievements"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Section Description</Label>
          <Textarea
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Celebrating excellence..."
            rows={2}
          />
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-semibold text-blue-600">
            Achievements & Awards
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAchievement}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Achievement
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="achievements-list">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "space-y-4",
                  snapshot.isDraggingOver && "bg-slate-50 rounded-xl p-2"
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
                          "p-4 bg-white border rounded-2xl shadow-sm space-y-4",
                          snapshot.isDragging
                            ? "shadow-xl ring-2 ring-blue-500/20"
                            : ""
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-slate-400 cursor-grab active:cursor-grabbing" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                              {achievement.title || "Achievement"}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAchievement(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Title & Category */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                              Title
                            </Label>
                            <Input
                              value={achievement.title || ""}
                              onChange={(e) =>
                                updateAchievement(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="Award Title"
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                              Category
                            </Label>
                            <Input
                              value={achievement.category || ""}
                              onChange={(e) =>
                                updateAchievement(
                                  index,
                                  "category",
                                  e.target.value
                                )
                              }
                              placeholder="Innovation"
                              className="h-9"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                          <Label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                            Description
                          </Label>
                          <Textarea
                            value={achievement.description || ""}
                            onChange={(e) =>
                              updateAchievement(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Briefly describe the achievement..."
                            rows={2}
                            className="text-sm"
                          />
                        </div>

                        {/* Icon Selection */}
                        <div className="space-y-2">
                          <Label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                            Icon / Badge Source
                          </Label>
                          <Tabs
                            defaultValue={
                              achievement.icon?.startsWith("http")
                                ? "image"
                                : "lucide"
                            }
                            className="w-full"
                          >
                            <TabsList className="grid w-full grid-cols-2 h-8">
                              <TabsTrigger
                                value="lucide"
                                className="text-[10px] flex items-center gap-1"
                              >
                                <Sparkles className="h-3 w-3" /> Lucide Icon
                              </TabsTrigger>
                              <TabsTrigger
                                value="image"
                                className="text-[10px] flex items-center gap-1"
                              >
                                <ImageIcon className="h-3 w-3" /> Custom Image
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="lucide" className="pt-2">
                              <IconPicker
                                value={
                                  achievement.icon?.startsWith("http")
                                    ? "Award"
                                    : achievement.icon || "Award"
                                }
                                onChange={(icon) =>
                                  updateAchievement(index, "icon", icon)
                                }
                              />
                            </TabsContent>
                            <TabsContent value="image" className="pt-2">
                              <ImageUploadWithCrop
                                currentImage={
                                  achievement.icon?.startsWith("http")
                                    ? achievement.icon
                                    : ""
                                }
                                onImageUpdate={(imageUrl: string) =>
                                  updateAchievement(index, "icon", imageUrl)
                                }
                                recommendedWidth={200}
                                recommendedHeight={200}
                                aspectRatio={1}
                              />
                            </TabsContent>
                          </Tabs>
                        </div>

                        {/* Date */}
                        <div className="space-y-1">
                          <Label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                            Year / Date
                          </Label>
                          <Input
                            value={achievement.date || ""}
                            onChange={(e) =>
                              updateAchievement(index, "date", e.target.value)
                            }
                            placeholder="e.g. 2024"
                            className="h-9"
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
        </DragDropContext>
      </div>
    </div>
  );
};

const Trophy = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
