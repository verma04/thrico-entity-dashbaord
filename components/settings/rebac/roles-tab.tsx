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
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
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
} from "lucide-react";
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

  const [deleteRole] = useDeleteRole({
    onCompleted: () => {
      toast({ title: "Role deleted" });
      refetch();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
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
    setSelectedRole(role);
    setShowAddDialog(true);
  };

  const handleDeleteRole = (role: any) => {
    if (role.isSystem) {
      toast({
        title: "Protected role",
        description: "System roles cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    if (confirm(`Delete the role "${role.name}"? This cannot be undone.`)) {
      deleteRole({ variables: { id: role.id } });
    }
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
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {role.name}
              </span>
              {role.isSystem && (
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  System
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
      key: "permissions",
      header: "Permissions",
      cell: (role: any) => {
        const perms = role.modulePermissions || [];
        const count = perms.reduce(
          (acc: number, p: any) =>
            acc +
            [p.canCreate, p.canRead, p.canUpdate, p.canDelete].filter(Boolean)
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
            <CtaButton onClick={() => router.push("/settings/users/roles/create")}>
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
        matchingCount={debouncedSearch.trim() || typeFilter !== "ALL" ? filteredRoles.length : undefined}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          const rows = filteredRoles;
          if (rows.length === 0) {
            sonnerToast.error("Nothing to export", { description: "No roles found." });
            return;
          }
          const csv = buildCsv(rows, [
            { header: "Role Name", getValue: (r) => r.name || "" },
            { header: "Description", getValue: (r) => r.description || "" },
            { header: "Type", getValue: (r) => r.isSystem ? "System" : "Custom" },
            { header: "Modules Count", getValue: (r) => (r.modulePermissions || []).length },
          ]);
          downloadCsv(csv, `roles-${new Date().toISOString().slice(0, 10)}`, format);
          sonnerToast.success("Export ready", { description: `${rows.length} role${rows.length !== 1 ? "s" : ""} exported.` });
        }}
      />
    </EcosystemWrapper>
  );
}
