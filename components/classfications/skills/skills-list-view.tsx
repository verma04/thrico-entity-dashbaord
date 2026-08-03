"use client";

import React, { useMemo } from "react";
import { Skill, useGetUserSkillsGraph } from "@/graphql/quries/skills/skill-queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Sparkles, Users, Pencil, Trash2 } from "lucide-react";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Button } from "@/components/ui/button";

// ── Color palette for skills ──
const SKILL_COLORS = [
  "#8b5cf6", // Purple
  "#14b8a6", // Teal
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f97316", // Orange
];

function getSkillColor(index: number) {
  return SKILL_COLORS[index % SKILL_COLORS.length];
}

export function SkillsListView({
  skills,
  isLoading,
  onEdit,
  onDelete,
}: {
  skills: Skill[];
  isLoading: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}) {
  const { data: graphData, loading: graphLoading } = useGetUserSkillsGraph({
    variables: { limit: 100 },
  });

  const skillsWithUsers = useMemo(() => {
    const edges = graphData?.getUserSkillsGraph || [];
    
    // Create a map to quickly look up users for a skill by title or name
    const skillsMap = new Map<string, { users: any[]; count: number }>();

    edges.forEach((edge) => {
      const sTitle = edge.skill.title || edge.skill.name;
      if (!skillsMap.has(sTitle)) {
        skillsMap.set(sTitle, {
          users: [],
          count: 0,
        });
      }

      const entry = skillsMap.get(sTitle)!;
      if (!entry.users.find((u: any) => u.id === edge.user.id)) {
        entry.users.push(edge.user);
        entry.count++;
      }
    });

    // Map the global skills list to include the graph users
    return skills.map(skill => {
      const title = skill.title || skill.name;
      const graphInfo = skillsMap.get(title) || { users: [], count: 0 };
      return {
        skill,
        users: graphInfo.users,
        count: graphInfo.count
      };
    }).sort((a, b) => b.count - a.count); // Sort by popularity
  }, [skills, graphData]);

  if (isLoading || graphLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border rounded-xl p-5 shadow-sm space-y-4 bg-card"
          >
            <div className="flex items-center gap-3 border-b pb-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-3 w-1/2" />
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, j) => (
                  <Skeleton
                    key={j}
                    className="h-8 w-8 rounded-full border-2 border-background"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (skillsWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Sparkles className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No skill data found</p>
        <p className="text-sm">There are no skill relationships recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {skillsWithUsers.map(({ skill, users, count }, index) => {
        const color = getSkillColor(index);
        
        return (
          <div
            key={skill.id}
            className="border border-border/50 bg-card rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative overflow-hidden"
          >
            {/* Color bar */}
            <div
              className="absolute top-0 left-0 h-1.5 w-full opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: color }}
            />
            
            <div className="flex items-start justify-between border-b border-border/50 pb-4 mb-4 mt-2">
              <div className="flex gap-3">
                <div 
                  className="p-2.5 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}15`, color: color }}
                >
                  <Award className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate group-hover:text-indigo-600 transition-colors" title={skill.title || skill.name}>
                    {skill.title || skill.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Users className="h-3 w-3" />
                    <span>
                      {count} {count === 1 ? "Endorsement" : "Endorsements"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Actions */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(skill);
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
                    onDelete(skill);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Users
                </p>
                <div className="flex flex-wrap gap-2">
                  {users.length === 0 && (
                    <p className="text-xs text-muted-foreground/70 italic">No users yet.</p>
                  )}
                  {users.slice(0, 8).map((user) => {
                    const name =
                      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                      "User";
                    const avatarUrl = user.avatar
                      ? `${process.env.NEXT_PUBLIC_CDN_URL}/${user.avatar}`
                      : "";

                    return (
                      <UserProfileHoverCard
                        key={user.id}
                        user={{ id: user.globalUserId, firstName: user.firstName, lastName: user.lastName, avatar: user.avatar, headline: user.headline }}
                      >
                        <Avatar
                          className="h-8 w-8 border-2 border-background shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-pointer"
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
                    <div className="h-8 w-8 rounded-full bg-slate-100 border-2 border-background flex items-center justify-center text-[10px] font-medium text-slate-600 shadow-sm">
                      +{users.length - 8}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
