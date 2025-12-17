import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Plus } from "lucide-react";

interface TimelineSettingsProps {
  content: {
    events?: Array<{
      year: string;
      title: string;
      description: string;
    }>;
    title?: string;
    description?: string;
    backgroundColor?: string;
  };
  onChange: (updates: any) => void;
}

const TimelineSettings: React.FC<TimelineSettingsProps> = ({
  content,
  onChange,
}) => {
  const [openPopover, setOpenPopover] = useState<number | null>(null);

  const {
    events = [
      {
        year: "2020",
        title: "Company Founded",
        description: "Started with a vision to transform the industry",
      },
      {
        year: "2021",
        title: "First Product Launch",
        description: "Released our flagship product to the market",
      },
      {
        year: "2022",
        title: "Global Expansion",
        description: "Expanded operations to 15 countries",
      },
      {
        year: "2023",
        title: "1M Users Milestone",
        description: "Reached one million active users worldwide",
      },
    ],
    title = "Our Journey",
    description = "A timeline of our key milestones and achievements",
    backgroundColor = "#ffffff",
  } = content;

  const addEvent = () => {
    const newEvents = [
      ...events,
      {
        year: "2024",
        title: "New Milestone",
        description: "Another significant achievement in our journey",
      },
    ];
    onChange({ events: newEvents });
  };

  const updateEvent = (index: number, updates: Partial<(typeof events)[0]>) => {
    const newEvents = events.map((event, i) =>
      i === index ? { ...event, ...updates } : event
    );
    onChange({ events: newEvents });
  };

  const removeEvent = (index: number) => {
    const newEvents = events.filter((_, i) => i !== index);
    onChange({ events: newEvents });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newEvents = Array.from(events);
    const [reorderedEvent] = newEvents.splice(result.source.index, 1);
    newEvents.splice(result.destination.index, 0, reorderedEvent);

    onChange({ events: newEvents });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Section Title</Label>
          <Input
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Our Journey"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Section Description</Label>
          <Textarea
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="A timeline of our key milestones and achievements"
            rows={2}
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Background Color</Label>
          <Input
            type="color"
            value={backgroundColor}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Timeline Events</Label>
          <Button
            onClick={addEvent}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="timeline-events">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {events.map((event, index) => (
                  <Draggable
                    key={`event-${index}`}
                    draggableId={`event-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 border rounded-lg space-y-3 bg-white ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium">
                              Event #{index + 1}
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
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64" align="end">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-medium text-sm">
                                    Delete Event
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Are you sure you want to delete "
                                    {event.title}"? This action cannot be
                                    undone.
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setOpenPopover(null)}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      removeEvent(index);
                                      setOpenPopover(null);
                                    }}
                                    className="flex-1"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600">
                              Year
                            </Label>
                            <Input
                              value={event.year}
                              onChange={(e) =>
                                updateEvent(index, { year: e.target.value })
                              }
                              placeholder="2024"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Event Title
                            </Label>
                            <Input
                              value={event.title}
                              onChange={(e) =>
                                updateEvent(index, { title: e.target.value })
                              }
                              placeholder="Milestone Achievement"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Description
                            </Label>
                            <Textarea
                              value={event.description}
                              onChange={(e) =>
                                updateEvent(index, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Describe this important milestone..."
                              rows={2}
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
