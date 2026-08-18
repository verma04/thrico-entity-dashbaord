"use client";

import React, { useState } from "react";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableMetric,
  AdminTableDate,
  AdminTableTag,
} from "@/components/shared/admin-table/admin-table";
import {
  Heart,
  MessageSquare,
  Share2,
  Pin,
  MoreVertical,
  Trash2,
  Copy,
  Eye,
  Briefcase,
  ShoppingBag,
  Play,
  BarChart2,
  Sparkles,
  Globe,
  Lock,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import {
  useDeleteFeed,
  usePinFeed,
  useDeleteCommunityFeed,
} from "@/graphql/actions/feed";
import { GET_PINNED_FEED, GET_COMMUNITY_FEED } from "@/graphql/quries/feed";
import type { FeedProps } from "./types";
import { FeedDetailModal } from "./feed-detail-modal";

export const feedTableColumns = [
  { key: "serial", header: "S.No" },
  { key: "author", header: "Author" },
  { key: "content", header: "Content" },
  { key: "type", header: "Type" },
  { key: "privacy", header: "Privacy" },
  { key: "reactions", header: "Likes" },
  { key: "comments", header: "Comments" },
  { key: "reshares", header: "Shares" },
  { key: "pinned", header: "Pinned" },
  { key: "createdAt", header: "Created At" },
  { key: "actions", header: "Actions" },
];

interface FeedTableProps {
  feeds: FeedProps[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
  loading?: boolean;
}

export function FeedTable({
  feeds,
  visibleColumns = {},
  offset = 0,
  loading = false,
}: FeedTableProps) {
  const [selectedFeedForView, setSelectedFeedForView] = useState<FeedProps | null>(null);
  const [feedToDelete, setFeedToDelete] = useState<FeedProps | null>(null);

  const [deleteFeedGlobal, { loading: isDeletingGlobal }] = useDeleteFeed({
    onCompleted: () => {
      setFeedToDelete(null);
      toast.success("Post deleted successfully", {
        description: "The post has been permanently removed.",
        icon: <Trash2 className="h-4 w-4 text-emerald-500" />,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete post", {
        description: error.message || "Something went wrong while deleting this post.",
      });
    },
  });

  const [deleteFeedCommunity, { loading: isDeletingCommunity }] =
    useDeleteCommunityFeed({
      onCompleted: () => {
        setFeedToDelete(null);
        toast.success("Community post deleted successfully", {
          description: "The post has been permanently removed from the community feed.",
          icon: <Trash2 className="h-4 w-4 text-emerald-500" />,
        });
      },
      onError: (error: any) => {
        toast.error("Failed to delete community post", {
          description: error.message || "Something went wrong while deleting this post.",
        });
      },
      refetchQueries: [GET_COMMUNITY_FEED],
    });

  const [pinFeed, { loading: isPinning }] = usePinFeed({
    refetchQueries: [{ query: GET_PINNED_FEED }],
    onCompleted: (data: any) => {
      const isPinned = data?.pinFeed?.isPinned;
      toast.success(isPinned ? "Post Pinned" : "Post Unpinned", {
        description: isPinned
          ? "This post will now appear at the top of the feed."
          : "The post has been unpinned from the top of the feed.",
        icon: <Pin className="h-4 w-4 text-amber-500" />,
      });
    },
    onError: (error: any) => {
      toast.error("Action failed", {
        description: error.message || "Could not update pin status.",
      });
    },
  });

  const handleDelete = () => {
    if (!feedToDelete) return;
    if (feedToDelete.isCommunityFeed) {
      deleteFeedCommunity({
        variables: { input: { id: feedToDelete.id } },
      });
    } else {
      deleteFeedGlobal({
        variables: { input: { id: feedToDelete.id } },
      });
    }
  };

  const handlePin = (feed: FeedProps) => {
    pinFeed({
      variables: {
        input: {
          feedId: feed.id.toString(),
          isPinned: !feed.isPinned,
        },
      },
    });
  };

  const handleCopyLink = (feed: FeedProps) => {
    if (typeof window !== "undefined") {
      const postUrl = `${window.location.origin}/feed/all?id=${feed.id}`;
      navigator.clipboard.writeText(postUrl);
      toast.success("Link copied to clipboard", {
        description: "You can share this post URL anywhere.",
        icon: <Copy className="h-4 w-4 text-primary" />,
      });
    }
  };

  const columns: AdminTableColumn<FeedProps>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-12 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => offset + index + 1,
    },
    {
      key: "author",
      header: "Author",
      cell: (row) => {
        const isEntity = row.addedBy === "ENTITY";
        const displayName = isEntity
          ? "Community Team"
          : `${row.user?.firstName || ""} ${row.user?.lastName || ""}`.trim() || "Community Member";
        const headline = isEntity
          ? "Official Admin"
          : row.user?.about?.currentPosition || "Community Member";

        const hoverData = {
          id: row.user?.id,
          firstName: row.user?.firstName,
          lastName: row.user?.lastName,
          avatar: row.user?.avatar,
          headline: row.user?.about?.currentPosition,
        };

        return !isEntity && row.user?.id ? (
          <UserProfileHoverCard user={hoverData}>
            <div>
              <AdminTableItem
                avatar={row.user?.avatar}
                title={displayName}
                subtitle={headline}
                fallbackText={`${row.user?.firstName?.charAt(0) || ""}${row.user?.lastName?.charAt(0) || ""}`}
                shape="circle"
              />
            </div>
          </UserProfileHoverCard>
        ) : (
          <AdminTableItem
            avatar={row.user?.avatar}
            title={displayName}
            subtitle={headline}
            fallbackText="CT"
            shape="circle"
          />
        );
      },
    },
    {
      key: "content",
      header: "Content",
      className: "max-w-[320px]",
      cell: (row) => {
        const hasMedia = row.media && row.media.length > 0;
        const firstMediaUrl = hasMedia ? getPreferredMediaUrl(row.media![0].url) : null;

        return (
          <div
            onClick={() => setSelectedFeedForView(row)}
            className="flex items-center gap-3 cursor-pointer group py-0.5"
          >
            {hasMedia && firstMediaUrl && (
              <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted border border-border/60 shrink-0 relative">
                <img
                  src={firstMediaUrl}
                  alt="attachment"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-[12px] font-medium text-foreground line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">
                {row.description || "No text content"}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                {hasMedia && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-muted/60 px-1.5 py-0.5 rounded">
                    <ImageIcon className="h-3 w-3" /> {row.media!.length} photo{row.media!.length > 1 ? "s" : ""}
                  </span>
                )}
                {row.moment && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-medium bg-purple-500/10 px-1.5 py-0.5 rounded">
                    <Play className="h-2.5 w-2.5" /> Video Moment
                  </span>
                )}
                {row.poll && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-sky-600 dark:text-sky-400 font-medium bg-sky-500/10 px-1.5 py-0.5 rounded">
                    <BarChart2 className="h-2.5 w-2.5" /> Poll
                  </span>
                )}
                {row.job && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    <Briefcase className="h-2.5 w-2.5" /> {row.job.title}
                  </span>
                )}
                {row.marketPlace && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <ShoppingBag className="h-2.5 w-2.5" /> ${row.marketPlace.price}
                  </span>
                )}
                {row.celebration && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded">
                    <Sparkles className="h-2.5 w-2.5" /> Celebration
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => {
        if (row.job || row.source === "jobs") {
          return (
            <AdminTableTag variant="indigo">
              <Briefcase className="h-2.5 w-2.5 mr-1" />
              Job
            </AdminTableTag>
          );
        }
        if (row.marketPlace || row.source === "marketPlace") {
          return (
            <AdminTableTag variant="emerald">
              <ShoppingBag className="h-2.5 w-2.5 mr-1" />
              Listing
            </AdminTableTag>
          );
        }
        if (row.moment) {
          return (
            <AdminTableTag variant="purple">
              <Play className="h-2.5 w-2.5 mr-1" />
              Moment
            </AdminTableTag>
          );
        }
        if (row.poll) {
          return (
            <AdminTableTag variant="sky">
              <BarChart2 className="h-2.5 w-2.5 mr-1" />
              Poll
            </AdminTableTag>
          );
        }
        if (row.celebration) {
          return (
            <AdminTableTag variant="amber">
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Celebration
            </AdminTableTag>
          );
        }
        return (
          <AdminTableTag variant="default">
            <MessageSquare className="h-2.5 w-2.5 mr-1" />
            Post
          </AdminTableTag>
        );
      },
    },
    {
      key: "privacy",
      header: "Privacy",
      cell: (row) => {
        const isPublic = row.privacy === "PUBLIC";
        return (
          <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            {isPublic ? (
              <>
                <Globe className="h-3 w-3 text-sky-500" />
                <span>Public</span>
              </>
            ) : (
              <>
                <Lock className="h-3 w-3 text-amber-500" />
                <span>Connections</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      key: "reactions",
      header: "Likes",
      headerClassName: "text-center",
      className: "text-center",
      cell: (row) => (
        <AdminTableMetric
          icon={Heart}
          value={row.totalReactions || 0}
          variant="rose"
        />
      ),
    },
    {
      key: "comments",
      header: "Comments",
      headerClassName: "text-center",
      className: "text-center",
      cell: (row) => (
        <AdminTableMetric
          icon={MessageSquare}
          value={row.totalComment || 0}
          variant="indigo"
        />
      ),
    },
    {
      key: "reshares",
      header: "Shares",
      headerClassName: "text-center",
      className: "text-center",
      cell: (row) => (
        <AdminTableMetric
          icon={Share2}
          value={row.totalReShare || 0}
        />
      ),
    },
    {
      key: "pinned",
      header: "Pinned",
      headerClassName: "text-center",
      className: "text-center",
      cell: (row) =>
        row.isPinned ? (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-semibold gap-1 px-1.5 py-0"
          >
            <Pin className="h-2.5 w-2.5 fill-amber-500" /> Pinned
          </Badge>
        ) : (
          <span className="text-[10px] text-muted-foreground/40">—</span>
        ),
    },
    {
      key: "createdAt",
      header: "Created At",
      cell: (row) => <AdminTableDate date={row.createdAt} />,
    },
    {
      key: "actions",
      header: "Actions",
      isFixedRight: true,
      headerClassName: "w-16 text-right",
      className: "text-right",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="h-3.5 w-3.5" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl">
            <DropdownMenuItem
              onClick={() => setSelectedFeedForView(row)}
              className="cursor-pointer gap-2 text-xs font-medium"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View Post</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handlePin(row)}
              disabled={isPinning}
              className="cursor-pointer gap-2 text-xs font-medium"
            >
              <Pin
                className={cn(
                  "h-3.5 w-3.5",
                  row.isPinned && "fill-amber-500 text-amber-500"
                )}
              />
              <span>{row.isPinned ? "Unpin Post" : "Pin to Top"}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleCopyLink(row)}
              className="cursor-pointer gap-2 text-xs font-medium"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Link</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setFeedToDelete(row)}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer gap-2 text-xs font-medium"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Post</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredColumns = columns.filter(
    (c) => c.key === "actions" || visibleColumns[c.key] !== false
  );

  return (
    <>
      <AdminTable<FeedProps>
        columns={filteredColumns}
        data={feeds}
        loading={loading}
        keyExtractor={(item) => item.id.toString()}
        pageSize={feeds.length || 999}
        emptyIcon={MessageSquare}
        emptyTitle="No posts found"
        emptyDescription="No community posts match your current search or filter criteria."
      />

      {/* Post Details Preview Modal */}
      <FeedDetailModal
        feed={selectedFeedForView}
        open={!!selectedFeedForView}
        onOpenChange={(open) => {
          if (!open) setSelectedFeedForView(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={!!feedToDelete}
        onOpenChange={(open) => {
          if (!open) setFeedToDelete(null);
        }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the post and its comments from the
              community feed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeletingGlobal || isDeletingCommunity}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              {isDeletingGlobal || isDeletingCommunity ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default FeedTable;
