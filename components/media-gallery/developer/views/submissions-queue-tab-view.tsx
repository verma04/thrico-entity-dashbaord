"use client";

import React, { useState, useMemo } from "react";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldCheck,
  RotateCw,
  Check,
  X,
  Play,
  Eye,
  LayoutGrid,
  List as ListIcon,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  User,
  FolderOpen,
} from "lucide-react";
import {
  useMediaGalleryDeveloper,
  MediaGallerySubmissionItem,
} from "../media-gallery-developer-context";
import { MediaGallerySubmissionDrawer } from "../media-gallery-submission-drawer";
import { cn } from "@/lib/utils";

export function SubmissionsQueueTabView() {
  const {
    submissions,
    submissionsLoading,
    refetchSubmissions,
    approveSubmission,
    rejectSubmission,
    isApproving,
    isRejecting,
    albums,
    selectedSubmission,
    setSelectedSubmission,
    submissionDrawerOpen,
    setSubmissionDrawerOpen,
  } = useMediaGalleryDeveloper();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const captionMatch = (sub.caption || "").toLowerCase().includes(q);
        const nameMatch = (sub.externalUploaderName || "").toLowerCase().includes(q);
        const emailMatch = (sub.externalUploaderEmail || "").toLowerCase().includes(q);
        if (!captionMatch && !nameMatch && !emailMatch) return false;
      }
      if (statusFilter !== "ALL" && sub.status !== statusFilter) {
        return false;
      }
      if (typeFilter !== "ALL") {
        const isVideo =
          sub.type === "VIDEO" ||
          (sub.url && sub.url.match(/\.(mp4|webm|mov|m4v)$/i));
        if (typeFilter === "VIDEO" && !isVideo) return false;
        if (typeFilter === "IMAGE" && isVideo) return false;
      }
      return true;
    });
  }, [submissions, search, statusFilter, typeFilter]);

  const handleOpenReview = (item: MediaGallerySubmissionItem) => {
    setSelectedSubmission(item);
    setSubmissionDrawerOpen(true);
  };

  const getAlbumTitle = (albumId: string) => {
    const found = albums.find((a) => a.id === albumId);
    return found ? found.title : "Community Album";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return (
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0.5 font-bold border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-[4px]"
          >
            Pending Review
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0.5 font-bold border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-[4px]"
          >
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0.5 font-bold border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-[4px]"
          >
            Declined
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  return (
    <PolarisFormCard
      icon={ShieldCheck}
      title="Third-Party Submissions & Review Queue"
      description="Inspect, approve, or reject user photo and video uploads sent from external client sites and widget embeds."
      badge="Moderation Queue"
    >
      <div className="space-y-4">
        {/* Action & Filter Bar (EcosystemActionBar style) */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            {/* Search */}
            <EcosystemActionBar.Item grow className="max-w-xs">
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search caption, name, email…"
              />
            </EcosystemActionBar.Item>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-[30px] w-[145px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-[6px]">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING_APPROVAL">Pending Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Declined</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-[30px] w-[130px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent className="rounded-[6px]">
                <SelectItem value="ALL">All Media</SelectItem>
                <SelectItem value="IMAGE">Photos Only</SelectItem>
                <SelectItem value="VIDEO">Videos Only</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#d2d5d9] dark:border-zinc-800 rounded-[4px] p-0.5 bg-[#f6f6f7] dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1 rounded-[3px] transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-zinc-800 shadow-2xs text-[#303030] dark:text-zinc-100"
                    : "text-[#616161] dark:text-zinc-400 hover:text-[#303030]"
                }`}
                title="Table View"
              >
                <ListIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded-[3px] transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-zinc-800 shadow-2xs text-[#303030] dark:text-zinc-100"
                    : "text-[#616161] dark:text-zinc-400 hover:text-[#303030]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Refresh Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetchSubmissions()}
              disabled={submissionsLoading}
              className="h-[30px] rounded-[4px] text-xs gap-1.5 font-medium border-border cursor-pointer hover:border-zinc-400"
            >
              <RotateCw
                className={cn(
                  "h-3.5 w-3.5 text-zinc-500",
                  submissionsLoading && "animate-spin"
                )}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        {/* Content Display */}
        {filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[260px] border border-dashed border-border/80 rounded-xl p-8 text-center bg-card shadow-2xs">
            <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">
              No Submissions Found
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {search || statusFilter !== "ALL"
                ? "No submissions match the current search or filter query."
                : "The review queue is currently empty. External uploads will appear here for administrative moderation."}
            </p>
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="rounded-xl border border-border/70 overflow-hidden bg-card shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 border-b border-border/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Media</th>
                    <th className="py-2.5 px-3">Caption & Attribution</th>
                    <th className="py-2.5 px-3">Destination</th>
                    <th className="py-2.5 px-3">Submitted</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredSubmissions.map((item) => {
                    const isVideo =
                      item.type === "VIDEO" ||
                      (item.url && item.url.match(/\.(mp4|webm|mov|m4v)$/i));

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-muted/30 transition-colors cursor-pointer group"
                        onClick={() => handleOpenReview(item)}
                      >
                        {/* Media Thumbnail */}
                        <td className="py-2.5 px-3 w-16">
                          <div className="relative h-12 w-14 rounded-lg overflow-hidden bg-zinc-900 border border-border/70 shrink-0 flex items-center justify-center">
                            {isVideo ? (
                              <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
                                <video
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Play className="h-4 w-4 text-white fill-white" />
                                </div>
                              </div>
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.url}
                                alt={item.caption || "Thumbnail"}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </td>

                        {/* Caption & Attribution */}
                        <td className="py-2.5 px-3 max-w-[240px]">
                          <p className="font-semibold text-foreground truncate">
                            {item.caption || "No caption provided"}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5 truncate">
                            <User className="h-3 w-3 shrink-0 text-zinc-400" />
                            <span className="truncate">
                              {item.externalUploaderName || "Anonymous"}
                            </span>
                            {item.externalUploaderEmail && (
                              <span>({item.externalUploaderEmail})</span>
                            )}
                          </div>
                        </td>

                        {/* Destination Album */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                            <FolderOpen className="h-3 w-3 text-sky-500 shrink-0" />
                            <span className="truncate max-w-[140px]">
                              {getAlbumTitle(item.albumId)}
                            </span>
                          </div>
                        </td>

                        {/* Submitted At */}
                        <td className="py-2.5 px-3 text-[11px] text-muted-foreground whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>

                        {/* Actions */}
                        <td
                          className="py-2.5 px-3 text-right whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenReview(item)}
                              className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Inspect full resolution"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>

                            {item.status === "PENDING_APPROVAL" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => rejectSubmission(item.id)}
                                  disabled={isRejecting}
                                  className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900 cursor-pointer"
                                  title="Decline"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  onClick={() => approveSubmission(item.id)}
                                  disabled={isApproving}
                                  className="h-7 w-7 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs"
                                  title="Approve & Publish"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSubmissions.map((item) => {
              const isVideo =
                item.type === "VIDEO" ||
                (item.url && item.url.match(/\.(mp4|webm|mov|m4v)$/i));

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenReview(item)}
                  className="rounded-xl border border-border/70 bg-card overflow-hidden hover:border-border transition-all shadow-2xs cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-zinc-950 flex items-center justify-center overflow-hidden">
                    {isVideo ? (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.url}
                        alt={item.caption || "Thumbnail"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    <div className="absolute top-2 left-2">
                      {getStatusBadge(item.status)}
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className="p-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] flex items-center gap-0.5">
                        {isVideo ? (
                          <Film className="h-2.5 w-2.5" />
                        ) : (
                          <ImageIcon className="h-2.5 w-2.5" />
                        )}
                        {isVideo ? "Video" : "Photo"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-semibold text-foreground truncate">
                        {item.caption || "No caption provided"}
                      </h5>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        By {item.externalUploaderName || "Anonymous contributor"}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="truncate max-w-[120px]">
                        {getAlbumTitle(item.albumId)}
                      </span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {item.status === "PENDING_APPROVAL" && (
                    <div
                      className="p-2.5 bg-muted/20 border-t border-border/50 flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rejectSubmission(item.id)}
                        disabled={isRejecting}
                        className="flex-1 h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900 cursor-pointer"
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => approveSubmission(item.id)}
                        disabled={isApproving}
                        className="flex-1 h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-2xs"
                      >
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review & Moderation Inspection Drawer */}
      <MediaGallerySubmissionDrawer
        open={submissionDrawerOpen}
        onOpenChange={setSubmissionDrawerOpen}
        submission={selectedSubmission}
        albumTitle={
          selectedSubmission
            ? getAlbumTitle(selectedSubmission.albumId)
            : undefined
        }
        onApprove={approveSubmission}
        onReject={rejectSubmission}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />
    </PolarisFormCard>
  );
}
