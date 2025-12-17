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

interface PodcastSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const PodcastSettings = ({
  content,
  onChange,
  layout,
}: PodcastSettingsProps) => {
  const episodes = content.episodes || [];

  const addEpisode = () => {
    const newEpisodes = [
      ...episodes,
      {
        title: "",
        description: "",
        audioUrl: "",
        duration: "",
        publishDate: "",
        season: 1,
        episodeNumber: episodes.length + 1,
        thumbnail: "",
      },
    ];
    onChange({ episodes: newEpisodes });
  };

  const updateEpisode = (index: number, field: string, value: any) => {
    const newEpisodes = [...episodes];
    newEpisodes[index] = { ...newEpisodes[index], [field]: value };
    onChange({ episodes: newEpisodes });
  };

  const deleteEpisode = (index: number) => {
    const newEpisodes = episodes.filter((_: any, i: number) => i !== index);
    onChange({ episodes: newEpisodes });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(episodes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ episodes: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Podcast Episodes
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addEpisode}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Episode
          </Button>
        </div>

        <Droppable droppableId="episodes-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {episodes.map((episode: any, index: number) => (
                <Draggable
                  key={`episode-${index}`}
                  draggableId={`episode-${index}`}
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
                          <span className="text-xs font-bold">Episode {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteEpisode(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Episode Title</Label>
                        <Input
                          value={episode.title || ""}
                          onChange={(e) => updateEpisode(index, "title", e.target.value)}
                          placeholder="Episode Title"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={episode.description || ""}
                          onChange={(e) => updateEpisode(index, "description", e.target.value)}
                          placeholder="Episode description..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Audio URL</Label>
                        <Input
                          value={episode.audioUrl || ""}
                          onChange={(e) => updateEpisode(index, "audioUrl", e.target.value)}
                          placeholder="https://..."
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Duration</Label>
                          <Input
                            value={episode.duration || ""}
                            onChange={(e) => updateEpisode(index, "duration", e.target.value)}
                            placeholder="45:30"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Season</Label>
                          <Input
                            type="number"
                            value={episode.season || 1}
                            onChange={(e) => updateEpisode(index, "season", parseInt(e.target.value) || 1)}
                            placeholder="1"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Episode #</Label>
                          <Input
                            type="number"
                            value={episode.episodeNumber || 1}
                            onChange={(e) => updateEpisode(index, "episodeNumber", parseInt(e.target.value) || 1)}
                            placeholder="1"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Publish Date</Label>
                          <Input
                            type="date"
                            value={episode.publishDate || ""}
                            onChange={(e) => updateEpisode(index, "publishDate", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Thumbnail URL</Label>
                          <Input
                            value={episode.thumbnail || ""}
                            onChange={(e) => updateEpisode(index, "thumbnail", e.target.value)}
                            placeholder="https://..."
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

        {episodes.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No episodes yet. Click "Add Episode" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
