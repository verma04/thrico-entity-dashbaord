"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { 
  useGetRoles, 
  useUpdateAdminUserRole, 
  AdminUser, 
  Role 
} from "@/graphql/actions";
import { 
  ShieldCheck, 
  Info, 
  ShieldAlert, 
  Database, 
  Search, 
  CheckCircle2, 
  Loader2,
  Lock,
  Globe,
  Settings,
  Shield,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ModuleIcon } from "./module-icon";

interface ManagePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
}


export default function ManagePermissionsDialog({
  open,
  onOpenChange,
  user,
}: ManagePermissionsDialogProps) {
  const { toast } = useToast();
  const { data: rolesData, loading: rolesLoading } = useGetRoles();
  const [selectedRoleId, setSelectedRoleId] = useState<string>(user?.role?.id || "");

  const [updateRole, { loading: saving }] = useUpdateAdminUserRole({
    onCompleted: () => {
      toast({
        title: "Policy Assigned",
        description: `Successfully updated ${user.firstName}'s access permissions.`,
      });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast({
        title: "IAM Update Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const roles = rolesData?.getRoles || [];
  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const handleSave = () => {
    if (!selectedRoleId) return;
    updateRole({
      variables: {
        adminId: user.id,
        roleId: selectedRoleId,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[780px] p-0 overflow-hidden border-border/40 shadow-2xl bg-background rounded-2xl">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Refined Header */}
          <div className="bg-muted/20 px-8 py-6 border-b border-border/40">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                  Modify IAM Policy
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground mt-1 opacity-80">
                  Manage access permissions for <span className="text-primary font-semibold">{user?.firstName} {user?.lastName}</span>
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Role Selection */}
            <div className="w-[300px] border-r border-border/40 bg-muted/5 flex flex-col">
              <div className="p-4 border-b border-border/40">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/50" />
                  <input
                    placeholder="Search policies..."
                    className="w-full bg-background border border-border/60 text-xs font-medium p-2.5 pl-9 rounded-xl shadow-none focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-1.5">
                  {rolesLoading ? (
                    <div className="p-10 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary opacity-40" />
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">Fetching Policies</p>
                    </div>
                  ) : (
                    roles.map((role) => (
                      <div
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                        className={cn(
                          "group p-3.5 rounded-xl cursor-pointer transition-all border border-transparent",
                          selectedRoleId === role.id 
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                            : "hover:bg-primary/5 hover:border-primary/10"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">{role.name}</span>
                          {selectedRoleId === role.id && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <p className={cn(
                          "text-[10px] line-clamp-1 font-medium opacity-70",
                          selectedRoleId === role.id ? "text-primary-foreground" : "text-muted-foreground"
                        )}>
                          {role.description || "No policy description provided."}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Right Pane: Policy Preview */}
            <div className="flex-1 flex flex-col bg-background">
              <ScrollArea className="flex-1 px-8 py-6">
                {!selectedRole ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-5 opacity-40">
                    <div className="p-4 bg-muted/30 rounded-full">
                      <ShieldAlert className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-1.5 px-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">No Policy Selected</p>
                      <p className="text-[11px] text-muted-foreground/80 font-medium">Select a role from the sidebar to review its attached entity permissions and access scopes.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary/5 rounded-lg border border-primary/10">
                          <Briefcase className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Attached Policy Details</h4>
                      </div>
                      <div className="p-5 rounded-2xl bg-muted/10 border border-border/40">
                        <p className="text-xs font-semibold text-foreground mb-1.5">{selectedRole.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic opacity-80">{selectedRole.description || "Comprehensive policy for administrative actions."}</p>
                      </div>
                    </div>

                    <Separator className="opacity-30" />

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-500/5 rounded-lg border border-amber-500/10">
                          <Lock className="h-3.5 w-3.5 text-amber-500" />
                        </div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Admin Panel Privileges</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedRole.adminAccess || {})
                          .filter(([_, val]) => val)
                          .map(([key]) => (
                            <Badge key={key} variant="outline" className="bg-amber-50/50 text-amber-700 border-amber-200/50 text-[10px] font-semibold px-2.5 py-0.5 rounded-lg">
                              {key.replace(/([A-Z])/g, " $1")}
                            </Badge>
                          ))}
                        {!Object.values(selectedRole.adminAccess || {}).some(Boolean) && (
                          <p className="text-[11px] text-muted-foreground font-medium italic opacity-60">No elevated panel access defined in this policy.</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                          <Globe className="h-3.5 w-3.5 text-indigo-500" />
                        </div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Resource Permissions</h4>
                      </div>
                      <div className="space-y-2.5">
                        {selectedRole.modulePermissions?.map((perm: any) => (
                          <div key={perm.id} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/5 border border-border/40 hover:bg-muted/10 transition-all border-dashed">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-background rounded-lg border border-border/60 shadow-sm">
                                <ModuleIcon name={perm.module} className="h-4 w-4 text-primary opacity-80" />
                              </div>
                              <span className="text-xs font-semibold text-foreground/90 capitalize">{perm.module}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {perm.canRead && <Badge className="text-[9px] h-5 font-semibold bg-emerald-50 text-emerald-700 border-emerald-200/50 uppercase rounded-md shadow-none">Read</Badge>}
                              {perm.canCreate && <Badge className="text-[9px] h-5 font-semibold bg-blue-50 text-blue-700 border-blue-200/50 uppercase rounded-md shadow-none">Create</Badge>}
                              {perm.canEdit && <Badge className="text-[9px] h-5 font-semibold bg-amber-50 text-amber-700 border-amber-200/50 uppercase rounded-md shadow-none">Edit</Badge>}
                              {perm.canDelete && <Badge className="text-[9px] h-5 font-semibold bg-rose-50 text-rose-700 border-rose-200/50 uppercase rounded-md shadow-none">Delete</Badge>}
                            </div>
                          </div>
                        ))}
                        {(!selectedRole.modulePermissions || selectedRole.modulePermissions.length === 0) && (
                          <div className="p-10 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-2 opacity-50 bg-muted/5">
                            <Info className="h-6 w-6 text-muted-foreground" />
                            <p className="text-[11px] font-medium text-muted-foreground italic">No resource-level permissions attached to this policy.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Clean Footer */}
          <div className="px-8 py-6 bg-muted/20 border-t border-border/40 flex items-center justify-between">
            <div className="hidden sm:block">
              <p className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest mb-0.5">IAM Service</p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/80">
                <ShieldCheck className="h-3 w-3 opacity-50" />
                Access Management Console
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="font-medium text-xs px-5 h-10 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving || !selectedRoleId || selectedRoleId === user?.role?.id}
                className={cn(
                  "font-medium text-xs px-8 h-10 rounded-xl shadow-sm transition-all active:scale-[0.98]",
                  saving || !selectedRoleId || selectedRoleId === user?.role?.id
                    ? "opacity-40"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Updating Policy...
                  </>
                ) : (
                  "Apply IAM Policy"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  );
}
