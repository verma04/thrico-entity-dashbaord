import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface ComparisonTableSettingsProps {
  content: any;
  onChange: (updates: any) => void;
}

export const ComparisonTableSettings = ({
  content,
  onChange,
}: ComparisonTableSettingsProps) => {
  const columns = content.columns || ["Feature", "Basic", "Pro"];
  const rows = content.rows || [];

  const addColumn = () => {
    const newColumns = [...columns, `Column ${columns.length + 1}`];
    onChange({ columns: newColumns });
  };

  const updateColumn = (index: number, value: string) => {
    const newColumns = [...columns];
    newColumns[index] = value;
    onChange({ columns: newColumns });
  };

  const deleteColumn = (index: number) => {
    if (columns.length <= 2) return; // Keep at least 2 columns
    const newColumns = columns.filter((_: any, i: number) => i !== index);
    const newRows = rows.map((row: any) => {
      const newCells = [...row.cells];
      newCells.splice(index, 1);
      return { ...row, cells: newCells };
    });
    onChange({ columns: newColumns, rows: newRows });
  };

  const addRow = () => {
    const newRows = [
      ...rows,
      {
        cells: columns.map(() => ""),
      },
    ];
    onChange({ rows: newRows });
  };

  const updateCell = (rowIndex: number, cellIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex].cells[cellIndex] = value;
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
    <div className="space-y-4">
      {/* Column Headers */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Table Columns
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColumn}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Column
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {columns.map((column: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                value={column}
                onChange={(e) => updateColumn(index, e.target.value)}
                placeholder={`Column ${index + 1}`}
                className="h-8 text-xs"
              />
              {columns.length > 2 && (
                <button
                  onClick={() => deleteColumn(index)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex justify-between items-center">
          <Label className="text-xs uppercase font-bold text-muted-foreground">
            Table Rows
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Row
          </Button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="table-rows-list">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "space-y-2",
                  snapshot.isDraggingOver && "bg-primary/5 rounded-md p-2"
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
                          "space-y-2 p-3 bg-muted/10 rounded border transition-shadow",
                          snapshot.isDragging && "shadow-lg ring-2 ring-primary/20"
                        )}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
                            </div>
                            <span className="text-xs font-bold">Row {rowIndex + 1}</span>
                          </div>
                          <button
                            onClick={() => deleteRow(rowIndex)}
                            className="text-red-500 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {columns.map((column: string, cellIndex: number) => (
                            <div key={cellIndex} className="space-y-1">
                              <Label className="text-[10px] text-muted-foreground">
                                {column}
                              </Label>
                              <Input
                                value={row.cells[cellIndex] || ""}
                                onChange={(e) =>
                                  updateCell(rowIndex, cellIndex, e.target.value)
                                }
                                placeholder={`Enter ${column.toLowerCase()}`}
                                className="h-8 text-xs"
                              />
                            </div>
                          ))}
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
          <p className="text-xs text-muted-foreground text-center py-4">
            No rows yet. Click "Add Row" to create one.
          </p>
        )}
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Tip:</strong> Add columns for different plans/features, then add rows to compare them. Drag rows to reorder.
        </p>
      </div>
    </div>
  );
};
