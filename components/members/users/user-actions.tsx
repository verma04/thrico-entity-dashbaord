"use client"

import { useState } from "react"
import type { userStatus } from "@/types/user-types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Eye, Check, X, Lock, Unlock, AlertCircle, RefreshCw, Shield } from "lucide-react"
import UserDetailsDrawer from "./user-details-drawer"

export default function UserActions({ user }: { user: userStatus }) {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [reason, setReason] = useState("")

  const handleAction = (action: string) => {
    setSelectedAction(action)
    setIsActionModalOpen(true)
  }

  const confirmAction = () => {
    // TODO: Implement action API call
    console.log(`Action: ${selectedAction}, Reason: ${reason}`)
    setIsActionModalOpen(false)
    setReason("")
    setSelectedAction(null)
  }

  const isReasonRequired = selectedAction && ["BLOCK", "APPROVE", "REJECT", "FLAG", "VERIFY"].includes(selectedAction)

  const actions = [
    {
      label: "View Details",
      icon: Eye,
      onClick: () => setIsDetailsOpen(true),
    },
    { type: "separator" },
  ]

  if (user.status === "PENDING") {
    actions.push(
      { label: "Approve", icon: Check, onClick: () => handleAction("APPROVE"), color: "text-green-600" },
      { label: "Reject", icon: X, onClick: () => handleAction("REJECT"), color: "text-red-600" },
    )
  }

  if (user.status === "BLOCKED") {
    actions.push({
      label: "Unblock",
      icon: Unlock,
      onClick: () => handleAction("UNBLOCK"),
      color: "text-green-600",
    })
  } else if (user.status === "REJECTED") {
    actions.push(
      { label: "Block", icon: Lock, onClick: () => handleAction("BLOCK"), color: "text-red-600" },
      {
        label: "Re-approve",
        icon: RefreshCw,
        onClick: () => handleAction("REAPPROVE"),
        color: "text-blue-600",
      },
    )
  }

  if (user.status === "APPROVED") {
    actions.push(
      {
        label: user.verification?.isVerified ? "Remove Verification" : "Verify",
        icon: Shield,
        onClick: () => handleAction(user.verification?.isVerified ? "UNVERIFY" : "VERIFY"),
      },
      { label: "Disable", icon: Lock, onClick: () => handleAction("DISABLE"), color: "text-orange-600" },
    )
  }

  if (user.status === "DISABLED") {
    actions.push({
      label: "Enable",
      icon: Check,
      onClick: () => handleAction("ENABLE"),
      color: "text-green-600",
    })
  }

  actions.push(
    { type: "separator" },
    {
      label: "Flag for Review",
      icon: AlertCircle,
      onClick: () => handleAction("FLAG"),
      color: "text-orange-600",
    },
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, idx) =>
            action.type === "separator" ? (
              <DropdownMenuSeparator key={idx} />
            ) : (
              <DropdownMenuItem key={idx} onClick={action.onClick}>
                <action.icon className={`h-4 w-4 mr-2 ${action.color || ""}`} />
                {action.label}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              {selectedAction === "APPROVE" &&
                "This will approve the user's account and grant them access to the platform."}
              {selectedAction === "REJECT" &&
                "This will reject the user's registration. They will need to register again to access the platform."}
              {selectedAction === "BLOCK" &&
                "This will block the user from accessing the platform. They will not be able to log in."}
              {selectedAction === "UNBLOCK" &&
                "This will unblock the user's account and restore their access to the platform."}
              {selectedAction === "DISABLE" &&
                "This will temporarily disable the user's account. They will not be able to log in until re-enabled."}
              {selectedAction === "ENABLE" &&
                "This will re-enable the user's account and restore their access to the platform."}
              {selectedAction === "FLAG" && "This will flag the user's account for further review by the admin team."}
              {selectedAction === "VERIFY" && "This will add a verification badge to the user's profile."}
              {selectedAction === "UNVERIFY" && "This will remove the verification badge from the user's profile."}
              {selectedAction === "REAPPROVE" && "This will change the user's status from rejected to approved."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isReasonRequired && (
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for action</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for this action..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsActionModalOpen(false)
                setReason("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={isReasonRequired && !reason.trim()}
              variant={
                selectedAction?.includes("BLOCK") || selectedAction === "REJECT" || selectedAction === "DISABLE"
                  ? "destructive"
                  : "default"
              }
            >
              {selectedAction === "APPROVE" && "Approve"}
              {selectedAction === "REJECT" && "Reject"}
              {selectedAction === "BLOCK" && "Block"}
              {selectedAction === "UNBLOCK" && "Unblock"}
              {selectedAction === "DISABLE" && "Disable"}
              {selectedAction === "ENABLE" && "Enable"}
              {selectedAction === "FLAG" && "Flag"}
              {selectedAction === "VERIFY" && "Verify"}
              {selectedAction === "UNVERIFY" && "Remove Verification"}
              {selectedAction === "REAPPROVE" && "Re-approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UserDetailsDrawer open={isDetailsOpen} onOpenChange={setIsDetailsOpen} user={user} />
    </>
  )
}
