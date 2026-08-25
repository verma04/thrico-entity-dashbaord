"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { CHECK_ENTITY_SUBSCRIPTIONS } from "@/graphql/quries";
import { useGetAvailableModules, AdminAccess } from "@/graphql/actions";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
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

  if (
    rawModules &&
    typeof rawModules === "object" &&
    !Array.isArray(rawModules)
  ) {
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
            <div className="space-y-4">
              {/* Live Role Preview */}
              <PolarisSidebarCard
                title="Role Preview"
                badge="Live Policy"
                icon={Sparkles}
              >
                <RolePreview
                  formData={formData}
                  adminAccess={adminAccess}
                  permissions={permissions}
                  adminAccessLabels={adminAccessLabels}
                  groupedModules={groupedModules}
                />

                {/* Structured Configuration Breakdown */}
                <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
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
                Combine granular Read/Create/Edit/Delete permissions to tailor
                roles precisely to staff functions (e.g. Content Author vs
                Moderator).
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Step 1: Role Identity & Full Admin Access */}
            <PolarisFormCard
              step={1}
              title="Role Identity & Administrative Level"
              description="Establish role designation, description, and high-level privilege level."
              badge="Required"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                  >
                    Role Designation / Name{" "}
                    <span className="text-[#d72c0d] ml-0.5">*</span>
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Senior Community Moderator"
                    className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                  />
                  {!formData.name.trim() && isDirty && (
                    <p className="text-[12.5px] text-[#d72c0d] font-normal leading-[18px]">
                      Role name is required
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="description"
                    className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none block"
                  >
                    Scope Description{" "}
                    <span className="text-[#616161] font-normal">
                      (Optional)
                    </span>
                  </label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Explain permissions and responsibilities..."
                    className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                  />
                </div>
              </div>

              {/* Full Admin Access Switch Card */}
              <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <div className="flex items-center justify-between p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40">
                  <div className="space-y-0.5">
                    <label className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 flex items-center gap-1.5 cursor-pointer">
                      <ShieldCheck className="w-4 h-4 text-[#303030] dark:text-zinc-100" />
                      Grant Full Superadmin Privileges
                    </label>
                    <p className="text-[11.5px] text-[#616161] dark:text-zinc-400">
                      Instantly grant unrestricted access to every platform
                      module and system configuration.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-zinc-800 border border-[#aeb4b9] dark:border-zinc-700 px-3 py-1.5 rounded-[6px] hover:bg-[#f6f6f7] transition-colors">
                    <Checkbox
                      checked={isFullAdmin}
                      onCheckedChange={(c) => handleFullAdminChange(!!c)}
                      className="h-4 w-4 rounded-[4px]"
                    />
                    <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
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
              <div className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-[8px] bg-[#f6f6f7]/60 dark:bg-zinc-900/60 border border-[#d2d5d9] dark:border-zinc-800">
                <span className="text-[11.5px] font-semibold text-[#616161] uppercase tracking-wider">
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
                          "text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-[4px] border transition-all cursor-pointer",
                          allOfType
                            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                            : "bg-white dark:bg-zinc-800 text-[#616161] border-[#d2d5d9] dark:border-zinc-700 hover:border-[#aeb4b9]",
                        )}
                      >
                        {type}
                      </button>
                    );
                  })}
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 px-2.5 py-1 rounded-[4px] ml-1">
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
                      className="h-3.5 w-3.5 rounded-[3px]"
                    />
                    <span className="text-[10px] font-bold uppercase">All</span>
                  </label>
                </div>
              </div>

              {/* Module Accordions */}
              {modulesLoading || subsLoading ? (
                <div className="space-y-2.5 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-[8px]" />
                  ))}
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2.5 pt-2">
                  {categories.map((category) => {
                    const modulesInCategory = groupedModules[category];

                    const allCategoryChecked = modulesInCategory.every((mod) =>
                      permissionTypes.every(
                        (type) => !!permissions[mod]?.[type],
                      ),
                    );
                    const anyCategoryChecked = modulesInCategory.some((mod) =>
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
                        className="border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 rounded-[8px] overflow-hidden px-2"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={allCategoryChecked}
                            onCheckedChange={(c) =>
                              toggleCategoryPermissions(!!c)
                            }
                            className={cn(
                              "ml-3 h-4 w-4 rounded-[4px]",
                              anyCategoryChecked &&
                                !allCategoryChecked &&
                                "bg-[#303030]/40",
                            )}
                          />
                          <AccordionTrigger className="hover:no-underline py-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[13px] text-[#303030] dark:text-zinc-100">
                                {category}
                              </span>
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-4 px-1.5 font-bold bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 rounded-[4px]"
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
                                  "group flex flex-col md:flex-row md:items-center gap-3 px-3.5 py-2.5 rounded-[6px] border transition-all",
                                  anyChecked
                                    ? "bg-[#f6f6f7]/70 dark:bg-zinc-800/40 border-[#aeb4b9] dark:border-zinc-700"
                                    : "bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800",
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
                                    className="h-4 w-4 rounded-[4px] shrink-0"
                                  />
                                  <div className="h-7 w-7 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-[#d2d5d9] dark:border-zinc-700">
                                    <ModuleIcon
                                      name={moduleName}
                                      className="w-3.5 h-3.5 text-[#616161] dark:text-zinc-400"
                                    />
                                  </div>
                                  <span className="text-[12.5px] font-medium capitalize text-[#303030] dark:text-zinc-100 truncate">
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
                                          "flex items-center gap-1 px-2.5 py-1 rounded-[4px] text-[11px] font-semibold border transition-all cursor-pointer",
                                          isChecked
                                            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                                            : "bg-[#f6f6f7] text-[#616161] border-[#d2d5d9] hover:border-[#aeb4b9]",
                                        )}
                                      >
                                        <div
                                          className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            isChecked
                                              ? "bg-white dark:bg-zinc-900"
                                              : "bg-[#8c9196] dark:bg-zinc-600",
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
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-300">
                    Administrative Scope Permissions
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[12px] font-semibold text-[#303030] dark:text-zinc-300">
                    <Checkbox
                      checked={allAdminSelected}
                      onCheckedChange={(checked) =>
                        toggleAllAdminAccess(!!checked)
                      }
                      className="h-3.5 w-3.5 rounded-[3px]"
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
                          "flex items-center gap-2.5 p-3 rounded-[8px] border text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
                            : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleAdminAccess(key)}
                          className="h-4 w-4 rounded-[4px] shrink-0 pointer-events-none"
                        />
                        <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 truncate">
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
