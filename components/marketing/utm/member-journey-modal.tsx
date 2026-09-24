"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AttributedMemberProfile, TouchDetails } from "@/types/utm";
import { safeFormat } from "@/lib/date-utils";
import {
  Compass,
  Calendar,
} from "lucide-react";

interface MemberJourneyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: AttributedMemberProfile | null;
}

export function MemberJourneyModal({
  open,
  onOpenChange,
  member,
}: MemberJourneyModalProps) {
  if (!member) return null;

  const renderTouchCard = (title: string, touch: TouchDetails, isFirst: boolean) => {
    return (
      <Card className="border-border/70 bg-muted/20 shadow-none rounded-xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isFirst ? "bg-indigo-500" : "bg-purple-500"
                }`}
              />
              <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                {title}
              </span>
            </div>
            {touch.seenAt && (
              <span className="text-[10.5px] text-muted-foreground flex items-center gap-1 font-mono">
                <Calendar className="h-3 w-3" />
                {safeFormat(touch.seenAt, "MMM d, yyyy h:mm a")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-background border border-border/50 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Source
              </span>
              <div className="font-mono font-bold text-foreground truncate">
                {touch.source || "Direct / Unknown"}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-background border border-border/50 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Medium
              </span>
              <div className="font-mono font-bold text-foreground truncate">
                {touch.medium || "organic"}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-background border border-border/50 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Campaign
              </span>
              <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate">
                {touch.campaign || "None"}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-background border border-border/50 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Term (Keyword)
              </span>
              <div className="font-mono text-foreground truncate">
                {touch.term || <span className="text-muted-foreground italic">None</span>}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-background border border-border/50 space-y-0.5 col-span-2">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Creative Content
              </span>
              <div className="font-mono text-foreground truncate">
                {touch.content || <span className="text-muted-foreground italic">None</span>}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-background border border-border/50 space-y-0.5 col-span-2">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                Landing Page
              </span>
              <div className="font-mono text-[11px] text-foreground truncate">
                {touch.landingPage || "/auth/signup"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col justify-between overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <SheetHeader className="p-0 space-y-3 pb-4 border-b border-border/60">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-mono border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300">
                User ID: {member.userId}
              </Badge>
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-mono">
                {member.loginCount} Lifetime Logins
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 rounded-full border border-border shadow-xs">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-sm font-bold bg-indigo-50 text-indigo-700">
                  {(member.firstName?.[0] || "U") + (member.lastName?.[0] || "")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <SheetTitle className="text-base font-bold text-foreground">
                  {member.firstName} {member.lastName}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground font-mono truncate">
                  {member.email}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-indigo-600" />
                Multi-Touch Attribution Journey Comparison
              </span>
              <span className="text-[11px] text-muted-foreground">
                First vs last conversion trigger
              </span>
            </div>

            <div className="space-y-4">
              {renderTouchCard("First Touch Attribution", member.firstTouch, true)}
              {renderTouchCard("Last Touch Attribution", member.lastTouch, false)}
            </div>
          </div>
        </div>

        <SheetFooter className="p-6 pt-3 border-t border-border/60 bg-muted/10">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full text-xs h-9 cursor-pointer"
          >
            Close Audit Drawer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
