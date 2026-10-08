"use client";

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import * as BrandIcons from "@/components/ui/brand-icons";
import {
  ChevronDown,
  Check,
  Search,
  X,
  Sparkles,
  Images,
  FolderHeart,
  Ban,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const POPULAR_MEDIA_ICONS = [
  "Images",
  "Camera",
  "Film",
  "Video",
  "Sparkles",
  "Clapperboard",
  "ImagePlus",
  "FileImage",
  "GalleryHorizontalEnd",
  "PlaySquare",
  "Compass",
  "Heart",
  "FolderHeart",
  "Eye",
  "Layers",
  "Flame",
  "Star",
  "Music",
  "Mic",
  "Tv",
];

export const SOCIAL_BRAND_ICONS = [
  "Instagram",
  "Youtube",
  "Tiktok",
  "Facebook",
  "Twitter",
  "Linkedin",
  "Whatsapp",
  "Discord",
  "Pinterest",
  "Spotify",
  "Vimeo",
  "Twitch",
  "Threads",
  "Reddit",
  "Dribbble",
  "Figma",
  "Github",
  "Slack",
];

export const getIconComponent = (name?: string) => {
  if (!name || name === "none") return null;
  const formatted = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    (BrandIcons as any)[formatted] ||
    (BrandIcons as any)[name] ||
    (LucideIcons as any)[formatted] ||
    (LucideIcons as any)[name] ||
    null
  );
};

const ALL_LUCIDE_NAMES = Object.keys(LucideIcons).filter(
  (n) =>
    n !== "icons" &&
    n !== "createLucideIcon" &&
    isNaN(Number(n)) &&
    typeof (LucideIcons as any)[n] === "function"
);

const ALL_BRAND_NAMES = Object.keys(BrandIcons).filter(
  (n) => isNaN(Number(n)) && typeof (BrandIcons as any)[n] === "function"
);

const ALL_ICON_NAMES = Array.from(
  new Set([
    ...POPULAR_MEDIA_ICONS,
    ...SOCIAL_BRAND_ICONS,
    ...ALL_BRAND_NAMES,
    ...ALL_LUCIDE_NAMES,
  ])
);

export interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  defaultIcon?: string;
  className?: string;
  placeholder?: string;
  allowNone?: boolean;
}

