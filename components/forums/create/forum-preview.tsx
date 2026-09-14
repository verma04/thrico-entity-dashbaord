"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Clock, ShieldCheck, ThumbsUp, MessageCircle, Sparkles } from "lucide-react";
import { useGetUser } from "@/graphql/actions";
import { cn } from "@/lib/utils";

interface ForumPreviewProps {
  formData: {
    title: string;
    content: string;
    category?: string;
    isAnonymous: boolean;
  };
  categories?: any[];
  singularName?: string;
}

export function ForumPreview({
  formData,
  categories = [],
  singularName = "Discussion",
}: ForumPreviewProps) {
  const { data: userData } = useGetUser();
  const user = userData?.getUser;

  const selectedCategory = categories.find((c) => c.id === formData.category);

  return (
    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#fbfbfc] dark:bg-zinc-900/70 p-3.5 space-y-3 shadow-2xs transition-all">
      {/* Author & Metadata */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-7 w-7 rounded-full border border-[#d2d5d9] dark:border-zinc-700 shrink-0">
            {!formData.isAnonymous && user?.avatar ? (
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName || ""} ${user.lastName || ""}`}
              />
            ) : null}
            <AvatarFallback className="bg-[#f0f0f1] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 text-[11px] font-semibold">
              {formData.isAnonymous ? (
                <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
              ) : (
                (user?.firstName?.[0] || "U").toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h4 className="font-semibold text-[12.5px] text-[#303030] dark:text-zinc-100 truncate leading-tight">
              {formData.isAnonymous
                ? "Anonymous Member"
                : user
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Community Member"
                : "You"}
            </h4>
            <div className="flex items-center gap-1.5 text-[10.5px] text-[#616161] dark:text-zinc-400 mt-0.5">
              <Clock className="h-2.5 w-2.5" />
              <span>Just now</span>
              {formData.isAnonymous && (
                <>
                  <span>•</span>
                  <span className="text-zinc-500 font-medium">Hidden author</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Category Badge */}
        <Badge
          variant="outline"
          className="bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700 text-[10px] font-medium px-2 py-0.5 rounded-[4px] shrink-0"
        >
          {selectedCategory?.name || "General"}
        </Badge>
      </div>

      {/* Discussion Title */}
      <div className="space-y-1">
        <h3 className="font-semibold text-[14px] text-[#202223] dark:text-zinc-100 leading-snug break-words">
          {formData.title?.trim() || `${singularName} title will appear here…`}
        </h3>
        <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-[17px] break-words line-clamp-4 whitespace-pre-wrap">
          {formData.content?.trim() ||
            "Discussion content and detailed description will be previewed here in real-time as you write…"}
        </p>
      </div>

      {/* Interactive Mock Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-[#f1f2f3] dark:border-zinc-800/80 text-[11px] text-[#616161] dark:text-zinc-400">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 font-medium text-[10.5px]">
            <ThumbsUp className="h-2.5 w-2.5 text-zinc-500" />
            0 upvotes
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-[10.5px]">
            <MessageCircle className="h-2.5 w-2.5 text-zinc-500" />
            0 replies
          </span>
        </div>
        <span className="text-[9.5px] text-zinc-400 italic">
          Live feed card simulation
        </span>
      </div>
    </div>
  );
}
