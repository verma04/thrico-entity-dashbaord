import React from "react";
import { getPreferredMediaUrl } from "@/utils/media";
import { cn } from "@/lib/utils";

interface BadgeIconProps {
  icon?: string;
  className?: string;
  imageClassName?: string;
}

export function BadgeIcon({ icon, className, imageClassName }: BadgeIconProps) {
  const isImage = icon?.includes("/") || icon?.startsWith("http");

  return (
    <div className={cn("flex items-center justify-center overflow-hidden", className)}>
      {isImage ? (
        <img
          src={getPreferredMediaUrl(icon) || ""}
          alt="Badge Icon"
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      ) : (
        <span>{icon || "⭐"}</span>
      )}
    </div>
  );
}
