"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShopifyDisconnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopDomain?: string;
  isDisconnecting: boolean;
  onConfirmDisconnect: () => void;
}

export function ShopifyDisconnectModal({
  isOpen,
  onClose,
  shopDomain,
  isDisconnecting,
  onConfirmDisconnect,
}: ShopifyDisconnectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-6 rounded-2xl border-border">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-base font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Disconnect Store?
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to disconnect{" "}
            <strong>{shopDomain || "your Shopify store"}</strong>? Real-time
            order syncs and automated notification triggers will be paused.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={onClose}
            disabled={isDisconnecting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 text-xs font-semibold gap-1.5"
            onClick={onConfirmDisconnect}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Disconnecting…
              </>
            ) : (
              "Yes, Disconnect"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
