"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  UserPlus,
  ShieldCheck,
  Trash2,
  Lock,
  Globe,
  Settings,
  User,
} from "lucide-react";
import AddUserDialog from "./add-user-dialog";
import ManagePermissionsDialog from "./manage-permissions-dialog";
import { ModuleIcon } from "./module-icon";
import { useGetAdminUsers, useUpdateAdminUser, AdminUser } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";

export default function UsersTab() {
  const { toast } = useToast();
  const { data, loading } = useGetAdminUsers();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

  const [updateUser, { loading: updatingStatus }] = useUpdateAdminUser({
    onCompleted: (data: any) => {
      toast({
        title: "Status Updated",
        description: `User status has been set to ${data.updateAdminUser.status}.`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const users = data?.getAdminUsers || [];

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
    updateUser({
      variables: { 
        adminId: id, 
        input: { status: newStatus } 
      },
    });
  };

  const columns = useMemo<ColumnDef<AdminUser>[]>(() => [
    {
      id: "user",
      accessorFn: (row) => `${row.firstName} ${row.lastName} ${row.email}`,
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-xl border border-border/50 shadow-sm transition-transform group-hover:scale-105">
              <AvatarImage src={user.avatar as any} />
              <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-foreground">
                  {user.firstName} {user.lastName}
                </p>
                {user.isSuperAdmin && (
                  <div className="flex items-center gap-1 bg-primary/5 text-primary border border-primary/10 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Super Admin
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium opacity-80">
                {user.email}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "role.name",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge
            variant="outline"
            className={cn(
              "font-medium border-border/50 text-[11px] capitalize px-2 py-0.5 rounded-md",
              user.isSuperAdmin
                ? "bg-slate-100 text-slate-700 border-slate-200"
                : "text-foreground bg-muted/30 border-border/40",
            )}
          >
            {user.isSuperAdmin
              ? "Super Admin"
              : user.role?.name || "No Role"}
          </Badge>
        );
      }
    },
    {
      id: "moduleAccess",
      header: "Module Access",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-wrap gap-1.5 max-w-[280px]">
            {user.isSuperAdmin ? (
              <div className="text-[10px] font-medium uppercase tracking-wider flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50/50 text-indigo-600 border border-indigo-100/50">
                <Globe className="w-3 h-3" />
                Full Platform
              </div>
            ) : (
              <>
                {user.role?.modulePermissions?.map((perm: any) => (
                  <Badge
                    key={perm.id}
                    variant="secondary"
                    className="text-[10px] font-medium uppercase tracking-tight flex items-center gap-1.5 px-1.5 py-0.5 bg-muted/50 text-muted-foreground border-border/30"
                  >
                    <ModuleIcon
                      name={perm.module}
                      className="w-3 h-3 opacity-70"
                    />
                    {perm.module}
                  </Badge>
                ))}
                {!user.role?.modulePermissions?.length && (
                  <span className="text-[11px] text-muted-foreground italic">
                    None
                  </span>
                )}
              </>
            )}
          </div>
        );
      }
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div
            className={cn(
              "font-semibold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded-full border shadow-sm flex items-center gap-1.5 w-fit",
              status === "active"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                : "bg-muted/50 text-muted-foreground border-border/50",
            )}
          >
            {status === "active" && (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
            )}
            {status}
          </div>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        if (user.isSuperAdmin) {
          return (
            <div className="flex justify-end p-2 opacity-30">
              <Lock className="w-3.5 h-3.5" />
            </div>
          );
        }
        return (
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
              <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-xl border-border/60 shadow-xl">
                <DropdownMenuLabel className="px-2 py-1.5 font-semibold text-[10px] uppercase tracking-widest text-muted-foreground/80">
                  Member Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem
                  onClick={() => handleManagePermissions(user)}
                  className="flex items-center gap-2.5 px-2 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary"
                >
                  <ShieldCheck className="h-4 w-4 opacity-70" /> 
                  Edit Role & Access
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleEditUser(user)}
                  className="flex items-center gap-2.5 px-2 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary"
                >
                  <User className="h-4 w-4 opacity-70" /> 
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(user.id, user.status)}
                  disabled={updatingStatus}
                  className={cn(
                    "flex items-center gap-2.5 px-2 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors focus:bg-muted/50",
                    user.status === "active" ? "text-amber-600 focus:text-amber-600 focus:bg-amber-50/50" : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50/50"
                  )}
                >
                  {user.status === "active" ? (
                    <><Lock className="h-4 w-4 opacity-70" /> Deactivate</>
                  ) : (
                    <><ShieldCheck className="h-4 w-4 opacity-70" /> Activate</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem className="flex items-center gap-2.5 px-2 py-2 text-sm font-medium text-destructive rounded-lg cursor-pointer transition-colors focus:bg-destructive/5 focus:text-destructive">
                  <Trash2 className="h-4 w-4 opacity-70" /> 
                  Remove Access
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    }
  ], [updatingStatus]);

  return (
    <div className="space-y-6">
      <AppDataTable
        columns={columns}
        data={users}
        isLoading={loading}
        searchableColumns={[{ id: "user", placeholder: "Search team members..." }]}
        isShowExportButtons={true}
        customButtons={
          <Button onClick={() => setShowAddDialog(true)} className="h-10 rounded-xl px-5 font-medium transition-all hover:-translate-y-px active:translate-y-0 shadow-sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        }
      />

      {/* Dialogs */}
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
