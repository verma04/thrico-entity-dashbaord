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
        title: "Status updated",
        description: `User is now ${data.updateAdminUser.status}.`,
      });
    },
    onError: (err: any) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
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
    updateUser({ variables: { adminId: id, input: { status: newStatus } } });
  };

  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        id: "user",
        accessorFn: (row) => `${row.firstName} ${row.lastName} ${row.email}`,
        header: "Member",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3 py-0.5">
              <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0">
                <AvatarImage src={user.avatar as any} />
                <AvatarFallback className="rounded-lg bg-muted text-muted-foreground text-xs font-semibold">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-foreground leading-none">
                    {user.firstName} {user.lastName}
                  </p>
                  {user.isSuperAdmin && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/8 border border-primary/15 px-1.5 py-0.5 rounded-md leading-none">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Owner
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "role.name",
        header: "Role",
        cell: ({ row }) => {
          const user = row.original;
          const roleName = user.isSuperAdmin ? "Super Admin" : user.role?.name || "—";
          return (
            <span className="text-sm text-muted-foreground font-medium">
              {roleName}
            </span>
          );
        },
      },
      {
        id: "moduleAccess",
        header: "Access",
        cell: ({ row }) => {
          const user = row.original;
          if (user.isSuperAdmin) {
            return (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Globe className="w-3.5 h-3.5" />
                Full access
              </div>
            );
          }
          const perms = user.role?.modulePermissions || [];
          if (!perms.length) {
            return <span className="text-xs text-muted-foreground">No modules</span>;
          }
          const visible = perms.slice(0, 3);
          const remaining = perms.length - 3;
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
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const isActive = status === "active";
          return (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border w-fit",
                isActive
                  ? "text-emerald-700 bg-emerald-50 border-emerald-200/60"
                  : "text-muted-foreground bg-muted/40 border-border/40"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  isActive ? "bg-emerald-500" : "bg-muted-foreground/40"
                )}
              />
              {isActive ? "Active" : "Inactive"}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const user = row.original;
          if (user.isSuperAdmin) {
            return (
              <div className="flex justify-end pr-2">
                <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />
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
                    className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleManagePermissions(user)}
                    className="gap-2 text-sm"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    Edit role & access
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEditUser(user)}
                    className="gap-2 text-sm"
                  >
                    <UserCog className="h-3.5 w-3.5 text-muted-foreground" />
                    Edit profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleUpdateStatus(user.id, user.status)}
                    disabled={updatingStatus}
                    className={cn(
                      "gap-2 text-sm",
                      user.status === "active"
                        ? "text-amber-600 focus:text-amber-600 focus:bg-amber-50/60"
                        : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50/60"
                    )}
                  >
                    {user.status === "active" ? (
                      <>
                        <PowerOff className="h-3.5 w-3.5" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="h-3.5 w-3.5" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-sm text-destructive focus:text-destructive focus:bg-destructive/5">
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [updatingStatus]
  );

  return (
    <div className="space-y-4 pt-4">
      <AppDataTable
        columns={columns}
        data={users}
        isLoading={loading}
        searchableColumns={[{ id: "user", placeholder: "Search members..." }]}
        isShowExportButtons={true}
        customButtons={
          <Button
            onClick={() => setShowAddDialog(true)}
            size="sm"
            className="gap-2 h-9 px-4 font-medium"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add member
          </Button>
        }
      />

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
