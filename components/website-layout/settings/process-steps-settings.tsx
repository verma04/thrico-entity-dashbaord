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

interface ProcessStepsSettingsProps {
  content: {
    steps?: Array<{
      title: string;
      description: string;
      icon?: string;
      url?: string;
    }>;
    title?: string;
    description?: string;
    helpTitle?: string;
    helpDescription?: string;
    helpButtonText?: string;
    helpButtonUrl?: string;
  };
  onChange: (updates: any) => void;
}

const ProcessStepsSettings: React.FC<ProcessStepsSettingsProps> = ({
  content,
  onChange,
}) => {
  const [openPopover, setOpenPopover] = useState<number | null>(null);

  const {
    steps = [
      {
        title: "Sign Up",
        description: "Create your account in seconds",
        icon: "1",
      },
      { title: "Setup", description: "Configure your preferences", icon: "2" },
      { title: "Launch", description: "Start using our platform", icon: "3" },
      {
        title: "Succeed",
        description: "Achieve your goals with ease",
        icon: "4",
      },
    ],
    title = "How It Works",
    description = "Follow these simple steps to get started",
    helpTitle = "Need help?",
    helpDescription = "Our experts are available 24/7 to guide you through the process.",
    helpButtonText = "Schedule a Call",
    helpButtonUrl = "#",
  } = content;

  const addStep = () => {
    const newSteps = [
      ...steps,
      {
        title: "New Step",
        description: "Describe this step",
        icon: (steps.length + 1).toString(),
      },
    ];
    onChange({ steps: newSteps });
  };

  const updateStep = (index: number, updates: Partial<(typeof steps)[0]>) => {
    const newSteps = steps.map((step, i) =>
      i === index ? { ...step, ...updates } : step
    );
    onChange({ steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onChange({ steps: newSteps });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newSteps = Array.from(steps);
    const [reorderedStep] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedStep);

    onChange({ steps: newSteps });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Section Title</Label>
          <Input
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="How It Works"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Section Description</Label>
          <Textarea
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Follow these simple steps to get started"
            rows={2}
          />
        </div>

        <div className="pt-4 border-t space-y-4">
          <Label className="text-sm font-semibold text-blue-600">
            Help Card (Vertical Layout Only)
          </Label>
          <div>
            <Label className="text-xs text-gray-600">Help Title</Label>
            <Input
              value={helpTitle}
              onChange={(e) => onChange({ helpTitle: e.target.value })}
              placeholder="Need help?"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Help Description</Label>
            <Textarea
              value={helpDescription}
              onChange={(e) => onChange({ helpDescription: e.target.value })}
              placeholder="Our experts are available 24/7..."
              rows={2}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Button Text</Label>
            <Input
              value={helpButtonText}
              onChange={(e) => onChange({ helpButtonText: e.target.value })}
              placeholder="Schedule a Call"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Button URL</Label>
            <Input
              value={helpButtonUrl}
              onChange={(e) => onChange({ helpButtonUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Process Steps</Label>
          <Button
            onClick={addStep}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Step
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="process-steps">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {steps.map((step, index) => (
                  <Draggable
                    key={`step-${index}`}
                    draggableId={`step-${index}`}
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
                              Step #{index + 1}
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
                                    Delete Step
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Are you sure you want to delete "
                                    {step.title}"? This action cannot be undone.
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
                                      removeStep(index);
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
                              Icon/Number
                            </Label>
                            <Input
                              value={step.icon || ""}
                              onChange={(e) =>
                                updateStep(index, { icon: e.target.value })
                              }
                              placeholder={(index + 1).toString()}
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Step Title
                            </Label>
                            <Input
                              value={step.title}
                              onChange={(e) =>
                                updateStep(index, { title: e.target.value })
                              }
                              placeholder="Step Title"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Description
                            </Label>
                            <Textarea
                              value={step.description}
                              onChange={(e) =>
                                updateStep(index, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Describe this step..."
                              rows={2}
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Step URL (Link)
                            </Label>
                            <Input
                              value={step.url || ""}
                              onChange={(e) =>
                                updateStep(index, { url: e.target.value })
                              }
                              placeholder="https://..."
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

export default ProcessStepsSettings;
