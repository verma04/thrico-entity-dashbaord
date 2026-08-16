"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast as sonnerToast } from "sonner";
import {
  MoreHorizontal,
  UserPlus,
  ShieldCheck,
  Lock,
  UserCog,
  PowerOff,
  Power,
  RefreshCw,
  Users,
  Upload,
} from "lucide-react";
import AddUserDialog from "./add-user-dialog";
import ManagePermissionsDialog from "./manage-permissions-dialog";
import {
  useGetAdminUsers,
  useUpdateAdminUser,
  AdminUser,
} from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  AdminTable,
  AdminStatusBadge,
} from "@/components/shared/admin-table/admin-table";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { CtaButton } from "@/components/ui/cta-button";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Status", dot: "" },
  { value: "active", label: "Active", dot: "bg-emerald-500" },
  { value: "inactive", label: "Inactive", dot: "bg-zinc-400" },
];

export default function UsersTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const statusFilter = searchParams.get("status") || "ALL";
  const setStatusFilter = (v: string) =>
    updateParams({ status: v === "ALL" ? null : v });

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const { data, loading, error, refetch } = useGetAdminUsers();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [updateUser, { loading: updatingStatus }] = useUpdateAdminUser({
    onCompleted: (data: any) => {
      toast({
        title: "Status updated",
        description: `User is now ${data.updateAdminUser.status}.`,
      });
      refetch();
    },
    onError: (err: any) => {
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const users = data?.getAdminUsers?.data || [];

  const filteredUsers = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return users.filter((u) => {
      const matchesSearch =
        !q ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        u.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [users, debouncedSearch, statusFilter]);

  const handleManagePermissions = (user: AdminUser) => {
    setSelectedUser(user);
    setShowPermissionsDialog(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowAddDialog(true);
  };

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    updateUser({ variables: { adminId: id, input: { status: newStatus } } });
  };

  const columns = [
    {
      key: "user",
      header: "Member",
      cell: (user: AdminUser) => {
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage
                src={
                  user.avatar
                    ? `https://cdn.thrico.network/${user.avatar}`
                    : undefined
                }
              />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-foreground">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      header: "Role",
      cell: (user: AdminUser) => {
        return (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {user.role?.name || "Member"}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (user: AdminUser) => {
        const isActive = user.status === "active";
        return (
          <AdminStatusBadge
            status={user.status}
            variant={isActive ? "success" : "neutral"}
          />
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (user: AdminUser) => {
        const isActive = user.status === "active";
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleManagePermissions(user)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Manage Permissions
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(user.id, user.status)}
                  className={
                    isActive
                      ? "text-rose-600 focus:text-rose-600"
                      : "text-emerald-600 focus:text-emerald-600"
                  }
                >
                  {isActive ? (
                    <>
                      <PowerOff className="h-4 w-4 mr-2" />
                      Deactivate User
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 mr-2" />
                      Activate User
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Members"
        description="Manage team members and their status."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Members" },
        ]}
        icon={Users}
        badgeText="Access & RBAC"
        showLiveIndicator={false}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch?.()}
              className="h-9 w-9 rounded-lg border-border text-muted-foreground hover:text-foreground transition-all"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loading && "animate-spin")}
              />
            </Button>
            <CtaButton onClick={() => router.push("/settings/users/create")}>
              <UserPlus className="h-3.5 w-3.5" />
              Add Member
            </CtaButton>
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search members by name or email…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              placeholder="Status"
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
                dot: opt.dot || undefined,
              }))}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredUsers.length > 0}>
            Showing {filteredUsers.length} of {users.length} Members
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-5">
          <AdminTable
            columns={columns}
            data={filteredUsers}
            loading={loading}
            keyExtractor={(u) => u.id}
            emptyTitle="No members found"
            emptyDescription="No team members match your current search and filters."
          />
        </div>
      </EcosystemContainer>

      <AddUserDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) setSelectedUser(null);
        }}
        user={selectedUser}
      />
      {selectedUser && (
        <ManagePermissionsDialog
          open={showPermissionsDialog}
          onOpenChange={setShowPermissionsDialog}
          user={selectedUser}
        />
      )}

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="team members"
        description="Export admin users and team members as CSV. Includes names, emails, roles, and status."
        totalCount={users.length}
        matchingCount={debouncedSearch.trim() || statusFilter !== "ALL" ? filteredUsers.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredUsers;
          if (rows.length === 0) {
            sonnerToast.error("Nothing to export", { description: "No members found." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "First Name", getValue: (u) => u.firstName || "" },
            { header: "Last Name", getValue: (u) => u.lastName || "" },
            { header: "Email", getValue: (u) => u.email || "" },
            { header: "Role", getValue: (u) => u.role?.name || u.role || "Member" },
            { header: "Status", getValue: (u) => u.status || "active" },
          ]);
          downloadCsv(csv, `members-${new Date().toISOString().slice(0, 10)}`, format);
          sonnerToast.success("Export ready", { description: `${rows.length} member${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
