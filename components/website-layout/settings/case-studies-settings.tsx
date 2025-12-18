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

interface CaseStudiesSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const CaseStudiesSettings = ({
  content,
  onChange,
  layout,
}: CaseStudiesSettingsProps) => {
  const caseStudies = content.caseStudies || [];

  const addCaseStudy = () => {
    const newCaseStudies = [
      ...caseStudies,
      {
        title: "",
        client: "",
        industry: "",
        challenge: "",
        solution: "",
        results: "",
        image: "",
        testimonial: "",
        metrics: [],
        url: "",
      },
    ];
    onChange({ caseStudies: newCaseStudies });
  };

  const updateCaseStudy = (index: number, field: string, value: any) => {
    const newCaseStudies = [...caseStudies];
    newCaseStudies[index] = { ...newCaseStudies[index], [field]: value };
    onChange({ caseStudies: newCaseStudies });
  };

  const deleteCaseStudy = (index: number) => {
    const newCaseStudies = caseStudies.filter(
      (_: any, i: number) => i !== index
    );
    onChange({ caseStudies: newCaseStudies });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(caseStudies);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ caseStudies: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Case Studies
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCaseStudy}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Case Study
          </Button>
        </div>

        <Droppable droppableId="case-studies-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {caseStudies.map((caseStudy: any, index: number) => (
                <Draggable
                  key={`case-study-${index}`}
                  draggableId={`case-study-${index}`}
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
                            Case Study {index + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteCaseStudy(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Title
                        </Label>
                        <Input
                          value={caseStudy.title || ""}
                          onChange={(e) =>
                            updateCaseStudy(index, "title", e.target.value)
                          }
                          placeholder="Project Success Story"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">
                            Client
                          </Label>
                          <Input
                            value={caseStudy.client || ""}
                            onChange={(e) =>
                              updateCaseStudy(index, "client", e.target.value)
                            }
                            placeholder="Company Name"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">
                            Industry
                          </Label>
                          <Input
                            value={caseStudy.industry || ""}
                            onChange={(e) =>
                              updateCaseStudy(index, "industry", e.target.value)
                            }
                            placeholder="Technology"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Challenge
                        </Label>
                        <Textarea
                          value={caseStudy.challenge || ""}
                          onChange={(e) =>
                            updateCaseStudy(index, "challenge", e.target.value)
                          }
                          placeholder="Describe the challenge..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Solution
                        </Label>
                        <Textarea
                          value={caseStudy.solution || ""}
                          onChange={(e) =>
                            updateCaseStudy(index, "solution", e.target.value)
                          }
                          placeholder="Describe the solution..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Results
                        </Label>
                        <Textarea
                          value={caseStudy.results || ""}
                          onChange={(e) =>
                            updateCaseStudy(index, "results", e.target.value)
                          }
                          placeholder="Describe the results..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      {console.log(caseStudy.image)}
                      {/* Image Upload */}
                      <div className="space-y-2">
                        <ImageUploadWithCrop
                          currentImage={caseStudy.image || ""}
                          onImageUpdate={(url) =>
                            updateCaseStudy(index, "image", url)
                          }
                          label="Case Study Image"
                          recommendedWidth={800}
                          recommendedHeight={600}
                          aspectRatio={4 / 3}
                          maxFileSize={5}
                          showDimensions={true}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Testimonial (optional)
                        </Label>
                        <Textarea
                          value={caseStudy.testimonial || ""}
                          onChange={(e) =>
                            updateCaseStudy(
                              index,
                              "testimonial",
                              e.target.value
                            )
                          }
                          placeholder="Client testimonial..."
                          className="text-xs min-h-[40px]"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Case Study URL (optional)
                        </Label>
                        <Input
                          value={caseStudy.url || ""}
                          onChange={(e) =>
                            updateCaseStudy(index, "url", e.target.value)
                          }
                          placeholder="https://example.com/case-study"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Metrics (comma-separated)
                        </Label>
                        <Textarea
                          value={(caseStudy.metrics || []).join(", ")}
                          onChange={(e) => {
                            const metrics = e.target.value
                              .split(",")
                              .map((m) => m.trim())
                              .filter(Boolean);
                            updateCaseStudy(index, "metrics", metrics);
                          }}
                          placeholder="50% increase, $1M saved, 10x ROI"
                          className="text-xs min-h-[40px]"
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

        {caseStudies.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No case studies yet. Click "Add Case Study" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
