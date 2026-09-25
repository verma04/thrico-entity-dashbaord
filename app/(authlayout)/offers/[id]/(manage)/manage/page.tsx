"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOfferById } from "@/graphql/actions/offers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Tag,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Ticket,
  Eye,
  CheckCircle2,
  Percent,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  FileText,
  Lock,
  Globe,
  Settings,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";
import Image from "next/image";
import moment from "moment";

export default function OfferManagePage() {
  const singularName = useModuleStore((state) => state.offerSingularName) || "Offer";
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const { data, loading } = useGetOfferById(id, {
    skip: !id,
  });

  const offer = data?.getOfferById;

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading {singularName.toLowerCase()} details...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border/80">
        <Tag className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-foreground">
          {singularName} Not Found
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          We couldn&apos;t retrieve the details for this {singularName.toLowerCase()}. It may have been deleted or moved.
        </p>
      </div>
    );
  }

  const isExpired = offer.validityEnd && moment(offer.validityEnd).isBefore(moment());
  const isActive = offer.status === "ACTIVE";

  const stats = [
    {
      label: "Total Claims",
      value: offer.claimsCount ?? 0,
      icon: Ticket,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Impressions",
      value: offer.viewsCount ?? 0,
      icon: Eye,
      gradient: "from-violet-500/10 to-violet-600/5",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      label: "Discount Value",
      value: offer.discount || "Standard",
      icon: Percent,
      gradient: "from-emerald-500/10 to-emerald-600/5",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      isText: true,
    },
    {
      label: "Status",
      value: isExpired ? "Expired" : offer.status,
      icon: isExpired ? Clock : CheckCircle2,
      gradient: isExpired
        ? "from-rose-500/10 to-rose-600/5"
        : "from-amber-500/10 to-amber-600/5",
      iconBg: isExpired ? "bg-rose-500/10" : "bg-amber-500/10",
      iconColor: isExpired ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400",
      isText: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`border-none shadow-sm ring-1 ring-border/50 overflow-hidden bg-gradient-to-br ${stat.gradient}`}
          >
            <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
              <div
                className={`p-2.5 rounded-xl ${stat.iconBg} ring-1 ring-black/[0.04] shrink-0`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p
                  className={`font-bold ${stat.isText ? "text-sm sm:text-base" : "text-xl sm:text-2xl"} tracking-tight truncate`}
                >
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider truncate">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Content & Terms) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Cover Card */}
          <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
            <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full bg-muted/40 overflow-hidden">
              <Image
                src={
                  offer.image
                    ? `https://cdn.thrico.network/${offer.image}`
                    : "https://cdn.thrico.network/defaultEventCover.png"
                }
                alt={offer.title || "Offer cover"}
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div className="space-y-1.5 text-white">
                  <div className="flex flex-wrap items-center gap-2">
                    {offer.category?.name && (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20 text-white"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: offer.category.color || "#3b82f6" }}
                        />
                        {offer.category.name}
                      </span>
                    )}
                    {offer.discount && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/90 text-white backdrop-blur-md">
                        <Sparkles className="h-3 w-3" />
                        {offer.discount}
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm line-clamp-1">
                    {offer.title}
                  </h1>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => router.push(`/offers/${id}/settings`)}
                  className="shrink-0 h-8 gap-1.5 rounded-lg bg-white/90 text-zinc-900 hover:bg-white text-xs font-semibold shadow-md backdrop-blur-sm"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Edit Offer
                </Button>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  About This {singularName}
                </h3>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                  {offer.description || "No description provided for this offer."}
                </p>
              </div>

              {/* Terms & Conditions */}
              {offer.termsAndConditions && (
                <>
                  <Separator className="bg-border/60" />
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      Terms & Conditions
                    </h3>
                    <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {offer.termsAndConditions}
                    </div>
                  </div>
                </>
              )}

              {/* Audience & Eligibility Rule */}
              <Separator className="bg-border/60" />
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  Access & Member Eligibility
                </h3>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        Eligibility Scope:
                      </span>
                      <Badge variant="outline" className="font-semibold uppercase tracking-wider text-[11px] px-2.5 py-0.5">
                        {offer.memberEligibility || offer.eligibility?.memberEligibility || "ALL MEMBERS"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {offer.memberEligibility === "OUTSIDE_PLATFORM"
                        ? "Available publicly to all external web visitors."
                        : offer.memberEligibility === "VERIFIED"
                          ? "Restricted to verified community members only."
                          : offer.memberEligibility === "TIERS"
                            ? "Exclusive benefit for specified membership tier subscribers."
                            : "Available to all registered community members."}
                    </p>
                  </div>
                  {offer.memberEligibility === "TIERS" && (offer.eligibility?.eligibleTierIds?.length || 0) > 0 && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      {offer.eligibility?.eligibleTierIds?.length} Tier(s) Assigned
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Sidebar details) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Offer Details</CardTitle>
              <CardDescription className="text-xs">
                Key specifications and redemption rules
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              {/* Partner / Company */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/40">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Partner / Merchant
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {offer.company || "Direct Listing"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/40">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Applicable Location
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {offer.location || "Global / Online"}
                  </p>
                </div>
              </div>

              {/* Validity Window */}
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/40">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Validity Window
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    {offer.validityStart ? moment(offer.validityStart).format("MMM D, YYYY") : "N/A"}
                    {" — "}
                    {offer.validityEnd ? moment(offer.validityEnd).format("MMM D, YYYY") : "N/A"}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              {offer.timeline && (
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Timeline / Duration
                    </p>
                    <p className="text-xs font-medium text-foreground truncate">
                      {offer.timeline}
                    </p>
                  </div>
                </div>
              )}

              {/* External Website */}
              {offer.website && (
                <div className="pt-1">
                  <a
                    href={offer.website.startsWith("http") ? offer.website : `https://${offer.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between w-full p-2.5 rounded-lg border border-border/60 bg-background hover:bg-muted/50 transition-colors text-xs font-semibold text-primary group"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      Visit Merchant Website
                    </span>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground">
                      &rarr;
                    </span>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Badge Card */}
          <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    offer.verification?.isVerified
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {offer.verification?.isVerified ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <ShieldAlert className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {offer.verification?.isVerified
                      ? "Verified Partner Offer"
                      : "Unverified Listing"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {offer.verification?.isVerified
                      ? offer.verification.verificationReason || "Confirmed by platform team"
                      : "Pending authentication"}
                  </p>
                </div>
              </div>
              <Badge
                variant={offer.verification?.isVerified ? "default" : "secondary"}
                className="text-[10px] uppercase font-semibold"
              >
                {offer.verification?.isVerified ? "Verified" : "Unverified"}
              </Badge>
            </CardContent>
          </Card>

          {/* Creator / Added By */}
          {offer.creator && (
            <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-semibold">Listing Creator</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <UserProfileHoverCard user={offer.creator}>
                  <div className="flex items-center gap-3 cursor-pointer group">
                    <Avatar className="h-10 w-10 rounded-lg border border-border/60">
                      <AvatarImage src={offer.creator.avatar || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                        {offer.creator.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {offer.creator.firstName} {offer.creator.lastName || ""}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        Created {moment(offer.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </UserProfileHoverCard>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

