"use client";

import React, { isValidElement, cloneElement } from "react";
import { Card } from "@/components/ui/card";

interface PageType {
  type: string;
  title: string;
  description: string;
  icon: React.ReactElement;
}

function SelectPage({
  pageTypes,
  onSelect,
}: {
  pageTypes: PageType[];
  onSelect: (type: string) => void;
}) {
  return (
    <div className="py-5">
      <h2 className="text-2xl font-bold text-center mb-5">
        Create a Page to elevate
      </h2>
      <p className="text-center text-base mb-10 text-gray-600">
        Create a professional page to showcase your organization, connect with
        your audience, and grow your presence. Select a page type to begin.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {pageTypes.map((page) => (
          <Card
            key={page.type + page.title}
            className="group relative h-full cursor-pointer overflow-hidden border-none shadow-sm ring-1 ring-border/50 hover:ring-primary/40 hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center bg-card/50 backdrop-blur-sm"
            onClick={() => onSelect(page.type)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative mb-6 p-4 rounded-2xl bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300 transform group-hover:scale-110 group-hover:-translate-y-1">
              {isValidElement(page.icon) &&
                cloneElement(
                  page.icon as React.ReactElement<{ className?: string }>,
                  {
                    className:
                      "h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors",
                  }
                )}
            </div>

            <div className="relative space-y-2">
              <h4 className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
                {page.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">
                {page.description}
              </p>
            </div>

            <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Get Started
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SelectPage;
