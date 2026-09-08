"use client";

import React, { useState } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";
import { HeroVideoDialog } from "@/components/magicui/hero-video-dialog";
import {
  Play,
  Clock,
  Video as VideoIcon,
  Sparkles,
  Layers,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface VideoItem {
  id?: string;
  title?: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  duration?: string;
  category?: string;
}

interface VideoSpotlightModuleProps {
  module?: ModuleData;
  content?: Record<string, any>;
  layout?: string;
  previewDevice?: string;
}

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "1",
    title: "Discover Our Platform & Community",
    description:
      "Explore how our ecosystem empowers members to connect, learn, and grow together.",
    url: "https://www.youtube.com/watch?v=qh3NGpYRG3I",
    thumbnail:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&auto=format&fit=crop&q=80",
    duration: "4:32",
    category: "Featured",
  },
  {
    id: "2",
    title: "Member Spotlights & Success Stories",
    description:
      "Real stories from creators and leaders achieving milestones across our community.",
    url: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    thumbnail:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80",
    duration: "6:15",
    category: "Stories",
  },
  {
    id: "3",
    title: "Interactive Features & Masterclass Tour",
    description:
      "Deep dive into collaborative workspaces, live event stages, and resources.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    duration: "8:40",
    category: "Tutorial",
  },
];

export function getEmbedUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  const url = rawUrl.trim();

  // YouTube
  const ytRegex =
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // Vimeo
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return url;
}

export function getVideoThumbnail(video?: VideoItem): string {
  if (video?.thumbnail && video.thumbnail.trim()) {
    return video.thumbnail;
  }
  if (video?.url) {
    const ytRegex =
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
    const ytMatch = video.url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
    }
  }
  return "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&auto=format&fit=crop&q=80";
}

