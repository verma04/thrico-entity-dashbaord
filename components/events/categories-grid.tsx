import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { Pencil, Trash2, Tag, Mic, Users, Globe, BookOpen, PartyPopper, Briefcase, GraduationCap, Calendar, Plus } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  conference: <Mic className="h-5 w-5" />,
  workshop: <BookOpen className="h-5 w-5" />,
  meetup: <Users className="h-5 w-5" />,
  webinar: <Globe className="h-5 w-5" />,
  social: <PartyPopper className="h-5 w-5" />,
  corporate: <Briefcase className="h-5 w-5" />,
  academic: <GraduationCap className="h-5 w-5" />,
  other: <Calendar className="h-5 w-5" />,
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

export interface EventCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  eventCount: number;
  description: string;
}

interface CategoriesGridProps {
  categories: EventCategory[];
  onDeleteCategory: (id: string) => void;
}

export function CategoriesGrid({ categories, onDeleteCategory }: CategoriesGridProps) {
  const moduleName = useModuleStore((state) => state.eventModuleName);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-xl border border-slate-200 border-dashed m-4">
        <Tag className="h-10 w-10 text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-800 tracking-tight">No categories found</h3>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-sm">Try adding a new category or adjusting your search filters.</p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden rounded-xl hover:border-indigo-500/20 hover:-translate-y-1 bg-white cursor-pointer"
        >
          {/* Color bar */}
          <div
            className="h-1.5 w-full opacity-80 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: category.color }}
          />
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm"
                  style={{
                    backgroundColor: `${category.color}15`,
                    color: category.color,
                  }}
                >
                  {CATEGORY_ICONS[category.icon] || (
                    <Tag className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{category.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                    {category.eventCount} {moduleName.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-slate-600 font-medium mt-4 line-clamp-2 leading-relaxed">
              {category.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
