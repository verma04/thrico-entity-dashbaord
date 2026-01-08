import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, Check, X, Type } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComparisonTableSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const ComparisonTableSettings = ({
  content,
  onChange,
}: ComparisonTableSettingsProps) => {
  const columns = content.columns || ["Basic", "Pro", "Enterprise"];
  const rows = content.rows || [];

  const addColumn = () => {
    const newColumns = [...columns, `Plan ${columns.length + 1}`];
    // Add a corresponding empty cell to every row
    const newRows = rows.map((row: any) => ({
      ...row,
      cells: [...(row.cells || []), ""],
    }));
    onChange({ columns: newColumns, rows: newRows });
  };

  const updateColumn = (index: number, value: string) => {
    const newColumns = [...columns];
    newColumns[index] = value;
    onChange({ columns: newColumns });
  };

  const deleteColumn = (index: number) => {
    if (columns.length <= 1) return;
    const newColumns = columns.filter((_: any, i: number) => i !== index);
    const newRows = rows.map((row: any) => {
      const newCells = [...(row.cells || [])];
      newCells.splice(index, 1);
      return { ...row, cells: newCells };
    });
    onChange({ columns: newColumns, rows: newRows });
  };

  const addRow = () => {
    const newRows = [
      ...rows,
      {
        label: "New Feature",
        cells: columns.map(() => true), // Default to checked boolean
      },
    ];
    onChange({ rows: newRows });
  };

  const updateRowLabel = (index: number, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], label: value };
    onChange({ rows: newRows });
  };

  const updateCell = (
    rowIndex: number,
    cellIndex: number,
    value: string | boolean
  ) => {
    const newRows = [...rows];
    const currentCells = [...(newRows[rowIndex].cells || [])];
    currentCells[cellIndex] = value;
    newRows[rowIndex] = { ...newRows[rowIndex], cells: currentCells };
    onChange({ rows: newRows });
  };

  const deleteRow = (index: number) => {
    const newRows = rows.filter((_: any, i: number) => i !== index);
    onChange({ rows: newRows });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const itemsArray = Array.from(rows);
    const [reorderedItem] = itemsArray.splice(result.source.index, 1);
    itemsArray.splice(result.destination.index, 0, reorderedItem);

    onChange({ rows: itemsArray });
  };

  return (
    <div className="space-y-8">
      {/* 1. Columns Management */}
      <div className="space-y-4 border-b pb-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Label className="text-sm font-semibold">Column Headers</Label>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Define the plans or categories you are comparing.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColumn}
            className="h-8 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Column
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {columns.map((column: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={column}
                onChange={(e) => updateColumn(index, e.target.value)}
                placeholder={`Plan ${index + 1}`}
                className="h-9 text-sm"
              />
              {columns.length > 1 && (
                <button
                  onClick={() => deleteColumn(index)}
                  className="text-muted-foreground hover:text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Rows Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Label className="text-sm font-semibold">Features (Rows)</Label>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Add features and set their values for each plan.
            </p>
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={addRow}
            className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Feature
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="table-rows-list">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "space-y-3",
                  snapshot.isDraggingOver && "bg-accent/5 rounded-lg p-2"
                )}
              >
                {rows.map((row: any, rowIndex: number) => (
                  <Draggable
                    key={`row-${rowIndex}`}
                    draggableId={`row-${rowIndex}`}
                    index={rowIndex}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "bg-white dark:bg-slate-950 border rounded-lg overflow-hidden transition-all shadow-sm",
                          snapshot.isDragging && "shadow-xl ring-2 ring-primary"
                        )}
                      >
                        {/* Row Header */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 border-b flex items-center gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>

                          <div className="flex-1">
                            <Input
                              value={row.label || ""}
                              onChange={(e) =>
                                updateRowLabel(rowIndex, e.target.value)
                              }
                              className="h-8 border-transparent bg-transparent hover:bg-background focus:bg-background font-semibold px-2 -ml-2 transition-colors"
                              placeholder="Feature Name (e.g. Analytics)"
                            />
                          </div>

                          <button
                            onClick={() => deleteRow(rowIndex)}
                            className="text-muted-foreground hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Row Cells */}
                        <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                          {columns.map((column: string, cellIndex: number) => {
                            const cellValue = row.cells?.[cellIndex];
                            const isBoolean = typeof cellValue === "boolean";
                            const isText = typeof cellValue === "string";

                            return (
                              <div key={cellIndex} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <Label
                                    className="text-[10px] uppercase font-bold text-muted-foreground truncate max-w-[120px]"
                                    title={column}
                                  >
                                    {column}
                                  </Label>
                                  {/* Type toggle */}
                                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded p-0.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateCell(rowIndex, cellIndex, true)
                                      }
                                      className={cn(
                                        "p-1 rounded text-[10px]",
                                        isBoolean &&
                                          "bg-white shadow text-primary"
                                      )}
                                      title="Boolean (Check/X)"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateCell(rowIndex, cellIndex, "")
                                      }
                                      className={cn(
                                        "p-1 rounded text-[10px]",
                                        isText && "bg-white shadow text-primary"
                                      )}
                                      title="Text"
                                    >
                                      <Type className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {isBoolean ? (
                                  <div className="flex gap-1">
                                    <Button
                                      type="button"
                                      variant={
                                        cellValue === true
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      className={cn(
                                        "flex-1 h-8 text-xs",
                                        cellValue === true
                                          ? "bg-green-600 hover:bg-green-700"
                                          : "text-muted-foreground"
                                      )}
                                      onClick={() =>
                                        updateCell(rowIndex, cellIndex, true)
                                      }
                                    >
                                      <Check className="w-3 h-3 mr-1" /> Yes
                                    </Button>
                                    <Button
                                      type="button"
                                      variant={
                                        cellValue === false
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      className={cn(
                                        "flex-1 h-8 text-xs",
                                        cellValue === false
                                          ? "bg-red-500 hover:bg-red-600"
                                          : "text-muted-foreground"
                                      )}
                                      onClick={() =>
                                        updateCell(rowIndex, cellIndex, false)
                                      }
                                    >
                                      <X className="w-3 h-3 mr-1" /> No
                                    </Button>
                                  </div>
                                ) : (
                                  <Input
                                    value={cellValue || ""}
                                    onChange={(e) =>
                                      updateCell(
                                        rowIndex,
                                        cellIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Value"
                                    className="h-8 text-xs font-medium"
                                  />
                                )}
                              </div>
                            );
                          })}
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

        {rows.length === 0 && (
          <div className="text-center py-8 bg-slate-50 border rounded-lg border-dashed">
            <p className="text-sm text-muted-foreground mb-3">
              No features added yet.
            </p>
            <Button variant="outline" size="sm" onClick={addRow}>
              Start Adding Features
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
