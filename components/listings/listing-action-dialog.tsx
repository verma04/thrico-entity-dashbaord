"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getModalDescription, getModalTitle } from "@/lib/utils"

type DialogAction = "APPROVE" | "DISABLE" | "ENABLE" | "REJECT" | "VERIFY" | "UNVERIFY" | "REAPPROVE" | "PAUSE"

export function ListingActionDialog({
  open,
  onOpenChange,
  action,
  onConfirm,
  isLoading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  action?: DialogAction
  onConfirm: () => void
  isLoading: boolean
}) {
  const title = getModalTitle(action)
  const description = getModalDescription(action)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