export const VideoSpotlightModule = ({
  module,
  content: directContent,
  layout: directLayout,
  previewDevice = "desktop",
}: VideoSpotlightModuleProps) => {
  const content = directContent || module?.content || {};
  const layout = directLayout || module?.layout || "centered-video";

  const rawVideos: VideoItem[] = content.videos || [];
  const videos = rawVideos.length > 0 ? rawVideos : DEFAULT_VIDEOS;

  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(
    null
  );

  const featuredVideo = videos[0] || DEFAULT_VIDEOS[0];
  const activePlaylistVideo = videos[activePlaylistIndex] || featuredVideo;

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className={cn(
        "relative py-12 md:py-20 transition-colors",
        !content.containerSettings?.background && "bg-background text-foreground"
      )}
    >
      {/* Module Header */}
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
        titleClassName="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
        descriptionClassName="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto"
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />

      {/* 1. Centered Video Layout */}
      {layout === "centered-video" && (
        <div className="relative max-w-5xl mx-auto px-2 sm:px-4">
          <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border/60 bg-card shadow-xl transition-all duration-300 hover:shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 to-violet-500/30 opacity-0 group-hover:opacity-40 blur-xl transition duration-500 pointer-events-none" />

            <div
              className="relative aspect-video w-full cursor-pointer overflow-hidden bg-black/90"
              onClick={() => setActiveModalVideo(featuredVideo)}
            >
              <img
                src={getVideoThumbnail(featuredVideo)}
                alt={featuredVideo.title || "Featured Video"}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 transition-opacity group-hover:opacity-90" />

              {/* Pulsing Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/30 animate-ping opacity-75 pointer-events-none" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-2xl flex items-center justify-center backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* Bottom Video Info */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 md:p-8 flex items-end justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  {featuredVideo.category && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary/90 text-primary-foreground">
                      <Sparkles className="w-3 h-3" />
                      {featuredVideo.category}
                    </span>
                  )}
                  <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight">
                    {featuredVideo.title}
                  </h3>
                  {featuredVideo.description && (
                    <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                      {featuredVideo.description}
                    </p>
                  )}
                </div>

                {featuredVideo.duration && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-mono shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredVideo.duration}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Video Gallery Layout */}
      {layout === "video-gallery" && (
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, idx) => (
              <div
                key={video.id || idx}
                onClick={() => setActiveModalVideo(video)}
                className="group flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail container */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={getVideoThumbnail(video)}
                    alt={video.title || `Video ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    {video.category ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/90 text-primary-foreground backdrop-blur-md">
                        {video.category}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-white backdrop-blur-md">
                        #{idx + 1}
                      </span>
                    )}

                    {video.duration && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-black/70 text-white backdrop-blur-md">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {video.title || `Video ${idx + 1}`}
                    </h3>
                    {video.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Playlist View Layout */}
      {layout === "playlist-view" && (
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left: Active Video Stage */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <div
                className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-border/70 bg-black cursor-pointer shadow-xl"
                onClick={() => setActiveModalVideo(activePlaylistVideo)}
              >
                <img
                  src={getVideoThumbnail(activePlaylistVideo)}
                  alt={activePlaylistVideo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>

                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
                    Now Playing #{activePlaylistIndex + 1}
                  </span>
                </div>
              </div>

              {/* Active Video Meta */}
              <div className="p-4 sm:p-6 rounded-2xl border border-border/60 bg-card shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {activePlaylistVideo.title}
                  </h3>
                  {activePlaylistVideo.duration && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted text-foreground text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      {activePlaylistVideo.duration}
                    </span>
                  )}
                </div>
                {activePlaylistVideo.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activePlaylistVideo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Playlist Queue */}
            <div className="lg:col-span-5 xl:col-span-4 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Playlist Episodes
                  </h4>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {videos.length} Videos
                </span>
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {videos.map((video, idx) => {
                  const isSelected = idx === activePlaylistIndex;
                  return (
                    <button
                      key={video.id || idx}
                      type="button"
                      onClick={() => setActivePlaylistIndex(idx)}
                      className={cn(
                        "w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 group/item",
                        isSelected
                          ? "bg-primary/10 border-primary/60 text-foreground ring-1 ring-primary/30"
                          : "bg-background hover:bg-muted/60 border-border/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {/* Mini Thumbnail */}
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <img
                          src={getVideoThumbnail(video)}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 fill-white text-white" />
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-0.5">
                          <span>EP {String(idx + 1).padStart(2, "0")}</span>
                          {video.duration && (
                            <>
                              <span>•</span>
                              <span>{video.duration}</span>
                            </>
                          )}
                        </div>
                        <h5 className="text-xs sm:text-sm font-semibold truncate text-foreground group-hover/item:text-primary transition-colors">
                          {video.title || `Video ${idx + 1}`}
                        </h5>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Hero Video Dialog Layout */}
      {layout === "hero-video-dialog" && (
        <div
          className={cn(
            "relative w-full max-w-6xl mx-auto px-4",
            previewDevice === "mobile" ? "py-6" : "py-10"
          )}
        >
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="top-in-bottom-out"
            videoSrc={getEmbedUrl(featuredVideo.url || "")}
            thumbnailSrc={getVideoThumbnail(featuredVideo)}
            thumbnailAlt={featuredVideo.title || "Hero Video"}
          />
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="top-in-bottom-out"
            videoSrc={getEmbedUrl(featuredVideo.url || "")}
            thumbnailSrc={getVideoThumbnail(featuredVideo)}
            thumbnailAlt={featuredVideo.title || "Hero Video"}
          />
        </div>
      )}

      {/* 5. Hero Video Layout (Cinematic Banner) */}
      {layout === "hero-video" && (
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div
            onClick={() => setActiveModalVideo(featuredVideo)}
            className="group relative min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-border/60 bg-black cursor-pointer shadow-2xl flex items-center justify-center text-center p-6 sm:p-12"
          >
            {/* Background Image */}
            <img
              src={getVideoThumbnail(featuredVideo)}
              alt={featuredVideo.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark Cinematic Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 group-hover:opacity-90 transition-opacity" />

            {/* Center Content */}
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              {featuredVideo.category && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  {featuredVideo.category}
                </div>
              )}

              <div className="flex justify-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 rounded-full bg-white/20 animate-ping pointer-events-none" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-black shadow-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-white">
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {featuredVideo.title || "Watch Our Story"}
                </h3>
                <p className="text-sm sm:text-base text-gray-200/90 line-clamp-2 max-w-xl mx-auto">
                  {featuredVideo.description ||
                    "Experience our journey and discover how we build the future together."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Player Dialog */}
      <Dialog
        open={!!activeModalVideo}
        onOpenChange={(open) => !open && setActiveModalVideo(null)}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-zinc-800 shadow-2xl rounded-2xl z-[9999]">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {activeModalVideo?.title || "Video Spotlight"}
            </DialogTitle>
            <DialogDescription>
              {activeModalVideo?.description || "Watch video spotlight"}
            </DialogDescription>
          </DialogHeader>

          <div className="relative aspect-video w-full bg-black">
            {activeModalVideo && (
              <iframe
                src={getEmbedUrl(activeModalVideo.url || "")}
                title={activeModalVideo.title || "Video Player"}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ModuleContainer>
  );
};
