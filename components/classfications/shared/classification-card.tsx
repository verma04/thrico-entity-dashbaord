"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Pencil, Trash2 } from "lucide-react";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Button } from "@/components/ui/button";

export interface ClassificationCardProps {
  id: string;
  title: string;
  count: number;
  users: Array<{
    id: string;
    globalUserId?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    headline?: string;
  }>;
  color: string;
  icon: React.ReactNode;
  countLabelSingular?: string;
  countLabelPlural?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ClassificationCard({
  id,
  title,
  count,
  users,
  color,
  icon,
  countLabelSingular = "Member",
  countLabelPlural = "Members",
  onEdit,
  onDelete,
}: ClassificationCardProps) {
  return (
    <div
      className="border border-border/50 bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden"
    >
      {/* Color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start justify-between border-b border-border/50 pb-3 mb-3 mt-1">
        <div className="flex gap-2.5">
          <div
            className="p-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-semibold text-foreground truncate group-hover:text-zinc-600 transition-colors"
              title={title}
            >
              {title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
              <Users className="h-3 w-3" />
              <span>
                {count} {count === 1 ? countLabelSingular : countLabelPlural}
              </span>
            </div>
          </div>
        </div>

        {/* Hover Actions */}
        {(onEdit || onDelete) && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {countLabelPlural}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {users.length === 0 && (
              <p className="text-xs text-muted-foreground/70 italic">
                No members yet.
              </p>
            )}
            {users.slice(0, 8).map((user) => {
              const name =
                [user.firstName, user.lastName]
                  .filter(Boolean)
                  .join(" ") || "User";
              const avatarUrl = user.avatar
                ? `https://cdn.thrico.network/${user.avatar}`
                : "";

              return (
                <UserProfileHoverCard
                  key={user.id}
                  user={{
                    id: user.globalUserId || user.id, // Fallback if globalUserId is missing
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                    headline: user.headline,
                  }}
                >
                  <Avatar
                    className="h-7 w-7 border-2 border-background shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                    title={`${name} ${user.headline ? `- ${user.headline}` : ""}`}
                  >
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                      {user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </UserProfileHoverCard>
              );
            })}
            {users.length > 8 && (
              <div className="h-7 w-7 rounded-full bg-slate-100 border-2 border-background flex items-center justify-center text-[10px] font-medium text-slate-600 shadow-sm">
                +{users.length - 8}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
