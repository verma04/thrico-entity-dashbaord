"use client";

import React from "react";
import { CategoriesManager } from "@/components/offers/categories-manager";
import { FolderTree } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FolderTree className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Offer Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage categories to organize your offers and improve
            discoverability.
          </p>
        </div>
      </div>

      <CategoriesManager />
    </div>
  );
}
