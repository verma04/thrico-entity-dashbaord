"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { CHECK_ENTITY_SUBSCRIPTIONS } from "@/graphql/quries";
import { useGetAvailableModules, AdminAccess } from "@/graphql/actions";
import {
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Loader2,
  Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ModuleIcon } from "./module-icon";
import { RolePreview } from "./role-preview";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  EcosystemHeader,
  EcosystemWrapper,
} from "@/components/layout/ecosystem";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";

interface RoleCreationFormProps {
  initialValues?: any;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
}

const permissionTypes = ["Read", "Create", "Edit", "Delete"] as const;

const adminAccessLabels: Record<string, string> = {
  reports: "Reports & Analytics",
  settings: "Workspace Settings",
  subscription: "Billing & Plans",
  platformFeatures: "Feature Flags",
  appearance: "Theme & Branding",
  auditLogs: "Security Audit Logs",
  domain: "Custom Domains",
  permissions: "RBAC Governance",
  adminUsers: "Administrator Provisioning",
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

  const rawModules = modulesData?.getAvailableModules;
  let groupedModules: Record<string, string[]> = {};

  if (rawModules && typeof rawModules === "object" && !Array.isArray(rawModules)) {
    groupedModules = rawModules;
  } else if (Array.isArray(rawModules)) {
    groupedModules = { Modules: rawModules };
  }

  const availableModules = Object.values(groupedModules).flat() as string[];

  const defaultAdminAccess = {
    reports: false,
    settings: false,
    subscription: false,
    platformFeatures: false,
    appearance: false,
    auditLogs: false,
    domain: false,
    permissions: false,
    adminUsers: false,
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
    const newAdminAccess = {
      ...adminAccess,
      ...Object.fromEntries(
        Object.keys(adminAccessLabels).map((k) => [k, checked]),
      ),
    };
    setAdminAccess(newAdminAccess);
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

  const allAdminSelected = Object.values(adminAccess).every((v) => v);
  const isEditing = !!initialValues;

  const categories = Object.keys(groupedModules)
    .filter((c) => c !== "Other")
    .sort((a, b) => a.localeCompare(b));

  const isFullAdmin =
    Object.values(adminAccess).every(Boolean) &&
    availableModules.length > 0 &&
    availableModules.every((mod: string) =>
      permissionTypes.every((t) => !!permissions[mod]?.[t]),
    );

  const handleFullAdminChange = (checked: boolean) => {
    if (checked) {
      const allAdmin = Object.keys(adminAccessLabels).reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
      setAdminAccess(allAdmin);

      const allPerms = availableModules.reduce(
        (acc: any, mod: string) => {
          acc[mod] = { Read: true, Create: true, Edit: true, Delete: true };
          return acc;
        },
        {} as Record<string, Record<string, boolean>>,
      );
      setPermissions(allPerms);
    } else {
      setAdminAccess({ ...defaultAdminAccess });
      setPermissions({});
    }
    markDirty();
  };

  const activeAdminCount = Object.values(adminAccess).filter(Boolean).length;
  const activeModuleCount = Object.values(permissions).filter((p) =>
    Object.values(p).some(Boolean),
  ).length;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={isEditing ? "Edit Security Role" : "Create Security Role"}
        description={
          isEditing
            ? "Update role attributes, module CRUD capabilities, and administrative scopes."
            : "Define an authorization role with granular module permissions and administrative scopes."
        }
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Roles", href: "/settings/users/roles" },
          { label: isEditing ? "Edit Role" : "Create Role" },
        ]}
        icon={ShieldCheck}
        badgeText="Access & RBAC"
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* Live Role Preview */}
              <PolarisSidebarCard title="Role Preview" badge="Live Policy" icon={Sparkles}>
                <RolePreview
                  formData={formData}
                  adminAccess={adminAccess}
                  permissions={permissions}
                  adminAccessLabels={adminAccessLabels}
                  groupedModules={groupedModules}
                />

                {/* Structured Configuration Breakdown */}
                <div className="space-y-1.5 pt-2">
                  <PolarisSummaryRow
                    label="Role Title"
                    value={
                      <span className="truncate max-w-[150px] inline-block font-semibold">
                        {formData.name || "Not specified"}
                      </span>
                    }
                  />
                  <PolarisSummaryRow
                    label="Authorized Modules"
                    value={`${activeModuleCount} of ${availableModules.length}`}
                  />
                  <PolarisSummaryRow
                    label="Admin Scopes"
                    value={`${activeAdminCount} of ${Object.keys(adminAccessLabels).length}`}
                  />
                  <PolarisSummaryRow
                    label="Full Access"
                    value={isFullAdmin ? "Superadmin" : "Restricted"}
                    isLast
                  />
                </div>
              </PolarisSidebarCard>

              {/* RBAC Strategy Tip */}
              <PolarisTipCard title="RBAC Policy Tip">
                Combine granular Read/Create/Edit/Delete permissions to tailor roles precisely to staff functions (e.g. Content Author vs Moderator).
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Step 1: Role Identity & Full Admin Access */}
            <PolarisFormCard
              step={1}
              title="Role Identity & Administrative Level"
              description="Establish role designation, description, and high-level privilege level."
              badge="Required"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Role Designation / Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                    placeholder="e.g., Senior Community Moderator"
                    className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  />
                  {!formData.name.trim() && isDirty && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      Role name is required
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Scope Description <span className="text-zinc-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Explain permissions and responsibilities..."
                    className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Full Admin Access Switch Card */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                      Grant Full Superadmin Privileges
                    </Label>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      Instantly grant unrestricted access to every platform module and system configuration.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                    <Checkbox
                      checked={isFullAdmin}
                      onCheckedChange={(c) => handleFullAdminChange(!!c)}
                      className="h-4 w-4 rounded"
                    />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Grant All
                    </span>
                  </label>
                </div>
              </div>
            </PolarisFormCard>

            {/* Step 2: Module Permission Matrix */}
            <PolarisFormCard
              step={2}
              title="Granular Module Permission Matrix"
              description="Define specific Create, Read, Edit, and Delete authorization flags across each module."
              badge="CRUD Matrix"
            >
              {/* Global Permission Type Quick Select */}
              <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Bulk Quick-Toggle:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
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
                          togglePermissionTypeForAllModules(type, !allOfType)
                        }
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border transition-all cursor-pointer",
                          allOfType
                            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                            : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300",
                        )}
                      >
                        {type}
                      </button>
                    );
                  })}
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-md ml-1">
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
                      className="h-3.5 w-3.5 rounded"
                    />
                    <span className="text-[10px] font-bold uppercase">All</span>
                  </label>
                </div>
              </div>

              {/* Module Accordions */}
              {modulesLoading || subsLoading ? (
                <div className="space-y-2.5 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-3 pt-2">
                  {categories.map((category) => {
                    const modulesInCategory = groupedModules[category];

                    const allCategoryChecked = modulesInCategory.every(
                      (mod) =>
                        permissionTypes.every(
                          (type) => !!permissions[mod]?.[type],
                        ),
                    );
                    const anyCategoryChecked = modulesInCategory.some(
                      (mod) =>
                        permissionTypes.some(
                          (type) => !!permissions[mod]?.[type],
                        ),
                    );

                    const toggleCategoryPermissions = (checked: boolean) => {
                      setPermissions((prev) => {
                        const next = { ...prev };
                        modulesInCategory.forEach((mod) => {
                          next[mod] = {
                            Read: checked,
                            Create: checked,
                            Edit: checked,
                            Delete: checked,
                          };
                        });
                        return next;
                      });
                      markDirty();
                    };

                    return (
                      <AccordionItem
                        value={category}
                        key={category}
                        className="border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 rounded-xl overflow-hidden px-2"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={allCategoryChecked}
                            onCheckedChange={(c) =>
                              toggleCategoryPermissions(!!c)
                            }
                            className={cn(
                              "ml-3 h-4 w-4 rounded",
                              anyCategoryChecked && !allCategoryChecked && "bg-zinc-900/40",
                            )}
                          />
                          <AccordionTrigger className="hover:no-underline py-3.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                                {category}
                              </span>
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-4 px-1.5 font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                              >
                                {modulesInCategory.length}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                        </div>

                        <AccordionContent className="pt-0 pb-3 px-3 space-y-2">
                          {modulesInCategory.map((moduleName: string) => {
                            const allChecked = permissionTypes.every(
                              (type) => !!permissions[moduleName]?.[type],
                            );
                            const anyChecked = permissionTypes.some(
                              (type) => !!permissions[moduleName]?.[type],
                            );
                            return (
                              <div
                                key={moduleName}
                                className={cn(
                                  "group flex flex-col md:flex-row md:items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all",
                                  anyChecked
                                    ? "bg-zinc-50/70 dark:bg-zinc-800/40 border-zinc-300 dark:border-zinc-700"
                                    : "bg-white dark:bg-zinc-900 border-zinc-200/70 dark:border-zinc-800",
                                )}
                              >
                                <div className="flex items-center gap-2.5 md:w-1/3">
                                  <Checkbox
                                    checked={allChecked}
                                    onCheckedChange={(checked) =>
                                      toggleAllModulePermissions(
                                        moduleName,
                                        !!checked,
                                      )
                                    }
                                    className="h-4 w-4 rounded shrink-0"
                                  />
                                  <div className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                                    <ModuleIcon
                                      name={moduleName}
                                      className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400"
                                    />
                                  </div>
                                  <span className="text-xs font-semibold capitalize text-zinc-900 dark:text-zinc-100 truncate">
                                    {moduleName.replace(/_/g, " ")}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 md:ml-auto">
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
                                        className={cn(
                                          "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer",
                                          isChecked
                                            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                                            : "bg-zinc-100/70 dark:bg-zinc-800/70 text-zinc-500 dark:text-zinc-400 border-transparent hover:border-zinc-300",
                                        )}
                                      >
                                        <div
                                          className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            isChecked
                                              ? "bg-white dark:bg-zinc-900"
                                              : "bg-zinc-300 dark:bg-zinc-600",
                                          )}
                                        />
                                        {type}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </PolarisFormCard>

            {/* Step 3: Platform Settings & Administrative Scopes */}
            <PolarisFormCard
              step={3}
              title="System Governance & Administrative Scopes"
              description="Authorize access to core workspace infrastructure, billing, and platform controls."
              badge="Admin Scopes"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Administrative Scope Permissions
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <Checkbox
                      checked={allAdminSelected}
                      onCheckedChange={(checked) =>
                        toggleAllAdminAccess(!!checked)
                      }
                      className="h-3.5 w-3.5 rounded"
                    />
                    <span>Select All Scopes</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {Object.keys(adminAccessLabels).map((key) => {
                    const isSelected = adminAccess[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleAdminAccess(key)}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900/[0.04] dark:bg-zinc-100/10 ring-2 ring-zinc-900/20 dark:ring-zinc-100/20 shadow-xs"
                            : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700",
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleAdminAccess(key)}
                          className="h-4 w-4 rounded shrink-0 pointer-events-none"
                        />
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {adminAccessLabels[key] ?? key}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </PolarisFormCard>

            {/* Floating Action Bar */}
            <FloatingSavePanel
              hasChanged={isDirty}
              saved={false}
              isSaving={loading}
              onSave={handleSubmit}
              onReset={handleReset}
              title={isEditing ? "Save Role Changes" : "Create Security Role"}
              description="You have unsaved changes to this RBAC policy."
              buttonText={isEditing ? "Save Changes" : "Create Role"}
            />
          </div>
        </PolarisFormLayout>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
