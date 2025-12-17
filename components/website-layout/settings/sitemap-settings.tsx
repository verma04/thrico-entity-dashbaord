"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SitemapSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const SitemapSettings = ({
  content,
  onChange,
}: SitemapSettingsProps) => {
  const sections = content.sections || [];
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Section Management
  const addSection = () => {
    const newSections = [
      ...sections,
      {
        title: "",
        links: [],
      },
    ];
    onChange({ sections: newSections });
    setExpandedSections([...expandedSections, newSections.length - 1]);
  };

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    onChange({ sections: newSections });
  };

  const deleteSection = (index: number) => {
    const newSections = sections.filter((_: any, i: number) => i !== index);
    onChange({ sections: newSections });
  };

  const onDragEndSections = (result: DropResult) => {
    if (!result.destination) return;

    const sectionsArray = Array.from(sections);
    const [reorderedSection] = sectionsArray.splice(result.source.index, 1);
    sectionsArray.splice(result.destination.index, 0, reorderedSection);

    onChange({ sections: sectionsArray });
  };

  // Link Management
  const addLink = (sectionIndex: number) => {
    const newSections = [...sections];
    const currentLinks = newSections[sectionIndex].links || [];
    newSections[sectionIndex].links = [
      ...currentLinks,
      { label: "", url: "" },
    ];
    onChange({ sections: newSections });
  };

  const updateLink = (
    sectionIndex: number,
    linkIndex: number,
    field: string,
    value: any
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].links[linkIndex] = {
      ...newSections[sectionIndex].links[linkIndex],
      [field]: value,
    };
    onChange({ sections: newSections });
  };

  const deleteLink = (sectionIndex: number, linkIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].links = newSections[sectionIndex].links.filter(
      (_: any, i: number) => i !== linkIndex
    );
    onChange({ sections: newSections });
  };

  const onDragEndLinks = (sectionIndex: number) => (result: DropResult) => {
    if (!result.destination) return;

    const newSections = [...sections];
    const linksArray = Array.from(newSections[sectionIndex].links);
    const [reorderedLink] = linksArray.splice(result.source.index, 1);
    linksArray.splice(result.destination.index, 0, reorderedLink);

    newSections[sectionIndex].links = linksArray;
    onChange({ sections: newSections });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Sitemap Sections
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSection}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Section
        </Button>
      </div>

      {/* Sections List */}
      <DragDropContext onDragEnd={onDragEndSections}>
        <Droppable droppableId="sitemap-sections-list">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "space-y-3",
                snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
              )}
            >
              {sections.map((section: any, sectionIndex: number) => {
                const isExpanded = expandedSections.includes(sectionIndex);
                
                return (
                  <Draggable
                    key={`section-${sectionIndex}`}
                    draggableId={`section-${sectionIndex}`}
                    index={sectionIndex}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "border rounded-lg bg-card transition-shadow",
                          snapshot.isDragging && "shadow-lg ring-2 ring-primary/20"
                        )}
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between p-3 bg-muted/30">
                          <div className="flex items-center gap-2 flex-1">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                            </div>
                            <button
                              onClick={() => toggleSection(sectionIndex)}
                              className="flex items-center gap-2 flex-1 text-left"
                            >
                              <span className="text-xs font-bold">
                                Section {sectionIndex + 1}
                              </span>
                              {section.title && (
                                <span className="text-xs text-muted-foreground">
                                  - {section.title}
                                </span>
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => deleteSection(sectionIndex)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Section Content (Collapsible) */}
                        {isExpanded && (
                          <div className="p-3 space-y-3">
                            {/* Section Title */}
                            <div className="space-y-2">
                              <Label className="text-[10px] text-muted-foreground">
                                Section Title
                              </Label>
                              <Input
                                value={section.title || ""}
                                onChange={(e) =>
                                  updateSection(sectionIndex, "title", e.target.value)
                                }
                                placeholder="e.g., Company, Products, Resources"
                                className="h-8 text-xs"
                              />
                            </div>

                            {/* Links Header */}
                            <div className="flex justify-between items-center pt-2">
                              <Label className="text-[10px] text-muted-foreground uppercase">
                                Links
                              </Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => addLink(sectionIndex)}
                                className="h-6 text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Link
                              </Button>
                            </div>

                            {/* Links List */}
                            <DragDropContext onDragEnd={onDragEndLinks(sectionIndex)}>
                              <Droppable droppableId={`links-${sectionIndex}`}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                      "space-y-2",
                                      snapshot.isDraggingOver && "bg-primary/5 rounded p-1"
                                    )}
                                  >
                                    {(section.links || []).map(
                                      (link: any, linkIndex: number) => (
                                        <Draggable
                                          key={`link-${sectionIndex}-${linkIndex}`}
                                          draggableId={`link-${sectionIndex}-${linkIndex}`}
                                          index={linkIndex}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className={cn(
                                                "flex items-start gap-2 p-2 bg-muted/20 rounded border",
                                                snapshot.isDragging &&
                                                  "shadow-md ring-1 ring-primary/20"
                                              )}
                                            >
                                              <div {...provided.dragHandleProps}>
                                                <GripVertical className="h-3 w-3 text-muted-foreground/50 cursor-grab active:cursor-grabbing mt-1" />
                                              </div>
                                              <div className="flex-1 space-y-2">
                                                <Input
                                                  value={link.label || ""}
                                                  onChange={(e) =>
                                                    updateLink(
                                                      sectionIndex,
                                                      linkIndex,
                                                      "label",
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="Link Label"
                                                  className="h-7 text-xs"
                                                />
                                                <Input
                                                  value={link.url || ""}
                                                  onChange={(e) =>
                                                    updateLink(
                                                      sectionIndex,
                                                      linkIndex,
                                                      "url",
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="/page-url"
                                                  className="h-7 text-xs"
                                                />
                                              </div>
                                              <button
                                                onClick={() =>
                                                  deleteLink(sectionIndex, linkIndex)
                                                }
                                                className="text-red-500 hover:bg-red-50 p-1 rounded mt-1"
                                              >
                                                <Trash2 className="h-3 w-3" />
                                              </button>
                                            </div>
                                          )}
                                        </Draggable>
                                      )
                                    )}
                                    {provided.placeholder}
                                    {(section.links || []).length === 0 && (
                                      <p className="text-xs text-muted-foreground text-center py-2">
                                        No links yet. Click "Add Link" to create one.
                                      </p>
                                    )}
                                  </div>
                                )}
                              </Droppable>
                            </DragDropContext>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {sections.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4 bg-muted/20 rounded border border-dashed">
          No sections yet. Click "Add Section" to create one.
        </p>
      )}
    </div>
  );
};
