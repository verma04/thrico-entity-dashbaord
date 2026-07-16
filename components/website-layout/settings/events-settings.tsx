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
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface EventsSettingsProps {
  content: {
    events?: Array<{
      title: string;
      date: string;
      time: string;
      location: string;
      description: string;
      status: string;
      image?: string;
    }>;
    title?: string;
    description?: string;
  };
  onChange: (updates: any) => void;
}

const EventsSettings: React.FC<EventsSettingsProps> = ({
  content,
  onChange,
}) => {
  const [openPopover, setOpenPopover] = useState<number | null>(null);

  const {
    events = [
      {
        title: "Product Launch Conference",
        date: "2024-03-15",
        time: "10:00 AM",
        location: "San Francisco, CA",
        description:
          "Join us for the unveiling of our latest product innovations",
        status: "upcoming",
      },
      {
        title: "Developer Workshop",
        date: "2024-03-22",
        time: "2:00 PM",
        location: "Virtual Event",
        description: "Learn advanced techniques from our engineering team",
        status: "registration-open",
      },
      {
        title: "Annual User Summit",
        date: "2024-04-10",
        time: "9:00 AM",
        location: "New York, NY",
        description: "Connect with fellow users and discover new possibilities",
        status: "early-bird",
      },
    ],
    title = "Upcoming Events",
    description = "Join us for these exciting events",
  } = content;

  const addEvent = () => {
    const newEvents = [
      ...events,
      {
        title: "New Event",
        date: "2024-12-31",
        time: "10:00 AM",
        location: "TBD",
        description: "Event description",
        status: "upcoming",
        image: "",
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
            placeholder="Upcoming Events"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Section Description</Label>
          <Textarea
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Join us for these exciting events"
            rows={2}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Events</Label>
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
          <Droppable droppableId="events">
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
                        className={`p-4 border rounded-lg space-y-3 bg-card ${
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
                              {event.title}
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

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-600">
                              Event Title
                            </Label>
                            <Input
                              value={event.title}
                              onChange={(e) =>
                                updateEvent(index, { title: e.target.value })
                              }
                              placeholder="Event Title"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Status
                            </Label>
                            <select
                              value={event.status}
                              onChange={(e) =>
                                updateEvent(index, { status: e.target.value })
                              }
                              className="w-full h-8 text-xs border rounded px-2"
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="registration-open">
                                Registration Open
                              </option>
                              <option value="early-bird">Early Bird</option>
                              <option value="sold-out">Sold Out</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Date
                            </Label>
                            <Input
                              type="date"
                              value={event.date}
                              onChange={(e) =>
                                updateEvent(index, { date: e.target.value })
                              }
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Time
                            </Label>
                            <Input
                              value={event.time}
                              onChange={(e) =>
                                updateEvent(index, { time: e.target.value })
                              }
                              placeholder="10:00 AM"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600">
                            Location
                          </Label>
                          <Input
                            value={event.location}
                            onChange={(e) =>
                              updateEvent(index, { location: e.target.value })
                            }
                            placeholder="Event location"
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
                            placeholder="Event description..."
                            rows={2}
                          />
                        </div>

                        <div>
                          <ImageUploadWithCrop
                            label="Event Image"
                            currentImage={event.image}
                            onImageUpdate={(url) =>
                              updateEvent(index, { image: url })
                            }
                            recommendedWidth={800}
                            recommendedHeight={500}
                            aspectRatio={16 / 10}
                            maxFileSize={5}
                            showDimensions={true}
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

export default EventsSettings;
