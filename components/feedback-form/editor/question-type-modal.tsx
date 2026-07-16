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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Question Type</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {options.map((option) => (
            <Button
              key={option.key}
              variant="outline"
              className={cn(
                "h-24 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary",
              )}
              onClick={() => {
                onSelect(option.key);
                onOpenChange(false);
              }}
            >
              <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10">
                {option.icon}
              </div>
              <span className="font-medium text-sm">{option.label}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