export function IconPicker({
  value,
  onChange,
  defaultIcon = "Images",
  className,
  placeholder = "Select Icon",
  allowNone = true,
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"media" | "social" | "all">("media");

  const isNoIcon = value === "none";
  const currentIconName = isNoIcon ? "none" : value || defaultIcon;
  const CurrentIcon = isNoIcon ? null : getIconComponent(currentIconName) || Images;

  const activeIconList = useMemo(() => {
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return ALL_ICON_NAMES.filter((name) => name.toLowerCase().includes(q));
    }
    if (category === "media") return POPULAR_MEDIA_ICONS;
    if (category === "social") return SOCIAL_BRAND_ICONS;
    return ALL_ICON_NAMES;
  }, [search, category]);

  const handleSelect = (name: string) => {
    onChange(name);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(defaultIcon);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            "h-8 px-2.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 flex items-center justify-between gap-1.5 text-[12px] font-medium hover:border-[#b4b7bb] dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs cursor-pointer group",
            isNoIcon && "bg-[#f6f6f7]/80 dark:bg-zinc-800/80 text-[#616161] dark:text-zinc-400 border-dashed",
            className
          )}
          title={isNoIcon ? "Icon: None (Text Only)" : "Current Icon: " + currentIconName}
        >
          <div className="flex items-center gap-1.5 truncate">
            {isNoIcon ? (
              <>
                <span className="h-4 w-4 shrink-0 flex items-center justify-center text-[#8c9196]">
                  <Ban className="h-3.5 w-3.5" />
                </span>
                <span className="truncate max-w-[85px] text-[#616161] dark:text-zinc-400 italic">
                  No Icon
                </span>
              </>
            ) : (
              <>
                <span className="h-4 w-4 shrink-0 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {CurrentIcon && <CurrentIcon className="h-4 w-4" />}
                </span>
                <span className="truncate max-w-[85px]">
                  {value || placeholder}
                </span>
              </>
            )}
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#8c9196] group-hover:text-[#303030] dark:group-hover:text-zinc-200 transition-colors" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[280px] p-2 bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-800 rounded-[8px] shadow-lg z-[200]"
      >
        <div className="space-y-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#8c9196]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons (e.g. Instagram, Camera)..."
              className="w-full h-8 pl-8 pr-7 text-[12px] rounded-[5px] border border-[#d2d5d9] dark:border-zinc-700 bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 placeholder:text-[#8c9196] focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-2 text-[#8c9196] hover:text-[#303030] dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Explicit "No Icon" Option */}
          {allowNone && (
            <button
              type="button"
              onClick={() => handleSelect("none")}
              className={cn(
                "w-full h-8 px-2.5 rounded-[5px] flex items-center justify-between text-[11px] font-medium transition-all border cursor-pointer",
                isNoIcon
                  ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold"
                  : "border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-800/60 text-[#616161] dark:text-zinc-300 hover:border-[#d2d5d9] hover:bg-[#f6f6f7]"
              )}
            >
              <div className="flex items-center gap-2">
                <Ban className="h-3.5 w-3.5 text-[#8c9196]" />
                <span>No Icon (Text Only Tab)</span>
              </div>
              {isNoIcon && <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />}
            </button>
          )}

          {/* Category Tabs (shown when not searching) */}
          {!search && (
            <div className="flex items-center gap-1 p-0.5 bg-[#f6f6f7] dark:bg-zinc-800 rounded-[5px]">
              <button
                type="button"
                onClick={() => setCategory("media")}
                className={cn(
                  "flex-1 text-[11px] font-medium py-1 px-1.5 rounded-[4px] transition-all cursor-pointer",
                  category === "media"
                    ? "bg-white dark:bg-zinc-700 text-[#303030] dark:text-zinc-100 shadow-2xs font-semibold"
                    : "text-[#616161] dark:text-zinc-400 hover:text-[#303030]"
                )}
              >
                Media & Photos
              </button>
              <button
                type="button"
                onClick={() => setCategory("social")}
                className={cn(
                  "flex-1 text-[11px] font-medium py-1 px-1.5 rounded-[4px] transition-all cursor-pointer",
                  category === "social"
                    ? "bg-white dark:bg-zinc-700 text-[#303030] dark:text-zinc-100 shadow-2xs font-semibold"
                    : "text-[#616161] dark:text-zinc-400 hover:text-[#303030]"
                )}
              >
                Social Brands
              </button>
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={cn(
                  "flex-1 text-[11px] font-medium py-1 px-1.5 rounded-[4px] transition-all cursor-pointer",
                  category === "all"
                    ? "bg-white dark:bg-zinc-700 text-[#303030] dark:text-zinc-100 shadow-2xs font-semibold"
                    : "text-[#616161] dark:text-zinc-400 hover:text-[#303030]"
                )}
              >
                All
              </button>
            </div>
          )}

          {/* Icon Grid */}
          <div className="max-h-[200px] overflow-y-auto pr-0.5 space-y-1">
            {activeIconList.length === 0 ? (
              <div className="py-6 text-center text-[12px] text-[#8c9196]">
                No matching icons found.
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-1.5">
                {activeIconList.slice(0, 100).map((iconName) => {
                  const Icon = getIconComponent(iconName);
                  if (!Icon) return null;
                  const isSelected =
                    !isNoIcon && currentIconName.toLowerCase() === iconName.toLowerCase();

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleSelect(iconName)}
                      className={cn(
                        "h-10 rounded-[6px] flex flex-col items-center justify-center p-1 transition-all border group relative cursor-pointer",
                        isSelected
                          ? "border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                          : "border-transparent hover:border-[#d2d5d9] dark:hover:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#303030] dark:text-zinc-200"
                      )}
                      title={iconName}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[9px] truncate max-w-full leading-none mt-1 opacity-70 group-hover:opacity-100">
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Reset & None Toggle */}
          <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 flex items-center justify-between text-[11px]">
            <span className="text-[#8c9196]">
              Selected: <strong className="text-[#303030] dark:text-zinc-200">{isNoIcon ? "None" : currentIconName}</strong>
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Default (Images)
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default IconPicker;
