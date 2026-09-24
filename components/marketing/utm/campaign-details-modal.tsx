"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ADMIN_GET_UTM_CAMPAIGN_BY_ID,
  ADMIN_UPDATE_UTM_CAMPAIGN,
} from "@/graphql/actions/utm/admin-utm.graphql";
import { UtmCampaignItem, UtmCampaignStatus } from "@/types/utm";
import { safeFormat } from "@/lib/date-utils";
import {
  Link2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  BarChart3,
  ShieldCheck,
  Edit3,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface CampaignDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string | null;
  initialCampaign?: UtmCampaignItem | null;
  onSelect360?: (campaignSlug: string) => void;
  onEdit?: (campaign: UtmCampaignItem) => void;
  onOpenQr?: (campaign: UtmCampaignItem) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (campaign: UtmCampaignItem, nextStatus: UtmCampaignStatus) => void;
}

export function CampaignDetailsModal({
  open,
  onOpenChange,
  campaignId,
  initialCampaign,
  onSelect360,
  onEdit,
  onOpenQr,
  onDelete,
  onStatusChange,
}: CampaignDetailsModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  // Fetch campaign by ID via Apollo
  const { data, refetch } = useQuery(ADMIN_GET_UTM_CAMPAIGN_BY_ID, {
    variables: { id: campaignId },
    skip: !campaignId || !open,
    fetchPolicy: "cache-and-network",
  });

  const [updateStatusMutation] = useMutation(ADMIN_UPDATE_UTM_CAMPAIGN);

  const campaign: UtmCampaignItem | null =
    data?.getUtmCampaignById || initialCampaign || null;

  if (!campaign) return null;

  const shortUrl = campaign.shortCode
    ? `https://${campaign.shortCode}`
    : `https://thrc.io/${campaign.utmCampaign.slice(0, 8)}`;

  const handleCopyLink = (text: string, isShort: boolean) => {
    navigator.clipboard.writeText(text);
    if (isShort) {
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
    toast.success("Link copied to clipboard");
  };

  const handleToggleStatus = async (nextStatus: UtmCampaignStatus) => {
    try {
      await updateStatusMutation({
        variables: { input: { id: campaign.id, status: nextStatus } },
      });
      refetch();
      if (onStatusChange) {
        onStatusChange({ ...campaign, status: nextStatus }, nextStatus);
      }
      toast.success(`Campaign marked as ${nextStatus}`);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to update campaign status");
    }
  };

  const getStatusBadge = (status: UtmCampaignStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold gap-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold gap-1.5 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            PAUSED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-zinc-500 font-semibold gap-1.5 text-xs">
            ARCHIVED
          </Badge>
        );
    }
  };

  const getDestinationBadge = (type: string) => {
    switch (type) {
      case "SIGNUP":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 text-[10.5px]">
            SIGNUP FUNNEL
          </Badge>
        );
      case "LOGIN":
        return (
          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 text-[10.5px]">
            LOGIN FUNNEL
          </Badge>
        );
      default:
        return (
          <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 text-[10.5px]">
            CUSTOM LANDING
          </Badge>
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col justify-between overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          <SheetHeader className="p-0 space-y-3 pb-3 border-b border-border/60">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(campaign.status)}
                {getDestinationBadge(campaign.destinationType)}
                <Badge variant="outline" className="text-[11px] font-mono border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300">
                  utm_campaign: {campaign.utmCampaign}
                </Badge>
              </div>

              {/* Quick Status Toggle */}
              <div className="flex items-center gap-1">
                {campaign.status !== "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus("ACTIVE")}
                    className="h-7 text-xs text-emerald-600 hover:text-emerald-700 border-emerald-200 cursor-pointer"
                  >
                    Activate
                  </Button>
                )}
                {campaign.status === "ACTIVE" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus("PAUSED")}
                    className="h-7 text-xs text-amber-600 hover:text-amber-700 border-amber-200 cursor-pointer"
                  >
                    Pause
                  </Button>
                )}
              </div>
            </div>

            <div>
              <SheetTitle className="text-xl font-bold tracking-tight text-foreground">
                {campaign.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Campaign ID: <span className="font-mono text-foreground">{campaign.id}</span>
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* Links Card */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <Link2 className="h-3.5 w-3.5 text-indigo-600" />
              Generated URLs & Distribution
            </span>

            {/* Short Link */}
            <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Short Attribution Link
                </span>
                <span className="text-[10px] text-muted-foreground">Mobile & SMS friendly</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-xs font-semibold text-foreground truncate">
                  {shortUrl}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(shortUrl, true)}
                    className="h-7 text-xs px-2 cursor-pointer"
                  >
                    {copiedShort ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Full Tracking URL */}
            <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Full Tracking Link
                </span>
                <span className="text-[10px] text-indigo-600 font-mono">360° Tagged</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="font-mono text-xs text-muted-foreground truncate select-all">
                  {campaign.generatedUrl}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(campaign.generatedUrl, false)}
                    className="h-7 text-xs px-2 cursor-pointer"
                  >
                    {copiedUrl ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <a
                    href={campaign.generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* UTM Parameters Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
              UTM Parameters Breakdown
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-border/60 bg-background space-y-0.5">
                <span className="text-[10.5px] text-muted-foreground uppercase font-semibold">
                  utm_source
                </span>
                <div className="font-mono font-bold text-foreground truncate">
                  {campaign.utmSource}
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-border/60 bg-background space-y-0.5">
                <span className="text-[10.5px] text-muted-foreground uppercase font-semibold">
                  utm_medium
                </span>
                <div className="font-mono font-bold text-foreground truncate">
                  {campaign.utmMedium}
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-border/60 bg-background space-y-0.5">
                <span className="text-[10.5px] text-muted-foreground uppercase font-semibold">
                  utm_campaign
                </span>
                <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate">
                  {campaign.utmCampaign}
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-border/60 bg-background space-y-0.5">
                <span className="text-[10.5px] text-muted-foreground uppercase font-semibold">
                  utm_term
                </span>
                <div className="font-mono text-foreground truncate">
                  {campaign.utmTerm || <span className="text-muted-foreground italic">None</span>}
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-border/60 bg-background space-y-0.5 col-span-2">
                <span className="text-[10.5px] text-muted-foreground uppercase font-semibold">
                  utm_content
                </span>
                <div className="font-mono text-foreground truncate">
                  {campaign.utmContent || <span className="text-muted-foreground italic">None</span>}
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-border/60 bg-background space-y-0.5 col-span-2">
                <span className="text-[10.5px] text-muted-foreground uppercase font-semibold">
                  Destination Base URL
                </span>
                <div className="truncate font-mono text-xs text-foreground" title={campaign.destinationUrl}>
                  {campaign.destinationUrl}
                </div>
              </div>
            </div>
          </div>

          {/* Audit Timestamps */}
          <div className="pt-2 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/60">
            <div>
              Created: <strong>{safeFormat(campaign.createdAt, "MMM d, yyyy h:mm a")}</strong>
            </div>
            {campaign.updatedAt && (
              <div>
                Updated: <strong>{safeFormat(campaign.updatedAt, "MMM d, yyyy h:mm a")}</strong>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="p-6 pt-3 border-t border-border/60 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDelete(campaign.id);
                  onOpenChange(false);
                }}
                className="text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(campaign);
                }}
                className="text-xs h-8 cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenQr && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onOpenQr(campaign);
                }}
                className="text-xs h-8 cursor-pointer gap-1.5"
              >
                <QrCode className="h-3.5 w-3.5" />
                QR Code
              </Button>
            )}
            {onSelect360 && (
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onSelect360(campaign.utmCampaign);
                }}
                className="text-xs h-8 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer gap-1.5 shadow-2xs"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                360° Analytics →
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
