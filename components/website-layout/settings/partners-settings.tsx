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

interface PartnersSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const PartnersSettings = ({
  content,
  onChange,
  layout,
}: PartnersSettingsProps) => {
  const partners = content.partners || [];

  const addPartner = () => {
    const newPartners = [
      ...partners,
      {
        name: "",
        logo: "",
        description: "",
        website: "",
        category: "",
      },
    ];
    onChange({ partners: newPartners });
  };

  const updatePartner = (index: number, field: string, value: any) => {
    const newPartners = [...partners];
    newPartners[index] = { ...newPartners[index], [field]: value };
    onChange({ partners: newPartners });
  };

  const deletePartner = (index: number) => {
    const newPartners = partners.filter((_: any, i: number) => i !== index);
    onChange({ partners: newPartners });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(partners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ partners: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Partners
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPartner}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Partner
          </Button>
        </div>

        <Droppable droppableId="partners-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {partners.map((partner: any, index: number) => (
                <Draggable
                  key={`partner-${index}`}
                  draggableId={`partner-${index}`}
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
                          <span className="text-xs font-bold">Partner {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deletePartner(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Partner Name</Label>
                        <Input
                          value={partner.name || ""}
                          onChange={(e) => updatePartner(index, "name", e.target.value)}
                          placeholder="Company Name"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Logo URL</Label>
                        <Input
                          value={partner.logo || ""}
                          onChange={(e) => updatePartner(index, "logo", e.target.value)}
                          placeholder="https://..."
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={partner.description || ""}
                          onChange={(e) => updatePartner(index, "description", e.target.value)}
                          placeholder="Brief description..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Website</Label>
                          <Input
                            value={partner.website || ""}
                            onChange={(e) => updatePartner(index, "website", e.target.value)}
                            placeholder="https://partner.com"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Category</Label>
                          <Input
                            value={partner.category || ""}
                            onChange={(e) => updatePartner(index, "category", e.target.value)}
                            placeholder="Technology"
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

        {partners.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No partners yet. Click "Add Partner" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
