"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateHeaderProps {
  count: number;
  onCreate: () => void;
}

export function TemplateHeader({ count, onCreate }: TemplateHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Email Templates
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {count > 0
            ? `${count} template${count !== 1 ? "s" : ""} in your library`
            : "No templates yet. Create one to get started."}
        </p>
      </div>
      <Button
        size="sm"
        onClick={onCreate}
        className="h-9 rounded-lg gap-2 text-xs font-medium"
      >
        <Plus className="h-3.5 w-3.5" />
        New Template
      </Button>
    </div>
  );
}
