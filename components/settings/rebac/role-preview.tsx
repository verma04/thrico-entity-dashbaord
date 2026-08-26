"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModuleIcon } from "./module-icon";

interface RolePreviewProps {
  formData: {
    name: string;
    description: string;
  };
  permissions: Record<string, Record<string, boolean>>;
  groupedModules: Record<string, string[]>;
}

export function RolePreview({
  formData,
  permissions,
  groupedModules,
}: RolePreviewProps) {
  const activeModules = Object.entries(permissions).filter(([_, perms]) =>
    Object.values(perms).some((v) => v),
  );

  return (
    <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3.5 space-y-3 shadow-xs">
      {/* Role Identity */}
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-[6px] bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-[14px] text-[#303030] dark:text-zinc-100 truncate">
            {formData.name || "Role Name"}
          </h4>
          <p className="text-[12px] text-[#616161] dark:text-zinc-400 mt-0.5 line-clamp-2 leading-[16px]">
            {formData.description || "No description provided"}
          </p>
        </div>
      </div>

      {/* Module Permissions Summary */}
      <div className="space-y-2 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#616161]">
          <span>Module Access</span>
          <span>{activeModules.length} modules</span>
        </div>

        {activeModules.length > 0 ? (
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {Object.entries(
              activeModules.reduce((acc: any, [moduleName, perms]) => {
                let cat = "Other";
                for (const [category, modules] of Object.entries(
                  groupedModules,
                )) {
                  if (modules.includes(moduleName)) {
                    cat = category;
                    break;
                  }
                }
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push([moduleName, perms]);
                return acc;
              }, {}),
            ).map(([category, mods]: [string, any]) => (
              <div key={category} className="space-y-1">
                <span className="text-[10px] font-bold text-[#8c9196] uppercase tracking-wider">
                  {category}
                </span>
                <div className="space-y-1">
                  {mods.map(([modName, perms]: [string, any]) => (
                    <div
                      key={modName}
                      className="flex items-center justify-between p-1.5 rounded-[4px] bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <ModuleIcon
                          name={modName}
                          className="w-3 h-3 text-[#616161] shrink-0"
                        />
                        <span className="text-[11.5px] font-medium capitalize text-[#303030] dark:text-zinc-100 truncate">
                          {modName.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {Object.entries(perms)
                          .filter(([_, v]) => v)
                          .map(([type]) => (
                            <span
                              key={type}
                              className="text-[9px] font-bold px-1 py-0.2 rounded-[2px] bg-[#f6f6f7] text-[#303030] border border-[#d2d5d9] uppercase"
                            >
                              {type[0]}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-10 border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[6px] bg-[#f6f6f7]/60 dark:bg-zinc-800/30">
            <p className="text-[11.5px] text-[#8c9196] font-medium">
              No module permissions configured
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
