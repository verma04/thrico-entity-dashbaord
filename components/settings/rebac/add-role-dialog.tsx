"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery, ApolloError } from "@apollo/client";
import { CHECK_ENTITY_SUBSCRIPTIONS } from "@/graphql/quries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAvailableModules,
  useCreateRole,
  useUpdateRole,
  AdminAccess,
} from "@/graphql/actions";
import { Loader2, ShieldCheck, ShieldAlert, Info } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: any;
}

const permissionTypes = ["Read", "Create", "Edit", "Delete"] as const;

const adminAccessLabels: Record<string, string> = {
  website: "Website",
  moderation: "Moderation",
  reports: "Reports",
  settings: "Settings",
  subscription: "Subscription",
  platformFeatures: "Platform Features",
  appearance: "Appearance",
  auditLogs: "Audit Logs",
  domain: "Domain",
  permissions: "Permissions",
  adminUsers: "Admin Users",
};

export default function AddRoleDialog({ open, onOpenChange, role }: AddRoleDialogProps) {
  const { toast } = useToast();
  const { data: subsData, loading: subsLoading } = useQuery(CHECK_ENTITY_SUBSCRIPTIONS);
  const { data: modulesData, loading: modulesLoading } = useGetAvailableModules();

  const [createRole, { loading: creating }] = useCreateRole({
    onCompleted: () => {
      toast({ title: "Role created" });
      onOpenChange(false);
    },
    onError: (err: ApolloError) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const [updateRole, { loading: updating }] = useUpdateRole({
    onCompleted: () => {
      toast({ title: "Role updated" });
      onOpenChange(false);
    },
    onError: (err: ApolloError) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const defaultAdminAccess = {
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
    users:false,
  };

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [adminAccess, setAdminAccess] = useState<Record<string, boolean>>(defaultAdminAccess);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    if (role && open) {
      setFormData({ name: role.name, description: role.description || "" });
      const newAdminAccess = { ...defaultAdminAccess };
      if (role.adminAccess) {
        Object.keys(newAdminAccess).forEach((key) => {
          const typedKey = key as keyof typeof newAdminAccess;
          if (role.adminAccess[typedKey] !== undefined) {
            newAdminAccess[typedKey] = !!role.adminAccess[typedKey];
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
      setAdminAccess(defaultAdminAccess);
      setPermissions({});
    }
  }, [role, open]);

  const togglePermission = (moduleId: string, type: string) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || { Read: false, Create: false, Edit: false, Delete: false }),
        [type]: !prev[moduleId]?.[type],
      },
    }));
  };

  const toggleAdminAccess = (key: string) => {
    setAdminAccess((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllAdminAccess = (checked: boolean) => {
    setAdminAccess(Object.fromEntries(Object.keys(adminAccess).map((k) => [k, checked])));
  };

  const toggleAllModulePermissions = (moduleId: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: { Read: checked, Create: checked, Edit: checked, Delete: checked },
    }));
  };

  const togglePermissionTypeForAllModules = (type: string, checked: boolean) => {
    const availableModules = modulesData?.getAvailableModules || [];
    setPermissions((prev) => {
      const next = { ...prev };
      availableModules.forEach((mod: string) => {
        next[mod] = {
          ...(next[mod] || { Read: false, Create: false, Edit: false, Delete: false }),
          [type]: checked,
        };
      });
      return next;
    });
  };

  const toggleAllPermissions = (checked: boolean) => {
    const availableModules = modulesData?.getAvailableModules || [];
    const allPerms: Record<string, Record<string, boolean>> = {};
    availableModules.forEach((mod: string) => {
      allPerms[mod] = {
        Read: checked,
        Create: checked,
        Edit: checked,
        Delete: checked,
      };
    });
    setPermissions(allPerms);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: "Role name is required", variant: "destructive" });
      return;
    }

    const modulePermissions = Object.entries(permissions)
      .filter(([_, perms]) => Object.values(perms).some((v) => v === true))
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
          },
        },
      });
    } else {
      createRole({
        variables: {
          input: {
            name: formData.name,
            description: formData.description,
            adminAccess: adminAccess as Partial<AdminAccess>,
            modulePermissions,
          },
        },
      });
    }
  };

  const isLoading = creating || updating;
  const availableModules = modulesData?.getAvailableModules || [];
  const allAdminSelected = Object.values(adminAccess).every((v) => v);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[780px] h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl border-border/50">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-5 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-muted-foreground shrink-0">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                {role ? "Edit role" : "Create role"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {role
                  ? "Update this role's name, permission scopes, and module access."
                  : "Define a new permission set for your workspace administrators."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="px-6 py-6 space-y-8">
              {/* SECTION 1: Basic Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Basic Information
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                      Role name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Content Manager"
                      required
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="description"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Description{" "}
                      <span className="text-muted-foreground/50 font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the purpose of this role..."
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              <Separator className="opacity-40" />

              {/* SECTION 2: Admin Access */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin access scopes
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Grants elevated access to platform administration areas.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={allAdminSelected}
                      onCheckedChange={(checked) => toggleAllAdminAccess(!!checked)}
                      className="h-4 w-4 rounded border-border/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                    />
                    <span className="text-xs font-medium text-muted-foreground">Select all</span>
                  </label>
                </div>

                {Object.keys(adminAccess).some((k) => adminAccess[k]) && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50/80 border border-amber-200/60 rounded-lg">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                    <p className="text-xs text-amber-700">
                      Some admin scopes grant broad access. Assign carefully.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-4 bg-muted/30 rounded-lg border border-border/50">
                  {Object.keys(adminAccess).map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2.5 p-2 rounded-md hover:bg-background cursor-pointer transition-colors group"
                    >
                      <Checkbox
                        id={`admin-${key}`}
                        checked={adminAccess[key]}
                        onCheckedChange={() => toggleAdminAccess(key)}
                        className="h-4 w-4 rounded border-border/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground shrink-0"
                      />
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {adminAccessLabels[key] ?? key}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Separator className="opacity-40" />

              {/* SECTION 3: Module Permissions */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Module permissions
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Control read and write access for each platform module.
                  </p>
                </div>

                <div className="rounded-lg border border-border/50 overflow-hidden bg-background">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow className="hover:bg-transparent border-border/40">
                        <TableHead className="w-[240px] py-3 px-4 text-xs font-semibold text-muted-foreground">
                          <div className="flex items-center gap-2.5">
                            <Checkbox
                              checked={
                                availableModules.length > 0 &&
                                availableModules.every((mod: string) =>
                                  permissionTypes.every((type) => !!permissions[mod]?.[type])
                                )
                              }
                              onCheckedChange={(checked) => toggleAllPermissions(!!checked)}
                              className="h-4 w-4 rounded border-border/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                            />
                            <span>Module</span>
                          </div>
                        </TableHead>
                        {permissionTypes.map((type) => (
                          <TableHead
                            key={type}
                            className="text-center py-3 text-xs font-semibold text-muted-foreground"
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <span>{type}</span>
                              <Checkbox
                                checked={
                                  availableModules.length > 0 &&
                                  availableModules.every((mod: string) => !!permissions[mod]?.[type])
                                }
                                onCheckedChange={(checked) =>
                                  togglePermissionTypeForAllModules(type, !!checked)
                                }
                                className="h-3.5 w-3.5 rounded border-border/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
                              />
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modulesLoading || subsLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i} className="border-border/30">
                              <TableCell className="px-4 py-3">
                                <Skeleton className="h-4 w-32" />
                              </TableCell>
                              {permissionTypes.map((t) => (
                                <TableCell key={t} className="text-center">
                                  <Skeleton className="h-4 w-4 mx-auto rounded" />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        : availableModules.map((moduleName: string) => {
                            const allChecked = permissionTypes.every(
                              (type) => !!permissions[moduleName]?.[type]
                            );
                            return (
                              <TableRow
                                key={moduleName}
                                className="hover:bg-muted/20 border-border/30 last:border-0 transition-colors"
                              >
                                <TableCell className="px-4 py-3">
                                  <label className="flex items-center gap-2.5 cursor-pointer">
                                    <Checkbox
                                      checked={allChecked}
                                      onCheckedChange={(checked) =>
                                        toggleAllModulePermissions(moduleName, !!checked)
                                      }
                                      className="h-4 w-4 rounded border-border/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground shrink-0"
                                    />
                                    <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                                      <ModuleIcon name={moduleName} className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm font-medium capitalize text-foreground">
                                      {moduleName}
                                    </span>
                                  </label>
                                </TableCell>
                                {permissionTypes.map((type) => (
                                  <TableCell key={type} className="text-center">
                                    <Checkbox
                                      checked={!!permissions[moduleName]?.[type]}
                                      onCheckedChange={() => togglePermission(moduleName, type)}
                                      className="h-4 w-4 rounded border-border/60 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground mx-auto"
                                    />
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

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/40 flex items-center justify-end gap-2 shrink-0">
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
              type="submit"
              size="sm"
              disabled={isLoading || !formData.name.trim()}
              className="h-9 px-5 font-medium gap-2"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {role ? "Save changes" : "Create role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
