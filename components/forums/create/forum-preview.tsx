"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, User, Clock } from "lucide-react";
import { useGetUser } from "@/graphql/actions";

interface ForumPreviewProps {
  formData: {
    title: string;
    content: string;
    category?: string;
    isAnonymous: boolean;
  };
  categories?: any[];
}

export function ForumPreview({ formData, categories = [] }: ForumPreviewProps) {
  const { data: userData } = useGetUser();
  const user = userData?.getUser;

  const selectedCategory = categories.find((c) => c.id === formData.category);

  return (
    <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
      <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
      <CardContent className="pt-6 space-y-6">
        {/* Header/Author Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/20">
            {!formData.isAnonymous && user?.avatar ? (
              <AvatarImage
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
            ) : null}
            <AvatarFallback className="bg-primary/5 text-primary">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-sm leading-tight">
              {formData.isAnonymous ? "Anonymous User" : user ? `${user.firstName} ${user.lastName}` : "User Name"}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <Clock className="h-3 w-3" />
              <span>Just now</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-bold text-lg leading-tight break-words">
            {formData.title || "Discussion Title"}
          </h3>

          {/* Tags / Category */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              {selectedCategory?.name || "General Discussion"}
            </Badge>
            {formData.isAnonymous && (
              <Badge
                variant="outline"
                className="bg-muted text-muted-foreground"
              >
                Anonymous
              </Badge>
            )}
          </div>

          <Separator className="opacity-50" />

          {/* Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm text-foreground/80 leading-relaxed break-words whitespace-pre-wrap">
              {formData.content ||
                "Write your discussion content here to see how it looks to other members..."}
            </p>
          </div>
        </div>

        {/* Mock Actions */}
        <div className="flex items-center gap-4 pt-4 mt-4 border-t opacity-60">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-[10px]">▲</span>
            </div>
            <span>0</span>
            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
              <span className="text-[10px]">▼</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>0 Comments</span>
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground italic pt-2">
          Preview version - Final layout may vary slightly
        </p>
      </CardContent>
    </Card>
  );
}
