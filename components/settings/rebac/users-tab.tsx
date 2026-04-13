"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  UserPlus,
  ShieldCheck,
  Trash2,
  Lock,
  Globe,
  UserCog,
  PowerOff,
  Power,
  RotateCw,
  Search,
} from "lucide-react";
import AddUserDialog from "./add-user-dialog";
import ManagePermissionsDialog from "./manage-permissions-dialog";
import { ModuleIcon } from "./module-icon";
import { useGetAdminUsers, useUpdateAdminUser, AdminUser } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AdminTable, AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function UsersTab() {
  const { toast } = useToast();
  const { data, loading, refetch } = useGetAdminUsers();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [updateUser, { loading: updatingStatus }] = useUpdateAdminUser({
    onCompleted: (data: any) => {
      toast({
        title: "Status updated",
        description: `User is now ${data.updateAdminUser.status}.`,
      });
    },
    onError: (err: any) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  const users = data?.getAdminUsers || [];

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

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
      cell: (user: AdminUser) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-xl border border-zinc-200 shrink-0">
            <AvatarImage src={user.avatar as any} />
            <AvatarFallback className="rounded-xl bg-zinc-100 text-zinc-400 text-xs font-medium uppercase">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {user.firstName} {user.lastName}
              </span>
              {user.isSuperAdmin && (
                <span className="inline-flex h-4 items-center gap-1 text-[9px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-1.5 rounded-md uppercase">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Owner
                </span>
              )}
            </div>
            <span className="text-[11px] text-zinc-400 font-normal">
              {user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (user: AdminUser) => {
        const roleName = user.isSuperAdmin ? "Owner" : user.role?.name || "Member";
        return (
          <div className="flex flex-col">
             <span className="text-sm font-medium text-foreground">
                {roleName}
             </span>
             <span className="text-[10px] text-zinc-400 uppercase tracking-tight">
                {user.isSuperAdmin ? "Full Access" : "Restricted"}
             </span>
          </div>
        );
      },
    },
    {
      key: "access",
      header: "Access",
      cell: (user: AdminUser) => {
        if (user.isSuperAdmin) {
          return (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200/50 w-fit">
               <Globe className="h-3 w-3 text-zinc-400" />
               <span className="text-[10px] font-medium text-zinc-500 uppercase">Global</span>
            </div>
          );
        }
        const perms = user.role?.modulePermissions || [];
        if (!perms.length) return <span className="text-[10px] text-zinc-400 italic">No access</span>;
        
        return (
          <div className="flex items-center gap-1">
             {perms.slice(0, 3).map((p: any) => (
                <div key={p.id} className="h-6 w-6 rounded bg-white border border-border flex items-center justify-center shadow-sm" title={p.module}>
                   <ModuleIcon name={p.module} className="h-3 w-3 text-zinc-400" />
                </div>
             ))}
             {perms.length > 3 && (
                <span className="text-[10px] text-zinc-400 ml-1">+{perms.length - 3}</span>
             )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (user: AdminUser) => (
        <AdminStatusBadge status={user.status === "active" ? "APPROVED" : "PENDING"}>
          {user.status}
        </AdminStatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (user: AdminUser) => {
        if (user.isSuperAdmin) return (
           <div className="flex justify-end pr-2 opacity-10">
              <Lock className="h-3.5 w-3.5" />
           </div>
        );
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 rounded-lg hover:text-foreground hover:bg-zinc-100 transition-all">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-lg border-border">
                <DropdownMenuItem onClick={() => handleManagePermissions(user)} className="gap-2.5 py-2 text-xs font-medium rounded-lg cursor-pointer">
                  <ShieldCheck className="h-4 w-4 text-zinc-400" /> Access & Scopes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditUser(user)} className="gap-2.5 py-2 text-xs font-medium rounded-lg cursor-pointer">
                  <UserCog className="h-4 w-4 text-zinc-400" /> Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem onClick={() => handleUpdateStatus(user.id, user.status)} disabled={updatingStatus} className={cn("gap-2.5 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors", user.status === "active" ? "text-amber-600 focus:bg-amber-50" : "text-emerald-600 focus:bg-emerald-50")}>
                  {user.status === "active" ? <><PowerOff className="h-4 w-4" /> Deactivate</> : <><Power className="h-4 w-4" /> Activate</>}
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 py-2 text-xs font-medium rounded-lg cursor-pointer text-rose-600 focus:bg-rose-50">
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
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
                placeholder="Search team members..."
              />
            </div>
         </EcosystemActionBar.Group>
         <EcosystemActionBar.Group align="right">
            <EcosystemActionBar.Item>
               <Button onClick={() => setShowAddDialog(true)} size="sm" className="h-9 px-6 rounded-xl gap-2 font-medium">
                 <UserPlus className="h-4 w-4" />
                 Add Member
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
              data={filteredUsers}
              loading={loading}
              keyExtractor={(u) => u.id}
              emptyTitle="No members found"
              emptyDescription="No team members have been added to this workspace yet."
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
    </div>
  );
}
