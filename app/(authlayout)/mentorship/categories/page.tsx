"use client";

import { MentorCategoriesManager } from "@/components/mentorship/mentor-category-manager";
import { FolderTree } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FolderTree className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Mentor Categories
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage categories for organizing mentors and improving
            discoverability.
          </p>
        </div>
      </div>

      <MentorCategoriesManager />
    </div>
  );
}
