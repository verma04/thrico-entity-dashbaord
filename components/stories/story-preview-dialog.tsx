"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  Clock,
  Copy,
  Layers,
  Trash2,
  User,
  Radio,
  ExternalLink,
  Code,
  ShieldAlert,
} from "lucide-react";
import { Story, StoryTextOverlay } from "@/graphql/actions/stories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { getMediaUrl } from "./story-card";
import { safeFormat, safeFormatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface StoryPreviewDialogProps {
  story: Story | null;
  onClose: () => void;
  onDeleteStory?: (story: Story) => void;
}

export function StoryPreviewDialog({
  story,
  onClose,
  onDeleteStory,
}: StoryPreviewDialogProps) {
  const [activeTab, setActiveTab] = useState<"details" | "overlays" | "raw">("details");

  if (!story) return null;

  const isLive =
    story.isActive && new Date(story.expiresAt).getTime() > Date.now();
  const author = story.user;
  const authorName =
    [author?.firstName, author?.lastName].filter(Boolean).join(" ") ||
    "Unknown User";

  // Normalize text overlays
  let parsedOverlays: StoryTextOverlay[] = [];
  if (story.textOverlays) {
    if (Array.isArray(story.textOverlays)) {
      parsedOverlays = story.textOverlays;
    } else if (typeof story.textOverlays === "string") {
      try {
        const p = JSON.parse(story.textOverlays);
        parsedOverlays = Array.isArray(p) ? p : [p];
      } catch {
        parsedOverlays = [];
      }
    }
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(story.id);
    toast.success("Story ID copied to clipboard");
  };

  const imageUrl = getMediaUrl(story.image);
  const avatarUrl = getMediaUrl(author?.avatar);

  return (
    <Dialog open={!!story} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0 rounded-2xl border border-border/80 bg-card shadow-2xl">
        {/* Header Strip */}
        <div className="p-5 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-foreground">
                  {story.caption || "Story Inspection"}
                </h3>
                <AdminStatusBadge
                  status={isLive ? "Live" : "Expired"}
                  variant={isLive ? "success" : "neutral"}
                  className="text-[10px]"
                />
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">ID: {story.id}</span>
                <button
                  onClick={handleCopyId}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy ID"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onDeleteStory && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDeleteStory(story);
                }}
                className="h-8 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Content Body: Two Columns */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Phone Story Mockup (col-span-5) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-3xl bg-zinc-950 border-4 border-zinc-800 shadow-xl overflow-hidden flex flex-col justify-between">
              {/* Top notch simulation */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-20 bg-zinc-900 rounded-full z-30" />

              {/* Story Image Layer */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={story.caption || "Story media"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                  <Radio className="h-8 w-8 opacity-40 mb-1" />
                  <span className="text-xs">No media preview</span>
                </div>
              )}

              {/* Vignette Shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

              {/* Render Text Overlays over the Story viewport */}
              <div className="absolute inset-0 p-4 pointer-events-none overflow-hidden z-20">
                {parsedOverlays.map((layer, idx) => {
                  const xPercent = layer.x != null ? (layer.x <= 1 ? layer.x * 100 : layer.x) : 50;
                  const yPercent = layer.y != null ? (layer.y <= 1 ? layer.y * 100 : layer.y) : 50;
                  const fontSize = layer.fontSize ? Math.min(Math.max(layer.fontSize, 11), 22) : 13;
                  const textColor = layer.color || "#ffffff";

                  return (
                    <div
                      key={idx}
                      style={{
                        position: "absolute",
                        left: `${xPercent}%`,
                        top: `${yPercent}%`,
                        transform: "translate(-50%, -50%)",
                        color: textColor,
                        fontSize: `${fontSize}px`,
                        fontWeight: 700,
                        textShadow: "0 2px 6px rgba(0, 0, 0, 0.8)",
                      }}
                      className="px-2 py-0.5 rounded backdrop-blur-[1px] text-center max-w-[90%] break-words"
                    >
                      {layer.text || ""}
                    </div>
                  );
                })}
              </div>

              {/* Story Bottom Bar in Mockup */}
              <div className="relative z-30 p-3 pt-6 mt-auto">
                {story.caption && (
                  <p className="text-xs font-semibold text-white line-clamp-3 drop-shadow mb-2">
                    {story.caption}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[10px] text-white/80">
                  <Avatar className="h-5 w-5 border border-white/40">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-[8px]">
                      {authorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium truncate">{authorName}</span>
                </div>
              </div>
            </div>
            <p className="text-[10.5px] text-muted-foreground mt-2 text-center">
              Ephemeral story viewport with rendered overlay coordinates
            </p>
          </div>

          {/* Right Column: Details & Inspector (col-span-7) */}
          <div className="md:col-span-7 space-y-5">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 h-8 p-0.5 bg-muted rounded-lg">
                <TabsTrigger value="details" className="text-xs font-medium h-7">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="overlays" className="text-xs font-medium h-7">
                  Overlays ({parsedOverlays.length})
                </TabsTrigger>
                <TabsTrigger value="raw" className="text-xs font-medium h-7">
                  JSON Raw
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Overview Details */}
              <TabsContent value="details" className="mt-4 space-y-4">
                {/* Author Card */}
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Author & Creator
                    </span>
                    <Badge variant="outline" className="text-[9px] font-bold">
                      Storyteller
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-border/80">
                      <AvatarImage src={avatarUrl} alt={authorName} />
                      <AvatarFallback className="font-bold text-xs bg-muted">
                        {authorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">
                        {authorName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {author?.email || "No email on record"}
                      </p>
                      {author?.headline && (
                        <p className="text-xs text-muted-foreground/80 mt-0.5 italic truncate">
                          "{author.headline}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-indigo-500" />
                      Created At
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {safeFormat(story.createdAt, "MMM d, yyyy · h:mm a")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {safeFormatDistanceToNow(story.createdAt, { addSuffix: true })}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3 space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-500" />
                      Expiration
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {safeFormat(story.expiresAt, "MMM d, yyyy · h:mm a")}
                    </p>
                    <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      {isLive
                        ? `Live (ends ${safeFormatDistanceToNow(story.expiresAt, { addSuffix: true })})`
                        : "Expired archive"}
                    </p>
                  </div>
                </div>

                {/* Entity & Technical IDs */}
                <div className="rounded-xl border border-border/60 bg-muted/10 p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Entity ID</span>
                    <span className="font-mono text-[11px] text-foreground">{story.entityId}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">User ID</span>
                    <span className="font-mono text-[11px] text-foreground">{story.userId}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground font-medium">Active Status</span>
                    <span className="font-semibold text-foreground">
                      {story.isActive ? "Active (True)" : "Inactive (False)"}
                    </span>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Overlays List */}
              <TabsContent value="overlays" className="mt-4 space-y-3">
                {parsedOverlays.length === 0 ? (
                  <div className="p-8 text-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                    No text overlays placed on this story.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {parsedOverlays.map((layer, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-border/60 bg-card p-3 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[9.5px] px-1.5 py-0 font-bold">
                              Layer #{index + 1}
                            </Badge>
                            <span className="text-xs font-bold text-foreground truncate">
                              "{layer.text}"
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[10.5px] text-muted-foreground font-mono">
                            <span>x: {layer.x ?? "auto"}</span>
                            <span>y: {layer.y ?? "auto"}</span>
                            <span>size: {layer.fontSize ?? 14}px</span>
                          </div>
                        </div>

                        {layer.color && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className="h-4 w-4 rounded-full border border-black/20 shadow-xs"
                              style={{ backgroundColor: layer.color }}
                            />
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {layer.color}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Tab 3: Raw JSON */}
              <TabsContent value="raw" className="mt-4">
                <div className="rounded-xl border border-border/60 bg-zinc-950 p-3 text-[11px] font-mono text-emerald-400 max-h-[320px] overflow-auto">
                  <pre>{JSON.stringify(story, null, 2)}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
