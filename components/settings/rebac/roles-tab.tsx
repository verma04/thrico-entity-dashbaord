"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type {
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast as sonnerToast } from "sonner";
import {
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
  Lock,
  RefreshCw,
  Fingerprint,
  ShieldCheck,
  ShieldX,
  Upload,
  Loader2,
  Users,
  AlertTriangle,
  Crown,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddRoleDialog from "./add-role-dialog";
import { useGetRoles, useDeleteRole } from "@/graphql/actions";
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

const ROLE_TYPE_OPTIONS = [
  { value: "ALL", label: "All Roles", dot: "" },
  { value: "SYSTEM", label: "System Roles", dot: "bg-emerald-500" },
  { value: "CUSTOM", label: "Custom Roles", dot: "bg-indigo-500" },
];

export default function RolesTab() {
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

  const typeFilter = searchParams.get("type") || "ALL";
  const setTypeFilter = (v: string) =>
    updateParams({ type: v === "ALL" ? null : v });

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  // Sync debounced search to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const { data, loading, refetch } = useGetRoles();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [deleteRole, { loading: deleting }] = useDeleteRole({
    onCompleted: () => {
      sonnerToast.success("Role deleted", {
        description: `The role "${roleToDelete?.name || "Selected"}" has been deleted.`,
      });
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
      refetch();
    },
    onError: (err: any) => {
      sonnerToast.error("Failed to delete role", {
        description: err.message,
      });
    },
  });

  const roles = data?.getRoles || [];

  const filteredRoles = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return roles.filter((r) => {
      const matchesSearch =
        !q ||
        r.name?.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q));

      const matchesType =
        typeFilter === "ALL" ||
        (typeFilter === "SYSTEM" ? r.isSystem : !r.isSystem);

      return matchesSearch && matchesType;
    });
  }, [roles, debouncedSearch, typeFilter]);

  const handleEditRole = (role: any) => {
    router.push(`/settings/users/roles/${role.id}`);
  };

  const handleDeleteRole = (role: any) => {
    if (role.isSystem) {
      sonnerToast.error("Protected role", {
        description: "System roles cannot be deleted.",
      });
      return;
    }
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete?.id) return;
    await deleteRole({ variables: { id: roleToDelete.id } });
  };

  const columns = [
    {
      key: "role",
      header: "Role",
      cell: (role: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
            <Fingerprint className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleEditRole(role)}
                className="text-sm font-semibold text-foreground hover:text-primary hover:underline text-left cursor-pointer transition-colors"
              >
                {role.name}
              </button>
              {role.isSystem && (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 px-1.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  System
                </span>
              )}
              {role.isAdmin && (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 px-1.5 py-0.5 rounded-md">
                  <Crown className="w-2.5 h-2.5" />
                  Admin
                </span>
              )}
            </div>
            {role.description && (
              <span className="text-[11px] text-muted-foreground truncate max-w-sm">
                {role.description}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "users",
      header: "Assigned Users",
      cell: (role: any) => {
        const count = role.usersCount ?? role.userCount ?? 0;
        return (
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span
              className={cn(
                "font-medium",
                count > 0
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground",
              )}
            >
              {count} {count === 1 ? "user" : "users"}
            </span>
          </div>
        );
      },
    },
    {
      key: "permissions",
      header: "Permissions",
      cell: (role: any) => {
        const perms = role.modulePermissions || [];
        const count = perms.reduce(
          (acc: number, p: any) =>
            acc +
            [p.canCreate, p.canRead, p.canEdit, p.canDelete].filter(Boolean)
              .length,
          0,
        );
        return (
          <span className="text-xs font-medium text-muted-foreground">
            {perms.length} modules ({count} actions)
          </span>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      cell: (role: any) => (
        <AdminStatusBadge
          status={role.isSystem ? "SYSTEM" : "CUSTOM"}
          variant={role.isSystem ? "neutral" : "success"}
        >
          {role.isSystem ? "System" : "Custom"}
        </AdminStatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (role: any) => (
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleEditRole(role)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Role
              </DropdownMenuItem>
              {!role.isSystem && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteRole(role)}
                    className="text-rose-600 focus:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Role
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Roles & Permissions"
        description="Manage workspace roles and their access levels."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Roles & Permissions" },
        ]}
        icon={ShieldCheck}
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
            <CtaButton
              onClick={() => router.push("/settings/users/roles/create")}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Role
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
              placeholder="Search roles by name or description…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Select
              value={typeFilter}
              onValueChange={setTypeFilter}
              placeholder="Role Type"
              options={ROLE_TYPE_OPTIONS.map((opt) => ({
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
          <EcosystemActionBar.Status active={filteredRoles.length > 0}>
            Showing {filteredRoles.length} of {roles.length} Roles
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-5">
          <AdminTable
            columns={columns}
            data={filteredRoles}
            loading={loading}
            keyExtractor={(r) => r.id}
            emptyTitle="No roles found"
            emptyDescription="Create your first role to start managing permissions."
          />
        </div>
      </EcosystemContainer>

      <AddRoleDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        role={selectedRole}
      />

      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="roles"
        description="Export workspace roles and access levels as CSV. Includes role names, descriptions, permissions, and system status."
        totalCount={roles.length}
        matchingCount={
          debouncedSearch.trim() || typeFilter !== "ALL"
            ? filteredRoles.length
            : undefined
        }
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredRoles;
          if (rows.length === 0) {
            sonnerToast.error("Nothing to export", {
              description: "No roles found.",
            });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Role Name", getValue: (r) => r.name || "" },
            { header: "Description", getValue: (r) => r.description || "" },
            {
              header: "Type",
              getValue: (r) => (r.isSystem ? "System" : "Custom"),
            },
            {
              header: "Assigned Users",
              getValue: (r) => r.usersCount ?? r.userCount ?? 0,
            },
            {
              header: "Modules Count",
              getValue: (r) => (r.modulePermissions || []).length,
            },
          ]);
          downloadCsv(
            csv,
            `roles-${new Date().toISOString().slice(0, 10)}`,
            format,
          );
          sonnerToast.success("Export ready", {
            description: `${rows.length} role${rows.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />

      <AlertDialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setIsDeleteModalOpen(false);
            setRoleToDelete(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-md p-6 rounded-2xl border border-border/60 bg-background shadow-xl">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <AlertDialogTitle className="text-base font-semibold text-foreground">
                  Delete Role
                </AlertDialogTitle>
                <p className="text-xs text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pt-1 space-y-3">
              <div>
                Are you sure you want to permanently delete the role{" "}
                <span className="font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded-md border border-border/60">
                  {roleToDelete?.name}
                </span>
                ?
              </div>

              {(() => {
                const affectedCount =
                  roleToDelete?.usersCount ?? roleToDelete?.userCount ?? 0;
                if (affectedCount > 0) {
                  return (
                    <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-left space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-xs">
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>
                          {affectedCount}{" "}
                          {affectedCount === 1 ? "User" : "Users"} Currently
                          Assigned
                        </span>
                      </div>
                      <p className="text-[11.5px] text-amber-700 dark:text-amber-400/90 leading-normal pl-6">
                        There{" "}
                        {affectedCount === 1
                          ? "is currently 1 user"
                          : `are currently ${affectedCount} users`}{" "}
                        assigned to this role. Deleting this role will
                        immediately revoke their access permissions.
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50 flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>No users are currently assigned to this role.</span>
                  </div>
                );
              })()}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5 gap-2 sm:gap-2">
            <AlertDialogCancel
              disabled={deleting}
              onClick={() => {
                setIsDeleteModalOpen(false);
                setRoleToDelete(null);
              }}
              className="h-9 px-4 text-xs font-medium rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={handleConfirmDelete}
              className="h-9 px-4 text-xs font-medium gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Role"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
}
