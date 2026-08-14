"use client";

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
}

export function UserPreview({ formData, roles }: UserPreviewProps) {
  const selectedRole = roles.find((r) => r.id === formData.role);
  const fullName =
    [formData.firstName, formData.lastName].filter(Boolean).join(" ") || "";
  const initials = [formData.firstName?.[0], formData.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 space-y-4 shadow-xs">
      {/* Profile Identity */}
      <div className="flex flex-col items-center text-center gap-2.5">
        <Avatar className="h-14 w-14 ring-2 ring-zinc-900/10 dark:ring-zinc-100/10">
          <AvatarFallback className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-sm font-bold">
            {initials || <UserPlus className="h-5 w-5" />}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
            {fullName || "Admin Member"}
          </h4>
          {formData.email ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center justify-center gap-1 truncate max-w-[220px]">
              <Mail className="h-3 w-3 shrink-0" />
              {formData.email}
            </p>
          ) : (
            <p className="text-xs text-zinc-400 mt-0.5">
              email@organization.com
            </p>
          )}
        </div>
      </div>

      {/* Assigned Role */}
      <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          Access Level
        </span>
        {selectedRole ? (
          <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {selectedRole.name}
                </p>
                {selectedRole.description && (
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {selectedRole.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-11 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100/50 dark:bg-zinc-800/30">
            <p className="text-[11px] text-zinc-400 font-medium">
              No role assigned
            </p>
          </div>
        )}
      </div>

      {/* Status Chip */}
      <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Invitation Status:</span>
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
          Pending Invite
        </span>
      </div>
    </div>
  );
}
