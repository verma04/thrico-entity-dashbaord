"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
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
  Mail,
  SlidersHorizontal,
  Plus,
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
  AdminTableItem,
  AdminTableText,
  AdminTableDate,
  AdminTableColumn,
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

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      serial: true,
      member: true,
      contact: true,
      role: true,
      status: true,
      joined: true,
      actions: true,
    },
  );

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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

      const userStatus =
        typeof u.status === "string"
          ? u.status
          : typeof u.status === "boolean"
            ? u.status
              ? "active"
              : "inactive"
            : "";

      const matchesStatus =
        statusFilter === "ALL" ||
        userStatus.toLowerCase() === statusFilter.toLowerCase();

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

  const handleUpdateStatus = (id: string, currentStatus: any) => {
    const isCurrentlyActive =
      typeof currentStatus === "string"
        ? currentStatus.toLowerCase() === "active"
        : Boolean(currentStatus);
    const newStatus = isCurrentlyActive ? "inactive" : "active";
    updateUser({ variables: { adminId: id, input: { status: newStatus } } });
  };

  // ── Column definitions (matching members/all pattern) ──────────────────
  const columns: AdminTableColumn<AdminUser>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-10 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_: AdminUser, index: number) => index + 1,
    },
    {
      key: "member",
      header: "Member",
      cell: (user: AdminUser) => (
        <AdminTableItem
          avatar={user.avatar}
          title={`${user.firstName || ""} ${user.lastName || ""}`}
          subtitle={user.email || "Team Member"}
          fallbackText={`${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`}
          onClick={() => {}}
        />
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (user: AdminUser) => (
        <AdminTableText primary={user.email || "—"} icon={Mail} />
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user: AdminUser) => (
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
          <span className="text-[12px] font-semibold text-foreground">
            {user.role?.name || "Member"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (user: AdminUser) => {
        const isActive =
          typeof user.status === "string"
            ? user.status.toLowerCase() === "active"
            : Boolean(user.status);
        return (
          <AdminStatusBadge
            status={user.status}
            variant={isActive ? "success" : "neutral"}
          />
        );
      },
    },
    {
      key: "joined",
      header: "Joined",
      cell: (user: AdminUser) => (
        <AdminTableDate date={(user as any).createdAt} />
      ),
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-10 text-right",
      className: "text-right",
      isFixedRight: true,
      cell: (user: AdminUser) => {
        const isActive =
          typeof user.status === "string"
            ? user.status.toLowerCase() === "active"
            : Boolean(user.status);
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
                <DropdownMenuItem onClick={() => handleManagePermissions(user)}>
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

  const activeColumns = useMemo(() => {
    return columns.filter((col) => visibleColumns[col.key] !== false);
  }, [visibleColumns]);

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Members"
        badgeText="Access & RBAC"
        description={
          loading
            ? "Loading members…"
            : `${users.length} total members in your team.`
        }
        icon={Users}
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Members" },
        ]}
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
              <Plus className="h-3.5 w-3.5" />
              Add Role
            </CtaButton>
          </div>
        }
      />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name or email…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Primary filters */}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                Toggle Columns
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns
                .filter((c) => c.key !== "actions")
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns[col.key] !== false}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="text-xs font-medium cursor-pointer"
                  >
                    {col.header || col.key}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>

          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Status active={filteredUsers.length > 0}>
            Showing {filteredUsers.length} of {users.length} Members
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-3">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="h-10 border-b border-border bg-muted/30 px-5 flex items-center gap-4">
                  {[120, 180, 100, 80, 80, 90].map((w, i) => (
                    <Skeleton
                      key={i}
                      className="h-2.5 rounded"
                      style={{ width: w }}
                    />
                  ))}
                </div>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-3 border-b border-border/40 last:border-0"
                  >
                    <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3 w-32 rounded" />
                      <Skeleton className="h-2.5 w-20 rounded" />
                    </div>
                    <Skeleton className="h-3 w-40 rounded hidden sm:block" />
                    <Skeleton className="h-3 w-20 rounded hidden md:block" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md hidden lg:block" />
                    <Skeleton className="h-3 w-20 rounded hidden lg:block" />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <AdminTable<AdminUser>
                columns={activeColumns}
                data={filteredUsers}
                keyExtractor={(u) => u.id}
                emptyIcon={Users}
                emptyTitle="No members found"
                emptyDescription="No team members match your current search and filters."
                pageSize={100}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
        matchingCount={
          debouncedSearch.trim() || statusFilter !== "ALL"
            ? filteredUsers.length
            : undefined
        }
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredUsers;
          if (rows.length === 0) {
            sonnerToast.error("Nothing to export", {
              description: "No members found.",
            });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "First Name", getValue: (u) => u.firstName || "" },
            { header: "Last Name", getValue: (u) => u.lastName || "" },
            { header: "Email", getValue: (u) => u.email || "" },
            {
              header: "Role",
              getValue: (u) =>
                (typeof u.role === "object" ? u.role?.name : u.role) ||
                "Member",
            },
            {
              header: "Status",
              getValue: (u) =>
                typeof u.status === "string"
                  ? u.status
                  : u.status
                    ? "active"
                    : "inactive",
            },
          ]);
          downloadCsv(
            csv,
            `members-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          sonnerToast.success("Export ready", {
            description: `${rows.length} member${rows.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
}
