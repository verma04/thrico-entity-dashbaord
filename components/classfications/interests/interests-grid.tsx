"use client";

import React from "react";
import { Interest } from "@/graphql/quries/interests/interest-queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, Heart } from "lucide-react";

// ── Color palette for interests ──
const INTEREST_COLORS = [
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
];

function getInterestColor(index: number) {
  return INTEREST_COLORS[index % INTEREST_COLORS.length];
}

export function InterestsGrid({
  interests,
  isLoading,
  onEdit,
  onDelete,
  onViewUsers,
}: {
  interests: Interest[];
  isLoading: boolean;
  onEdit: (interest: Interest) => void;
  onDelete: (interest: Interest) => void;
  onViewUsers: (interest: Interest) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Card
              key={i}
              className="border border-border rounded-xl overflow-hidden"
            >
              <Skeleton className="h-1.5 w-full" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (interests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border border-border border-dashed m-4">
        <Heart className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          No interests found
        </h3>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
          Try adding a new interest or adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {interests.map((interest, index) => {
        const color = getInterestColor(index);
        return (
          <Card
            key={interest.id}
            onClick={() => onViewUsers(interest)}
            className="border border-border shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden rounded-xl hover:border-rose-500/20 hover:-translate-y-1 bg-card cursor-pointer"
          >
            {/* Color bar */}
            <div
              className="h-1.5 w-full opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: color }}
            />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-md w-full text-foreground group-hover:text-rose-600 transition-colors">
                      {interest.title}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                      Interest
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(interest);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(interest);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
