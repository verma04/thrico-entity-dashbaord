"use client";

import React, { useMemo } from "react";
import {
  Skill,
  useGetUserSkillsGraph,
} from "@/graphql/quries/skills/skill-queries";
import { Award, Sparkles } from "lucide-react";
import { ClassificationCard } from "../shared/classification-card";
import { ClassificationSkeletonGrid } from "../shared/classification-skeleton";

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
    return skills
      .map((skill) => {
        const title = skill.title || skill.name;
        const graphInfo = skillsMap.get(title) || { users: [], count: 0 };
        return {
          skill,
          users: graphInfo.users,
          count: graphInfo.count,
        };
      })
      .sort((a, b) => b.count - a.count); // Sort by popularity
  }, [skills, graphData]);

  if (isLoading || graphLoading) {
    return <ClassificationSkeletonGrid />;
  }

  if (skillsWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Sparkles className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No skill data found</p>
        <p className="text-sm">
          There are no skill relationships recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {skillsWithUsers.map(({ skill, users, count }, index) => {
        const color = getSkillColor(index);

        return (
          <ClassificationCard
            key={skill.id}
            id={skill.id}
            title={skill.title || skill.name}
            count={count}
            users={users.map((u: any) => ({
              id: u.id,
              globalUserId: u.globalUserId,
              firstName: u.firstName,
              lastName: u.lastName,
              avatar: u.avatar,
              headline: u.headline,
            }))}
            color={color}
            icon={<Award className="h-4 w-4" />}
            countLabelSingular="Endorsement"
            countLabelPlural="Endorsements"
            onEdit={() => onEdit(skill)}
            onDelete={() => onDelete(skill)}
          />
        );
      })}
    </div>
  );
}
