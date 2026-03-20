"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Shield,
  Edit,
  Trash2,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import AddRoleDialog from "./add-role-dialog";
import { ModuleIcon } from "./module-icon";
import { useGetRoles, useDeleteRole } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ApolloError } from "@apollo/client";

export default function RolesTab() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading } = useGetRoles();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const [deleteRole, { loading: deleting }] = useDeleteRole({
    onCompleted: () => {
      toast({ title: "Success", description: "Role deleted successfully" });
    },
    onError: (err: ApolloError) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const roles = data?.getRoles || [];

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            placeholder="Search roles..."
            className="pl-10 h-10 border-border/60 bg-muted/20 focus-visible:ring-primary/20 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
      </div>

      <div className="rounded-2xl border border-border/50 bg-background overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/50 hover:bg-muted/30">
              <TableHead className="py-4 font-semibold text-foreground/80">Role</TableHead>
              <TableHead className="py-4 font-semibold text-foreground/80">Modules</TableHead>
              <TableHead className="py-4 font-semibold text-foreground/80">Permissions</TableHead>
              <TableHead className="py-4 font-semibold text-foreground/80">Status</TableHead>
              <TableHead className="w-[80px] py-4 font-semibold text-center text-foreground/80">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-10 w-10 mx-auto rounded-xl" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <TableRow
                  key={role.id}
                  className="group hover:bg-muted/20 transition-all border-b border-border/40 last:border-0"
                >
                  <TableCell className="py-4">
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
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {role.modulePermissions?.map((perm: any) => (
                        <Badge
                          key={perm.id}
                          variant="secondary"
                          className="text-[10px] flex items-center gap-1.5 font-medium bg-muted/50 border-border/30 text-muted-foreground px-1.5 py-0.5"
                        >
                          <ModuleIcon
                            name={perm.module}
                            className="w-3 h-3 opacity-70"
                          />
                          {perm.module}
                        </Badge>
                      ))}
                      {!role.modulePermissions?.length && (
                        <span className="text-[11px] text-muted-foreground italic">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-border" />
                        {role.modulePermissions?.length || 0} Modules Enabled
                      </div>
                      {Object.values(role.adminAccess || {}).some(
                        (v) => v === true,
                      ) && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50/50 text-amber-700 border border-amber-100/50 text-[10px] font-medium uppercase tracking-wider w-fit">
                          <ShieldAlert className="w-3 h-3" /> 
                          Admin Access
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[9px] px-2.5 py-0.5 rounded-full border shadow-sm",
                        role.isSystem
                          ? "bg-slate-50 text-slate-600 border-slate-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200/50",
                      )}
                    >
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        role.isSystem ? "bg-slate-400" : "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"
                      )} />
                      Active
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
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
                          onClick={() => handleEditRole(role)}
                          className="flex items-center gap-2.5 px-2 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors focus:bg-primary/5 focus:text-primary"
                        >
                          <Edit className="h-3.5 w-3.5 opacity-70" /> 
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteRole(role)}
                          className="flex items-center gap-2.5 px-2 py-2 text-sm font-medium text-destructive rounded-lg cursor-pointer transition-colors focus:bg-destructive/5 focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5 opacity-70" /> 
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-48 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-muted/30 rounded-full">
                      <Shield className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">No roles found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try adjusting your filters or create a new role.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddRoleDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        role={selectedRole}
      />
    </div>
  );
}
