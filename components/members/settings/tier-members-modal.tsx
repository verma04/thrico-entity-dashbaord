"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Award } from "lucide-react";
import TierMembersList from "./tier-members-list";

interface TierMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: any | null;
}

export function TierMembersModal({
  isOpen,
  onClose,
  tier,
}: TierMembersModalProps) {
  if (!tier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <DialogHeader className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            {tier.badgeIcon ? (
              <img
                src={
                  tier.badgeIcon.startsWith("http")
                    ? tier.badgeIcon
                    : `https://cdn.thrico.network/${tier.badgeIcon}`
                }
                alt={tier.name}
                className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700"
                style={{
                  backgroundColor: `${tier.badgeColor || "#6366f1"}18`,
                  borderColor: tier.badgeColor || "#6366f1",
                }}
              >
                <Award
                  className="h-4 w-4"
                  style={{ color: tier.badgeColor || "#6366f1" }}
                />
              </div>
            )}
            <div>
              <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {tier.name} — Members
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage members assigned to this tier and configure membership access.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="pt-2">
          <TierMembersList tierId={tier.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
