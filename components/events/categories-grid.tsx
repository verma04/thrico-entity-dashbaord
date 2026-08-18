"use client";

import React from "react";
import Link from "next/link";
import { CtaButton } from "@/components/ui/cta-button";
import {
  Tag,
  Mic,
  Users,
  Globe,
  BookOpen,
  PartyPopper,
  Briefcase,
  GraduationCap,
  Calendar,
  Plus,
} from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";
import { ClassificationCard } from "@/components/classfications/shared/classification-card";

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  conference: <Mic className="h-4 w-4" />,
  workshop: <BookOpen className="h-4 w-4" />,
  meetup: <Users className="h-4 w-4" />,
  webinar: <Globe className="h-4 w-4" />,
  social: <PartyPopper className="h-4 w-4" />,
  corporate: <Briefcase className="h-4 w-4" />,
  academic: <GraduationCap className="h-4 w-4" />,
  other: <Calendar className="h-4 w-4" />,
};

export const CATEGORY_COLORS = [
  { name: "Violet", value: "#8b5cf6", bg: "bg-violet-500/10", text: "text-violet-600" },
  { name: "Cyan", value: "#06b6d4", bg: "bg-cyan-500/10", text: "text-cyan-600" },
  { name: "Amber", value: "#f59e0b", bg: "bg-amber-500/10", text: "text-amber-600" },
  { name: "Emerald", value: "#22c55e", bg: "bg-emerald-500/10", text: "text-emerald-600" },
  { name: "Rose", value: "#f43f5e", bg: "bg-rose-500/10", text: "text-rose-600" },
  { name: "Blue", value: "#3b82f6", bg: "bg-blue-500/10", text: "text-blue-600" },
  { name: "Orange", value: "#f97316", bg: "bg-orange-500/10", text: "text-orange-600" },
  { name: "Pink", value: "#ec4899", bg: "bg-pink-500/10", text: "text-pink-600" },
];

export interface EventCategoryUser {
  id: string;
  globalUserId?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  headline?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  eventCount: number;
  description: string;
  users?: EventCategoryUser[];
}

interface CategoriesGridProps {
  categories: EventCategory[];
  onDeleteCategory: (id: string) => void;
  onEditCategory?: (category: EventCategory) => void;
}

export function CategoriesGrid({
  categories,
  onDeleteCategory,
  onEditCategory,
}: CategoriesGridProps) {
  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border border-border border-dashed m-4">
        <Tag className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          No categories found
        </h3>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
          Try adding a new category or adjusting your search filters.
        </p>
        <Link href="/events/categories/create" className="mt-6">
          <CtaButton>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </CtaButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 md:p-6">
      {categories.map((category) => (
        <ClassificationCard
          key={category.id}
          id={category.id}
          title={category.name}
          count={category.eventCount}
          users={category.users || []}
          color={category.color}
          icon={CATEGORY_ICONS[category.icon] || <Tag className="h-4 w-4" />}
          countLabelSingular={singularName || "Event"}
          countLabelPlural={moduleName || "Events"}
          onEdit={onEditCategory ? () => onEditCategory(category) : undefined}
          onDelete={() => onDeleteCategory(category.id)}
        />
      ))}
    </div>
  );
}
