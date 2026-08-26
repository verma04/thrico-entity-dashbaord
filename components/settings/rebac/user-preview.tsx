"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Mail, ShieldCheck } from "lucide-react";

interface UserPreviewProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  roles: Array<{ id: string; name: string; description?: string }>;
  isEditing?: boolean;
  status?: boolean | string;
  memberStatus?: string;
}

export function UserPreview({
  formData,
  roles,
  isEditing,
  status,
  memberStatus,
}: UserPreviewProps) {
  const selectedRole = roles.find((r) => r.id === formData.role);
  const fullName =
    [formData.firstName, formData.lastName].filter(Boolean).join(" ") || "";
  const initials = [formData.firstName?.[0], formData.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const displayStatus = isEditing
    ? memberStatus || (status === false ? "Inactive" : "Active")
    : "Pending Invite";

  return (
    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3 shadow-xs">
      {/* Profile Identity */}
      <div className="flex flex-col items-center text-center gap-2">
        <Avatar className="h-14 w-14 ring-2 ring-black/5 dark:ring-white/10">
          <AvatarFallback className="bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 text-sm font-bold">
            {initials || <UserPlus className="h-5 w-5" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-[14px] text-[#303030] dark:text-zinc-100 truncate max-w-[200px]">
            {fullName || "Admin Member"}
          </h4>
          {formData.email ? (
            <p className="text-[12px] text-[#616161] dark:text-zinc-400 mt-0.5 flex items-center justify-center gap-1 truncate max-w-[220px]">
              <Mail className="h-3 w-3 shrink-0 text-[#8c9196]" />
              {formData.email}
            </p>
          ) : (
            <p className="text-[12px] text-[#8c9196] mt-0.5">
              email@organization.com
            </p>
          )}
        </div>
      </div>

      {/* Assigned Role */}
      <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#616161] flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          Access Level
        </span>
        {selectedRole ? (
          <div className="p-2.5 rounded-[6px] bg-white dark:bg-zinc-800/80 border border-[#d2d5d9] dark:border-zinc-700/80">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[4px] bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 truncate">
                  {selectedRole.name}
                </p>
                {selectedRole.description && (
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 line-clamp-1">
                    {selectedRole.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-10 border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[6px] bg-[#f6f6f7]/60 dark:bg-zinc-800/30">
            <p className="text-[11.5px] text-[#8c9196] font-medium">
              No role assigned
            </p>
          </div>
        )}
      </div>

      {/* Status Chip */}
      <div className="pt-1 flex items-center justify-between text-[11.5px] text-[#616161]">
        <span>{isEditing ? "Account Status:" : "Invitation Status:"}</span>
        <span className="font-semibold text-[#303030] dark:text-zinc-200">
          {displayStatus}
        </span>
      </div>
    </div>
  );
}
