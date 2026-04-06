"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  useGetRoles, 
  useUpdateAdminUserRole, 
  AdminUser 
} from "@/graphql/actions";
import { 
  Shield, 
  Search, 
  CheckCircle2, 
  Loader2,
  Lock,
  Globe,
  Briefcase,
  ShieldAlert,
  Info,
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
  const [searchQuery, setSearchQuery] = useState("");

  const [updateRole, { loading: saving }] = useUpdateAdminUserRole({
    onCompleted: () => {
      toast({
        title: "Permissions updated",
        description: `Access for ${user.firstName} has been updated.`,
      });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const roles = rolesData?.getRoles || [];
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
      <DialogContent className="sm:max-w-[840px] p-0 overflow-hidden rounded-xl border-border/50">
        <div className="flex flex-col h-[600px] max-h-[85vh]">
          {/* Header */}
          <DialogHeader className="px-6 py-5 border-b border-border/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-muted-foreground shrink-0">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground">
                  Manage member access
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Update permissions for <span className="text-foreground font-medium">{user?.firstName} {user?.lastName}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 flex overflow-hidden">
            {/* Left: Role Selection */}
            <div className="w-[300px] border-r border-border/40 bg-muted/20 flex flex-col shrink-0">
              <div className="p-4 border-b border-border/40 bg-background/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    placeholder="Find a role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-border/60 text-xs py-1.5 pl-9 pr-3 rounded-lg outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/50 transition-all font-medium"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-1">
                  {rolesLoading ? (
                    <div className="p-8 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/40" />
                      <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">Loading roles</span>
                    </div>
                  ) : filteredRoles.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground italic">No roles found</div>
                  ) : (
                    filteredRoles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-all border border-transparent flex flex-col gap-0.5 group",
                          selectedRoleId === role.id 
                            ? "bg-foreground text-background" 
                            : "hover:bg-muted/60"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold truncate leading-none">{role.name}</span>
                          {selectedRoleId === role.id && <CheckCircle2 className="h-3 w-3" />}
                        </div>
                        <p className={cn(
                          "text-[10px] line-clamp-1 leading-none font-medium mt-0.5",
                          selectedRoleId === role.id ? "text-background/70" : "text-muted-foreground"
                        )}>
                          {role.description || "No description"}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Right: Role Details */}
            <div className="flex-1 overflow-hidden flex flex-col bg-background">
              <ScrollArea className="flex-1">
                <div className="p-6">
                  {!selectedRole ? (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center px-8">
                      <div className="h-12 w-12 rounded-full bg-muted border border-border/40 flex items-center justify-center mb-4">
                        <ShieldAlert className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Select a role</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[200px]">
                        Choose a role from the sidebar to see its associated permissions.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in duration-200">
                      {/* Section: Overview */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                          <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Role Summary</h4>
                        </div>
                        <div className="p-4 rounded-xl border border-border/50 bg-muted/10">
                          <p className="text-sm font-semibold text-foreground">{selectedRole.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {selectedRole.description || "No description provided for this role."}
                          </p>
                        </div>
                      </div>

                      {/* Section: Admin Panes */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Admin Privileges</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(selectedRole.adminAccess || {})
                            .filter(([_, val]) => val)
                            .map(([key]) => (
                              <Badge 
                                key={key} 
                                variant="outline" 
                                className="bg-amber-50 border-amber-200/60 text-amber-700 text-[10px] font-medium px-2 py-0 rounded-md"
                              >
                                {key.replace(/([A-Z])/g, " $1")}
                              </Badge>
                            ))}
                          {!Object.values(selectedRole.adminAccess || {}).some(Boolean) && (
                            <p className="text-xs text-muted-foreground italic">No system-wide admin privileges.</p>
                          )}
                        </div>
                      </div>

                      {/* Section: Module Permissions */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Resource Permissions</h4>
                        </div>
                        <div className="grid gap-2">
                          {selectedRole.modulePermissions?.map((perm: any) => (
                            <div 
                              key={perm.id} 
                              className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/5 group hover:bg-muted/10 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-7 w-7 rounded-md bg-background border border-border/60 flex items-center justify-center shrink-0">
                                  <ModuleIcon name={perm.module} className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-semibold capitalize text-foreground/80">{perm.module}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {perm.canRead && <Badge className="text-[10px] h-5 bg-background text-foreground border border-border/60 font-medium px-1.5 py-0 shadow-none">Read</Badge>}
                                {perm.canCreate && <Badge className="text-[10px] h-5 bg-background text-foreground border border-border/60 font-medium px-1.5 py-0 shadow-none">Create</Badge>}
                                {perm.canEdit && <Badge className="text-[10px] h-5 bg-background text-foreground border border-border/60 font-medium px-1.5 py-0 shadow-none">Edit</Badge>}
                                {perm.canDelete && <Badge className="text-[10px] h-5 bg-background text-foreground border border-border/60 font-medium px-1.5 py-0 shadow-none">Delete</Badge>}
                              </div>
                            </div>
                          ))}
                          {(!selectedRole.modulePermissions?.length) && (
                            <div className="p-6 border border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center text-center gap-2 opacity-50">
                              <Info className="h-4 w-4 text-muted-foreground" />
                              <span className="text-[11px] font-medium text-muted-foreground">No resource permissions.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between shrink-0 bg-muted/10">
            <div className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="h-3 w-3" />
              IAM Control
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 px-4 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={saving || !selectedRoleId || selectedRoleId === user?.role?.id}
                className="h-9 px-6 font-medium gap-2"
              >
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Apply policy
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
