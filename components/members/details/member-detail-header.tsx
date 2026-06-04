"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  ChevronRight,
  Shield,
  Circle,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MemberDetailHeaderProps {
  firstName: string;
  lastName: string;
  memberId: string;
  status?: string;
  isOnline?: boolean;
  isVerified?: boolean;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  BLOCKED: {
    label: "Blocked",
    className: "bg-red-50 text-red-600 border-red-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-muted text-muted-foreground border-border",
  },
  DISABLED: {
    label: "Disabled",
    className: "bg-orange-50 text-orange-600 border-orange-200",
  },
};

export function MemberDetailHeader({
  firstName,
  lastName,
  memberId,
  status,
  isOnline,
  isVerified,
}: MemberDetailHeaderProps) {
  const router = useRouter();
  const statusInfo = status ? STATUS_BADGE[status] : null;

  return (
    <div className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl border-b border-border/60 px-6 py-3">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Left: Back + Breadcrumb */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl h-9 w-9 shrink-0 border border-border/60 hover:bg-muted/80 transition-all"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Button>

          <div className="space-y-0.5">
            {/* Name + badges row */}
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-semibold tracking-tight text-foreground">
                {firstName} {lastName}
              </h1>

              {isVerified && (
                <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />
              )}

              {statusInfo && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0",
                    statusInfo.className,
                  )}
                >
                  {statusInfo.label}
                </Badge>
              )}
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Link
                href="/members"
                className="hover:text-foreground transition-colors"
              >
                Members
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground/70 font-medium">
                Profile
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/members/${memberId}/edit`}>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 h-8 rounded-lg text-xs font-semibold border-border/60 hover:bg-muted/80"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
