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

interface VideoSpotlightSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const VideoSpotlightSettings = ({
  content,
  onChange,
  layout,
}: VideoSpotlightSettingsProps) => {
  const videos = content.videos || [];

  const addVideo = () => {
    const newVideos = [
      ...videos,
      {
        title: "",
        description: "",
        url: "",
        thumbnail: "",
        duration: "",
        category: "",
      },
    ];
    onChange({ videos: newVideos });
  };

  const updateVideo = (index: number, field: string, value: any) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    onChange({ videos: newVideos });
  };

  const deleteVideo = (index: number) => {
    const newVideos = videos.filter((_: any, i: number) => i !== index);
    onChange({ videos: newVideos });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ videos: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Videos
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVideo}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Video
          </Button>
        </div>

        <Droppable droppableId="videos-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {videos.map((video: any, index: number) => (
                <Draggable
                  key={`video-${index}`}
                  draggableId={`video-${index}`}
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
                          <span className="text-xs font-bold">Video {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteVideo(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Title</Label>
                        <Input
                          value={video.title || ""}
                          onChange={(e) => updateVideo(index, "title", e.target.value)}
                          placeholder="Video Title"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={video.description || ""}
                          onChange={(e) => updateVideo(index, "description", e.target.value)}
                          placeholder="Video description..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Video URL (YouTube/Vimeo)</Label>
                        <Input
                          value={video.url || ""}
                          onChange={(e) => updateVideo(index, "url", e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Thumbnail URL</Label>
                          <Input
                            value={video.thumbnail || ""}
                            onChange={(e) => updateVideo(index, "thumbnail", e.target.value)}
                            placeholder="https://..."
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Duration</Label>
                          <Input
                            value={video.duration || ""}
                            onChange={(e) => updateVideo(index, "duration", e.target.value)}
                            placeholder="5:30"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Category</Label>
                        <Input
                          value={video.category || ""}
                          onChange={(e) => updateVideo(index, "category", e.target.value)}
                          placeholder="Tutorial, Webinar, etc."
                          className="h-8 text-xs"
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

        {videos.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No videos yet. Click "Add Video" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
