"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppDataTable } from "@/components/ui/app-data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Plus,
  Shield,
  Edit,
  Trash2,
  ShieldAlert,
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
      toast({ title: "Success", description: "Role deleted successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const roles = data?.getRoles || [];

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setShowAddDialog(true);
  };

  const handleDeleteRole = (role: any) => {
    if (role.isSystem) {
      toast({
        title: "Protected Role",
        description: "System roles cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      deleteRole({ variables: { id: role.id } });
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: "name",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground tracking-tight">
                {role.name}
              </p>
              {role.isSystem && (
                <div className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-primary/5 text-primary border border-primary/10 uppercase tracking-wider">
                  System
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-medium line-clamp-1 opacity-80">
              {role.description || "No description provided"}
            </p>
          </div>
        );
      }
    },
    {
      id: "modules",
      header: "Modules",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex flex-wrap gap-1.5">
            {role.modulePermissions?.map((perm: any) => (
              <Badge
                key={perm.id}
                variant="secondary"
                className="text-[10px] flex items-center gap-1.5 font-medium bg-muted/50 border-border/30 text-muted-foreground px-1.5 py-0.5"
              >
                <ModuleIcon name={perm.module} className="w-3 h-3 opacity-70" />
                {perm.module}
              </Badge>
            ))}
            {!role.modulePermissions?.length && (
              <span className="text-[11px] text-muted-foreground italic">None</span>
            )}
          </div>
        );
      }
    },
    {
      id: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
              <div className="w-1 h-1 rounded-full bg-border" />
              {role.modulePermissions?.length || 0} Modules Enabled
            </div>
            {Object.values(role.adminAccess || {}).some((v) => v === true) && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50/50 text-amber-700 border border-amber-100/50 text-[10px] font-medium uppercase tracking-wider w-fit">
                <ShieldAlert className="w-3 h-3" /> 
                Admin Access
              </div>
            )}
          </div>
        );
      }
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const isSystem = row.original.isSystem;
        return (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[9px] px-2.5 py-0.5 rounded-full border shadow-sm",
              isSystem
                ? "bg-slate-50 text-slate-600 border-slate-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/50",
            )}
          >
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isSystem ? "bg-slate-400" : "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"
            )} />
            Active
          </div>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/5 hover:text-primary transition-all group"
              >
                <MoreVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border-border/60 shadow-xl">
              <DropdownMenuLabel className="px-2 py-1.5 font-semibold text-[10px] uppercase tracking-widest text-muted-foreground/80">
                Role Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem
                onClick={() => handleEditRole(row.original)}
                className="flex items-center gap-2.5 px-2 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary"
              >
                <Edit className="h-3.5 w-3.5 opacity-70" /> 
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteRole(row.original)}
                className="flex items-center gap-2.5 px-2 py-2 text-sm font-medium text-destructive rounded-lg cursor-pointer transition-colors focus:bg-destructive/5 focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 opacity-70" /> 
                Delete Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ], []);

  return (
    <div className="space-y-6">
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
            className="h-10 rounded-xl px-5 font-medium transition-all hover:-translate-y-px active:translate-y-0 shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Role
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
