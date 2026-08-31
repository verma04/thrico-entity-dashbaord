"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { Search, X, Loader2, Users, Building } from "lucide-react";
import { GET_MEMBERSHIP_TIERS } from "@/graphql/membership-tier";
import { useSearchUserByName } from "@/graphql/actions/mentorship/mentorship-actions";
import { GET_COMMUNITIES } from "@/graphql/quries/group/approval";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { InlineAlert } from "@/components/ui/inline-alert";

export function toArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string" && val.trim()) return [val.trim()];
  return [];
}

interface PolarisEligibilityCardProps {
  step?: number;
  title?: string;
  description?: string;
  badge?: string;
  eligibility: string;
  onEligibilityChange: (val: string) => void;
  tierIds?: string[] | string | undefined | null;
  onTierIdsChange?: (tierIds: string[]) => void;
  userIds?: string[] | string | undefined | null;
  onUserIdsChange?: (userIds: string[]) => void;
  communityIds?: string[] | string | undefined | null;
  onCommunityIdsChange?: (communityIds: string[]) => void;
  showToAllMembers?: boolean;
  onShowToAllMembersChange?: (val: boolean) => void;
  allowOutsidePlatform?: boolean;
  allowCommunity?: boolean;
  errorMessage?: string | null | React.ReactNode;
  children?: React.ReactNode;
}

