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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResourcesSettingsProps {
  content: any;
  onChange: (updates: any) => void;
  layout?: string;
}

export const ResourcesSettings = ({
  content,
  onChange,
  layout,
}: ResourcesSettingsProps) => {
  const resources = content.resources || [];

  const addResource = () => {
    const newResources = [
      ...resources,
      {
        title: "",
        description: "",
        type: "",
        url: "",
        fileSize: "",
        category: "",
        thumbnail: "",
      },
    ];
    onChange({ resources: newResources });
  };

  const updateResource = (index: number, field: string, value: any) => {
    const newResources = [...resources];
    newResources[index] = { ...newResources[index], [field]: value };
    onChange({ resources: newResources });
  };

  const deleteResource = (index: number) => {
    const newResources = resources.filter((_: any, i: number) => i !== index);
    onChange({ resources: newResources });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(resources);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({ resources: items });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Resources
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addResource}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Resource
          </Button>
        </div>

        <Droppable droppableId="resources-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-2",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {resources.map((resource: any, index: number) => (
                <Draggable
                  key={`resource-${index}`}
                  draggableId={`resource-${index}`}
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
                          <span className="text-xs font-bold">Resource {index + 1}</span>
                        </div>
                        <button
                          onClick={() => deleteResource(index)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Title</Label>
                        <Input
                          value={resource.title || ""}
                          onChange={(e) => updateResource(index, "title", e.target.value)}
                          placeholder="Resource Title"
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Description</Label>
                        <Textarea
                          value={resource.description || ""}
                          onChange={(e) => updateResource(index, "description", e.target.value)}
                          placeholder="Resource description..."
                          className="text-xs min-h-[50px]"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Resource Type</Label>
                          <Select
                            value={resource.type || ""}
                            onValueChange={(value) => updateResource(index, "type", value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PDF">📄 PDF</SelectItem>
                              <SelectItem value="Video">🎥 Video</SelectItem>
                              <SelectItem value="Guide">📖 Guide</SelectItem>
                              <SelectItem value="Template">📋 Template</SelectItem>
                              <SelectItem value="Whitepaper">📝 Whitepaper</SelectItem>
                              <SelectItem value="Ebook">📚 Ebook</SelectItem>
                              <SelectItem value="Worksheet">📊 Worksheet</SelectItem>
                              <SelectItem value="Tool">🛠️ Tool</SelectItem>
                              <SelectItem value="Other">📦 Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Category</Label>
                          <Input
                            value={resource.category || ""}
                            onChange={(e) => updateResource(index, "category", e.target.value)}
                            placeholder="Documentation"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">File Size</Label>
                          <Input
                            value={resource.fileSize || ""}
                            onChange={(e) => updateResource(index, "fileSize", e.target.value)}
                            placeholder="2.5 MB"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] text-muted-foreground">Download URL</Label>
                          <Input
                            value={resource.url || ""}
                            onChange={(e) => updateResource(index, "url", e.target.value)}
                            placeholder="https://..."
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] text-muted-foreground">Resource Thumbnail</Label>
                        <ImageUploadWithCrop
                          currentImage={resource.thumbnail || ""}
                          onImageUpdate={(url: string) => updateResource(index, "thumbnail", url)}
                          aspectRatio={16 / 9}
                          label="Upload Thumbnail"
                          maxFileSize={2}
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

        {resources.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No resources yet. Click "Add Resource" to create one.
          </p>
        )}
      </div>
    </DragDropContext>
  );
};
