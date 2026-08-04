"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { CHECK_ENTITY_SUBSCRIPTIONS } from "@/graphql/quries";
import { useGetAvailableModules, AdminAccess } from "@/graphql/actions";
import {
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Info,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModuleIcon } from "./module-icon";
import { RolePreview } from "./role-preview";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  EcosystemActionBar,
  EcosystemHeader,
  EcosystemWrapper,
} from "@/components/layout/ecosystem";
import { CtaButton } from "@/components/ui/cta-button";

interface RoleCreationFormProps {
  initialValues?: any;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
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
  users: "Users",
};

export function RoleCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: RoleCreationFormProps) {
  const { data: subsData, loading: subsLoading } = useQuery(
    CHECK_ENTITY_SUBSCRIPTIONS,
  );
  const { data: modulesData, loading: modulesLoading } =
    useGetAvailableModules();

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
    users: false,
  };

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [adminAccess, setAdminAccess] =
    useState<Record<string, boolean>>(defaultAdminAccess);
  const [permissions, setPermissions] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name,
        description: initialValues.description || "",
      });
      const newAdminAccess = { ...defaultAdminAccess };
      if (initialValues.adminAccess) {
        Object.keys(newAdminAccess).forEach((key) => {
          const typedKey = key as keyof typeof newAdminAccess;
          if (initialValues.adminAccess[typedKey] !== undefined) {
            newAdminAccess[typedKey] = !!initialValues.adminAccess[typedKey];
          }
        });
      }
      setAdminAccess(newAdminAccess);
      const newPerms: Record<string, Record<string, boolean>> = {};
      initialValues.modulePermissions?.forEach((p: any) => {
        newPerms[p.module] = {
          Read: !!p.canRead,
          Create: !!p.canCreate,
          Edit: !!p.canEdit,
          Delete: !!p.canDelete,
        };
      });
      setPermissions(newPerms);
    }
  }, [initialValues]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleInputChange = (field: "name" | "description", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const togglePermission = (moduleId: string, type: string) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...(prev[moduleId] || {
          Read: false,
          Create: false,
          Edit: false,
          Delete: false,
        }),
        [type]: !prev[moduleId]?.[type],
      },
    }));
    markDirty();
  };

  const toggleAdminAccess = (key: string) => {
    setAdminAccess((prev) => ({ ...prev, [key]: !prev[key] }));
    markDirty();
  };

  const toggleAllAdminAccess = (checked: boolean) => {
    setAdminAccess(
      Object.fromEntries(Object.keys(adminAccess).map((k) => [k, checked])),
    );
    markDirty();
  };

  const toggleAllModulePermissions = (moduleId: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        Read: checked,
        Create: checked,
        Edit: checked,
        Delete: checked,
      },
    }));
    markDirty();
  };

  const togglePermissionTypeForAllModules = (
    type: string,
    checked: boolean,
  ) => {
    const availableModules = modulesData?.getAvailableModules || [];
    setPermissions((prev) => {
      const next = { ...prev };
      availableModules.forEach((mod: string) => {
        next[mod] = {
          ...(next[mod] || {
            Read: false,
            Create: false,
            Edit: false,
            Delete: false,
          }),
          [type]: checked,
        };
      });
      return next;
    });
    markDirty();
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
    markDirty();
  };

  const handleSubmit = () => {
    const modulePermissions = Object.entries(permissions)
      .filter(([_, perms]) => Object.values(perms).some((v) => v === true))
      .map(([moduleName, perms]) => ({
        module: moduleName,
        canRead: !!perms.Read,
        canCreate: !!perms.Create,
        canEdit: !!perms.Edit,
        canDelete: !!perms.Delete,
      }));

    onFinish({
      name: formData.name,
      description: formData.description,
      adminAccess,
      modulePermissions,
    });
  };

  const handleReset = () => {
    if (onCancel) {
      onCancel();
    } else {
      window.history.back();
    }
  };

  const availableModules = modulesData?.getAvailableModules || [];
  const allAdminSelected = Object.values(adminAccess).every((v) => v);
  const isEditing = !!initialValues;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={isEditing ? "Edit Role" : "Create Role"}
        description={
          isEditing
            ? "Update role settings and permissions."
            : "Define a new role and its access levels."
        }
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Roles", href: "/settings/users/roles" },
          { label: isEditing ? "Edit" : "Create" },
        ]}
        icon={ShieldCheck}
        badgeText="Access & RBAC"
        showLiveIndicator={false}
        actions={
          <EcosystemActionBar
            shadow="none"
            className="p-0 border-none bg-transparent gap-2"
          >
            <EcosystemActionBar.Group align="right">
              <CtaButton
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                Cancel
              </CtaButton>
              <CtaButton
                onClick={handleSubmit}
                disabled={
                  !formData.name.trim() || loading || (!isDirty && !isEditing)
                }
              >
                {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Role"}
              </CtaButton>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-xl">Basic Information</CardTitle>
                  <CardDescription>
                    Define the role's identity and purpose
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Role Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="e.g. Content Manager"
                        className="h-10"
                      />
                      {!formData.name.trim() && isDirty && (
                        <p className="text-xs text-destructive">
                          Role name is required
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description{" "}
                        <span className="text-muted-foreground/50 font-normal">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Describe the purpose of this role..."
                        className="h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Admin Access Scopes
                      </CardTitle>
                      <CardDescription>
                        Grants elevated access to platform administration areas
                      </CardDescription>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer bg-background border px-3 py-1.5 rounded-lg">
                      <Checkbox
                        checked={allAdminSelected}
                        onCheckedChange={(checked) =>
                          toggleAllAdminAccess(!!checked)
                        }
                        className="h-4 w-4 rounded border-border/60"
                      />
                      <span className="text-xs font-medium">
                        Select all scopes
                      </span>
                    </label>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {Object.keys(adminAccess).some((k) => adminAccess[k]) && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50/80 border border-amber-200/60 rounded-lg">
                      <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-700">
                        Some admin scopes grant broad access. Assign carefully.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4 bg-muted/30 rounded-lg border border-border/50">
                    {Object.keys(adminAccess).map((key) => (
                      <label
                        key={key}
                        className="flex items-center gap-2.5 p-3 rounded-md bg-background border hover:bg-muted/50 cursor-pointer transition-colors group"
                      >
                        <Checkbox
                          id={`admin-${key}`}
                          checked={adminAccess[key]}
                          onCheckedChange={() => toggleAdminAccess(key)}
                          className="h-4 w-4 rounded border-border/60 shrink-0"
                        />
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {adminAccessLabels[key] ?? key}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-xl">
                        Module Permissions
                      </CardTitle>
                      <CardDescription>
                        Control read and write access for each platform module
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {permissionTypes.map((type) => {
                        const allOfType =
                          availableModules.length > 0 &&
                          availableModules.every(
                            (mod: string) => !!permissions[mod]?.[type],
                          );
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() =>
                              togglePermissionTypeForAllModules(
                                type,
                                !allOfType,
                              )
                            }
                            className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border transition-all ${
                              allOfType
                                ? "bg-primary/10 text-primary border-primary/30"
                                : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                      <Separator orientation="vertical" className="h-6 mx-1" />
                      <label className="flex items-center gap-2 cursor-pointer bg-background border px-3 py-1.5 rounded-lg">
                        <Checkbox
                          checked={
                            availableModules.length > 0 &&
                            availableModules.every((mod: string) =>
                              permissionTypes.every(
                                (type) => !!permissions[mod]?.[type],
                              ),
                            )
                          }
                          onCheckedChange={(checked) =>
                            toggleAllPermissions(!!checked)
                          }
                          className="h-4 w-4 rounded border-border/60"
                        />
                        <span className="text-xs font-medium">All</span>
                      </label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {modulesLoading || subsLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className="h-[60px] w-full rounded-xl"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableModules.map((moduleName: string) => {
                        const allChecked = permissionTypes.every(
                          (type) => !!permissions[moduleName]?.[type],
                        );
                        const anyChecked = permissionTypes.some(
                          (type) => !!permissions[moduleName]?.[type],
                        );
                        return (
                          <div
                            key={moduleName}
                            className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${
                              anyChecked
                                ? "bg-primary/[0.02] border-primary/20 ring-1 ring-primary/10"
                                : "bg-background border-border/50 hover:border-border hover:bg-muted/20"
                            }`}
                          >
                            <Checkbox
                              checked={allChecked}
                              onCheckedChange={(checked) =>
                                toggleAllModulePermissions(
                                  moduleName,
                                  !!checked,
                                )
                              }
                              className="h-4 w-4 rounded border-border/60 shrink-0"
                            />

                            <div className="flex items-center gap-3 min-w-[160px]">
                              <div
                                className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                  anyChecked
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "bg-muted text-muted-foreground border border-border/50"
                                }`}
                              >
                                <ModuleIcon
                                  name={moduleName}
                                  className="w-4 h-4"
                                />
                              </div>
                              <span className="text-sm font-semibold capitalize text-foreground">
                                {moduleName.replace(/_/g, " ")}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                              {permissionTypes.map((type) => {
                                const isChecked =
                                  !!permissions[moduleName]?.[type];
                                return (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() =>
                                      togglePermission(moduleName, type)
                                    }
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                      isChecked
                                        ? "bg-primary/10 text-primary border-primary/25 hover:bg-primary/15"
                                        : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted/80 hover:text-foreground"
                                    }`}
                                  >
                                    <div
                                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                        isChecked
                                          ? "bg-primary"
                                          : "bg-muted-foreground/30"
                                      }`}
                                    />
                                    {type}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Live Preview Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Role Preview</h3>
                  <Badge
                    variant="outline"
                    className="bg-green-500/5 text-green-600 border-green-500/20"
                  >
                    Live Preview
                  </Badge>
                </div>

                <RolePreview
                  formData={formData}
                  adminAccess={adminAccess}
                  permissions={permissions}
                  adminAccessLabels={adminAccessLabels}
                />

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Info className="h-5 w-5" />
                      Tips for Roles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          Use descriptive names like "Content Editor" or
                          "Community Manager"
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          Follow the principle of least privilege — only grant
                          necessary permissions
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          Admin scopes grant broad access to sensitive areas —
                          assign carefully
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          Module permissions control create, read, edit, and
                          delete actions per feature
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

    </EcosystemWrapper>
  );
}
