"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";
import moment from "moment";
import {
  Moment,
  useAdminGetMomentHistory,
  MomentHistoryItem,
} from "@/graphql/actions/moments";
import { getPreferredMediaUrl } from "@/lib/media-utils";

interface MomentHistoryDialogProps {
  moment: Moment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MomentHistoryDialog({
  moment: momentData,
  open,
  onOpenChange,
}: MomentHistoryDialogProps) {
  const { data, loading } = useAdminGetMomentHistory(
    open && momentData?.id ? momentData.id : undefined
  );

  const history = data?.adminGetMomentHistory;
  const items = history?.items || [];
  const currentAddedBy = history?.currentAddedBy || momentData?.addedBy || "USER";
  const currentOwner = history?.currentOwner || momentData?.owner;

  const thumbUrl = momentData?.thumbnailUrl
    ? getPreferredMediaUrl(momentData.thumbnailUrl)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg rounded-xl p-6 border-border gap-5 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="gap-1 pb-1 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <History className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                Attribution & Edit History
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Transparency timeline of ownership, upload type, and administrative updates.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Moment Summary Card ── */}
        <div className="rounded-lg border border-border/60 bg-muted/30 p-3 flex items-center gap-3">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt=""
              className="h-14 w-12 rounded object-cover border border-border/60 shrink-0 bg-black/40"
            />
          ) : (
            <div className="h-14 w-12 rounded bg-muted flex items-center justify-center border border-border/60 shrink-0 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="text-xs font-semibold text-foreground truncate">
              {momentData?.caption || "Untitled Moment"}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 font-medium">
                {currentAddedBy === "ENTITY" ? (
                  <>
                    <Building2 className="h-3 w-3 text-primary" />
                    <span className="text-foreground">Official Entity Post</span>
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 text-primary" />
                    <span className="text-foreground">
                      Attributed to {currentOwner ? `${currentOwner.firstName || ""} ${currentOwner.lastName || ""}`.trim() : "Member"}
                    </span>
                  </>
                )}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {momentData?.createdAt
                  ? moment(momentData.createdAt).format("MMM D, YYYY")
                  : "Recent"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Timeline Section ── */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
            Activity Timeline ({items.length} {items.length === 1 ? "event" : "events"})
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-xs">Loading audit history...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center space-y-2">
              <CheckCircle2 className="h-7 w-7 text-muted-foreground/60 mx-auto" />
              <div className="text-xs font-semibold text-foreground">
                Original Creation Record
              </div>
              <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                This moment is in its initial state created as{" "}
                <span className="font-semibold text-foreground">
                  {currentAddedBy === "ENTITY" ? "Entity Post" : "Member Post"}
                </span>
                . No ownership switches have been recorded yet.
              </p>
            </div>
          ) : (
            <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60">
              {items.map((item: MomentHistoryItem, idx: number) => {
                const isTypeChange = item.action === "CHANGE_UPLOAD_TYPE";
                const isCreate = item.action === "CREATE";
                const adminName = item.admin
                  ? `${item.admin.firstName || ""} ${item.admin.lastName || ""}`.trim() || "Administrator"
                  : "Administrator";

                const prevAddedBy = item.previousState?.addedBy;
                const newAddedBy = item.newState?.addedBy;

                return (
                  <div key={item.id || idx} className="relative group">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-5 top-0.5 h-4 w-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>

                    <div className="rounded-lg border border-border/60 bg-card p-3.5 space-y-2 shadow-2xs hover:border-primary/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                          {isTypeChange ? (
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-bold px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20"
                            >
                              Attribution Switch
                            </Badge>
                          ) : isCreate ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold px-1.5 py-0 h-4 border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                            >
                              Moment Created
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold px-1.5 py-0 h-4"
                            >
                              {item.action}
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {moment(item.createdAt).format("MMM D, YYYY · h:mm A")}
                        </span>
                      </div>

                      {/* Transition description */}
                      {isTypeChange && prevAddedBy && newAddedBy && (
                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border border-border/40 text-xs">
                          <span className="font-medium text-muted-foreground flex items-center gap-1 text-[11px]">
                            {prevAddedBy === "ENTITY" ? (
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                            ) : (
                              <User className="h-3 w-3 text-muted-foreground" />
                            )}
                            {prevAddedBy === "ENTITY" ? "Entity" : "Member"}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                          <span className="font-semibold text-foreground flex items-center gap-1 text-[11px]">
                            {newAddedBy === "ENTITY" ? (
                              <Building2 className="h-3 w-3 text-primary" />
                            ) : (
                              <User className="h-3 w-3 text-primary" />
                            )}
                            {newAddedBy === "ENTITY"
                              ? "Official Entity"
                              : item.targetUser
                              ? `${item.targetUser.firstName || ""} ${item.targetUser.lastName || ""}`.trim()
                              : "Member"}
                          </span>
                        </div>
                      )}

                      {/* Reason */}
                      {item.reason && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {item.reason}
                        </p>
                      )}

                      {/* Performed by Admin row */}
                      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3 w-3 text-primary/70 shrink-0" />
                          <span>Performed by:</span>
                          <span className="font-semibold text-foreground">
                            {adminName}
                          </span>
                        </div>
                        <span>{moment(item.createdAt).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MomentHistoryDialog;
