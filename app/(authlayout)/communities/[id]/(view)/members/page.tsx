"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Users,
  UserPlus,
  MoreVertical,
  UserX,
  ShieldCheck,
  Check,
  X,
  Search,
  RefreshCw,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { toast } from "sonner";
import moment from "moment";
import {
  getCommunityMembers,
  getCommunityMemberRequests,
  removeCommunityMember,
  changeCommunityMemberRole,
  approveCommunityMemberRequest,
  rejectCommunityMemberRequest,
} from "@/graphql/actions/group/members";
import { useModuleStore } from "@/store/useModuleStore";

const ROLES = [
  { value: "ADMIN", label: "Admin", color: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800" },
  { value: "MANAGER", label: "Manager", color: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  { value: "MODERATOR", label: "Moderator", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { value: "USER", label: "Member", color: "bg-muted text-muted-foreground border-border/80" },
];

function getRoleBadge(role: string) {
  const found = ROLES.find((r) => r.value === role);
  return found ?? ROLES[3];
}

function safeParseMemberDate(value: any): string {
  if (!value) return "Unknown";
  const m = /^\d+$/.test(String(value)) ? moment(Number(value)) : moment(value);
  return m.isValid() ? m.format("MMM D, YYYY") : "Unknown";
}

export default function MembersPage() {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const params = useParams();
  const communityId = params?.id as string;

  const [activeTab, setActiveTab] = useState("all-members");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");
  const [removingMember, setRemovingMember] = useState<{ userId: string; name: string } | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: string;
    name: string;
    role: string;
    roleLabel: string;
  } | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);

  // Queries
  const {
    data: membersData,
    loading: membersLoading,
    fetchMore: fetchMoreMembers,
    refetch: refetchMembers,
  } = getCommunityMembers({
    variables: { communityId, limit: 20, offset: 0 },
    fetchPolicy: "cache-and-network",
    skip: !communityId,
  });

  const {
    data: requestsData,
    loading: requestsLoading,
    fetchMore: fetchMoreRequests,
    refetch: refetchRequests,
  } = getCommunityMemberRequests({
    variables: { communityId, limit: 20, offset: 0 },
    fetchPolicy: "cache-and-network",
    skip: !communityId,
  });

  // Mutations
  const [doRemove, { loading: removing }] = removeCommunityMember({
    onCompleted: () => {
      toast.success("Member removed successfully");
      setRemovingMember(null);
      refetchMembers();
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to remove member"),
  });

  const [doChangeRole, { loading: roleSaving }] = changeCommunityMemberRole({
    onCompleted: () => {
      toast.success("Role updated successfully");
      setPendingRoleChange(null);
      refetchMembers();
    },
    onError: (err: any) =>
      toast.error(err.message || "Failed to update role"),
  });

  const [doApproveRequest] = approveCommunityMemberRequest({
    onCompleted: () => {
      toast.success("Request approved successfully");
      setProcessingRequestId(null);
      refetchMembers();
      refetchRequests();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to approve request");
      setProcessingRequestId(null);
    },
  });

  const [doRejectRequest] = rejectCommunityMemberRequest({
    onCompleted: () => {
      toast.success("Request rejected successfully");
      setProcessingRequestId(null);
      refetchRequests();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to reject request");
      setProcessingRequestId(null);
    },
  });

  const membersList = membersData?.getCommunityMembers?.data ?? [];
  const membersTotalCount = membersData?.getCommunityMembers?.totalCount ?? 0;
  const requestsList = requestsData?.getCommunityMemberRequests?.data ?? [];
  const requestsTotalCount = requestsData?.getCommunityMemberRequests?.totalCount ?? 0;

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return membersList;
    const term = searchTerm.toLowerCase();
    return membersList.filter((m: any) => {
      const name = `${m.user?.firstName || ""} ${m.user?.lastName || ""}`.toLowerCase();
      const role = (m.role || "").toLowerCase();
      return name.includes(term) || role.includes(term);
    });
  }, [membersList, searchTerm]);

  const handleLoadMoreMembers = () =>
    fetchMoreMembers({
      variables: { offset: membersList.length },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        return {
          getCommunityMembers: {
            ...fetchMoreResult.getCommunityMembers,
            data: [...prev.getCommunityMembers.data, ...fetchMoreResult.getCommunityMembers.data],
          },
        };
      },
    });

  const handleLoadMoreRequests = () =>
    fetchMoreRequests({
      variables: { offset: requestsList.length },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        return {
          getCommunityMemberRequests: {
            ...fetchMoreResult.getCommunityMemberRequests,
            data: [
              ...prev.getCommunityMemberRequests.data,
              ...fetchMoreResult.getCommunityMemberRequests.data,
            ],
          },
        };
      },
    });

  return (
    <div className="space-y-6">
      {/* ─── Top Control Strip ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            {singularName} Members
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage membership directory, role assignments, and pending join requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs w-[160px] sm:w-[190px] bg-background"
            />
          </div>

          {/* View Mode Toggle: Grid / List */}
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "grid" | "list")}
            className="bg-muted p-0.5 rounded-lg border border-border shrink-0"
          >
            <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
              <TabsTrigger
                value="grid"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <LayoutGrid className="h-3 w-3" />
                Grid
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <ListIcon className="h-3 w-3" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchMembers();
              refetchRequests();
            }}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            title="Refresh list"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ─── Tabs Navigation ──────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="h-8 bg-muted/60 border border-border/60 rounded-lg p-0.5 gap-0.5">
          <TabsTrigger
            value="all-members"
            className="h-7 px-3 rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm text-muted-foreground data-[state=active]:text-foreground gap-1.5"
          >
            <Users className="h-3.5 w-3.5" />
            Directory
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] rounded">
              {membersTotalCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="h-7 px-3 rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm text-muted-foreground data-[state=active]:text-foreground gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Join Requests
            {requestsTotalCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] rounded bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                {requestsTotalCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ─── All Members Tab ──────────────────────────────────────────────── */}
        <TabsContent value="all-members" className="space-y-3 focus-visible:outline-none">
          {membersLoading && membersList.length === 0 ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="bg-card border border-dashed border-border/80 rounded-xl p-12 text-center text-xs text-muted-foreground">
              <Users className="h-8 w-8 mx-auto opacity-40 mb-2" />
              <p className="font-medium text-foreground">No members found</p>
              <p className="text-muted-foreground mt-0.5">
                {searchTerm
                  ? "No members matched your search query."
                  : `This ${singularName.toLowerCase()} has no active members yet.`}
              </p>
            </div>
          ) : view === "grid" ? (
            /* ─── GRID VIEW ─────────────────────────────────────────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredMembers.map((member: any) => {
                const badge = getRoleBadge(member.role);
                const fullName = `${member.user?.firstName || ""} ${member.user?.lastName || ""}`.trim();
                const initial =
                  member.user?.firstName?.charAt(0) ||
                  member.user?.lastName?.charAt(0) ||
                  "M";

                return (
                  <div
                    key={member.id || member.userId}
                    className="bg-card border border-border/80 hover:border-border rounded-xl p-3.5 shadow-sm transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserProfileHoverCard user={member.user ?? {}}>
                        <Avatar className="h-9 w-9 rounded-lg border border-border/60 shrink-0 cursor-pointer">
                          <AvatarImage src={member.user?.avatar ?? ""} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                      </UserProfileHoverCard>

                      <div className="flex flex-col min-w-0">
                        <UserProfileHoverCard user={member.user ?? {}}>
                          <span className="text-xs font-semibold text-foreground truncate hover:text-primary transition-colors cursor-pointer">
                            {fullName || "Anonymous Member"}
                          </span>
                        </UserProfileHoverCard>
                        <span className="text-[11px] text-muted-foreground truncate">
                          Joined {safeParseMemberDate(member.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0 rounded ${badge.color}`}
                      >
                        {badge.label}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuLabel className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                            Manage Member
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="gap-2 text-xs">
                              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                              Change Role
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-36 text-xs">
                              {ROLES.map((r) => (
                                <DropdownMenuItem
                                  key={r.value}
                                  disabled={member.role === r.value}
                                  className="text-xs"
                                  onSelect={() =>
                                    setPendingRoleChange({
                                      userId: member.userId,
                                      name: fullName,
                                      role: r.value,
                                      roleLabel: r.label,
                                    })
                                  }
                                >
                                  {r.label}
                                  {member.role === r.value && (
                                    <span className="ml-auto text-[10px] text-muted-foreground font-semibold">Active</span>
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive gap-2 text-xs"
                            onSelect={() =>
                              setRemovingMember({
                                userId: member.userId,
                                name: fullName,
                              })
                            }
                          >
                            <UserX className="h-3.5 w-3.5" />
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ─── LIST VIEW ─────────────────────────────────────────────── */
            <div className="border border-border/80 rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Member</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Joined Date</TableHead>
                    <TableHead className="text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member: any) => {
                    const badge = getRoleBadge(member.role);
                    const fullName = `${member.user?.firstName || ""} ${member.user?.lastName || ""}`.trim();
                    const initial =
                      member.user?.firstName?.charAt(0) ||
                      member.user?.lastName?.charAt(0) ||
                      "M";

                    return (
                      <TableRow key={member.id || member.userId}>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2.5">
                            <UserProfileHoverCard user={member.user ?? {}}>
                              <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0 cursor-pointer">
                                <AvatarImage src={member.user?.avatar ?? ""} />
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                                  {initial}
                                </AvatarFallback>
                              </Avatar>
                            </UserProfileHoverCard>
                            <UserProfileHoverCard user={member.user ?? {}}>
                              <span className="text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer truncate">
                                {fullName || "Anonymous Member"}
                              </span>
                            </UserProfileHoverCard>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0 rounded ${badge.color}`}
                          >
                            {badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground py-3">
                          {safeParseMemberDate(member.createdAt)}
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 text-xs">
                              <DropdownMenuLabel className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                Manage Member
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="gap-2 text-xs">
                                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                                  Change Role
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="w-36 text-xs">
                                  {ROLES.map((r) => (
                                    <DropdownMenuItem
                                      key={r.value}
                                      disabled={member.role === r.value}
                                      className="text-xs"
                                      onSelect={() =>
                                        setPendingRoleChange({
                                          userId: member.userId,
                                          name: fullName,
                                          role: r.value,
                                          roleLabel: r.label,
                                        })
                                      }
                                    >
                                      {r.label}
                                      {member.role === r.value && (
                                        <span className="ml-auto text-[10px] text-muted-foreground font-semibold">Active</span>
                                      )}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive gap-2 text-xs"
                                onSelect={() =>
                                  setRemovingMember({
                                    userId: member.userId,
                                    name: fullName,
                                  })
                                }
                              >
                                <UserX className="h-3.5 w-3.5" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {membersList.length < membersTotalCount && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMoreMembers}
              disabled={membersLoading}
              className="w-full h-8 text-xs text-muted-foreground border-dashed"
            >
              {membersLoading && <Loader2 className="h-3 w-3 animate-spin mr-1.5" />}
              Load More Members ({membersList.length} of {membersTotalCount})
            </Button>
          )}
        </TabsContent>

        {/* ─── Join Requests Tab ────────────────────────────────────────────── */}
        <TabsContent value="requests" className="space-y-3 focus-visible:outline-none">
          {requestsLoading && requestsList.length === 0 ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : requestsList.length === 0 ? (
            <div className="bg-card border border-dashed border-border/80 rounded-xl p-12 text-center text-xs text-muted-foreground">
              <UserPlus className="h-8 w-8 mx-auto opacity-40 mb-2" />
              <p className="font-medium text-foreground">No pending requests</p>
              <p className="text-muted-foreground mt-0.5">
                No users are currently waiting to join this {singularName.toLowerCase()}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requestsList.map((request: any) => {
                const fullName = `${request.user?.firstName || ""} ${request.user?.lastName || ""}`.trim();
                const initial =
                  request.user?.firstName?.charAt(0) ||
                  request.user?.lastName?.charAt(0) ||
                  "R";

                return (
                  <div
                    key={request.id || request.userId}
                    className="bg-card border border-border/80 rounded-xl p-3.5 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserProfileHoverCard user={request.user ?? {}}>
                        <Avatar className="h-9 w-9 rounded-lg border border-border/60 shrink-0 cursor-pointer">
                          <AvatarImage src={request.user?.avatar ?? ""} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                      </UserProfileHoverCard>

                      <div className="flex flex-col min-w-0">
                        <UserProfileHoverCard user={request.user ?? {}}>
                          <span className="text-xs font-semibold text-foreground truncate hover:text-primary transition-colors cursor-pointer">
                            {fullName || "Anonymous Applicant"}
                          </span>
                        </UserProfileHoverCard>
                        <span className="text-[11px] text-muted-foreground truncate">
                          Requested {safeParseMemberDate(request.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 px-2 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => {
                          setProcessingRequestId(request.userId);
                          doApproveRequest({
                            variables: { communityId, userId: request.userId },
                          });
                        }}
                        disabled={processingRequestId === request.userId}
                      >
                        {processingRequestId === request.userId ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs gap-1 text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={() => {
                          setProcessingRequestId(request.userId);
                          doRejectRequest({
                            variables: { communityId, userId: request.userId },
                          });
                        }}
                        disabled={processingRequestId === request.userId}
                      >
                        {processingRequestId === request.userId ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {requestsList.length < requestsTotalCount && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadMoreRequests}
              disabled={requestsLoading}
              className="w-full h-8 text-xs text-muted-foreground border-dashed"
            >
              {requestsLoading && <Loader2 className="h-3 w-3 animate-spin mr-1.5" />}
              Load More Requests ({requestsList.length} of {requestsTotalCount})
            </Button>
          )}
        </TabsContent>
      </Tabs>

      {/* ─── Remove Member Confirmation Dialog ────────────────────────────── */}
      <AlertDialog open={!!removingMember} onOpenChange={() => setRemovingMember(null)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">Remove Member</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="font-semibold text-foreground">{removingMember?.name}</strong> from this{" "}
              {singularName.toLowerCase()}? They will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-8 text-xs shadow-sm"
              onClick={() =>
                doRemove({
                  variables: { communityId, userId: removingMember?.userId },
                })
              }
              disabled={removing}
            >
              {removing && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Change Role Confirmation Dialog ──────────────────────────────── */}
      <AlertDialog open={!!pendingRoleChange} onOpenChange={() => setPendingRoleChange(null)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">Change Member Role</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to assign the role of{" "}
              <strong className="font-semibold text-foreground">{pendingRoleChange?.roleLabel}</strong> to{" "}
              <strong className="font-semibold text-foreground">{pendingRoleChange?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={roleSaving} className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-xs shadow-sm"
              onClick={() => {
                if (!pendingRoleChange) return;
                doChangeRole({
                  variables: {
                    communityId,
                    userId: pendingRoleChange.userId,
                    role: pendingRoleChange.role,
                  },
                });
              }}
              disabled={roleSaving}
            >
              {roleSaving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Confirm Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
