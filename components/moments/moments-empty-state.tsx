"use client";

import React from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModuleStore } from "@/store/useModuleStore";

interface MomentsEmptyStateProps {
  onAction?: () => void;
}

export const MomentsEmptyState: React.FC<MomentsEmptyStateProps> = ({
  onAction,
}) => {
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50">
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center">
          <Video className="h-6 w-6 text-zinc-300" />
        </div>
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center">
          <span className="text-[8px] font-bold text-zinc-500">0</span>
        </span>
      </div>

      <h3 className="text-sm font-semibold text-zinc-800 tracking-tight mb-1">
        No {moduleName.toLowerCase()} found
      </h3>
      <p className="text-[12px] text-zinc-400 max-w-[200px] text-center leading-relaxed mb-5">
        Try a different search query or upload a new {singularName.toLowerCase()}.
      </p>

      {onAction && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-4 text-[11px] font-semibold rounded-lg border-zinc-200 text-zinc-600 hover:bg-white hover:border-zinc-300 hover:text-zinc-900 transition-all"
          onClick={onAction}
        >
          Upload {singularName.toLowerCase()}
        </Button>
      )}
    </div>
  );
};
