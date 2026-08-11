import React from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { CtaButton } from "@/components/ui/cta-button";

interface FaqDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const FaqDeleteDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
}: FaqDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-10 rounded-[24px] border-0 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mx-auto">
          <Trash2 size={32} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-900">
            Purge Entry?
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium tracking-tight px-4 leading-relaxed">
            This action will permanently remove this entry from your module's
            knowledge base.
          </DialogDescription>
        </div>
        <DialogFooter className="flex gap-3 pt-4">
          <CtaButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-9 text-[13px]"
          >
            Keep
          </CtaButton>
          <CtaButton
            onClick={onConfirm}
            className="flex-1 h-9 text-[13px] bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </CtaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
