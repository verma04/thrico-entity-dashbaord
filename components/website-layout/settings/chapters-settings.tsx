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

interface ChaptersSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const ChaptersSettings = ({
  content,
  onChange,
  layout,
}: ChaptersSettingsProps) => {
  const chapters = content.chapters || [];

  const addChapter = () => {
    const newChapters = [
      ...chapters,
      {
        name: "",
        location: "",
        region: "",
        description: "",
        memberCount: 0,
        contact: "",
        image: "",
        coordinates: { lat: 0, lng: 0 },
      },
    ];
    onChange({ chapters: newChapters });
  };

  const updateChapter = (index: number, field: string, value: any) => {
    const newChapters = [...chapters];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      newChapters[index] = {
        ...newChapters[index],
        [parent]: { ...newChapters[index][parent], [child]: value },
      };
    } else {
      newChapters[index] = { ...newChapters[index], [field]: value };
    }
    onChange({ chapters: newChapters });
  };

  const deleteChapter = (index: number) => {
    const newChapters = chapters.filter((_: any, i: number) => i !== index);
    onChange({ chapters: newChapters });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ chapters: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Chapters
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addChapter}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Chapter
          </Button>
        </div>

        <Droppable droppableId="chapters-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {chapters.map((chapter: any, index: number) => (
                <Draggable
                  key={`chapter-${index}`}
                  draggableId={`chapter-${index}`}
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
                          <span className="text-xs font-bold">Chapter {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteChapter(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Chapter Name</Label>
                          <Input
                            value={chapter.name || ""}
                            onChange={(e) => updateChapter(index, "name", e.target.value)}
                            placeholder="New York Chapter"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Location</Label>
                          <Input
                            value={chapter.location || ""}
                            onChange={(e) => updateChapter(index, "location", e.target.value)}
                            placeholder="New York, NY"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Region</Label>
                          <Input
                            value={chapter.region || ""}
                            onChange={(e) => updateChapter(index, "region", e.target.value)}
                            placeholder="Northeast"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Member Count</Label>
                          <Input
                            type="number"
                            value={chapter.memberCount || 0}
                            onChange={(e) => updateChapter(index, "memberCount", parseInt(e.target.value) || 0)}
                            placeholder="150"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={chapter.description || ""}
                          onChange={(e) => updateChapter(index, "description", e.target.value)}
                          placeholder="Chapter description..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Contact Email</Label>
                          <Input
                            value={chapter.contact || ""}
                            onChange={(e) => updateChapter(index, "contact", e.target.value)}
                            placeholder="contact@chapter.org"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Image URL</Label>
                          <Input
                            value={chapter.image || ""}
                            onChange={(e) => updateChapter(index, "image", e.target.value)}
                            placeholder="https://..."
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      {layout === "map" && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label className="text-[10px] text-muted-foreground">Latitude</Label>
                            <Input
                              type="number"
                              step="0.000001"
                              value={chapter.coordinates?.lat || 0}
                              onChange={(e) => updateChapter(index, "coordinates.lat", parseFloat(e.target.value) || 0)}
                              placeholder="40.7128"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] text-muted-foreground">Longitude</Label>
                            <Input
                              type="number"
                              step="0.000001"
                              value={chapter.coordinates?.lng || 0}
                              onChange={(e) => updateChapter(index, "coordinates.lng", parseFloat(e.target.value) || 0)}
                              placeholder="-74.0060"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {chapters.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No chapters yet. Click "Add Chapter" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
