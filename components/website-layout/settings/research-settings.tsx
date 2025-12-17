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

interface ResearchSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const ResearchSettings = ({
  content,
  onChange,
  layout,
}: ResearchSettingsProps) => {
  const papers = content.papers || [];

  const addPaper = () => {
    const newPapers = [
      ...papers,
      {
        title: "",
        authors: "",
        abstract: "",
        publishDate: "",
        journal: "",
        pdfUrl: "",
        category: "",
      },
    ];
    onChange({ papers: newPapers });
  };

  const updatePaper = (index: number, field: string, value: any) => {
    const newPapers = [...papers];
    newPapers[index] = { ...newPapers[index], [field]: value };
    onChange({ papers: newPapers });
  };

  const deletePaper = (index: number) => {
    const newPapers = papers.filter((_: any, i: number) => i !== index);
    onChange({ papers: newPapers });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(papers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ papers: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Research Papers
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPaper}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Paper
          </Button>
        </div>

        <Droppable droppableId="papers-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {papers.map((paper: any, index: number) => (
                <Draggable
                  key={`paper-${index}`}
                  draggableId={`paper-${index}`}
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
                          <span className="text-xs font-bold">Paper {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deletePaper(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Paper Title</Label>
                        <Input
                          value={paper.title || ""}
                          onChange={(e) => updatePaper(index, "title", e.target.value)}
                          placeholder="Research Paper Title"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Authors (comma-separated)</Label>
                        <Input
                          value={paper.authors || ""}
                          onChange={(e) => updatePaper(index, "authors", e.target.value)}
                          placeholder="John Doe, Jane Smith"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Abstract</Label>
                        <Textarea
                          value={paper.abstract || ""}
                          onChange={(e) => updatePaper(index, "abstract", e.target.value)}
                          placeholder="Paper abstract..."
                          className="text-xs min-h-[60px]"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Publish Date</Label>
                          <Input
                            type="date"
                            value={paper.publishDate || ""}
                            onChange={(e) => updatePaper(index, "publishDate", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Journal</Label>
                          <Input
                            value={paper.journal || ""}
                            onChange={(e) => updatePaper(index, "journal", e.target.value)}
                            placeholder="Journal Name"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">PDF URL</Label>
                          <Input
                            value={paper.pdfUrl || ""}
                            onChange={(e) => updatePaper(index, "pdfUrl", e.target.value)}
                            placeholder="https://..."
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Category</Label>
                          <Input
                            value={paper.category || ""}
                            onChange={(e) => updatePaper(index, "category", e.target.value)}
                            placeholder="Machine Learning"
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

        {papers.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No research papers yet. Click "Add Paper" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
