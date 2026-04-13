"use client";

import { useState, useMemo } from "react";
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
  ShieldAlert,
  Lock,
  RotateCw,
  Search,
  Fingerprint,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import AddRoleDialog from "./add-role-dialog";
import { ModuleIcon } from "./module-icon";
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
      header: "Permissions Template",
      cell: (role: any) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shadow-inner shrink-0">
             <Fingerprint className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-foreground uppercase tracking-tight">
                {role.name}
              </span>
              {role.isSystem && (
                <span className="inline-flex h-4 items-center gap-1 text-[8px] font-black text-zinc-500 bg-zinc-100 border border-zinc-200/50 px-1.5 rounded-md uppercase tracking-widest">
                  <Lock className="w-2 h-2" />
                  Core
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium line-clamp-1 max-w-[240px]">
              {role.description || "No categorical description defined."}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "coverage",
      header: "Module Scope",
      cell: (role: any) => {
        const perms = role.modulePermissions || [];
        if (!perms.length) return <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">Zero Coverage</span>;
        
        return (
          <div className="flex items-center gap-1.5">
             <div className="flex -space-x-1.5 overflow-hidden">
                {perms.slice(0, 3).map((p: any) => (
                  <div key={p.id} className="inline-block h-6 w-6 rounded-lg bg-white border border-border flex items-center justify-center shadow-sm relative z-0 hover:z-10 transition-all ring-2 ring-white" title={p.module}>
                     <ModuleIcon name={p.module} className="h-3 w-3 text-zinc-500" />
                  </div>
                ))}
             </div>
             {perms.length > 3 && (
                <span className="text-[10px] font-black text-muted-foreground ml-1.5 opacity-60">+{perms.length - 3} Units</span>
             )}
          </div>
        );
      },
    },
    {
      key: "access",
      header: "Admin Authority",
      cell: (role: any) => {
        const hasAdminAccess = Object.values(role.adminAccess || {}).some((v) => v === true);
        return (
           <div className="flex items-center gap-2">
              <div className={cn(
                 "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all",
                 hasAdminAccess 
                   ? "bg-amber-50 text-amber-600 border-amber-200/50" 
                   : "bg-zinc-50 text-zinc-400 border-zinc-200/50 opacity-60"
              )}>
                 {hasAdminAccess ? <ShieldCheck className="h-2.5 w-2.5" /> : <ShieldX className="h-2.5 w-2.5" />}
                 {hasAdminAccess ? "Privileged" : "Standard"}
              </div>
           </div>
        );
      },
    },
    {
       key: "status",
       header: "Registry Status",
       cell: (role: any) => (
         <AdminStatusBadge status="APPROVED">
           Active Node
         </AdminStatusBadge>
       ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (role: any) => (
        <div className="flex justify-end pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-xl hover:text-foreground hover:bg-muted transition-all">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-border">
              <DropdownMenuItem onClick={() => handleEditRole(role)} className="gap-3 py-2.5 text-xs font-bold uppercase tracking-tight rounded-lg cursor-pointer">
                <Edit2 className="h-4 w-4 text-zinc-400" /> Modify Structure
              </DropdownMenuItem>
              {!role.isSystem && (
                <>
                  <DropdownMenuSeparator className="my-1 opacity-50" />
                  <DropdownMenuItem onClick={() => handleDeleteRole(role)} className="gap-3 py-2.5 text-xs font-bold uppercase tracking-tight rounded-lg cursor-pointer text-rose-600 focus:bg-rose-50 transition-colors">
                    <Trash2 className="h-4 w-4" /> Delete Template
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
            <div className="relative max-w-sm w-full">
              <EcosystemActionBar.Search 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Locate role definition..."
              />
            </div>
         </EcosystemActionBar.Group>
         <EcosystemActionBar.Group align="right">
            <EcosystemActionBar.Item>
               <Button onClick={() => { setSelectedRole(null); setShowAddDialog(true); }} size="sm" className="h-9 px-6 rounded-xl gap-2 font-black uppercase tracking-tighter shadow-md ring-1 ring-black/5">
                 <Plus className="h-4 w-4" />
                 Initialize Role
               </Button>
            </EcosystemActionBar.Item>
            <EcosystemActionBar.Item>
               <Button variant="outline" size="icon" onClick={() => refetch()} className="h-9 w-9 rounded-xl text-zinc-400 border-zinc-200 bg-white">
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
              emptyTitle="No Definitions"
              emptyDescription="Define your first security template to begin permission delegation."
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
