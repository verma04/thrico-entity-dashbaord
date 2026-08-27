"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { options } from "../options";
import { cn } from "@/lib/utils";

interface QuestionTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (type: string) => void;
}

export function QuestionTypeModal({
  open,
  onOpenChange,
  onSelect,
}: QuestionTypeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-5">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-sm font-semibold">Select Question Type</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
          {options.map((option) => (
            <Button
              key={option.key}
              variant="outline"
              className={cn(
                "h-16 flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs",
              )}
              onClick={() => {
                onSelect(option.key);
                onOpenChange(false);
              }}
            >
              <div className="p-1 rounded-md bg-muted/80 text-foreground scale-90">
                {option.icon}
              </div>
              <span className="font-medium text-xs truncate max-w-full">{option.label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
