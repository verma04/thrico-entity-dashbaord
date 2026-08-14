"use client";

import { ShieldCheck, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModuleIcon } from "./module-icon";

interface RolePreviewProps {
  formData: {
    name: string;
    description: string;
  };
  adminAccess: Record<string, boolean>;
  permissions: Record<string, Record<string, boolean>>;
  adminAccessLabels: Record<string, string>;
  groupedModules: Record<string, string[]>;
}

export function RolePreview({
  formData,
  adminAccess,
  permissions,
  adminAccessLabels,
  groupedModules,
}: RolePreviewProps) {
  const activeAdminScopes = Object.entries(adminAccess).filter(
    ([key, v]) => v && key in adminAccessLabels
  );
  const activeModules = Object.entries(permissions).filter(([_, perms]) =>
    Object.values(perms).some((v) => v)
  );

  return (
    <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 space-y-4 shadow-xs">
      {/* Role Identity */}
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
            {formData.name || "Role Name"}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
            {formData.description || "No description provided"}
          </p>
        </div>
      </div>

      {/* Admin Access Scopes */}
      <div className="space-y-1.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          <span className="flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Admin Scopes
          </span>
          <span>
            {activeAdminScopes.length}/{Object.keys(adminAccessLabels).length}
          </span>
        </div>
        {activeAdminScopes.length > 0 ? (
          <div className="flex flex-wrap gap-1 pt-1">
            {activeAdminScopes.map(([key]) => (
              <span
                key={key}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-900/5 text-zinc-800 dark:bg-zinc-100/10 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
              >
                {adminAccessLabels[key] ?? key}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-9 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100/50 dark:bg-zinc-800/30">
            <p className="text-[11px] text-zinc-400 font-medium">
              No admin scopes assigned
            </p>
          </div>
        )}
      </div>

      {/* Module Permissions Summary */}
      <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          <span>Module Access</span>
          <span>{activeModules.length} modules</span>
        </div>

        {activeModules.length > 0 ? (
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {Object.entries(
              activeModules.reduce((acc: any, [moduleName, perms]) => {
                let cat = "Other";
                for (const [category, modules] of Object.entries(groupedModules)) {
                  if (modules.includes(moduleName)) {
                    cat = category;
                    break;
                  }
                }
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push([moduleName, perms]);
                return acc;
              }, {} as Record<string, [string, Record<string, boolean>][]>)
            )
              .sort(([a], [b]) => {
                if (a === "Other") return 1;
                if (b === "Other") return -1;
                return a.localeCompare(b);
              })
              .map(([category, modulesInCategory]: [string, any]) => (
                <div key={category} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    {category}
                  </span>
                  {modulesInCategory.map(([moduleName, perms]: [string, any]) => (
                    <div
                      key={moduleName}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80"
                    >
                      <div className="h-6 w-6 rounded bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                        <ModuleIcon name={moduleName} className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold capitalize flex-1 truncate text-zinc-800 dark:text-zinc-200">
                        {moduleName.replace(/_/g, " ")}
                      </span>
                      <div className="flex gap-0.5">
                        {(["Read", "Create", "Edit", "Delete"] as const).map(
                          (type) => (
                            <span
                              key={type}
                              className={`text-[9px] font-bold w-4 h-4 rounded flex items-center justify-center ${
                                perms[type]
                                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                  : "bg-zinc-100 text-zinc-400 dark:bg-zinc-700/50 dark:text-zinc-500"
                              }`}
                              title={`${type}: ${perms[type] ? "Allowed" : "Denied"}`}
                            >
                              {type[0]}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-9 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100/50 dark:bg-zinc-800/30">
            <p className="text-[11px] text-zinc-400 font-medium">
              No module permissions granted
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