export function PolarisEligibilityCard({
  step = 4,
  title = "Eligibility",
  description = "Specify which customers, members, or tiers can access this reward.",
  badge,
  eligibility = "ALL",
  onEligibilityChange,
  tierIds,
  onTierIdsChange,
  userIds,
  onUserIdsChange,
  communityIds,
  onCommunityIdsChange,
  showToAllMembers = true,
  onShowToAllMembersChange,
  allowOutsidePlatform = false,
  allowCommunity = true,
  errorMessage,
  children,
}: PolarisEligibilityCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [selectedCustomersMap, setSelectedCustomersMap] = useState<
    Record<
      string,
      { id: string; name: string; email?: string; avatar?: string }
    >
  >({});

  const selectedTierIds = useMemo(() => toArray(tierIds), [tierIds]);
  const selectedUserIds = useMemo(() => toArray(userIds), [userIds]);
  const selectedCommunityIds = useMemo(() => toArray(communityIds), [communityIds]);

  const { data: tiersData } = useQuery(GET_MEMBERSHIP_TIERS);
  const membershipTiers = useMemo(
    () => (tiersData?.getMembershipTiers || []) as any[],
    [tiersData],
  );

  const { data: communitiesData, loading: loadingCommunities } = useQuery(
    GET_COMMUNITIES,
    {
      variables: { input: {} },
    },
  );
  const communities = useMemo(
    () => (communitiesData?.getCommunities?.data || []) as any[],
    [communitiesData],
  );

  const [searchUserByName, { data: searchUserData, loading: searchingUsers }] =
    useSearchUserByName();
  const searchResultsUsers = useMemo(
    () => (searchUserData?.searchUserByName || []) as any[],
    [searchUserData],
  );

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchQuery(val);
      if (eligibility === "SPECIFIC_CUSTOMERS" && val.trim().length > 0) {
        searchUserByName({
          variables: { name: val.trim() },
        });
      }
    },
    [eligibility, searchUserByName],
  );

  const handleSelectTier = useCallback(
    (tierId: string) => {
      const isSelected = selectedTierIds.includes(tierId);
      const next = isSelected
        ? selectedTierIds.filter((id) => id !== tierId)
        : [...selectedTierIds, tierId];
      onTierIdsChange?.(next);
    },
    [selectedTierIds, onTierIdsChange],
  );

  const handleSelectCommunity = useCallback(
    (communityId: string) => {
      const isSelected = selectedCommunityIds.includes(communityId);
      const next = isSelected
        ? selectedCommunityIds.filter((id) => id !== communityId)
        : [...selectedCommunityIds, communityId];
      onCommunityIdsChange?.(next);
    },
    [selectedCommunityIds, onCommunityIdsChange],
  );

  const handleSelectCustomer = useCallback(
    (member: any) => {
      const uid = member.user?.id || member.id;
      const name = member.user
        ? `${member.user.firstName || ""} ${member.user.lastName || ""}`.trim() ||
          member.user.email
        : member.name || uid;

      const isSelected = selectedUserIds.includes(uid);
      const next = isSelected
        ? selectedUserIds.filter((id) => id !== uid)
        : [...selectedUserIds, uid];

      onUserIdsChange?.(next);
      if (!isSelected) {
        setSelectedCustomersMap((prev) => ({
          ...prev,
          [uid]: {
            id: uid,
            name,
            email: member.user?.email,
            avatar: member.user?.avatar,
          },
        }));
      }
    },
    [selectedUserIds, onUserIdsChange],
  );

  React.useEffect(() => {
    if (searchResultsUsers.length > 0) {
      setSelectedCustomersMap((prev) => {
        const next = { ...prev };
        searchResultsUsers.forEach((m: any) => {
          const uid = m.user?.id || m.id;
          const name =
            `${m.user?.firstName || ""} ${m.user?.lastName || ""}`.trim() ||
            m.user?.email ||
            m.name ||
            uid;
          if (uid) {
            next[uid] = {
              id: uid,
              name,
              email: m.user?.email,
              avatar: m.user?.avatar,
            };
          }
        });
        return next;
      });
    }
  }, [searchResultsUsers]);

  React.useEffect(() => {
    if (
      eligibility === "SPECIFIC_CUSTOMERS" &&
      selectedUserIds.length > 0 &&
      searchResultsUsers.length === 0
    ) {
      searchUserByName({ variables: { name: "" } });
    }
  }, [
    eligibility,
    selectedUserIds.length,
    searchResultsUsers.length,
  ]);

  return (
    <>
      <PolarisFormCard
        step={step}
        title={title}
        description={description}
        badge={badge}
      >
        <div className="space-y-3">
          {/* Primary Eligibility Select */}
          <Select
            value={eligibility || "ALL"}
            onValueChange={(val) => {
              onEligibilityChange(val);
              setSearchQuery("");
              if (val === "ALL" || val === "VERIFIED" || val === "OUTSIDE_PLATFORM") {
                onTierIdsChange?.([]);
                onUserIdsChange?.([]);
                onCommunityIdsChange?.([]);
              }
            }}
          >
            <SelectTrigger
              id="memberEligibility"
              className="h-[34px] w-full bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12.5px] font-normal text-[#303030] dark:text-zinc-100 shadow-none focus:ring-1 focus:ring-[#005bd3] focus:border-[#005bd3] rounded-[6px]"
            >
              <SelectValue placeholder="Select eligibility" />
            </SelectTrigger>
            <SelectContent>
              {allowOutsidePlatform && (
                <SelectItem value="OUTSIDE_PLATFORM" className="text-[12.5px]">
                  Outside Platform (Public / Non-members)
                </SelectItem>
              )}
              <SelectItem value="ALL" className="text-[12.5px]">
                All Members
              </SelectItem>
              <SelectItem value="VERIFIED" className="text-[12.5px]">
                Specific Members segments (Verified)
              </SelectItem>
              <SelectItem value="TIERS" className="text-[12.5px]">
                Specific tiers
              </SelectItem>
              {allowCommunity && (
                <SelectItem value="COMMUNITY" className="text-[12.5px]">
                  Specific Communities
                </SelectItem>
              )}
              <SelectItem value="SPECIFIC_CUSTOMERS" className="text-[12.5px]">
                Specific Members
              </SelectItem>
            </SelectContent>
          </Select>

          {/* When Outside Platform is active: Warning notification like subscription-alerts */}
          {eligibility === "OUTSIDE_PLATFORM" && (
            <div className="pt-0.5 animate-in fade-in-50 duration-200">
              <InlineAlert
                variant="alert"
                title="Outside Platform Warning:"
                message={
                  <>
                    Selecting <strong>Outside Platform</strong> will make this
                    publicly accessible to everyone on the web. Visitors, guests, and
                    non-registered users can discover, view details, and participate
                    without needing to join the community or hold a membership tier.
                  </>
                }
                className="rounded-lg text-xs"
              />
            </div>
          )}

          {/* When Specific Tiers, Communities, or Specific Customers is active: Search bar + Browse button */}
          {(eligibility === "TIERS" ||
            eligibility === "COMMUNITY" ||
            eligibility === "SPECIFIC_CUSTOMERS") && (
            <div className="space-y-2.5 pt-0.5 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#616161]" />
                  <Input
                    placeholder={
                      eligibility === "TIERS"
                        ? "Search tiers"
                        : eligibility === "COMMUNITY"
                          ? "Search communities"
                          : "Search customers by name"
                    }
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="h-[34px] pl-8 pr-7 text-[12.5px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 rounded-[6px] shadow-none focus:ring-1 focus:ring-[#005bd3] focus:border-[#005bd3]"
                  />
                  {(searchingUsers || loadingCommunities) && (
                    <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#616161] animate-spin" />
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsBrowseOpen(true);
                    if (
                      eligibility === "SPECIFIC_CUSTOMERS" &&
                      searchResultsUsers.length === 0
                    ) {
                      searchUserByName({
                        variables: { name: searchQuery || "a" },
                      });
                    }
                  }}
                  className="h-[34px] px-3 text-[12.5px] font-medium border-[#aeb4b9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#303030] dark:text-zinc-200 rounded-[6px] shrink-0"
                >
                  Browse
                </Button>
              </div>

              {/* Selected Tiers List */}
              {eligibility === "TIERS" && selectedTierIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {selectedTierIds.map((tierId: string) => {
                    const tier = membershipTiers.find(
                      (t: any) => t.id === tierId,
                    );
                    return (
                      <span
                        key={tierId}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                      >
                        {tier?.badgeColor && (
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: tier.badgeColor }}
                          />
                        )}
                        <span>{tier?.name || tierId}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTier(tierId);
                          }}
                          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 ml-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Selected Communities List */}
              {eligibility === "COMMUNITY" && selectedCommunityIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {selectedCommunityIds.map((cId: string) => {
                    const comm = communities.find(
                      (c: any) => c.id === cId || c._id === cId,
                    );
                    return (
                      <span
                        key={cId}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                      >
                        <Building className="h-3 w-3 text-zinc-500 shrink-0" />
                        <span>{comm?.title || comm?.name || cId}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCommunity(cId);
                          }}
                          className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 ml-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Selected Customers List */}
              {eligibility === "SPECIFIC_CUSTOMERS" &&
                selectedUserIds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {selectedUserIds.map((userId: string) => {
                      const saved = selectedCustomersMap[userId];
                      const displayName =
                        saved?.name ||
                        (userId.length > 20
                          ? `Customer (${userId.slice(0, 8)}...)`
                          : userId);
                      const avatar = saved?.avatar;
                      return (
                        <span
                          key={userId}
                          title={userId}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 max-w-full"
                        >
                          <Avatar className="h-3.5 w-3.5 shrink-0">
                            <AvatarImage src={avatar} />
                            <AvatarFallback className="text-[8px]">
                              {displayName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{displayName}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const next = selectedUserIds.filter(
                                (id) => id !== userId,
                              );
                              onUserIdsChange?.(next);
                            }}
                            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 ml-0.5 shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

              {/* Inline filter preview when searching */}
              {searchQuery.trim() && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-1.5 bg-white dark:bg-zinc-900 shadow-sm max-h-48 overflow-y-auto space-y-0.5">
                  {eligibility === "TIERS" ? (
                    membershipTiers
                      .filter((t: any) =>
                        t.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      )
                      .map((tier: any) => {
                        const isSelected = selectedTierIds.includes(tier.id);
                        return (
                          <div
                            key={tier.id}
                            onClick={() => handleSelectTier(tier.id)}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2">
                              {tier.badgeColor && (
                                <span
                                  className="h-2 w-2 rounded-full shrink-0"
                                  style={{ backgroundColor: tier.badgeColor }}
                                />
                              )}
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                {tier.name}
                              </span>
                            </div>
                            <Checkbox
                              checked={isSelected}
                              className="pointer-events-none"
                            />
                          </div>
                        );
                      })
                  ) : eligibility === "COMMUNITY" ? (
                    communities
                      .filter((c: any) =>
                        (c.title || c.name || "")
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      )
                      .map((comm: any) => {
                        const isSelected = selectedCommunityIds.includes(
                          comm.id || comm._id,
                        );
                        return (
                          <div
                            key={comm.id || comm._id}
                            onClick={() =>
                              handleSelectCommunity(comm.id || comm._id)
                            }
                            className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <Building className="h-3.5 w-3.5 text-zinc-500" />
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                {comm.title || comm.name}
                              </span>
                            </div>
                            <Checkbox
                              checked={isSelected}
                              className="pointer-events-none"
                            />
                          </div>
                        );
                      })
                  ) : searchResultsUsers.length === 0 ? (
                    <div className="p-3 text-center text-xs text-zinc-500">
                      {searchingUsers
                        ? "Searching customers..."
                        : "No matching customers found."}
                    </div>
                  ) : (
                    searchResultsUsers.map((m: any) => {
                      const uid = m.user?.id || m.id;
                      const name =
                        `${m.user?.firstName || ""} ${m.user?.lastName || ""}`.trim() ||
                        m.user?.email ||
                        "Customer";
                      const isSelected = selectedUserIds.includes(uid);
                      return (
                        <div
                          key={uid}
                          onClick={() => handleSelectCustomer(m)}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-5 w-5 shrink-0">
                              <AvatarImage src={m.user?.avatar} />
                              <AvatarFallback className="text-[9px]">
                                {name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="truncate">
                              <span className="font-medium text-zinc-900 dark:text-zinc-100 block truncate">
                                {name}
                              </span>
                              {m.user?.email && (
                                <span className="text-[10px] text-zinc-400 block truncate">
                                  {m.user.email}
                                </span>
                              )}
                            </div>
                          </div>
                          <Checkbox
                            checked={isSelected}
                            className="pointer-events-none shrink-0 ml-2"
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Validation error display */}
              {errorMessage ? (
                typeof errorMessage === "string" ? (
                  <p className="text-[11px] text-destructive font-medium mt-1 animate-in fade-in-50">
                    {errorMessage}
                  </p>
                ) : (
                  errorMessage
                )
              ) : null}
            </div>
          )}

          {/* Show To All Members Discovery Checkbox */}
          {onShowToAllMembersChange && (
            <div className="pt-3 border-t border-border/70 space-y-2">
              <div className="flex items-start space-x-3 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                <Checkbox
                  id="showToAllMembersCheckbox"
                  checked={showToAllMembers}
                  onCheckedChange={(checked) =>
                    onShowToAllMembersChange?.(Boolean(checked))
                  }
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="showToAllMembersCheckbox"
                    className="text-xs font-semibold text-foreground cursor-pointer"
                  >
                    Show to all members in discovery & game lists
                  </Label>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {showToAllMembers
                      ? "Visible to all members, but only members meeting the eligibility criteria can win or claim."
                      : "Hidden from non-eligible members. Only matching members can view and access this tier."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {children}
        </div>
      </PolarisFormCard>

      {/* Browse Modal */}
      <Dialog open={isBrowseOpen} onOpenChange={setIsBrowseOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl">
          <DialogHeader className="p-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <DialogTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {eligibility === "TIERS"
                ? "Select Membership Tiers"
                : eligibility === "COMMUNITY"
                  ? "Select Specific Communities"
                  : "Select Specific Customers"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <Input
                placeholder={
                  eligibility === "TIERS"
                    ? "Search tiers..."
                    : eligibility === "COMMUNITY"
                      ? "Search communities..."
                      : "Search customers by name..."
                }
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 pl-9 pr-8 text-xs"
              />
              {(searchingUsers || loadingCommunities) && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 animate-spin" />
              )}
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1 divide-y divide-zinc-100 dark:divide-zinc-800">
              {eligibility === "TIERS" ? (
                membershipTiers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    No membership tiers configured.
                  </div>
                ) : (
                  membershipTiers
                    .filter((t: any) =>
                      t.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((tier: any) => {
                      const isSelected = selectedTierIds.includes(tier.id);
                      return (
                        <div
                          key={tier.id}
                          onClick={() => handleSelectTier(tier.id)}
                          className="flex items-center gap-3 p-2.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer text-xs"
                        >
                          <Checkbox
                            checked={isSelected}
                            className="pointer-events-none"
                          />
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {tier.badgeColor && (
                              <span
                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: tier.badgeColor }}
                              />
                            )}
                            <div className="min-w-0">
                              <span className="font-medium text-zinc-900 dark:text-zinc-100 block truncate">
                                {tier.name}
                              </span>
                              {tier.description && (
                                <span className="text-[10px] text-zinc-400 block truncate">
                                  {tier.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                )
              ) : eligibility === "COMMUNITY" ? (
                communities.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500">
                    {loadingCommunities
                      ? "Loading communities..."
                      : "No communities found."}
                  </div>
                ) : (
                  communities
                    .filter((c: any) =>
                      (c.title || c.name || "")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    )
                    .map((comm: any) => {
                      const cId = comm.id || comm._id;
                      const isSelected = selectedCommunityIds.includes(cId);
                      return (
                        <div
                          key={cId}
                          onClick={() => handleSelectCommunity(cId)}
                          className="flex items-center gap-3 p-2.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer text-xs"
                        >
                          <Checkbox
                            checked={isSelected}
                            className="pointer-events-none"
                          />
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Building className="h-4 w-4 text-zinc-500 shrink-0" />
                            <div className="min-w-0">
                              <span className="font-medium text-zinc-900 dark:text-zinc-100 block truncate">
                                {comm.title || comm.name}
                              </span>
                              {comm.tagline && (
                                <span className="text-[10px] text-zinc-400 block truncate">
                                  {comm.tagline}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                )
              ) : searchResultsUsers.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">
                  {searchingUsers
                    ? "Searching customers..."
                    : "Type a name above to search customers."}
                </div>
              ) : (
                searchResultsUsers.map((m: any) => {
                  const uid = m.user?.id || m.id;
                  const name =
                    `${m.user?.firstName || ""} ${m.user?.lastName || ""}`.trim() ||
                    m.user?.email ||
                    "Customer";
                  const isSelected = selectedUserIds.includes(uid);
                  return (
                    <div
                      key={uid}
                      onClick={() => handleSelectCustomer(m)}
                      className="flex items-center gap-3 p-2.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer text-xs"
                    >
                      <Checkbox
                        checked={isSelected}
                        className="pointer-events-none"
                      />
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <Avatar className="h-6 w-6 shrink-0">
                          <AvatarImage src={m.user?.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100 block truncate">
                            {name}
                          </span>
                          {m.user?.email && (
                            <span className="text-[10px] text-zinc-400 block truncate">
                              {m.user.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <DialogFooter className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between sm:justify-between">
            <span className="text-[11px] text-zinc-500">
              {eligibility === "TIERS"
                ? `${selectedTierIds.length} tier(s) selected`
                : eligibility === "COMMUNITY"
                  ? `${selectedCommunityIds.length} community(ies) selected`
                  : `${selectedUserIds.length} customer(s) selected`}
            </span>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsBrowseOpen(false)}
              className="h-8 text-xs font-semibold"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
