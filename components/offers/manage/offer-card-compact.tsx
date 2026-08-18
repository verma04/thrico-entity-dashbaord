"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Offer } from "@/graphql/actions/offers";
import { OfferActions } from "./offer-actions";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface OfferCardCompactProps {
  offer: Offer;
  onEdit?: (offer: Offer) => void;
  refetch?: (variables?: any) => Promise<any> | void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  INACTIVE: {
    label: "Inactive",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  EXPIRED: {
    label: "Expired",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
};

export function OfferCardCompact({
  offer,
  onEdit,
  refetch,
}: OfferCardCompactProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  const statusInfo = STATUS_CONFIG[offer.status?.toUpperCase()] || {
    label: offer.status || "Unknown",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };

  const coverUrl =
    !imgError && offer.image
      ? offer.image.startsWith("http")
        ? offer.image
        : `https://cdn.thrico.network/${offer.image}`
      : null;

  return (
    <div
      onClick={() => router.push(`/offers/${offer.id}/manage`)}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      {/* Classification-card style top color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{
          backgroundColor:
            offer.category?.color ||
            (offer.status === "ACTIVE"
              ? "#10b981"
              : offer.status === "EXPIRED"
                ? "#f43f5e"
                : "#f59e0b"),
        }}
      />

      {/* ── Top Area (Image or Header Tags) ─────────────────────────────── */}
      {coverUrl ? (
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-muted">
          <Image
            src={coverUrl}
            alt={offer.title || "Offer image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Floating Discount Badge (Top-Left) */}
          <div className="absolute top-2.5 left-2.5 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg px-2 py-1 flex items-center gap-1 shadow-xs leading-none">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 font-mono">
              {offer.discount || "SPECIAL OFFER"}
            </span>
          </div>

          {/* Action button (Top-Right) */}
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-background/80 hover:bg-background backdrop-blur-md rounded-md shadow-xs transition-colors">
              <OfferActions offer={offer} onEdit={onEdit} refetch={refetch} />
            </div>
          </div>

          {/* Category & Status pills on bottom of image */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight backdrop-blur-md border shadow-2xs bg-primary/15 text-primary border-primary/30",
              )}
            >
              {offer.category?.name || "General"}
            </span>

            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold backdrop-blur-md bg-black/50 text-white border border-white/10 shadow-2xs",
              )}
            >
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
              />
              {statusInfo.label}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 font-mono bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
              {offer.discount || "SPECIAL OFFER"}
            </span>

            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
              {offer.category?.name || "General"}
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
              />
              {statusInfo.label}
            </span>
          </div>

          <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
            <OfferActions offer={offer} onEdit={onEdit} refetch={refetch} />
          </div>
        </div>
      )}

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Title */}
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={offer.title}
          >
            {offer.title}
          </h3>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            {offer.description || offer.company || "No description provided."}
          </p>

          {/* Creator / Entity info */}
          <div className="pt-0.5">
            {!offer.creator ? (
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                <Avatar className="h-4 w-4 rounded-full border border-primary/20">
                  <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                    EN
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground/80">Entity</span>
              </div>
            ) : (
              <UserProfileHoverCard user={offer.creator}>
                <div
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium cursor-pointer hover:text-primary transition-colors max-w-full truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar className="h-4 w-4 rounded-full border border-border/60 shrink-0">
                    <AvatarImage
                      src={
                        offer.creator.avatar?.startsWith("http")
                          ? offer.creator.avatar
                          : `https://cdn.thrico.network/${offer.creator.avatar}`
                      }
                      alt={`${offer.creator.firstName || ""} ${offer.creator.lastName || ""}`}
                    />
                    <AvatarFallback className="text-[8px] bg-muted font-bold">
                      {offer.creator.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {offer.creator.firstName} {offer.creator.lastName}
                  </span>
                </div>
              </UserProfileHoverCard>
            )}
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-foreground/80 font-medium">
              <Users className="h-3 w-3 text-muted-foreground shrink-0" />
              <span>{offer.claimsCount || 0}</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                claims
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-3 w-3 shrink-0" />
              <span>{offer.viewsCount || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {offer.verification?.isVerified && (
              <span
                className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400"
                title="Verified Offer"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferCardCompact;
