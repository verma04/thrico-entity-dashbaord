"use client";

import React from "react";

import { useModuleStore } from "@/store/useModuleStore";

export default function OfferManagePage() {
  const singularName = useModuleStore((state) => state.offerSingularName);
  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      <p className="text-muted-foreground">Manage your {singularName.toLowerCase()} overview here.</p>
    </div>
  );
}
