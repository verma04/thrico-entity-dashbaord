import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  GripVertical,
  Trash2,
  Plus,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Calendar,
} from "lucide-react";

interface TimelineSettingsProps {
  content: {
    milestones?: Array<{
      date: string;
      title: string;
      description: string;
    }>;
    events?: Array<{
      year: string;
      title: string;
      description: string;
    }>; // Legacy support
    title?: string;
    description?: string;
    align?: "left" | "center" | "right";
  };
  onChange: (updates: any) => void;
}

const TimelineSettings: React.FC<TimelineSettingsProps> = ({
  content,
  onChange,
}) => {
  const [openPopover, setOpenPopover] = useState<number | null>(null);

  // Initialize milestones from content or legacy events
  const milestones = content.milestones ||
    content.events?.map((e) => ({ ...e, date: e.year })) || [
      {
        date: "2020",
        title: "Company Founded",
        description: "Started with a vision to transform the industry",
      },
      {
        date: "2021",
        title: "First Product Launch",
        description: "Released our flagship product to the market",
      },
      {
        date: "2022",
        title: "Global Expansion",
        description: "Expanded operations to 15 countries",
      },
      {
        date: "2023",
        title: "1M Users Milestone",
        description: "Reached one million active users worldwide",
      },
    ];

  const updateMilestone = (index: number, updates: any) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], ...updates };
    onChange({ milestones: newMilestones });
  };

  const addMilestone = () => {
    const newMilestones = [
      ...milestones,
      {
        date: new Date().getFullYear().toString(),
        title: "New Milestone",
        description: "Describe this important achievement",
      },
    ];
    onChange({ milestones: newMilestones });
  };

  const removeMilestone = (index: number) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    onChange({ milestones: newMilestones });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newMilestones = Array.from(milestones);
    const [reorderedItem] = newMilestones.splice(result.source.index, 1);
    newMilestones.splice(result.destination.index, 0, reorderedItem);

    onChange({ milestones: newMilestones });
  };

  return (
    <div className="space-y-6">
      {/* Header Settings */}
      <div className="p-4 bg-muted/50 border rounded-lg space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Layout className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Header Settings</h3>
        </div>

        <div className="grid gap-4">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Section Title
            </Label>
            <Input
              value={content.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Our Journey"
              className="bg-card"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Description
            </Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Brief description of your timeline..."
              rows={2}
              className="bg-card"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
              Header Alignment
            </Label>
            <div className="flex items-center gap-2 p-1 bg-card border rounded-md w-fit">
              {[
                { value: "left", icon: AlignLeft },
                { value: "center", icon: AlignCenter },
                { value: "right", icon: AlignRight },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onChange({ align: option.value })}
                  className={`p-2 rounded hover:bg-muted transition-colors ${
                    (content.align || "center") === option.value
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                  title={`Align ${option.value}`}
                >
                  <option.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Timeline Milestones</h3>
          </div>
          <Button onClick={addMilestone} size="sm" className="h-8">
            <Plus className="w-3 h-3 mr-1.5" />
            Add Milestone
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="milestones">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {milestones.map((milestone, index) => (
                  <Draggable
                    key={`milestone-${index}`}
                    draggableId={`milestone-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group bg-card border rounded-lg overflow-hidden transition-all duration-200 ${
                          snapshot.isDragging
                            ? "shadow-xl scale-[1.02] border-primary/50 z-50"
                            : "hover:border-border"
                        }`}
                      >
                        {/* Drag Handle & Header */}
                        <div className="flex items-center justify-between p-3 bg-muted/30 border-b gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              {...provided.dragHandleProps}
                              className="text-muted-foreground hover:text-muted-foreground cursor-grab active:cursor-grabbing p-1 hover:bg-muted/50 rounded"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-sm truncate">
                              {milestone.title || "Untitled Milestone"}
                            </span>
                            <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                              {milestone.date}
                            </span>
                          </div>

                          <Popover
                            open={openPopover === index}
                            onOpenChange={(open) =>
                              setOpenPopover(open ? index : null)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-64 p-3"
                              align="end"
                              side="left"
                            >
                              <div className="space-y-3">
                                <p className="text-xs text-muted-foreground font-medium">
                                  Delete this milestone?
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setOpenPopover(null)}
                                    className="flex-1 h-7 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      removeMilestone(index);
                                      setOpenPopover(null);
                                    }}
                                    className="flex-1 h-7 text-xs"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Content Inputs */}
                        <div className="p-4 grid gap-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                              <Label className="text-xs text-muted-foreground mb-1.5 block">
                                Date / Year
                              </Label>
                              <Input
                                value={milestone.date}
                                onChange={(e) =>
                                  updateMilestone(index, {
                                    date: e.target.value,
                                  })
                                }
                                placeholder="2024"
                                className="h-9 text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label className="text-xs text-muted-foreground mb-1.5 block">
                                Title
                              </Label>
                              <Input
                                value={milestone.title}
                                onChange={(e) =>
                                  updateMilestone(index, {
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Milestone Title"
                                className="h-9 text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-muted-foreground mb-1.5 block">
                              Description
                            </Label>
                            <Textarea
                              value={milestone.description}
                              onChange={(e) =>
                                updateMilestone(index, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Describe what happened..."
                              rows={2}
                              className="text-sm resize-none bg-muted/50/30 focus:bg-card transition-colors"
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
        </DragDropContext>
      </div>
    </div>
  );
};

export default TimelineSettings;
