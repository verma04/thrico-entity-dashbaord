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

interface SuccessStoriesSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const SuccessStoriesSettings = ({
  content,
  onChange,
  layout,
}: SuccessStoriesSettingsProps) => {
  const stories = content.stories || [];

  const addStory = () => {
    const newStories = [
      ...stories,
      {
        title: "",
        author: "",
        role: "",
        story: "",
        results: "",
        image: "",
        date: "",
        category: "",
      },
    ];
    onChange({ stories: newStories });
  };

  const updateStory = (index: number, field: string, value: any) => {
    const newStories = [...stories];
    newStories[index] = { ...newStories[index], [field]: value };
    onChange({ stories: newStories });
  };

  const deleteStory = (index: number) => {
    const newStories = stories.filter((_: any, i: number) => i !== index);
    onChange({ stories: newStories });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(stories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ stories: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Success Stories
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStory}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Story
          </Button>
        </div>

        <Droppable droppableId="stories-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {stories.map((story: any, index: number) => (
                <Draggable
                  key={`story-${index}`}
                  draggableId={`story-${index}`}
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
                          <span className="text-xs font-bold">Story {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteStory(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Title</Label>
                        <Input
                          value={story.title || ""}
                          onChange={(e) => updateStory(index, "title", e.target.value)}
                          placeholder="How I Achieved Success"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Author</Label>
                          <Input
                            value={story.author || ""}
                            onChange={(e) => updateStory(index, "author", e.target.value)}
                            placeholder="John Doe"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Role</Label>
                          <Input
                            value={story.role || ""}
                            onChange={(e) => updateStory(index, "role", e.target.value)}
                            placeholder="CEO"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Story</Label>
                        <Textarea
                          value={story.story || ""}
                          onChange={(e) => updateStory(index, "story", e.target.value)}
                          placeholder="Tell the success story..."
                          className="text-xs min-h-[60px]"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Results/Impact</Label>
                        <Textarea
                          value={story.results || ""}
                          onChange={(e) => updateStory(index, "results", e.target.value)}
                          placeholder="Key results and impact..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <ImageUploadWithCrop
                          label="Story Image"
                          currentImage={story.image || ""}
                          onImageUpdate={(imageUrl: string) =>
                            updateStory(index, "image", imageUrl)
                          }
                          recommendedWidth={800}
                          recommendedHeight={600}
                          aspectRatio={4 / 3}
                          showDimensions
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Date</Label>
                          <Input
                            type="date"
                            value={story.date || ""}
                            onChange={(e) => updateStory(index, "date", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Category</Label>
                          <Input
                            value={story.category || ""}
                            onChange={(e) => updateStory(index, "category", e.target.value)}
                            placeholder="Business Growth"
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

        {stories.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No stories yet. Click "Add Story" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
