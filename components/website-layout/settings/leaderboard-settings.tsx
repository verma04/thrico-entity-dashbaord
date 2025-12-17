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

interface LeaderboardSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const LeaderboardSettings = ({
  content,
  onChange,
  layout,
}: LeaderboardSettingsProps) => {
  const rankings = content.rankings || [];

  const addRanking = () => {
    const newRankings = [
      ...rankings,
      {
        rank: rankings.length + 1,
        name: "",
        score: 0,
        avatar: "",
        badge: "",
        stats: "",
      },
    ];
    onChange({ rankings: newRankings });
  };

  const updateRanking = (index: number, field: string, value: any) => {
    const newRankings = [...rankings];
    newRankings[index] = { ...newRankings[index], [field]: value };
    onChange({ rankings: newRankings });
  };

  const deleteRanking = (index: number) => {
    const newRankings = rankings.filter((_: any, i: number) => i !== index);
    onChange({ rankings: newRankings });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(rankings);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update ranks after reordering
    const updatedItems = items.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    onChange({ rankings: updatedItems });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Rankings
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRanking}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Ranking
          </Button>
        </div>

        <Droppable droppableId="rankings-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {rankings.map((ranking: any, index: number) => (
                <Draggable
                  key={`ranking-${index}`}
                  draggableId={`ranking-${index}`}
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
                          <span className="text-xs font-bold">Rank {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteRanking(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Name</Label>
                          <Input
                            value={ranking.name || ""}
                            onChange={(e) => updateRanking(index, "name", e.target.value)}
                            placeholder="Player Name"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Score</Label>
                          <Input
                            type="number"
                            value={ranking.score || 0}
                            onChange={(e) => updateRanking(index, "score", parseInt(e.target.value) || 0)}
                            placeholder="1000"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Avatar Upload */}
                        <div className="space-y-2">
                          <ImageUploadWithCrop
                            currentImage={ranking.avatar || ""}
                            onImageUpdate={(url) => updateRanking(index, "avatar", url)}
                            label="Avatar"
                            recommendedWidth={200}
                            recommendedHeight={200}
                            aspectRatio={1}
                            maxFileSize={2}
                            showDimensions={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Badge</Label>
                          <Input
                            value={ranking.badge || ""}
                            onChange={(e) => updateRanking(index, "badge", e.target.value)}
                            placeholder="Gold, Silver, Bronze"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Stats</Label>
                        <Textarea
                          value={ranking.stats || ""}
                          onChange={(e) => updateRanking(index, "stats", e.target.value)}
                          placeholder="Additional stats..."
                          className="text-xs min-h-[50px]"
                          rows={2}
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

        {rankings.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No rankings yet. Click "Add Ranking" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
