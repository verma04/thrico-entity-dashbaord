"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  UserPlus,
  Shield,
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function UsersTab() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredUsers = users.filter(
    (user: AdminUser) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search team members..."
            className="pl-10 h-10 border-border/60 bg-muted/20 focus-visible:ring-primary/20 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="h-10 rounded-xl px-5 font-medium transition-all hover:-translate-y-px active:translate-y-0 shadow-sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border/50 bg-background overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/50 hover:bg-muted/30">
              <TableHead className="py-4 font-semibold text-foreground/80">User</TableHead>
              <TableHead className="py-4 font-semibold text-foreground/80">Role</TableHead>
              <TableHead className="py-4 font-semibold text-foreground/80">Module Access</TableHead>
              <TableHead className="py-4 font-semibold text-foreground/80">Privileges</TableHead>
              <TableHead className="py-4 font-semibold text-foreground/80">Status</TableHead>
              <TableHead className="w-[80px] py-4 font-semibold text-center text-foreground/80">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-12 w-[250px] rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[120px] rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[200px] rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[150px] rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[80px] rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-10 mx-auto rounded-xl" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="group hover:bg-muted/20 transition-all border-b border-border/40 last:border-0"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-xl border border-border/50 shadow-sm transition-transform group-hover:scale-105">
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
                  </TableCell>
                  <TableCell className="py-3">
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
                  </TableCell>
                  <TableCell className="py-3">
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
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.isSuperAdmin ? (
                        <div className="text-[10px] bg-amber-50/50 text-amber-700 border border-amber-100/50 font-medium uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1.5">
                          <Settings className="w-2.5 h-2.5" />
                          Global Root
                        </div>
                      ) : (
                        <>
                          {user.role?.adminAccess &&
                            Object.entries(user.role.adminAccess)
                              .filter(([_, value]) => value === true)
                              .slice(0, 2)
                              .map(([key]) => (
                                <Badge
                                  key={key}
                                  className="text-[10px] bg-amber-50/50 text-amber-700 border border-amber-200/50 font-medium uppercase tracking-tight px-1.5 py-0.5 rounded-md shadow-none"
                                >
                                  {key}
                                </Badge>
                              ))}
                          {user.role?.adminAccess &&
                            Object.values(user.role.adminAccess).filter(Boolean)
                              .length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-[10px] font-medium uppercase border-border/40 px-1.5 py-0.5 rounded-md"
                              >
                                +
                                {Object.values(user.role.adminAccess).filter(
                                  Boolean,
                                ).length - 2}{" "}
                                More
                              </Badge>
                            )}
                          {!Object.values(user.role?.adminAccess || {}).some(
                            Boolean,
                          ) && (
                            <span className="text-[11px] text-muted-foreground italic">
                              Standard
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "font-semibold uppercase tracking-wider text-[9px] px-2 py-0.5 rounded-full border shadow-sm flex items-center gap-1.5",
                          user.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                            : "bg-muted/50 text-muted-foreground border-border/50",
                        )}
                      >
                        {user.status === "active" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                        )}
                        {user.status}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-3">
                    {!user.isSuperAdmin ? (
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
                    ) : (
                      <div className="h-8 w-8 flex items-center justify-center text-muted-foreground/30 mx-auto">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-48 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-muted/30 rounded-full">
                      <Shield className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">No members found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your search or add a new admin user.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
