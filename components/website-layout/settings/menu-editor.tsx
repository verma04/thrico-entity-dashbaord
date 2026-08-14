"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MenuItem,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  GripVertical,
  Plus,
  Trash2,
  ExternalLink,
  FileText,
} from "lucide-react";
import { IconPicker } from "./icon-picker";

interface MenuEditorProps {
  menuItems?: MenuItem[];
  onChange: (items: MenuItem[]) => void;
}

export const MenuEditor = ({ menuItems, onChange }: MenuEditorProps) => {
  const [newItemLabel, setNewItemLabel] = useState("");
  const { pages } = useWebsiteBuilderStore();
  const [linkType, setLinkType] = useState<
    Record<string, "internal" | "external">
  >({});

  const addMenuItem = () => {
    if (!newItemLabel.trim()) return;
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      label: newItemLabel,
      link: "#",
      target: "_self",
      children: [],
    };
    onChange([...(menuItems || []), newItem]);
    setNewItemLabel("");
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !menuItems) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const updateItem = (
    id: string,
    updates: Partial<MenuItem>,
    items: MenuItem[]
  ): MenuItem[] => {
    return items.map((item) => {
      if (item.id === id) return { ...item, ...updates };
      if (item.children)
        return { ...item, children: updateItem(id, updates, item.children) };
      return item;
    });
  };

  const removeItem = (id: string, items: MenuItem[]): MenuItem[] => {
    return items
      .filter((i) => i.id !== id)
      .map((i) => ({
        ...i,
        children: i.children ? removeItem(id, i.children) : [],
      }));
  };

  const addSubItem = (parentId: string, items: MenuItem[]): MenuItem[] => {
    return items.map((item) => {
      if (item.id === parentId) {
        return {
          ...item,
          children: [
            ...(item.children || []),
            {
              id: crypto.randomUUID(),
              label: "New Link",
              link: "#",
              target: "_self",
              children: [],
            },
          ],
        };
      }
      if (item.children) {
        return { ...item, children: addSubItem(parentId, item.children) };
      }
      return item;
    });
  };

  const renderItems = (items: MenuItem[], depth = 0) => {
    if (!items || items.length === 0) return null;

    return (
      <Droppable droppableId={`menu-level-${depth}`} type={`menu-${depth}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "space-y-3",
              depth > 0 && "pl-4 border-l ml-2",
              snapshot.isDraggingOver && "bg-primary/5 rounded-md"
            )}
          >
            {items.map((item, index) => (
              <Draggable
                key={item.id || `item-${depth}-${index}`}
                draggableId={String(item.id || `item-${depth}-${index}`)}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      "bg-muted/30 p-2 rounded-md border text-sm space-y-2 transition-shadow",
                      snapshot.isDragging && "shadow-lg ring-2 ring-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                      </div>
                      <div className="flex-1 font-medium">{item.label}</div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            onChange(addSubItem(item.id, menuItems || []))
                          }
                          className="p-1 hover:bg-muted rounded text-primary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            onChange(removeItem(item.id, menuItems || []))
                          }
                          className="p-1 hover:bg-red-100 text-red-500 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Label
                        </Label>
                        <Input
                          value={item.label}
                          onChange={(e) =>
                            onChange(
                              updateItem(
                                item.id,
                                { label: e.target.value },
                                menuItems || []
                              )
                            )
                          }
                          className="h-7 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Icon
                        </Label>
                        <IconPicker
                          value={item.icon || ""}
                          onChange={(val) =>
                            onChange(
                              updateItem(
                                item.id,
                                { icon: val },
                                menuItems || []
                              )
                            )
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Link Type
                        </Label>
                        <Select
                          value={
                            linkType[item.id] ||
                            (item.link?.startsWith("/")
                              ? "internal"
                              : "external")
                          }
                          onValueChange={(val: "internal" | "external") => {
                            setLinkType({ ...linkType, [item.id]: val });
                            if (val === "internal") {
                              onChange(
                                updateItem(
                                  item.id,
                                  { link: "/", target: "_self" },
                                  menuItems || []
                                )
                              );
                            } else {
                              onChange(
                                updateItem(
                                  item.id,
                                  { link: "https://", target: "_blank" },
                                  menuItems || []
                                )
                              );
                            }
                          }}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal">
                              <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3" />
                                Internal Page
                              </div>
                            </SelectItem>
                            <SelectItem value="external">
                              <div className="flex items-center gap-2">
                                <ExternalLink className="h-3 w-3" />
                                External URL
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-[10px] text-muted-foreground">
                          {linkType[item.id] === "internal" ||
                          item.link?.startsWith("/")
                            ? "Select Page"
                            : "External URL"}
                        </Label>
                        {linkType[item.id] === "internal" ||
                        (item.link?.startsWith("/") &&
                          linkType[item.id] !== "external") ? (
                          <Select
                            value={item.link || "/"}
                            onValueChange={(val) =>
                              onChange(
                                updateItem(
                                  item.id,
                                  { link: val, target: "_self" },
                                  menuItems || []
                                )
                              )
                            }
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue placeholder="Select page..." />
                            </SelectTrigger>
                            <SelectContent>
                              {pages
                                .filter((p) => p.isEnabled)
                                .map((page) => (
                                  <SelectItem
                                    key={page.id}
                                    value={`/${page.slug}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-3 w-3" />
                                      {page.name}{" "}
                                      <span className="text-muted-foreground">
                                        /{page.slug}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={item.link || ""}
                            onChange={(e) =>
                              onChange(
                                updateItem(
                                  item.id,
                                  { link: e.target.value },
                                  menuItems || []
                                )
                              )
                            }
                            placeholder="https://example.com"
                            className="h-7 text-xs"
                          />
                        )}
                      </div>
                      <div className="col-span-2">
                        <Label className="text-[10px] text-muted-foreground">
                          Open In
                        </Label>
                        <Select
                          value={item.target || "_self"}
                          onValueChange={(val: "_self" | "_blank") =>
                            onChange(
                              updateItem(
                                item.id,
                                { target: val },
                                menuItems || []
                              )
                            )
                          }
                          disabled={
                            linkType[item.id] === "internal" ||
                            (item.link?.startsWith("/") &&
                              linkType[item.id] !== "external")
                          }
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_self">Same Tab</SelectItem>
                            <SelectItem value="_blank">New Tab</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {item.children && item.children.length > 0 && (
                      <div className="pt-2">
                        {renderItems(item.children, depth + 1)}
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Menu Items
        </Label>
        {renderItems(menuItems || [])}
        <div className="flex gap-2 pt-2 border-t mt-2 border-dashed">
          <Input
            placeholder="Add top-level item..."
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === "Enter" && addMenuItem()}
          />
          <button
            onClick={addMenuItem}
            className="p-2 bg-primary text-primary-foreground rounded-md"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};
