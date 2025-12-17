import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash2 } from "lucide-react";

interface DeleteConfirmPopoverProps {
  title: string;
  description: string;
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
}

export const DeleteConfirmPopover = ({
  title,
  description,
  onConfirm,
  open,
  onOpenChange,
  triggerClassName = "",
}: DeleteConfirmPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={`text-red-500 hover:text-red-700 hover:bg-red-50 ${triggerClassName}`}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onConfirm}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
