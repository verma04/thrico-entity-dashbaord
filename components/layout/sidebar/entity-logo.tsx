"use client";

import React from "react";
import { useGetEntity } from "@/graphql/actions";
import { cn } from "@/lib/utils";

export function EntityLogo({ className }: { className?: string }) {
  const { data } = useGetEntity();
  const entity = data?.getEntity;

  if (entity?.logo) {
    return (
      <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden shadow-lg border border-white/10", className)}>
        <img
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${entity.logo}`}
          alt={entity.name || "Workspace Logo"}
          className="w-full h-full object-contain p-1"
        />
      </div>
    );
  }

  // Fallback Placeholder
  return (
    <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/20", className)}>
      <div className="w-5 h-5 bg-white rounded-full mix-blend-overlay" />
    </div>
  );
}
