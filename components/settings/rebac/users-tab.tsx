"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
} from "@/components/shared/admin-table/admin-table";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function UsersTab() {
  const { toast } = useToast();
  const { data, loading, error, refetch } = useGetAdminUsers();
  console.log("GraphQL Error:", error);
  console.log("GraphQL Data:", data);
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
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const users = data?.getAdminUsers?.data || [];

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()),
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
          <Avatar className="h-8 w-8 border border-border shrink-0">
            <AvatarImage src={user.avatar as any} />
            <AvatarFallback className="text-[10px] bg-muted text-muted-foreground font-medium uppercase">
              {user.firstName[0]}
              {user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {user.firstName} {user.lastName}
              </span>
              {user.isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Owner
                </span>
              ) : user.role?.isSystem ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  System
                </span>
              ) : null}
            </div>
            <span className="text-[11px] text-muted-foreground">
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
        const roleName = user.isSuperAdmin
          ? "Owner"
          : user.role?.name || "Member";
        return (
          <span className="text-sm font-medium text-foreground">
            {roleName}
          </span>
        );
      },
    },
    {
      key: "access",
      header: "Access",
      cell: (user: AdminUser) => {
        if (user.isSuperAdmin || user.role?.isSystem) {
          return (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span className="text-xs">Full access</span>
            </div>
          );
        }
        const perms =
          user.modulePermissions || user.role?.modulePermissions || [];
        if (!perms.length)
          return (
            <span className="text-xs text-muted-foreground">No access</span>
          );
        return (
          <span className="text-xs text-muted-foreground">
            {perms.length} module{perms.length !== 1 ? "s" : ""}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (user: AdminUser) => (
        <AdminStatusBadge
          status={user.status === "active" ? "ACTIVE" : "PENDING"}
        >
          {user.status}
        </AdminStatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-[50px]",
      cell: (user: AdminUser) => {
        if (user.isSuperAdmin || user.role?.isSystem)
          return (
            <div className="flex justify-end pr-2 opacity-20">
              <Lock className="h-3.5 w-3.5" />
            </div>
          );
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-all"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 p-1 rounded-xl border-border"
              >
                <DropdownMenuItem
                  onClick={() => handleManagePermissions(user)}
                  className="gap-2.5 py-2 text-xs rounded-lg cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />{" "}
                  Permissions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleEditUser(user)}
                  className="gap-2.5 py-2 text-xs rounded-lg cursor-pointer"
                >
                  <UserCog className="h-4 w-4 text-muted-foreground" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(user.id, user.status)}
                  disabled={updatingStatus}
                  className={cn(
                    "gap-2.5 py-2 text-xs rounded-lg cursor-pointer",
                    user.status === "active"
                      ? "text-amber-600 focus:bg-amber-50"
                      : "text-emerald-600 focus:bg-emerald-50",
                  )}
                >
                  {user.status === "active" ? (
                    <>
                      <PowerOff className="h-4 w-4" /> Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4" /> Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 py-2 text-xs rounded-lg cursor-pointer text-rose-600 focus:bg-rose-50">
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
      <EcosystemActionBar
        shadow="none"
        className="bg-transparent border-none py-2"
      >
        <EcosystemActionBar.Group grow>
          <EcosystemActionBar.Item grow className="max-w-sm">
            <EcosystemActionBar.Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search members..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Link href="/settings/users/create">
              <Button
                size="sm"
                className="h-9 px-5 rounded-xl gap-2 font-medium"
              >
                <UserPlus className="h-4 w-4" />
                Add Member
              </Button>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="h-9 w-9 rounded-xl text-muted-foreground border-border hover:text-foreground hover:bg-muted"
            >
              <RotateCw
                className={cn("h-4 w-4", loading ? "animate-spin" : "")}
              />
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
            emptyDescription="No team members have been added yet."
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
