"use client";

import React, { useMemo, useState } from "react";
import {
  useGetUserNeo4jRelationships,
  Neo4jRelationship,
} from "@/graphql/actions/membership/membership-queries";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Network,
  Users,
  Handshake,
  Link2,
  UserCheck,
  Heart,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { safeFormatDistanceToNow } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ── Relationship type config ────────────────────────────────────────────── */

const RELATIONSHIP_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ElementType;
  }
> = {
  CONNECTED: {
    label: "Connected",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: Users,
  },
  MATCHED_WITH: {
    label: "Matched",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: Sparkles,
  },
  MENTORED_BY: {
    label: "Mentored By",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: UserCheck,
  },
  MENTORING: {
    label: "Mentoring",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    icon: UserCheck,
  },
  REFERRED: {
    label: "Referred",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Link2,
  },
  COLLABORATED_WITH: {
    label: "Collaborated",
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: Handshake,
  },
  FOLLOWING: {
    label: "Following",
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
    icon: Heart,
  },
};

function getRelConfig(type: string) {
  return (
    RELATIONSHIP_CONFIG[type] ?? {
      label: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      color: "text-foreground",
      bg: "bg-muted/50",
      border: "border-border",
      icon: Network,
    }
  );
}

/* ── Connection Card ─────────────────────────────────────────────────────── */

function ConnectionCard({ rel }: { rel: Neo4jRelationship }) {
  const config = getRelConfig(rel.type);
  const Icon = config.icon;
  const initials =
    `${rel.otherFirstName?.[0] || ""}${rel.otherLastName?.[0] || ""}`.toUpperCase();

  return (
    <Card className="group border-border hover:shadow-md hover:border-border/80 transition-all duration-200 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3.5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
              {rel.otherAvatar && (
                <AvatarImage
                  src={`https://cdn.thrico.network/${rel.otherAvatar}`}
                  alt={`${rel.otherFirstName} ${rel.otherLastName}`}
                />
              )}
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground truncate">
                {rel.otherFirstName} {rel.otherLastName}
              </p>
              <Link
                href={`/members/${rel.otherUserId}`}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </Link>
            </div>

            <Badge
              variant="outline"
              className={cn(
                "mt-1.5 text-[10px] font-semibold px-2 py-0.5 gap-1",
                config.color,
                config.bg,
                config.border,
              )}
            >
              <Icon className="h-3 w-3" />
              {config.label}
            </Badge>

            {rel.createdAt && (
              <p className="text-[11px] text-muted-foreground mt-2">
                Connected{" "}
                {safeFormatDistanceToNow(rel.createdAt, { addSuffix: true })}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Filter Pills ────────────────────────────────────────────────────────── */

function FilterPills({
  types,
  selected,
  onSelect,
  counts,
}: {
  types: string[];
  selected: string | null;
  onSelect: (t: string | null) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(null)}
        className={cn(
          "h-7 px-3 text-[11px] font-semibold rounded-full gap-1.5 transition-all",
          selected === null
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "border-border hover:bg-muted",
        )}
      >
        All
        <span className="text-[10px] opacity-70">
          {Object.values(counts).reduce((a, b) => a + b, 0)}
        </span>
      </Button>
      {types.map((type) => {
        const config = getRelConfig(type);
        const Icon = config.icon;
        const isActive = selected === type;
        return (
          <Button
            key={type}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(isActive ? null : type)}
            className={cn(
              "h-7 px-3 text-[11px] font-semibold rounded-full gap-1.5 transition-all",
              isActive
                ? `${config.bg} ${config.color} border ${config.border} hover:opacity-90`
                : "border-border hover:bg-muted",
            )}
          >
            <Icon className="h-3 w-3" />
            {config.label}
            <span className="text-[10px] opacity-70">{counts[type]}</span>
          </Button>
        );
      })}
    </div>
  );
}

/* ── Loading Skeleton ────────────────────────────────────────────────────── */

function ConnectionsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[80, 90, 70].map((w, i) => (
          <Skeleton key={i} className="h-7 rounded-full" style={{ width: w }} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-4 flex items-start gap-3.5">
              <Skeleton className="h-11 w-11 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export function ConnectionsTab({ userId }: { userId: string }) {
  const { data, loading, error } = useGetUserNeo4jRelationships(userId);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const relationships = data?.getUserNeo4jRelationships || [];

  // Extract unique types and counts
  const { types, counts } = useMemo(() => {
    const countMap: Record<string, number> = {};
    relationships.forEach((r) => {
      countMap[r.type] = (countMap[r.type] || 0) + 1;
    });
    return {
      types: Object.keys(countMap).sort(
        (a, b) => (countMap[b] || 0) - (countMap[a] || 0),
      ),
      counts: countMap,
    };
  }, [relationships]);

  const filtered = selectedType
    ? relationships.filter((r) => r.type === selectedType)
    : relationships;

  if (loading) return <ConnectionsSkeleton />;

  if (error) {
    return (
      <Card className="border-border">
        <CardContent className="p-8 text-center text-red-500">
          <p className="font-semibold">Error loading connections</p>
          <p className="text-sm mt-1">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (relationships.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="p-12 text-center flex flex-col items-center justify-center">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Network className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <p className="text-base font-semibold text-foreground">
            No Connections Found
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            This member hasn't made any connections in the network yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary + Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Network Connections
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {relationships.length} total connection
            {relationships.length !== 1 ? "s" : ""} across {types.length} type
            {types.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <FilterPills
        types={types}
        selected={selectedType}
        onSelect={setSelectedType}
        counts={counts}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((rel, idx) => (
          <ConnectionCard
            key={`${rel.otherUserId}-${rel.type}-${idx}`}
            rel={rel}
          />
        ))}
      </div>

      {filtered.length === 0 && selectedType && (
        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
          No connections of type "{getRelConfig(selectedType).label}" found.
        </div>
      )}
    </div>
  );
}
