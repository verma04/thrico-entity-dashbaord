"use client";

import React from "react";
import { FaqLayoutType } from "@/types/faq-types";
import { useFaqStore } from "@/store/useFaqStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  List,
  Grid3x3,
 
  Columns,
  Network,
  Check,
  TableCellsMergeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const layouts: Array<{
  type: FaqLayoutType;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    type: "accordion",
    name: "Accordion",
    description: "Classic expandable Q&A list - simple and effective",
    icon: List,
  },
  {
    type: "grid",
    name: "Grid Cards",
    description: "Visual cards in responsive grid layout",
    icon: Grid3x3,
  },
  {
    type: "tabs",
    name: "Tabbed Categories",
    description: "Each category as a separate tab",
    icon: TableCellsMergeIcon,
  },
  {
    type: "two-column",
    name: "Two Column",
    description: "Questions on left, answers on right",
    icon: Columns,
  },
  {
    type: "nested",
    name: "Nested/Hierarchical",
    description: "Expandable tree structure by category",
    icon: Network,
  },
];

export const FaqLayoutSelector: React.FC = () => {
  const { selectedLayout, setLayout } = useFaqStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ Display Layout</CardTitle>
        <CardDescription>
          Choose how your FAQs will be displayed to users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {layouts.map((layout) => {
            const Icon = layout.icon;
            const isSelected = selectedLayout === layout.type;

            return (
              <button
                key={layout.type}
                onClick={() => setLayout(layout.type)}
                className={cn(
                  "relative p-4 border rounded-lg text-left transition-all hover:border-primary",
                  isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{layout.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {layout.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
