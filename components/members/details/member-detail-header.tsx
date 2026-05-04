"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Edit3, ChevronRight, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberDetailHeaderProps {
  firstName: string;
  lastName: string;
  memberId: string;
}

export function MemberDetailHeader({ firstName, lastName, memberId }: MemberDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-3">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-lg h-9 w-9 shrink-0 border border-border hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Member Profile
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Members</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">
                {firstName} {lastName}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 h-9 rounded-lg text-xs"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Message
          </Button>
          <Link href={`/members/${memberId}/edit`}>
            <Button
              size="sm"
              className="gap-2 h-9 rounded-lg text-xs"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
