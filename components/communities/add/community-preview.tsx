"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Globe, Lock } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

interface CommunityPreviewProps {
  formData: {
    name?: string;
    title?: string;
    tagline?: string;
    description?: string;
    privacy?: string;
    communityType?: string;
    enableEvents?: boolean;
  };
  imageUrl: string | null;
}

export function CommunityPreview({
  formData,
  imageUrl,
}: CommunityPreviewProps) {
  const singularName = useModuleStore((state) => state.communitySingularName);

  const isPublic =
    formData?.privacy === "PUBLIC" || formData?.privacy === "public";

  return (
    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 overflow-hidden shadow-xs">
      {/* Cover Image */}
      <div className="aspect-[3/2] w-full overflow-hidden bg-[#e1e3e5] dark:bg-zinc-800 relative">
        <Image
          src={
            imageUrl || `https://cdn.thrico.network/default_communities.png`
          }
          alt={`${singularName} cover`}
          width={1536}
          height={1024}
          className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="bg-black/75 text-white backdrop-blur-xs border-none text-[10px] font-semibold px-2 py-0.5 rounded-[4px]"
          >
            {isPublic ? (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" /> Public
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> Private
              </span>
            )}
          </Badge>
          {formData?.communityType && (
            <Badge
              variant="secondary"
              className="bg-black/75 text-white backdrop-blur-xs border-none text-[10px] font-semibold px-2 py-0.5 rounded-[4px]"
            >
              {formData.communityType === "VIRTUAL" && "Virtual"}
              {formData.communityType === "INPERSON" && "In-Person"}
              {formData.communityType === "HYBRID" && "Hybrid"}
            </Badge>
          )}
        </div>
      </div>

      {/* Community Details */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h3 className="font-semibold text-[14px] text-[#303030] dark:text-zinc-100 truncate">
            {formData?.name || formData?.title || `New ${singularName}`}
          </h3>
          <p className="text-[12px] text-[#616161] dark:text-zinc-400 mt-0.5 line-clamp-2 leading-[16px]">
            {formData?.tagline || `A dedicated space for our community.`}
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#e1e3e5] dark:border-zinc-800">
          <div className="text-center p-1.5 rounded-[6px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700">
            <div className="text-[13px] font-bold text-[#303030] dark:text-zinc-100">
              0
            </div>
            <p className="text-[10px] text-[#616161] dark:text-zinc-400 font-medium">
              Members
            </p>
          </div>
          <div className="text-center p-1.5 rounded-[6px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700">
            <div className="text-[13px] font-bold text-[#303030] dark:text-zinc-100">
              0
            </div>
            <p className="text-[10px] text-[#616161] dark:text-zinc-400 font-medium">
              Posts
            </p>
          </div>
          <div className="text-center p-1.5 rounded-[6px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700">
            <div className="text-[13px] font-bold text-[#303030] dark:text-zinc-100">
              0
            </div>
            <p className="text-[10px] text-[#616161] dark:text-zinc-400 font-medium">
              Events
            </p>
          </div>
        </div>

        {/* Description snippet */}
        <div className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[16px] line-clamp-3">
          {formData?.description ||
            `Description will be displayed here once entered...`}
        </div>
      </div>
    </div>
  );
}
