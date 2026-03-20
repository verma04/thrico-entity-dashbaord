"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { CHECK_ENTITY_SUBSCRIPTIONS } from "@/graphql/quries";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  useGetAvailableModules, 
  useCreateRole, 
  useUpdateRole,
  AdminAccess
} from "@/graphql/actions";
import { 
  Loader2,
  ShieldCheck,
  Lock,
  Globe,
  Settings,
  Info,
  ShieldAlert,
  Database,
  Search,
  CheckCircle2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { extendedItems } from "@/components/layout/sidebar/menu-items";
import { ModuleIcon } from "./module-icon";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: any;
}

const permissionTypes = ["Read", "Create", "Edit", "Delete"] as const;

export default function AddRoleDialog({
  open,
  onOpenChange,
  role,
}: AddRoleDialogProps) {
  const { toast } = useToast();
  const { data: subsData, loading: subsLoading } = useQuery(CHECK_ENTITY_SUBSCRIPTIONS);
  const { data: modulesData, loading: modulesLoading } = useGetAvailableModules();

  const [createRole, { loading: creating }] = useCreateRole({
    onCompleted: () => {
      toast({ title: "Success", description: "Role created successfully" });
      onOpenChange(false);
    },
    onError: (err: ApolloError) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const [updateRole, { loading: updating }] = useUpdateRole({
    onCompleted: () => {
      toast({ title: "Success", description: "Role updated successfully" });
      onOpenChange(false);
    },
    onError: (err: ApolloError) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [adminAccess, setAdminAccess] = useState<Record<string, boolean>>({
    website: false,
    moderation: false,
    reports: false,
    settings: false,
    subscription: false,
    platformFeatures: false,
    appearance: false,
    auditLogs: false,
    domain: false,
    permissions: false,
    adminUsers: false,
  });

  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    if (role && open) {
      setFormData({
        name: role.name,
        description: role.description,
      });
      
      const newAdminAccess = { ...adminAccess };
      if (role.adminAccess) {
        Object.keys(newAdminAccess).forEach(key => {
          if (role.adminAccess[key] !== undefined) {
            newAdminAccess[key] = !!role.adminAccess[key];
          }
        });
      }
      setAdminAccess(newAdminAccess);

      const newPerms: Record<string, Record<string, boolean>> = {};
      role.modulePermissions?.forEach((p: any) => {
        newPerms[p.module] = {
          Read: !!p.canRead,
          Create: !!p.canCreate,
          Edit: !!p.canEdit,
          Delete: !!p.canDelete,
        };
      });
      setPermissions(newPerms);
    } else if (!role && open) {
      setFormData({ name: "", description: "" });
      setAdminAccess({
        website: false,
        moderation: false,
        reports: false,
        settings: false,
        subscription: false,
        platformFeatures: false,
        appearance: false,
        auditLogs: false,
        domain: false,
        permissions: false,
        adminUsers: false,
      });
      setPermissions({});
    }
  }, [role, open]);

  const togglePermission = (moduleId: string, type: string) => {
    setPermissions((prev) => {
      const modulePerms = prev[moduleId] || { Read: false, Create: false, Edit: false, Delete: false };
      return {
        ...prev,
        [moduleId]: {
          ...modulePerms,
          [type]: !modulePerms[type],
        },
      };
    });
  };

  const toggleAdminAccess = (key: string) => {
    setAdminAccess(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const modulePermissions = Object.entries(permissions)
      .filter(([_, perms]) => Object.values(perms).some(v => v === true))
      .map(([moduleName, perms]) => ({
        module: moduleName,
        canRead: !!perms.Read,
        canCreate: !!perms.Create,
        canEdit: !!perms.Edit,
        canDelete: !!perms.Delete,
      }));

    if (role) {
      updateRole({
        variables: {
          input: {
            id: role.id,
            name: formData.name,
            description: formData.description,
            adminAccess: adminAccess as Partial<AdminAccess>,
            modulePermissions,
          }
        }
      });
    } else {
      createRole({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            adminAccess: adminAccess as Partial<AdminAccess>,
            modulePermissions,
          }
        }
      });
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] h-[90vh] flex flex-col p-0 overflow-hidden border-border/40 shadow-2xl bg-background rounded-2xl">
        {/* Refined Header */}
        <div className="bg-muted/20 px-8 py-6 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                {role ? "Update RBAC Role" : "Create IAM Role"}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground mt-1 opacity-80">
                {role ? "Modify existing permission set and access scopes." : "Define a new set of permissions for platform resources."}
              </DialogDescription>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1 px-8 py-6">
            <div className="space-y-10 py-2">
              {/* SECTION: GENERAL SETTINGS */}
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/5 rounded-lg border border-primary/10">
                    <Database className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">General Configurations</h3>
                </div>
                <div className="grid gap-5 p-6 bg-muted/10 rounded-2xl border border-border/60">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[11px] font-medium text-muted-foreground/80 ml-0.5">Role Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Content-Manager-Lead"
                      required
                      className="bg-background border-border/60 shadow-none h-11 px-4 font-medium rounded-xl focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[11px] font-medium text-muted-foreground/80 ml-0.5">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the purpose of this role..."
                      className="bg-background border-border/60 shadow-none h-11 px-4 font-medium rounded-xl focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <Separator className="opacity-30" />

              {/* SECTION: ELEVATED PRIVILEGES */}
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/5 rounded-lg border border-amber-500/10">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Elevated Admin Access</h3>
                </div>

                <div className="p-3.5 bg-amber-50/50 border border-amber-100/50 rounded-xl flex gap-3">
                  <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5 opacity-70" />
                  <p className="text-[11px] text-amber-700/80 font-medium leading-relaxed">
                    Elevated permissions grant wide-reaching access across the administrative interface. Exercise caution when assigning "Settings" or "Permissions" scopes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 p-5 rounded-2xl bg-muted/10 border border-border/50">
                  {Object.keys(adminAccess).map((key) => (
                    <div key={key} className="flex items-center space-x-3 group cursor-pointer p-2 rounded-lg hover:bg-background transition-all">
                      <Checkbox
                        id={`admin-${key}`}
                        checked={adminAccess[key]}
                        onCheckedChange={() => toggleAdminAccess(key)}
                        className="h-5 w-5 border-border/60 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 rounded-md"
                      />
                      <Label
                        htmlFor={`admin-${key}`}
                        className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors"
                      >
                        {key.replace(/([A-Z])/g, " $1")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="opacity-30" />

              {/* SECTION: RESOURCE PERMISSIONS */}
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/5 rounded-lg border border-primary/10">
                    <Globe className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Entity Resource Permissions</h3>
                </div>

                <div className="rounded-2xl border border-border/50 bg-background overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/30 border-b border-border/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[300px] font-semibold text-[11px] uppercase tracking-wider px-6 text-foreground/70">Resource Name</TableHead>
                        {permissionTypes.map((type) => (
                          <TableHead key={type} className="text-center font-semibold text-[11px] uppercase tracking-wider text-foreground/70">{type}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modulesLoading || subsLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell className="px-6 py-4"><Skeleton className="h-5 w-40 rounded-md" /></TableCell>
                              {permissionTypes.map((t) => (
                                <TableCell key={t} className="text-center"><Skeleton className="h-6 w-6 mx-auto rounded-md" /></TableCell>
                              ))}
                            </TableRow>
                          ))
                        : (modulesData?.getAvailableModules || []).map((moduleName: string) => {
                            const subModule = subsData?.checkEntitySubscription?.modules?.find((m: any) => m.name.toLowerCase() === moduleName.toLowerCase());
                            return (
                              <TableRow key={moduleName} className="hover:bg-muted/10 border-b border-border/40 last:border-0 group transition-colors">
                                <TableCell className="px-6 py-4 flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                    <ModuleIcon name={moduleName} fallback={subModule?.icon} className="w-4.5 h-4.5 opacity-70" />
                                  </div>
                                  <span className="capitalize font-semibold text-sm text-foreground/90">{moduleName}</span>
                                </TableCell>
                                {permissionTypes.map((type) => (
                                  <TableCell key={type} className="text-center">
                                    <div className="flex items-center justify-center">
                                      <Checkbox
                                        checked={!!permissions[moduleName]?.[type]}
                                        onCheckedChange={() => togglePermission(moduleName, type)}
                                        className="h-5.5 w-5.5 border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all rounded-md"
                                      />
                                    </div>
                                  </TableCell>
                                ))}
                              </TableRow>
                            );
                          })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Clean Footer */}
          <div className="px-8 py-6 bg-muted/20 border-t border-border/40 flex items-center justify-between">
            <div className="hidden sm:block">
              <p className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest mb-0.5">IAM Policy</p>
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
                type="submit"
                disabled={creating || updating}
                className="bg-primary text-primary-foreground font-medium text-xs px-8 h-10 rounded-xl shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                {creating || updating ? (
                   <>
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  role ? "Apply policy updates" : "Initialize IAM policy"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
