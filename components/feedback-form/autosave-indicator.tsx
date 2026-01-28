"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutosaveIndicatorProps {
  isSaving?: boolean;
  lastSaved?: Date;
}

export function AutosaveIndicator({
  isSaving = false,
  lastSaved,
}: AutosaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaved(true);
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 animate-in fade-in duration-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="font-medium">Saving...</span>
      </div>
    );
  }

  if (showSaved) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 animate-in fade-in duration-200">
        <Check className="h-4 w-4" />
        <span className="font-medium">All changes saved</span>
      </div>
    );
  }

  return null;
}
