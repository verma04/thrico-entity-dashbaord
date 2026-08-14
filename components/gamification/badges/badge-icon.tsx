import React from "react";
import { getPreferredMediaUrl } from "@/utils/media";
import { cn } from "@/lib/utils";

interface BadgeIconProps {
  icon?: string;
  className?: string;
  imageClassName?: string;
}

export function BadgeIcon({ icon, className, imageClassName }: BadgeIconProps) {
  if (!icon) {
    return (
      <div className={cn("flex items-center justify-center overflow-hidden", className)}>
        <span>⭐</span>
      </div>
    );
  }

  const isImage =
    icon.includes("/") ||
    icon.startsWith("http") ||
    icon.startsWith("data:") ||
    icon.startsWith("blob:") ||
    /\.(png|jpe?g|svg|webp|gif|avif|ico|bmp)(\?.*)?$/i.test(icon);

  return (
    <div className={cn("flex items-center justify-center overflow-hidden", className)}>
      {isImage ? (
        <img
          src={getPreferredMediaUrl(icon) || ""}
          alt="Badge Icon"
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      ) : (
        <span>{icon}</span>
      )}
    </div>
  );
}
