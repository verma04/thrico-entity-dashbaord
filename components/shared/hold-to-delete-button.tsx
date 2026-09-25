"use client";

import React, { useState } from "react";
import HoldButton, { type HoldButtonSize } from "@/components/hold-button";
import { Trash2, Check, Loader2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface HoldToDeleteButtonProps {
  /** Callback fired when hold-to-delete completes or typed confirmation succeeds */
  onDelete: () => void | Promise<void>;
  /** Optional loading state (e.g. GraphQL mutation in flight) */
  loading?: boolean;
  /** Disable the button */
  disabled?: boolean;
  /** Name of the entity being deleted (e.g. "Community", "Survey", "Offer") */
  entityName?: string;
  /** Title of the specific instance (e.g. "Frontend Engineers Club") */
  entityTitle?: string;
  /** Time in milliseconds to hold down before triggering (defaults to 2000ms) */
  holdTime?: number;
  /** Button label when idle (defaults to "Hold 2s to Delete") */
  label?: string;
  /** Label when hold completes (defaults to "Deleted") */
  doneLabel?: string;
  /** Size variant */
  size?: HoldButtonSize;
  /** Require typing the exact title in a modal before enabling hold-to-delete */
  requireTypeMatch?: boolean;
  /** Optional CSS class overrides */
  className?: string;
}

/**
 * Reusable Hold-to-Delete Button powered by React Bits micro-interaction.
 * Features liquid fill animation that fills with destructive red on hold,
 * snaps back if released early, and triggers deletion upon full hold.
 */
export function HoldToDeleteButton({
  onDelete,
  loading = false,
  disabled = false,
  entityName = "Item",
  entityTitle,
  holdTime = 2000,
  label,
  doneLabel = "Confirmed",
  size = "sm",
  requireTypeMatch = false,
  className,
}: HoldToDeleteButtonProps) {
  const [showTypeConfirmModal, setShowTypeConfirmModal] = useState(false);
  const [typedName, setTypedName] = useState("");

  const idleLabel = label || `Hold ${Math.round(holdTime / 1000)}s to Delete`;

  const handleHoldComplete = () => {
    if (requireTypeMatch && entityTitle) {
      setShowTypeConfirmModal(true);
    } else {
      onDelete();
    }
  };

  const isTypeMatched =
    !entityTitle ||
    typedName.trim().toLowerCase() === entityTitle.trim().toLowerCase();

  return (
    <>
      <div className={cn("inline-flex items-center", className)}>
        {loading ? (
          <div className="h-9 px-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-semibold flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Deleting {entityName}…</span>
          </div>
        ) : (
          <HoldButton
            size={size}
            radius={12}
            holdTime={holdTime}
            releaseTime={200}
            backgroundColor="#18181b"
            fillColor="#dc2626"
            textColor="#ffffff"
            fillTextColor="#ffffff"
            wave={true}
            waveAmplitude={6}
            glow={true}
            disabled={disabled || loading}
            onHold={handleHoldComplete}
            icon={<Trash2 className="h-3.5 w-3.5 mr-1.5" />}
            doneIcon={<Check className="h-3.5 w-3.5 mr-1.5 text-white" />}
            doneLabel={doneLabel}
            className="shadow-2xs font-semibold text-xs"
          >
            {idleLabel}
          </HoldButton>
        )}
      </div>

      {/* Optional typed confirmation safeguard for high-stakes deletion */}
      {requireTypeMatch && entityTitle && (
        <AlertDialog
          open={showTypeConfirmModal}
          onOpenChange={setShowTypeConfirmModal}
        >
          <AlertDialogContent className="sm:max-w-md rounded-2xl">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-destructive mb-1">
                <AlertTriangle className="h-5 w-5" />
                <AlertDialogTitle className="text-base font-semibold">
                  Confirm Deletion of {entityTitle}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed space-y-3">
                <p>
                  You held to delete this {entityName.toLowerCase()}. To prevent accidental destruction, please type the exact title below:
                </p>
                <div className="p-3 bg-muted/40 rounded-lg border border-border/60 text-foreground space-y-1.5">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Required matching title:
                  </p>
                  <p className="text-xs font-mono font-bold select-all text-primary">
                    {entityTitle}
                  </p>
                  <Input
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="Type title here to verify…"
                    className="h-8 text-xs font-medium rounded-lg bg-background"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel
                onClick={() => setTypedName("")}
                className="h-8 text-xs rounded-lg"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  if (isTypeMatched) {
                    setShowTypeConfirmModal(false);
                    onDelete();
                  }
                }}
                disabled={!isTypeMatched || loading}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-8 text-xs shadow-2xs rounded-lg font-semibold cursor-pointer"
              >
                {loading && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                )}
                Permanently Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

export default HoldToDeleteButton;
