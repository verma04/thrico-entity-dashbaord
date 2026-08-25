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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 p-4">
        <DialogHeader className="pb-2.5 border-b border-[#e1e3e5] dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            {tier.badgeIcon ? (
              <img
                src={
                  tier.badgeIcon.startsWith("http")
                    ? tier.badgeIcon
                    : `https://cdn.thrico.network/${tier.badgeIcon}`
                }
                alt={tier.name}
                className="w-8 h-8 rounded-[4px] object-cover border border-[#d2d5d9] dark:border-zinc-700"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-[4px] flex items-center justify-center border border-[#d2d5d9] dark:border-zinc-700"
                style={{
                  backgroundColor: `${tier.badgeColor || "#303030"}18`,
                  borderColor: tier.badgeColor || "#303030",
                }}
              >
                <Award
                  className="h-4 w-4"
                  style={{ color: tier.badgeColor || "#303030" }}
                />
              </div>
            )}
            <div>
              <DialogTitle className="text-[13.5px] font-bold text-[#303030] dark:text-zinc-100">
                {tier.name} — Members
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5">
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
