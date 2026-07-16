"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Image as ImageIcon,
  Video,
  Quote as QuoteIcon,
  Code as CodeIcon,
} from "lucide-react";
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

interface ContentSectionSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const ContentSectionSettings: React.FC<ContentSectionSettingsProps> = ({
  content,
  onChange,
}) => {
  const blocks = content.blocks || [];

  const addBlock = (type: string = "text") => {
    const newBlocks = [
      ...blocks,
      {
        type,
        content: "",
        title: "",
      },
    ];
    onChange({ blocks: newBlocks });
  };

  const updateBlock = (index: number, updates: any) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    onChange({ blocks: newBlocks });
  };

  const deleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_: any, i: number) => i !== index);
    onChange({ blocks: newBlocks });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onChange({ blocks: items });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Section Basics */}
      <div className="space-y-4">
        <Label className="text-xs uppercase font-black text-blue-600 tracking-widest">
          Section Header
        </Label>
        <div className="space-y-4 p-4 bg-muted/50 rounded-2xl border border-border">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Section Label
            </Label>
            <Input
              value={content.heading || ""}
              onChange={(e) => onChange({ heading: e.target.value })}
              placeholder="e.g. CORE FEATURES or NEW ARRIVALS"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Title
            </Label>
            <Input
              value={content.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Section Title"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Description
            </Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Section Description..."
              className="min-h-[80px] rounded-xl text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Text Color
            </Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.textColor || "#000000"}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="h-10 w-12 rounded-xl border border-border cursor-pointer"
              />
              <Input
                value={content.textColor || ""}
                onChange={(e) => onChange({ textColor: e.target.value })}
                placeholder="#000000"
                className="flex-1 h-10 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Media */}
      <div className="space-y-4 border-t pt-6">
        <Label className="text-xs uppercase font-black text-blue-600 tracking-widest flex items-center gap-2">
          Featured Media{" "}
          <span className="text-[10px] font-normal text-muted-foreground font-sans tracking-normal uppercase">
            (Top of Section)
          </span>
        </Label>
        <div className="space-y-4 p-4 bg-muted/50 rounded-2xl border border-border">
          <ImageUploadWithCrop
            label="Featured Image"
            currentImage={content.image || ""}
            onImageUpdate={(imageUrl: string) => onChange({ image: imageUrl })}
            recommendedWidth={1200}
            recommendedHeight={800}
            aspectRatio={3 / 2}
          />
          <div className="space-y-1.5 pt-2 border-t border-border">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Video URL
            </Label>
            <Input
              value={content.videoUrl || ""}
              onChange={(e) => onChange({ videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="h-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-black text-blue-600 tracking-widest">
            Content Blocks
          </Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addBlock("text")}
              className="h-8 rounded-full text-[10px] font-bold uppercase"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Block
            </Button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="blocks-list">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "space-y-4",
                  snapshot.isDraggingOver && "bg-blue-50/50 rounded-3xl p-2"
                )}
              >
                {blocks.map((block: any, index: number) => (
                  <Draggable
                    key={`block-${index}`}
                    draggableId={`block-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "p-5 bg-card border rounded-2xl shadow-sm space-y-4 transition-all",
                          snapshot.isDragging
                            ? "shadow-2xl ring-4 ring-blue-500/10 scale-[1.02] z-50"
                            : ""
                        )}
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                            </div>
                            <div className="flex items-center gap-2">
                              {block.type === "text" && (
                                <Type className="h-4 w-4 text-muted-foreground" />
                              )}
                              {block.type === "image" && (
                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                              {block.type === "video" && (
                                <Video className="h-4 w-4 text-muted-foreground" />
                              )}
                              {block.type === "quote" && (
                                <QuoteIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                              {block.type === "code" && (
                                <CodeIcon className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                                Block {index + 1} • {block.type}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBlock(index)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                              Type
                            </Label>
                            <Select
                              value={block.type || "text"}
                              onValueChange={(val) =>
                                updateBlock(index, { type: val })
                              }
                            >
                              <SelectTrigger className="h-9 rounded-xl text-xs bg-muted/50 border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text Block</SelectItem>
                                <SelectItem value="image">
                                  Image Block
                                </SelectItem>
                                <SelectItem value="video">
                                  Video Block
                                </SelectItem>
                                <SelectItem value="quote">
                                  Quote Block
                                </SelectItem>
                                <SelectItem value="code">Code Block</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {block.type !== "image" && block.type !== "video" && (
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                                {block.type === "quote"
                                  ? "Quote Title (optional)"
                                  : "Title / Label"}
                              </Label>
                              <Input
                                value={block.title || ""}
                                onChange={(e) =>
                                  updateBlock(index, { title: e.target.value })
                                }
                                placeholder="Enter title..."
                                className="h-9 rounded-xl text-xs"
                              />
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                              {block.type === "image" && "Upload Image"}
                              {block.type === "video" && "Video URL"}
                              {block.type === "quote" && "Quote Text"}
                              {block.type === "code" && "Code Content"}
                              {block.type === "text" && "Text Content"}
                            </Label>

                            {block.type === "text" ||
                            block.type === "quote" ||
                            block.type === "code" ? (
                              <Textarea
                                value={block.content || ""}
                                onChange={(e) =>
                                  updateBlock(index, {
                                    content: e.target.value,
                                  })
                                }
                                placeholder={
                                  block.type === "quote"
                                    ? "Whose words are these?"
                                    : block.type === "code"
                                    ? "Paste your code here..."
                                    : "Tell your story..."
                                }
                                className="min-h-[100px] rounded-xl text-sm"
                                rows={4}
                              />
                            ) : block.type === "image" ? (
                              <ImageUploadWithCrop
                                label=""
                                currentImage={block.content || ""}
                                onImageUpdate={(imageUrl: string) =>
                                  updateBlock(index, { content: imageUrl })
                                }
                                recommendedWidth={1200}
                                recommendedHeight={800}
                                aspectRatio={3 / 2}
                              />
                            ) : (
                              <Input
                                value={block.content || ""}
                                onChange={(e) =>
                                  updateBlock(index, {
                                    content: e.target.value,
                                  })
                                }
                                placeholder="https://youtube.com/watch?v=..."
                                className="h-10 rounded-xl text-xs"
                              />
                            )}
                          </div>

                          {block.type === "quote" && (
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                                Author
                              </Label>
                              <Input
                                value={block.author || ""}
                                onChange={(e) =>
                                  updateBlock(index, { author: e.target.value })
                                }
                                placeholder="Author name"
                                className="h-9 rounded-xl text-xs"
                              />
                            </div>
                          )}
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

        {blocks.length === 0 && (
          <div className="text-center py-12 bg-muted/50 rounded-4xl border border-dashed border-border">
            <Type className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-xs text-muted-foreground font-medium">
              No content blocks yet. Click "Add Block" to start building.
            </p>
          </div>
        )}
      </div>

      {/* Call-to-Action */}
      <div className="space-y-4 border-t pt-6">
        <Label className="text-xs uppercase font-black text-blue-600 tracking-widest">
          Call-to-Action
        </Label>
        <div className="space-y-4 p-4 bg-muted/50 rounded-2xl border border-border">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                Button Text
              </Label>
              <Input
                value={content.buttonText || ""}
                onChange={(e) => onChange({ buttonText: e.target.value })}
                placeholder="Learn More"
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                Button Link
              </Label>
              <Input
                value={content.buttonLink || ""}
                onChange={(e) => onChange({ buttonLink: e.target.value })}
                placeholder="/learn-more"
                className="h-10 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">
              Button Style
            </Label>
            <Select
              value={content.buttonStyle || "primary"}
              onValueChange={(val) => onChange({ buttonStyle: val })}
            >
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary (High Impact)</SelectItem>
                <SelectItem value="secondary">Secondary (Soft)</SelectItem>
                <SelectItem value="outline">Outline (Ghost Border)</SelectItem>
                <SelectItem value="ghost">Ghost (Text Only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Global Alignment */}
      <div className="space-y-4 border-t pt-6">
        <Label className="text-xs uppercase font-black text-blue-600 tracking-widest font-sans">
          Section Alignment
        </Label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-xl border border-border">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => onChange({ alignment: align })}
              className={cn(
                "py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                content.alignment === align ||
                  (!content.alignment && align === "left")
                  ? "bg-card text-blue-600 shadow-sm ring-1 ring-slate-200"
                  : "text-muted-foreground hover:text-muted-foreground hover:bg-card/50"
              )}
            >
              {align}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
