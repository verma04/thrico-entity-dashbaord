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
import * as LucideIcons from "lucide-react";
import { IconPicker } from "./icon-picker";

interface FeatureHighlightsSettingsProps {
  content: {
    features?: Array<{
      title: string;
      description: string;
      icon: string;
      highlight: boolean;
    }>;
    title?: string;
    description?: string;
  };
  onChange: (updates: any) => void;
}

const FeatureHighlightsSettings: React.FC<FeatureHighlightsSettingsProps> = ({
  content,
  onChange,
}) => {
  const [openPopover, setOpenPopover] = useState<number | null>(null);

  const {
    features = [
      {
        title: "Lightning Fast",
        description:
          "Experience blazing fast performance that keeps your users engaged",
        icon: "Zap",
        highlight: true,
      },
      {
        title: "Secure & Reliable",
        description: "Bank-level security with 99.9% uptime guarantee",
        icon: "Lock",
        highlight: false,
      },
      {
        title: "24/7 Support",
        description: "Round-the-clock support from our expert team",
        icon: "Headphones",
        highlight: false,
      },
      {
        title: "Easy Integration",
        description:
          "Seamlessly integrate with your existing workflow in minutes",
        icon: "Link",
        highlight: true,
      },
    ],
    title = "Why Choose Us",
    description = "Discover what makes us the best choice for your needs",
  } = content;

  const addFeature = () => {
    const newFeatures = [
      ...features,
      {
        title: "New Feature",
        description: "Feature description",
        icon: "Sparkles",
        highlight: false,
      },
    ];
    onChange({ features: newFeatures });
  };

  const updateFeature = (
    index: number,
    updates: Partial<(typeof features)[0]>
  ) => {
    const newFeatures = features.map((feature, i) =>
      i === index ? { ...feature, ...updates } : feature
    );
    onChange({ features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    onChange({ features: newFeatures });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newFeatures = Array.from(features);
    const [reorderedFeature] = newFeatures.splice(result.source.index, 1);
    newFeatures.splice(result.destination.index, 0, reorderedFeature);

    onChange({ features: newFeatures });
  };

  // Helper function to render icon from icon name
  const renderIcon = (iconName: string, className?: string) => {
    if (!iconName) return null;
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Section Title</Label>
          <Input
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Why Choose Us"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Section Description</Label>
          <Textarea
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Discover what makes us the best choice for your needs"
            rows={2}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Feature Highlights</Label>
          <Button
            onClick={addFeature}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Feature
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="features">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {features.map((feature, index) => (
                  <Draggable
                    key={`feature-${index}`}
                    draggableId={`feature-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 border rounded-lg space-y-3 bg-card ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        } ${
                          feature.highlight ? "border-primary bg-primary/5" : ""
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
                            <div className="flex items-center justify-center w-6 h-6">
                              {renderIcon(feature.icon, "w-5 h-5")}
                            </div>
                            <span className="text-sm font-medium">
                              {feature.title}
                            </span>
                            {feature.highlight && (
                              <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                                Highlighted
                              </span>
                            )}
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
                                    Delete Feature
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Are you sure you want to delete "
                                    {feature.title}"? This action cannot be
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
                                      removeFeature(index);
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
                              Icon
                            </Label>
                            <IconPicker
                              value={feature.icon}
                              onChange={(icon) =>
                                updateFeature(index, { icon: icon })
                              }
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Feature Title
                            </Label>
                            <Input
                              value={feature.title}
                              onChange={(e) =>
                                updateFeature(index, { title: e.target.value })
                              }
                              placeholder="Feature Title"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-600">
                            Description
                          </Label>
                          <Textarea
                            value={feature.description}
                            onChange={(e) =>
                              updateFeature(index, {
                                description: e.target.value,
                              })
                            }
                            placeholder="Feature description..."
                            rows={2}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={feature.highlight}
                            onChange={(e) =>
                              updateFeature(index, {
                                highlight: e.target.checked,
                              })
                            }
                            className="rounded"
                          />
                          <Label className="text-xs text-gray-600">
                            Highlight this feature
                          </Label>
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

export default FeatureHighlightsSettings;
