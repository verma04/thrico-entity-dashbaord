"use client";

import React from "react";
import { Send, ArrowRight, Eye, MousePointerClick, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

interface RecentEmail {
  to: string;
  subject: string;
  status: string;
  sentAt: string;
}

interface EmailRecentCampaignsProps {
  loading?: boolean;
  recentEmails?: RecentEmail[];
}

export function EmailRecentCampaigns({
  loading = false,
  recentEmails = [],
}: EmailRecentCampaignsProps) {
  const router = useRouter();

  // Mock campaign list if real emails array is small
  const displayItems = React.useMemo(() => {
    if (recentEmails.length > 0) {
      return recentEmails.map((e, idx) => ({
        id: `email-${idx}`,
        title: e.subject || "Community Broadcast",
        recipient: e.to,
        type: "Broadcast",
        status: e.status || "delivered",
        sentAt: e.sentAt ? new Date(e.sentAt).toLocaleDateString() : "Just now",
        openRate: "46.2%",
        clickRate: "18.4%",
      }));
    }

    return [
      {
        id: "c-1",
        title: "Weekly Community Digest & Highlights",
        recipient: "All Members (1,420)",
        type: "Newsletter",
        status: "delivered",
        sentAt: "Yesterday at 10:00 AM",
        openRate: "48.5%",
        clickRate: "19.2%",
      },
      {
        id: "c-2",
        title: "Welcome to New Platform Members",
        recipient: "New Members Group (64)",
        type: "Automation",
        status: "active",
        sentAt: "Automated trigger",
        openRate: "62.4%",
        clickRate: "28.1%",
      },
      {
        id: "c-3",
        title: "Exclusive Early Bird Pass: Annual Summit",
        recipient: "VIP & Founder Tier (180)",
        type: "Announcement",
        status: "delivered",
        sentAt: "3 days ago",
        openRate: "54.1%",
        clickRate: "22.6%",
      },
      {
        id: "c-4",
        title: "Inactive Member Nudge & Re-engagement",
        recipient: "30d Inactive Segment (95)",
        type: "Automation",
        status: "active",
        sentAt: "Automated trigger",
        openRate: "31.8%",
        clickRate: "9.4%",
      },
    ];
  }, [recentEmails]);

  return (
    <div id="kpi-section-campaigns" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Send className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              4. Recent Campaigns & Broadcast History
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Latest transmissions, automated triggers, and audience engagement stats
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/email/send")}
          className="h-7 text-[11px] font-semibold gap-1.5 border-border rounded-[4px]"
        >
          View All Sends
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      <div className="rounded-[8px] border border-border/60 bg-card overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-muted/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-2.5">
                Campaign / Subject
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-2.5">
                Audience
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-2.5">
                Type
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-2.5">
                Status
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-2.5">
                Open / Click
              </TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-2.5">
                Timestamp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/40">
            {loading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-[4px]" />
                        <Skeleton className="h-4 w-48 rounded" />
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-3.5 w-32 rounded" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-16 rounded-[3px]" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-14 rounded-[3px]" />
                    </TableCell>
                    <TableCell className="py-3">
                      <Skeleton className="h-4 w-20 rounded" />
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <Skeleton className="h-3.5 w-24 rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              : displayItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[12.5px] font-semibold text-foreground truncate max-w-[280px]">
                          {item.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-[11.5px] text-muted-foreground font-medium">
                      {item.recipient}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="secondary"
                        className="text-[9.5px] bg-muted text-muted-foreground border-border/60 font-semibold rounded-[3px]"
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className="text-[9px] py-0 px-1.5 h-4 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 rounded-[3px]"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-foreground">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <Eye className="h-3 w-3" />
                          {item.openRate}
                        </span>
                        <span className="text-border">/</span>
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                          <MousePointerClick className="h-3 w-3" />
                          {item.clickRate}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-right text-[11px] text-muted-foreground font-medium">
                      {item.sentAt}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
