"use client";

import React, { useState } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";

interface SocialFeedModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export function SocialFeedModule({
  module,
  previewDevice,
}: SocialFeedModuleProps) {
  const { layout, content } = module;
  const [activeTab, setActiveTab] = useState("all");

  // Mock posts data if none provided
  const mockPosts = [
    {
      id: 1,
      platform: "Instagram",
      author: "@community",
      content: "Excited to share our latest community initiative! Join us in making a difference. 🌟",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
      likes: 245,
      comments: 18,
      shares: 12,
      date: "2h ago",
    },
    {
      id: 2,
      platform: "Twitter",
      author: "@ourteam",
      content: "Amazing turnout at today's event! Thank you to everyone who participated. 🎉",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop",
      likes: 189,
      comments: 24,
      shares: 8,
      date: "5h ago",
    },
    {
      id: 3,
      platform: "LinkedIn",
      author: "Company Page",
      content: "Proud to announce our new partnership with industry leaders. Together, we're building the future.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop",
      likes: 312,
      comments: 45,
      shares: 23,
      date: "1d ago",
    },
    {
      id: 4,
      platform: "Facebook",
      author: "Community Hub",
      content: "Check out the highlights from our recent workshop. More events coming soon!",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=400&fit=crop",
      likes: 156,
      comments: 12,
      shares: 6,
      date: "2d ago",
    },
  ];

  const posts = content.posts && content.posts.length > 0 ? content.posts : mockPosts;

  const getPlatformColor = (platform: string) => {
    const colors: any = {
      Instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
      Twitter: "bg-blue-400",
      LinkedIn: "bg-blue-600",
      Facebook: "bg-blue-700",
    };
    return colors[platform] || "bg-gray-500";
  };

  const getPlatformIcon = (platform: string) => {
    const icons: any = {
      Instagram: "📷",
      Twitter: "🐦",
      LinkedIn: "💼",
      Facebook: "👥",
    };
    return icons[platform] || "📱";
  };

  // Empty state
  if (!posts || posts.length === 0) {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-white border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              {content.title || "Social Feed"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {content.description || "Follow us on social media"}
            </p>
          </div>
          <div className="text-center py-12 bg-gray-50 rounded-lg border">
            <p className="text-muted-foreground text-sm sm:text-base">
              No posts added yet. Add posts in the settings panel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Layout 1: Feed Grid
  if (layout === "feed-grid") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-gradient-to-br from-slate-50 to-white border-y">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {content.title || "Social Feed"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              {content.description || "Follow us on social media"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post: any, idx: number) => (
              <div
                key={post.id || idx}
                className="bg-white rounded-xl border shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                {/* Post Image */}
                {post.image && (
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
                    <img
                      src={post.image}
                      alt={post.content}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={cn(
                      "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                      getPlatformColor(post.platform)
                    )}>
                      {getPlatformIcon(post.platform)}
                    </div>
                  </div>
                )}

                {/* Post Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(post.author || "@user").charAt(1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">
                        {post.author || "@community"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {post.date || "Recently"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.content || "Social media post content..."}
                  </p>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {post.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {post.comments || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3.5 w-3.5" />
                      {post.shares || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Layout 2: Timeline Feed
  if (layout === "timeline-feed") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-white border-y">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {content.title || "Social Timeline"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              {content.description || "Latest updates from our social channels"}
            </p>
          </div>

          <div className="space-y-6">
            {posts.map((post: any, idx: number) => (
              <div
                key={post.id || idx}
                className="bg-slate-50 rounded-xl p-4 sm:p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Platform Avatar */}
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0",
                    getPlatformColor(post.platform)
                  )}>
                    {getPlatformIcon(post.platform)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base">
                        {post.author || "@community"}
                      </h4>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        {post.date || "Recently"}
                      </span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-primary text-xs sm:text-sm font-medium">
                        {post.platform || "Social"}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground mb-3">
                      {post.content || "Post content..."}
                    </p>

                    {/* Post Image */}
                    {post.image && (
                      <div className="rounded-lg overflow-hidden mb-3">
                        <img
                          src={post.image}
                          alt={post.content}
                          className="w-full h-auto max-h-64 object-cover"
                        />
                      </div>
                    )}

                    {/* Engagement */}
                    <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                      <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                        <Heart className="h-4 w-4" />
                        {post.likes || 0}
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments || 0}
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                        <Share2 className="h-4 w-4" />
                        {post.shares || 0}
                      </button>
                      {post.link && (
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-primary hover:underline ml-auto"
                        >
                          View Post
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Layout 3: Masonry Posts
  if (layout === "masonry-posts") {
    return (
      <div className="p-4 sm:p-8 md:p-12 bg-slate-50 border-y">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {content.title || "Social Gallery"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
              {content.description || "Our latest social moments"}
            </p>
          </div>

          {/* Masonry Grid - Using columns for masonry effect */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
            {posts.map((post: any, idx: number) => (
              <div
                key={post.id || idx}
                className="break-inside-avoid bg-white rounded-xl border shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                {/* Image */}
                {post.image && (
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.content}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={cn(
                      "absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5",
                      getPlatformColor(post.platform)
                    )}>
                      <span>{getPlatformIcon(post.platform)}</span>
                      {post.platform}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(post.author || "@user").charAt(1).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{post.author || "@community"}</h4>
                      <p className="text-xs text-muted-foreground">{post.date || "Recently"}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {post.content || "Post content..."}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground border-t pt-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {post.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {post.comments || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3.5 w-3.5" />
                      {post.shares || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Layout 4: Platform Tabs
  if (layout === "platform-tabs") {
    const platforms = ["all", ...new Set(posts.map((p: any) => p.platform))];
    const filteredPosts = activeTab === "all" 
      ? posts 
      : posts.filter((p: any) => p.platform === activeTab);

    return (
      <div className="p-4 sm:p-8 md:p-12 bg-white border-y">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {content.title || "Social Channels"}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6">
              {content.description || "Connect with us across platforms"}
            </p>

            {/* Platform Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={cn(
                    "px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all",
                    activeTab === platform
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                  )}
                >
                  {platform === "all" ? "All Posts" : `${getPlatformIcon(platform)} ${platform}`}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPosts.map((post: any, idx: number) => (
              <div
                key={post.id || idx}
                className="bg-slate-50 rounded-xl border shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {post.image && (
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={post.image}
                      alt={post.content}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm",
                      getPlatformColor(post.platform)
                    )}>
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold truncate">{post.author || "@community"}</h4>
                      <p className="text-xs text-muted-foreground">{post.platform} • {post.date || "Recently"}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.content || "Post content..."}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {post.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {post.comments || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3.5 w-3.5" />
                      {post.shares || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="p-12 bg-white border-y">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {content.title || "Social Feed"}
          </h2>
          <p className="text-muted-foreground">
            {content.description || "Follow us on social media"}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post: any, idx: number) => (
            <div key={idx} className="bg-gray-50 rounded-lg border p-4">
              <h4 className="font-semibold mb-2">{post.author}</h4>
              <p className="text-sm text-muted-foreground">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
