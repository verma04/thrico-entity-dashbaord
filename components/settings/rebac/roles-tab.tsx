"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { AppDataTable } from "@/components/ui/app-data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Edit2,
  Trash2,
  ShieldAlert,
  Lock,
} from "lucide-react";
import AddRoleDialog from "./add-role-dialog";
import { ModuleIcon } from "./module-icon";
import { useGetRoles, useDeleteRole } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";

export default function RolesTab() {
  const { toast } = useToast();
  const { data, loading } = useGetRoles();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const [deleteRole] = useDeleteRole({
    onCompleted: () => {
      toast({ title: "Role deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const roles = data?.getRoles || [];

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

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original;
          return (
            <div className="py-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{role.name}</p>
                {role.isSystem && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted border border-border/60 px-1.5 py-0.5 rounded-md leading-none">
                    <Lock className="w-2.5 h-2.5" />
                    System
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                {role.description || "No description"}
              </p>
            </div>
          );
        },
      },
      {
        id: "modules",
        header: "Modules",
        cell: ({ row }) => {
          const role = row.original;
          const perms = role.modulePermissions || [];
          if (!perms.length) {
            return <span className="text-xs text-muted-foreground">None</span>;
          }
          const visible = perms.slice(0, 4);
          const remaining = perms.length - 4;
          return (
            <div className="flex flex-wrap items-center gap-1">
              {visible.map((perm: any) => (
                <span
                  key={perm.id}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 border border-border/40 px-1.5 py-0.5 rounded-md"
                >
                  <ModuleIcon name={perm.module} className="w-3 h-3" />
                  {perm.module}
                </span>
              ))}
              {remaining > 0 && (
                <span className="text-[11px] text-muted-foreground font-medium">
                  +{remaining} more
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: "adminAccess",
        header: "Admin Access",
        cell: ({ row }) => {
          const role = row.original;
          const hasAdminAccess = Object.values(role.adminAccess || {}).some((v) => v === true);
          const moduleCount = role.modulePermissions?.length || 0;
          return (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">
                {moduleCount} module{moduleCount !== 1 ? "s" : ""} enabled
              </span>
              {hasAdminAccess && (
                <div className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md w-fit">
                  <ShieldAlert className="w-3 h-3" />
                  Admin scopes
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const isSystem = row.original.isSystem;
          return (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border w-fit",
                isSystem
                  ? "text-muted-foreground bg-muted/40 border-border/40"
                  : "text-emerald-700 bg-emerald-50 border-emerald-200/60"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  isSystem ? "bg-muted-foreground/40" : "bg-emerald-500"
                )}
              />
              Active
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const role = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onClick={() => handleEditRole(role)}
                    className="gap-2 text-sm"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                    Edit role
                  </DropdownMenuItem>
                  {!role.isSystem && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteRole(role)}
                        className="gap-2 text-sm text-destructive focus:text-destructive focus:bg-destructive/5"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete role
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-4 pt-4">
      <AppDataTable
        columns={columns}
        data={roles}
        isLoading={loading}
        searchableColumns={[{ id: "name", placeholder: "Search roles..." }]}
        isShowExportButtons={true}
        customButtons={
          <Button
            onClick={() => {
              setSelectedRole(null);
              setShowAddDialog(true);
            }}
            size="sm"
            className="gap-2 h-9 px-4 font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Create role
          </Button>
        }
      />

      <AddRoleDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        role={selectedRole}
      />
    </div>
  );
}
