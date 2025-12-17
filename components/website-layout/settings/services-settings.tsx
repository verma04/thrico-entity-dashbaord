"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, GripVertical } from "lucide-react";
import { IconPicker } from "./icon-picker";
import { DeleteConfirmPopover } from "./delete-confirm-popover";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

export const ServicesSettings = ({
  content,
  onChange,
}: {
  content: Record<string, any>;
  onChange: (c: Record<string, any>) => void;
}) => {
  const services = content.services || [];
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const updateService = (index: number, field: string, value: any) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    onChange({ services: newServices });
  };

  const updateFeatures = (index: number, features: string[]) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], features };
    onChange({ services: newServices });
  };

  const addFeature = (serviceIndex: number) => {
    const service = services[serviceIndex];
    const currentFeatures = service.features || [];
    updateFeatures(serviceIndex, [...currentFeatures, "New feature"]);
  };

  const removeFeature = (serviceIndex: number, featureIndex: number) => {
    const service = services[serviceIndex];
    const currentFeatures = service.features || [];
    const newFeatures = currentFeatures.filter((_, i) => i !== featureIndex);
    updateFeatures(serviceIndex, newFeatures);
  };

  const updateFeature = (
    serviceIndex: number,
    featureIndex: number,
    value: string
  ) => {
    const service = services[serviceIndex];
    const currentFeatures = [...(service.features || [])];
    currentFeatures[featureIndex] = value;
    updateFeatures(serviceIndex, currentFeatures);
  };

  const addService = () => {
    onChange({
      services: [
        ...services,
        {
          title: "New Service",
          description: "Service description...",
          icon: "briefcase",
          features: ["Feature 1", "Feature 2", "Feature 3"],
          price: "$999",
          popular: false,
          image: "",
        },
      ],
    });
  };

  const removeService = (index: number) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    onChange({ services: newServices });
    setDeleteIndex(null);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(services);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ services: items });
  };

  return (
    <div className="space-y-6">
      

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Services</Label>
          <Button onClick={addService} size="sm" variant="outline">
            <Plus className="w-3 h-3 mr-1" />
            Add Service
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="services">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "space-y-4",
                  snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
                )}
              >
                {services.map((service: any, index: number) => (
                  <Draggable
                    key={`service-${index}`}
                    draggableId={`service-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "p-4 border rounded-lg space-y-4 transition-shadow",
                          snapshot.isDragging &&
                            "shadow-lg ring-2 ring-primary/20"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                            </div>
                            <span className="text-sm font-medium">
                              Service {index + 1}
                            </span>
                          </div>

                          {/* Delete Popover */}
                          <DeleteConfirmPopover
                            title="Delete Service"
                            description={`Are you sure you want to delete "${service.title}"? This action cannot be undone.`}
                            onConfirm={() => removeService(index)}
                            open={deleteIndex === index}
                            onOpenChange={(open) =>
                              setDeleteIndex(open ? index : null)
                            }
                          />
                        </div>{" "}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              Title
                            </Label>
                            <Input
                              value={service.title || ""}
                              onChange={(e) =>
                                updateService(index, "title", e.target.value)
                              }
                              className="h-8 text-xs"
                              placeholder="Service name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              Price
                            </Label>
                            <Input
                              value={service.price || ""}
                              onChange={(e) =>
                                updateService(index, "price", e.target.value)
                              }
                              className="h-8 text-xs"
                              placeholder="$999"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            Description
                          </Label>
                          <Textarea
                            value={service.description || ""}
                            onChange={(e) =>
                              updateService(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="text-xs resize-none"
                            rows={2}
                            placeholder="Describe what this service offers..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              Icon
                            </Label>
                            <IconPicker
                              value={service.icon || ""}
                              onChange={(icon) =>
                                updateService(index, "icon", icon)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              Popular
                            </Label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={service.popular || false}
                                onChange={(e) =>
                                  updateService(
                                    index,
                                    "popular",
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4"
                              />
                              <span className="text-xs">Mark as popular</span>
                            </div>
                          </div>
                        </div>

                        {/* Service Image */}
                        <div className="space-y-2">
                          <ImageUploadWithCrop
                            label="Service Image (Optional)"
                            currentImage={service.image}
                            onImageUpdate={(url) =>
                              updateService(index, "image", url)
                            }
                            recommendedWidth={800}
                            recommendedHeight={600}
                            aspectRatio={4 / 3}
                            maxFileSize={5}
                            showDimensions={true}
                          />
                        </div>

                        {/* Dynamic Features List */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs text-muted-foreground">
                              Features
                            </Label>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addFeature(index)}
                              className="h-6 text-xs px-2"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {(service.features || []).map(
                              (feature: string, featureIndex: number) => (
                                <div
                                  key={featureIndex}
                                  className="flex gap-2 items-center"
                                >
                                  <Input
                                    value={feature}
                                    onChange={(e) =>
                                      updateFeature(
                                        index,
                                        featureIndex,
                                        e.target.value
                                      )
                                    }
                                    className="h-7 text-xs flex-1"
                                    placeholder="Feature description"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      removeFeature(index, featureIndex)
                                    }
                                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              )
                            )}

                            {(!service.features ||
                              service.features.length === 0) && (
                              <p className="text-xs text-muted-foreground text-center py-2 border-2 border-dashed rounded">
                                No features added. Click "Add" to create
                                features.
                              </p>
                            )}
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

        {services.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-xs border-2 border-dashed rounded-lg">
            No services added. Click "Add Service" to start.
          </div>
        )}
      </div>
    </div>
  );
};
