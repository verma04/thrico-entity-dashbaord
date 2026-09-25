"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  RotateCcw,
  LayoutGrid,
  List as ListIcon,
  Upload,
  ShieldAlert,
  Crown,
  UserCheck,
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
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    value: "ADMIN",
    label: "Admin",
    color: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800",
  },
  {
    value: "MANAGER",
    label: "Manager",
    color: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  {
    value: "MODERATOR",
    label: "Moderator",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  {
    value: "USER",
    label: "Member",
    color: "bg-muted text-muted-foreground border-border/80",
  },
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

export default function CommunityMembersPage() {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const params = useParams();
  const communityId = params?.id as string;

  const [activeTab, setActiveTab] = useState("all-members");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [view, setView] = useState<"grid" | "list">("list");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [removingMember, setRemovingMember] = useState<{
    userId: string;
    name: string;
  } | null>(null);
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    userId: string;
    name: string;
    role: string;
    roleLabel: string;
  } | null>(null);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null
  );

  // Queries
  const {
    data: membersData,
    loading: membersLoading,
    fetchMore: fetchMoreMembers,
    refetch: refetchMembers,
  } = getCommunityMembers({
    variables: { communityId, limit: 30, offset: 0 },
    fetchPolicy: "cache-and-network",
    skip: !communityId,
  });

  const {
    data: requestsData,
    loading: requestsLoading,
    fetchMore: fetchMoreRequests,
    refetch: refetchRequests,
  } = getCommunityMemberRequests({
    variables: { communityId, limit: 30, offset: 0 },
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
    onError: (err: any) => toast.error(err.message || "Failed to update role"),
  });

  const [doApproveRequest] = approveCommunityMemberRequest({
    onCompleted: () => {
      toast.success("Join request approved");
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
      toast.success("Join request rejected");
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
  const requestsList =
    requestsData?.getCommunityMemberRequests?.data ?? [];
  const requestsTotalCount =
    requestsData?.getCommunityMemberRequests?.totalCount ?? 0;

  // Role Breakdown Stats
  const adminCount = useMemo(() => {
    return membersList.filter(
      (m: any) => m.role === "ADMIN" || m.role === "MANAGER"
    ).length;
  }, [membersList]);

  const modCount = useMemo(() => {
    return membersList.filter((m: any) => m.role === "MODERATOR").length;
  }, [membersList]);

  const filteredMembers = useMemo(() => {
    return membersList.filter((m: any) => {
      // 1. Search Query
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const name = `${m.user?.firstName || ""} ${m.user?.lastName || ""}`.toLowerCase();
        const role = (m.role || "").toLowerCase();
        const email = (m.user?.email || "").toLowerCase();
        if (!name.includes(term) && !role.includes(term) && !email.includes(term)) {
          return false;
        }
      }

      // 2. Role Filter
      if (roleFilter !== "ALL") {
        if ((m.role || "").toUpperCase() !== roleFilter.toUpperCase()) {
          return false;
        }
      }

      return true;
    });
  }, [membersList, searchTerm, roleFilter]);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchMembers(), refetchRequests()]);
      toast.success("Members directory refreshed");
    } catch {
      toast.error("Failed to refresh members data");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleExportMembers = () => {
    if (membersList.length === 0) {
      toast.error("No members available to export");
      return;
    }

    const rowsToExport = filteredMembers.length > 0 ? filteredMembers : membersList;

    const csv = buildCsv(rowsToExport, [
      {
        header: "User ID",
        getValue: (m: any) => m.userId || m.user?.id || "",
      },
      {
        header: "First Name",
        getValue: (m: any) => m.user?.firstName || "",
      },
      {
        header: "Last Name",
        getValue: (m: any) => m.user?.lastName || "",
      },
      {
        header: "Email",
        getValue: (m: any) => m.user?.email || "",
      },
      {
        header: "Role",
        getValue: (m: any) => m.role || "USER",
      },
      {
        header: "Joined Date",
        getValue: (m: any) => safeParseMemberDate(m.createdAt),
      },
    ]);

    downloadCsv(csv, `community-members-${moment().format("YYYY-MM-DD")}`);
    toast.success(`Exported ${rowsToExport.length} members successfully`);
  };

  const handleLoadMoreMembers = () =>
    fetchMoreMembers({
      variables: { offset: membersList.length },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        return {
          getCommunityMembers: {
            ...fetchMoreResult.getCommunityMembers,
            data: [
              ...prev.getCommunityMembers.data,
              ...fetchMoreResult.getCommunityMembers.data,
            ],
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top KPI Telemetry Scorecards ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Roster
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/50 rounded">
              Active
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {membersTotalCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              enrolled
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            Verified community members
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Leadership
            </span>
            <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold px-1.5 py-0.2 bg-red-50 dark:bg-red-950/50 rounded">
              Admins
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {adminCount}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              hosts
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            Admins &amp; Community Managers
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Moderators
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950/50 rounded">
              Safety
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {modCount}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              mods
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            Feed &amp; discussion supervisors
          </p>
        </div>

        <div
          onClick={() => setActiveTab("requests")}
          className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-amber-600 transition-colors">
              Join Requests
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/50 rounded">
              Pending
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {requestsTotalCount}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              awaiting
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            {requestsTotalCount > 0
              ? "Requires administrator review"
              : "All applicant requests cleared"}
          </p>
        </div>
      </div>

      {/* ── Main Tab Navigation & Filter Bar ────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Subheader action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border/60 rounded-xl p-3 shadow-2xs">
          <TabsList className="h-8 bg-muted/60 border border-border/60 rounded-lg p-0.5 gap-1 shrink-0">
            <TabsTrigger
              value="all-members"
              className="h-7 px-3 rounded-md text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-2xs text-muted-foreground data-[state=active]:text-foreground gap-1.5 cursor-pointer"
            >
              <Users className="h-3.5 w-3.5 text-blue-500" />
              Member Directory
              <Badge
                variant="secondary"
                className="ml-1 px-1.5 py-0 text-[10px] rounded font-semibold"
              >
                {membersTotalCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="h-7 px-3 rounded-md text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-2xs text-muted-foreground data-[state=active]:text-foreground gap-1.5 cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5 text-amber-500" />
              Join Requests
              {requestsTotalCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 px-1.5 py-0 text-[10px] rounded bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 font-semibold"
                >
                  {requestsTotalCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Search, Filter, View Toggles & Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {activeTab === "all-members" && (
              <>
                <div className="relative min-w-[160px] sm:min-w-[200px]">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, role, email…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 pl-8 pr-3 text-xs rounded-lg bg-background border-border/60 shadow-2xs"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-[10px]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-8 w-[120px] text-xs rounded-lg bg-background border-border/60 shadow-2xs">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                    <SelectItem value="USER">Member</SelectItem>
                  </SelectContent>
                </Select>

                <Tabs
                  value={view}
                  onValueChange={(v) => setView(v as "grid" | "list")}
                  className="bg-muted/70 p-0.5 rounded-lg border border-border/60 shrink-0"
                >
                  <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
                    <TabsTrigger
                      value="grid"
                      className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground text-xs font-medium gap-1"
                    >
                      <LayoutGrid className="h-3 w-3" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-2xs data-[state=active]:text-foreground text-muted-foreground text-xs font-medium gap-1"
                    >
                      <ListIcon className="h-3 w-3" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="h-8 w-8 rounded-lg border-border/60 text-muted-foreground hover:text-foreground shadow-2xs"
              title="Refresh roster"
            >
              <RotateCcw
                className={cn(
                  "h-3.5 w-3.5",
                  isRefreshing && "animate-spin text-primary"
                )}
              />
            </Button>

            {activeTab === "all-members" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportMembers}
                className="h-8 text-xs font-medium gap-1.5 border-border/60 rounded-lg shadow-2xs hover:bg-muted/60"
              >
                <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            )}
          </div>
        </div>

        {/* ── Directory Tab ────────────────────────────────────────────────── */}
        <TabsContent
          value="all-members"
          className="space-y-3 focus-visible:outline-none"
        >
          {membersLoading && membersList.length === 0 ? (
            <div className="flex justify-center p-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="bg-card border border-dashed border-border/80 rounded-xl p-16 text-center text-xs text-muted-foreground shadow-2xs space-y-2">
              <Users className="h-10 w-10 mx-auto opacity-30 text-muted-foreground" />
              <p className="font-semibold text-foreground text-sm">
                No members found
              </p>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {searchTerm || roleFilter !== "ALL"
                  ? "No community members match your current filter and search criteria."
                  : `This ${singularName.toLowerCase()} currently has no registered members.`}
              </p>
              {(searchTerm || roleFilter !== "ALL") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("ALL");
                  }}
                  className="mt-2 h-7 text-xs font-semibold"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : view === "grid" ? (
            /* ── GRID VIEW ───────────────────────────────────────────────── */
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
                    className="bg-card border border-border/60 hover:border-border rounded-xl p-4 shadow-2xs transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserProfileHoverCard user={member.user ?? {}}>
                        <Avatar className="h-10 w-10 rounded-xl border border-border/60 shrink-0 cursor-pointer shadow-xs">
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
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded",
                          badge.color
                        )}
                      >
                        {badge.label}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                          >
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
                                    <span className="ml-auto text-[10px] text-muted-foreground font-semibold">
                                      Active
                                    </span>
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
            /* ── LIST VIEW (TABLE) ───────────────────────────────────────── */
            <div className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-2xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/60">
                    <TableHead className="text-xs font-semibold py-3">Member</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Role</TableHead>
                    <TableHead className="text-xs font-semibold py-3">Joined Date</TableHead>
                    <TableHead className="text-right text-xs font-semibold py-3 pr-4">Actions</TableHead>
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
                      <TableRow
                        key={member.id || member.userId}
                        className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <UserProfileHoverCard user={member.user ?? {}}>
                              <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0 cursor-pointer shadow-xs">
                                <AvatarImage src={member.user?.avatar ?? ""} />
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                                  {initial}
                                </AvatarFallback>
                              </Avatar>
                            </UserProfileHoverCard>
                            <div className="flex flex-col min-w-0">
                              <UserProfileHoverCard user={member.user ?? {}}>
                                <span className="text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer truncate">
                                  {fullName || "Anonymous Member"}
                                </span>
                              </UserProfileHoverCard>
                              {member.user?.email && (
                                <span className="text-[11px] text-muted-foreground truncate">
                                  {member.user.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded",
                              badge.color
                            )}
                          >
                            {badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground py-3 tabular-nums">
                          {safeParseMemberDate(member.createdAt)}
                        </TableCell>
                        <TableCell className="text-right py-3 pr-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                              >
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
                                        <span className="ml-auto text-[10px] text-muted-foreground font-semibold">
                                          Active
                                        </span>
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
              className="w-full h-8 text-xs text-muted-foreground border-dashed rounded-lg"
            >
              {membersLoading && <Loader2 className="h-3 w-3 animate-spin mr-1.5" />}
              Load More Members ({membersList.length} of {membersTotalCount})
            </Button>
          )}
        </TabsContent>

        {/* ── Join Requests Tab ────────────────────────────────────────────── */}
        <TabsContent
          value="requests"
          className="space-y-3 focus-visible:outline-none"
        >
          {requestsLoading && requestsList.length === 0 ? (
            <div className="flex justify-center p-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : requestsList.length === 0 ? (
            <div className="bg-card border border-dashed border-border/80 rounded-xl p-16 text-center text-xs text-muted-foreground shadow-2xs space-y-2">
              <UserCheck className="h-10 w-10 mx-auto opacity-30 text-emerald-500" />
              <p className="font-semibold text-foreground text-sm">
                No pending requests
              </p>
              <p className="text-muted-foreground max-w-sm mx-auto">
                No users are currently waiting for admission into this{" "}
                {singularName.toLowerCase()}.
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
                    className="bg-card border border-border/60 rounded-xl p-4 shadow-2xs flex items-center justify-between gap-3 hover:border-border transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserProfileHoverCard user={request.user ?? {}}>
                        <Avatar className="h-10 w-10 rounded-xl border border-border/60 shrink-0 cursor-pointer shadow-xs">
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
                        className="h-7 px-2.5 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs font-semibold cursor-pointer"
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
                        className="h-7 px-2.5 text-xs gap-1 text-destructive hover:bg-destructive/10 border-destructive/30 rounded-lg font-semibold cursor-pointer"
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
              className="w-full h-8 text-xs text-muted-foreground border-dashed rounded-lg"
            >
              {requestsLoading && (
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
              )}
              Load More Requests ({requestsList.length} of {requestsTotalCount})
            </Button>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Remove Member Confirmation Dialog ────────────────────────────── */}
      <AlertDialog
        open={!!removingMember}
        onOpenChange={() => setRemovingMember(null)}
      >
        <AlertDialogContent className="sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">
              Remove Member
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to remove{" "}
              <strong className="font-semibold text-foreground">
                {removingMember?.name}
              </strong>{" "}
              from this {singularName.toLowerCase()}? Their membership and permissions will be revoked immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="h-8 text-xs rounded-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-8 text-xs shadow-2xs rounded-lg"
              onClick={() =>
                doRemove({
                  variables: { communityId, userId: removingMember?.userId },
                })
              }
              disabled={removing}
            >
              {removing && (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              )}
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Change Role Confirmation Dialog ──────────────────────────────── */}
      <AlertDialog
        open={!!pendingRoleChange}
        onOpenChange={() => setPendingRoleChange(null)}
      >
        <AlertDialogContent className="sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">
              Change Member Role
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to assign the role of{" "}
              <strong className="font-semibold text-foreground">
                {pendingRoleChange?.roleLabel}
              </strong>{" "}
              to{" "}
              <strong className="font-semibold text-foreground">
                {pendingRoleChange?.name}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              disabled={roleSaving}
              className="h-8 text-xs rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-xs shadow-2xs rounded-lg bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
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
              {roleSaving && (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              )}
              Confirm Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
