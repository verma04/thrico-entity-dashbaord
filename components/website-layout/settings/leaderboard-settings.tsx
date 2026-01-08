import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";

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
        score: "0",
        avatar: "",
        role: "",
        change: "neutral",
        stats: [], // Default empty stats array
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
    const updatedItems = items.map((item: any, idx: number) => ({
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
                        snapshot.isDragging &&
                          "shadow-lg ring-2 ring-primary/20"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                          </div>
                          <span className="text-xs font-bold">
                            Rank {index + 1}
                          </span>
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
                          <Label className="text-[10px] text-muted-foreground">
                            Name
                          </Label>
                          <Input
                            value={ranking.name || ""}
                            onChange={(e) =>
                              updateRanking(index, "name", e.target.value)
                            }
                            placeholder="Player Name"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">
                            Score
                          </Label>
                          <Input
                            type="text"
                            value={ranking.score || ""}
                            onChange={(e) =>
                              updateRanking(index, "score", e.target.value)
                            }
                            placeholder="Score (e.g. 1500)"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Avatar Upload */}
                        <div className="space-y-2">
                          <ImageUploadWithCrop
                            currentImage={ranking.avatar || ""}
                            onImageUpdate={(url) =>
                              updateRanking(index, "avatar", url)
                            }
                            label="Avatar"
                            recommendedWidth={200}
                            recommendedHeight={200}
                            aspectRatio={1}
                            maxFileSize={2}
                            showDimensions={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">
                            Role / Category
                          </Label>
                          <Input
                            value={ranking.role || ranking.category || ""}
                            onChange={(e) => {
                              updateRanking(index, "role", e.target.value);
                              updateRanking(index, "category", e.target.value);
                            }}
                            placeholder="e.g. Moderator"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">
                            Trend Change
                          </Label>
                          <Select
                            value={ranking.change || "neutral"}
                            onValueChange={(val) =>
                              updateRanking(index, "change", val)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Trend" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="up">Up (Growing)</SelectItem>
                              <SelectItem value="neutral">
                                Neutral (Stable)
                              </SelectItem>
                              <SelectItem value="down">
                                Down (Falling)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">
                            Stats (JSON)
                          </Label>
                          <Input
                            value={
                              typeof ranking.stats === "string"
                                ? ranking.stats
                                : JSON.stringify(ranking.stats || [])
                            }
                            onChange={(e) => {
                              try {
                                // Try to parse just to validate, but store as string or object?
                                // Simplified: just store whatever string user types if it's stats field,
                                // but we need array for the renderer.
                                // Let's assume user won't type raw JSON easily here.
                                // For now, let's keep it simple: Comma separated text or just use a placeholder text if complex.
                                // Actually, let's just make it a text field that parses to array of objects if possible, or just leave as is.
                                // The renderer expects { label, value } array.
                                // Let's skip complex stats editing for this turn to avoid breakage, pass empty or defautls if missing.
                                // Or better: Let's allow pasting JSON for power users.
                                updateRanking(
                                  index,
                                  "stats",
                                  JSON.parse(e.target.value)
                                );
                              } catch (err) {
                                // ignore parse error while typing
                              }
                            }}
                            placeholder='[{"label":"XP","value":"100"}]'
                            className="h-8 text-xs font-mono"
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

        {rankings.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No rankings yet. Click "Add Ranking" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
