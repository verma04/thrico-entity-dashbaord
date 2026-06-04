"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Loader2,
  Users,
  UserPlus,
  MoreVertical,
  UserX,
  ShieldCheck,
  Check,
  X,
} from "lucide-react";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  getCommunityMembers,
  getCommunityMemberRequests,
  removeCommunityMember,
  changeCommunityMemberRole,
  approveCommunityMemberRequest,
  rejectCommunityMemberRequest,
} from "@/graphql/actions/group/members";

const ROLES = [
  { value: "ADMIN", label: "Admin", color: "bg-red-50 text-red-700 border-red-200" },
  { value: "MANAGER", label: "Manager", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "MODERATOR", label: "Moderator", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "USER", label: "Member", color: "bg-zinc-50 text-zinc-600 border-zinc-200" },
];

function getRoleBadge(role: string) {
  const found = ROLES.find((r) => r.value === role);
  return found ?? ROLES[3];
}

export default function MembersPage() {
  const params = useParams();
  const communityId = params?.id as string;
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("all-members");
  const [removingMember, setRemovingMember] = useState<{ userId: string; name: string } | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<{ userId: string; name: string; role: string; roleLabel: string } | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);

  // — Queries —
  const { data: membersData, loading: membersLoading, fetchMore: fetchMoreMembers, refetch: refetchMembers } =
    getCommunityMembers({
      variables: { communityId, limit: 10, offset: 0 },
      fetchPolicy: "cache-and-network",
      skip: activeTab !== "all-members",
    });

  const { data: requestsData, loading: requestsLoading, fetchMore: fetchMoreRequests, refetch: refetchRequests } =
    getCommunityMemberRequests({
      variables: { communityId, limit: 10, offset: 0 },
      fetchPolicy: "cache-and-network",
      skip: activeTab !== "requests",
    });

  // — Mutations —
  const [doRemove, { loading: removing }] = removeCommunityMember({
    onCompleted: () => {
      toast({ title: "Member removed successfully" });
      setRemovingMember(null);
      refetchMembers();
    },
    onError: (err: any) =>
      toast({ title: "Error removing member", description: err.message, variant: "destructive" }),
  });

  const [doChangeRole, { loading: roleSaving }] = changeCommunityMemberRole({
    onCompleted: () => {
      toast({ title: "Role updated successfully" });
      setPendingRoleChange(null);
      refetchMembers();
    },
    onError: (err: any) =>
      toast({ title: "Error updating role", description: err.message, variant: "destructive" }),
  });

  const [doApproveRequest] = approveCommunityMemberRequest({
    onCompleted: () => {
      toast({ title: "Request approved successfully" });
      setProcessingRequestId(null);
      refetchMembers();
      refetchRequests();
    },
    onError: (err: any) => {
      toast({ title: "Error approving request", description: err.message, variant: "destructive" });
      setProcessingRequestId(null);
    }
  });

  const [doRejectRequest] = rejectCommunityMemberRequest({
    onCompleted: () => {
      toast({ title: "Request rejected successfully" });
      setProcessingRequestId(null);
      refetchRequests();
    },
    onError: (err: any) => {
      toast({ title: "Error rejecting request", description: err.message, variant: "destructive" });
      setProcessingRequestId(null);
    }
  });

  const membersList = membersData?.getCommunityMembers?.data ?? [];
  const membersTotalCount = membersData?.getCommunityMembers?.totalCount ?? 0;
  const requestsList = requestsData?.getCommunityMemberRequests?.data ?? [];
  const requestsTotalCount = requestsData?.getCommunityMemberRequests?.totalCount ?? 0;

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
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground mt-1">
          Manage community members and pending join requests.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-background border border-border/40 rounded-xl p-1">
          <TabsTrigger value="all-members" className="gap-2 rounded-lg">
            <Users className="h-4 w-4" />
            All Members
            {membersTotalCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs rounded-md">
                {membersTotalCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2 rounded-lg">
            <UserPlus className="h-4 w-4" />
            Requests
            {requestsTotalCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs rounded-md bg-orange-100 text-orange-700 hover:bg-orange-100">
                {requestsTotalCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ─── ALL MEMBERS ─── */}
        <TabsContent value="all-members" className="space-y-3">
          {membersLoading && membersList.length === 0 ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : membersList.length === 0 ? (
            <Card className="border-dashed shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-2xl bg-muted/50 mb-4 ring-1 ring-border/40">
                  <Users className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="text-base font-semibold">No members found</p>
                <p className="text-sm text-muted-foreground">This community has no active members yet.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {membersList.map((member: any) => {
                const badge = getRoleBadge(member.role);
                return (
                  <Card key={member.id} className="border-none shadow-sm shadow-black/[0.02] ring-1 ring-border/40 overflow-hidden hover:ring-primary/20 transition-all rounded-xl">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-center gap-4">
                        <UserProfileHoverCard user={member.user ?? {}}>
                          <Avatar className="h-11 w-11 border border-border/50 ring-1 ring-black/[0.04] cursor-pointer">
                            <AvatarImage src={member.user?.avatar ?? ""} />
                            <AvatarFallback className="bg-primary/5 text-primary font-bold text-sm">
                              {(member.user?.firstName?.[0] ?? "") + (member.user?.lastName?.[0] ?? "")}
                            </AvatarFallback>
                          </Avatar>
                        </UserProfileHoverCard>

                        <div className="flex-1 min-w-0">
                          <UserProfileHoverCard user={member.user ?? {}}>
                            <span className="font-semibold text-sm cursor-pointer hover:underline text-foreground">
                              {member.user?.firstName} {member.user?.lastName}
                            </span>
                          </UserProfileHoverCard>
                          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                            Joined{" "}
                            {member.createdAt
                              ? format(new Date(Number(member.createdAt)), "MMM d, yyyy")
                              : "Unknown"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${badge.color}`}
                          >
                            {badge.label}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl">
                              <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              {/* Change Role submenu */}
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="gap-2 font-medium text-sm rounded-lg">
                                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                  Change Role
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="rounded-xl shadow-xl">
                                  {ROLES.map((r) => (
                                    <DropdownMenuItem
                                      key={r.value}
                                      disabled={member.role === r.value}
                                      className="font-medium text-sm rounded-lg"
                                      onSelect={() =>
                                        setPendingRoleChange({
                                          userId: member.userId,
                                          name: `${member.user?.firstName} ${member.user?.lastName}`,
                                          role: r.value,
                                          roleLabel: r.label,
                                        })
                                      }
                                    >
                                      {r.label}
                                      {member.role === r.value && (
                                        <span className="ml-auto text-xs text-muted-foreground font-semibold">Current</span>
                                      )}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700 focus:bg-red-50 gap-2 font-medium text-sm rounded-lg"
                                onSelect={() =>
                                  setRemovingMember({
                                    userId: member.userId,
                                    name: `${member.user?.firstName} ${member.user?.lastName}`,
                                  })
                                }
                              >
                                <UserX className="h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {membersList.length < membersTotalCount && (
                <Button
                  variant="outline"
                  onClick={handleLoadMoreMembers}
                  disabled={membersLoading}
                  className="w-full mt-2 h-12 rounded-xl border-dashed border-2 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground font-semibold transition-all"
                >
                  {membersLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Load More Members
                </Button>
              )}
            </>
          )}
        </TabsContent>

        {/* ─── REQUESTS ─── */}
        <TabsContent value="requests" className="space-y-3">
          {requestsLoading && requestsList.length === 0 ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : requestsList.length === 0 ? (
            <Card className="border-dashed shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-2xl bg-muted/50 mb-4 ring-1 ring-border/40">
                  <UserPlus className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="text-base font-semibold">No pending requests</p>
                <p className="text-sm text-muted-foreground">
                  No users are currently waiting to join this community.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {requestsList.map((request: any) => (
                <Card key={request.id} className="border-none shadow-sm shadow-black/[0.02] ring-1 ring-border/40 overflow-hidden hover:ring-primary/20 transition-all rounded-xl">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      <UserProfileHoverCard user={request.user ?? {}}>
                        <Avatar className="h-11 w-11 border border-border/50 ring-1 ring-black/[0.04] cursor-pointer">
                          <AvatarImage src={request.user?.avatar ?? ""} />
                          <AvatarFallback className="bg-primary/5 text-primary font-bold text-sm">
                            {(request.user?.firstName?.[0] ?? "") + (request.user?.lastName?.[0] ?? "")}
                          </AvatarFallback>
                        </Avatar>
                      </UserProfileHoverCard>

                      <div className="flex-1 min-w-0">
                        <UserProfileHoverCard user={request.user ?? {}}>
                          <span className="font-semibold text-sm cursor-pointer hover:underline text-foreground">
                            {request.user?.firstName} {request.user?.lastName}
                          </span>
                        </UserProfileHoverCard>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                          Requested{" "}
                          {request.createdAt
                            ? format(new Date(Number(request.createdAt)), "MMM d, yyyy")
                            : "Unknown"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 gap-1 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            setProcessingRequestId(request.userId);
                            doApproveRequest({
                              variables: { communityId, userId: request.userId },
                            });
                          }}
                          disabled={processingRequestId === request.userId}
                        >
                          {processingRequestId === request.userId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 rounded-lg text-red-600 border-red-200 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setProcessingRequestId(request.userId);
                            doRejectRequest({
                              variables: { communityId, userId: request.userId },
                            });
                          }}
                          disabled={processingRequestId === request.userId}
                        >
                          {processingRequestId === request.userId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {requestsList.length < requestsTotalCount && (
                <Button
                  variant="outline"
                  onClick={handleLoadMoreRequests}
                  disabled={requestsLoading}
                  className="w-full mt-2 h-12 rounded-xl border-dashed border-2 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground font-semibold transition-all"
                >
                  {requestsLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Load More Requests
                </Button>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* ─── REMOVE CONFIRM DIALOG ─── */}
      <AlertDialog open={!!removingMember} onOpenChange={() => setRemovingMember(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong className="font-semibold text-foreground">{removingMember?.name}</strong> from this
              community? They will lose all access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm"
              onClick={() =>
                doRemove({
                  variables: { communityId, userId: removingMember?.userId },
                })
              }
              disabled={removing}
            >
              {removing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── CHANGE ROLE CONFIRM DIALOG ─── */}
      <AlertDialog open={!!pendingRoleChange} onOpenChange={() => setPendingRoleChange(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Change Member Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change{" "}
              <strong className="font-semibold text-foreground">{pendingRoleChange?.name}</strong>'s role
              to{" "}
              <strong className="font-semibold text-foreground">{pendingRoleChange?.roleLabel}</strong>?
              This will update their permissions in the community immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={roleSaving} className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl shadow-sm"
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
              {roleSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirm Change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
