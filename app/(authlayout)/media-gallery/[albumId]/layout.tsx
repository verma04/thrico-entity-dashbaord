"use client";

import React, { useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { Images, Settings, RotateCcw, Star, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { Badge } from "@/components/ui/badge";
import {
  useGetMediaGalleryAlbum,
  useUpdateMediaGalleryAlbum,
} from "@/graphql/actions/mediaGallery";
import { MultiGalleryUploadDialog } from "@/components/media-gallery/multi-gallery-upload-dialog";
import { cn } from "@/lib/utils";

export default function AlbumManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const albumId = params.albumId as string;
  const basePath = `/media-gallery/${albumId}`;

  const currentTab = pathname?.startsWith(`${basePath}/settings`)
    ? "settings"
    : "media";

  const { data, loading, refetch } = useGetMediaGalleryAlbum(albumId);
  const [updateAlbum] = useUpdateMediaGalleryAlbum();
  const album = data?.getMediaGalleryAlbum;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const coverImage = album?.coverImage
    ? album.coverImage.startsWith("http")
      ? album.coverImage
      : `https://cdn.thrico.network/${album.coverImage}`
    : null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch?.();
      toast.success("Album refreshed");
    } catch {
      toast.error("Failed to refresh album");
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const handleCoverImageChange = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    setIsUploadingCover(true);
    try {
      await updateAlbum({
        variables: {
          id: albumId,
          input: {
            coverImageUpload: file,
          },
        },
      });
      toast.success("Album cover photo updated");
      refetch?.();
    } catch (err: unknown) {
      toast.error(
        (err as Error)?.message || "Failed to update album cover photo",
      );
    } finally {
      setIsUploadingCover(false);
    }
  };

  const tabs: ManageTabItem[] = [
    { key: "media", label: "Media", icon: Images, path: "" },
    { key: "settings", label: "Settings", icon: Settings, path: "settings" },
  ];

  return (
    <>
      <ManageItemLayout
        title={album?.title || "Album"}
        loading={loading && !album}
        loadingText="Loading album..."
        coverImage={coverImage}
        onCoverImageChange={handleCoverImageChange}
        defaultIcon={Images}
        badges={
          album?.isFeatured ? (
            <Badge className="px-2 py-0 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/30 gap-1">
              <Star className="h-2.5 w-2.5 fill-amber-500" />
              Featured
            </Badge>
          ) : null
        }
        subtitle={
          album ? (
            <span>
              {album.imageCount ?? 0} media items
              {album.description ? ` · ${album.description}` : ""}
            </span>
          ) : null
        }
        headerActions={
          <div className="flex items-center gap-2">
            <CtaButton
              size="sm"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Photos
            </CtaButton>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing || loading || isUploadingCover}
              className="h-8 w-8 rounded-lg border-border/60 text-muted-foreground hover:text-foreground shadow-2xs cursor-pointer"
              title="Refresh album"
            >
              <RotateCcw
                className={cn(
                  "h-3.5 w-3.5",
                  (isRefreshing || isUploadingCover) &&
                    "animate-spin text-primary",
                )}
              />
            </Button>
          </div>
        }
        closeHref="/media-gallery"
        basePath={basePath}
        currentTab={currentTab}
        tabs={tabs}
        breadcrumbs={[
          { label: "Media Gallery", href: "/media-gallery" },
          { label: album?.title || "Album" },
        ]}
      >
        {children}
      </ManageItemLayout>

      {/* Upload Dialog triggered directly from Header Action */}
      <MultiGalleryUploadDialog
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        currentAlbumId={albumId}
        onUploaded={() => refetch?.()}
      />
    </>
  );
}
