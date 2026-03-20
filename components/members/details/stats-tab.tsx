"use client";

import React from "react";
import { useGetUserStats } from "@/graphql/actions";
import { 
  Layout, 
  MessageSquare, 
  Users, 
  Hash, 
  Calendar as CalendarIcon, 
  FileText, 
  TrendingUp, 
  Briefcase,
  ArrowUpRight 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function StatItem({
  label,
  value,
  icon: Icon,
  gradient,
  iconColor,
}: {
  label: string;
  value: number;
  icon: any;
  gradient?: string;
  iconColor?: string;
}) {
  return (
    <Card
      className={cn(
        "p-4 border-border/40 group hover:border-primary/30 transition-all",
        gradient || "bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg bg-background shadow-sm border border-border/20 group-hover:scale-110 transition-transform",
              iconColor || "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 leading-tight mb-0.5">
              {label}
            </p>
            <p className="text-2xl font-black">{value}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary -mr-1"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export function StatsTab({ userId }: { userId: string }) {
  const { data: statsData } = useGetUserStats(userId);
  const stats = statsData?.getUserStats;

  return (
    <div className="space-y-6 mt-0 border-none p-0 outline-none">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatItem
          label="Posts"
          value={stats?.totalPosts || 0}
          icon={Layout}
          gradient="from-blue-500/5 to-blue-500/10"
          iconColor="text-blue-500"
        />
        <StatItem
          label="Comments"
          value={stats?.totalComments || 0}
          icon={MessageSquare}
          gradient="from-purple-500/5 to-purple-500/10"
          iconColor="text-purple-500"
        />
        <StatItem
          label="Connections"
          value={stats?.totalConnections || 0}
          icon={Users}
          gradient="from-green-500/5 to-green-500/10"
          iconColor="text-green-500"
        />
        <StatItem
          label="Groups"
          value={stats?.totalGroups || 0}
          icon={Hash}
          gradient="from-orange-500/5 to-orange-500/10"
          iconColor="text-orange-500"
        />
        <StatItem
          label="Events"
          value={stats?.totalEvents || 0}
          icon={CalendarIcon}
        />
        <StatItem
          label="Listings"
          value={stats?.totalListings || 0}
          icon={FileText}
        />
        <StatItem
          label="Offers"
          value={stats?.totalOffers || 0}
          icon={TrendingUp}
        />
        <StatItem
          label="Jobs"
          value={stats?.totalJobs || 0}
          icon={Briefcase}
        />
      </section>

      <Card className="border-border/40 bg-linear-to-br from-background to-muted/20">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-tight">Activity Summary</CardTitle>
          <CardDescription className="font-bold">
            Visual breakdown of member participation across the network.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-40 flex items-center justify-center border-t border-dashed border-border/60">
          <p className="text-muted-foreground text-sm italic">
            User activity visualization coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
