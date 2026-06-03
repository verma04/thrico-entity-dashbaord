"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  Lock,
  RotateCw,
  Fingerprint,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import AddRoleDialog from "./add-role-dialog";
import { useGetRoles, useDeleteRole } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AdminTable, AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function RolesTab() {
  const { toast } = useToast();
  const { data, loading, refetch } = useGetRoles();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteRole] = useDeleteRole({
    onCompleted: () => {
      toast({ title: "Role deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const roles = data?.getRoles || [];

  const filteredRoles = useMemo(() => {
    return roles.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [roles, searchQuery]);

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
              <span className="text-sm font-medium text-foreground">
                {role.name}
              </span>
              {role.isSystem && (
                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-md">
                  <Lock className="w-2 h-2" />
                  System
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground line-clamp-1">
              {role.description || "No description"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "modules",
      header: "Modules",
      cell: (role: any) => {
        const perms = role.modulePermissions || [];
        if (!perms.length) return <span className="text-xs text-muted-foreground">None</span>;
        return (
          <span className="text-xs text-muted-foreground">
            {perms.length} module{perms.length !== 1 ? "s" : ""}
          </span>
        );
      },
    },
    {
      key: "access",
      header: "Access Level",
      cell: (role: any) => {
        const hasAdminAccess = Object.values(role.adminAccess || {}).some((v) => v === true);
        return (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {hasAdminAccess ? (
              <>
                <ShieldCheck className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-amber-600 font-medium">Privileged</span>
              </>
            ) : (
              <>
                <ShieldX className="h-3 w-3" />
                <span className="text-xs">Standard</span>
              </>
            )}
          </div>
        );
      },
    },
    {
       key: "status",
       header: "Status",
       cell: (role: any) => (
         <AdminStatusBadge status="ACTIVE">
           Active
         </AdminStatusBadge>
       ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (role: any) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-all">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1 rounded-xl border-border">
              <DropdownMenuItem onClick={() => handleEditRole(role)} className="gap-2.5 py-2 text-xs rounded-lg cursor-pointer">
                <Edit2 className="h-4 w-4 text-muted-foreground" /> Edit Role
              </DropdownMenuItem>
              {!role.isSystem && (
                <>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem onClick={() => handleDeleteRole(role)} className="gap-2.5 py-2 text-xs rounded-lg cursor-pointer text-rose-600 focus:bg-rose-50">
                    <Trash2 className="h-4 w-4" /> Delete
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
    <div className="space-y-0">
      <EcosystemActionBar shadow="none" className="bg-transparent border-none py-2">
         <EcosystemActionBar.Group grow>
            <EcosystemActionBar.Item grow className="max-w-sm">
              <EcosystemActionBar.Search 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search roles..."
              />
            </EcosystemActionBar.Item>
         </EcosystemActionBar.Group>
         <EcosystemActionBar.Group align="right">
            <EcosystemActionBar.Item>
               <Link href="/settings/users/roles/create">
                 <Button size="sm" className="h-9 px-5 rounded-xl gap-2 font-medium">
                   <Plus className="h-4 w-4" />
                   Add Role
                 </Button>
               </Link>
            </EcosystemActionBar.Item>
            <EcosystemActionBar.Item>
               <Button variant="outline" size="icon" onClick={() => refetch()} className="h-9 w-9 rounded-xl text-muted-foreground border-border hover:text-foreground hover:bg-muted">
                 <RotateCw className={cn("h-4 w-4", loading ? "animate-spin" : "")} />
               </Button>
            </EcosystemActionBar.Item>
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
    </div>
  );
}
