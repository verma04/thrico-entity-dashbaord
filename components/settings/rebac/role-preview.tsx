"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  ShieldAlert,
  Check,
  X,
} from "lucide-react";
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
    <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
      <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
      <CardContent className="pt-6 space-y-5">
        {/* Role Identity */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-lg leading-tight truncate">
              {formData.name || "Role Name"}
            </h4>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {formData.description || "No description provided"}
            </p>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Admin Access Summary */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <ShieldAlert className="h-3 w-3" />
            Admin Scopes
            <Badge
              variant="secondary"
              className="ml-auto text-[10px] px-1.5 py-0"
            >
              {activeAdminScopes.length}/{Object.keys(adminAccessLabels).length}
            </Badge>
          </h5>
          {activeAdminScopes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {activeAdminScopes.map(([key]) => (
                <Badge
                  key={key}
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 bg-amber-500/5 text-amber-700 border-amber-500/20"
                >
                  {adminAccessLabels[key] ?? key}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-10 border-2 border-dashed rounded-md bg-muted/50">
              <p className="text-[11px] text-muted-foreground">
                No admin scopes assigned
              </p>
            </div>
          )}
        </div>

        <Separator className="opacity-50" />

        {/* Module Permissions Summary */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Module Access
            <Badge
              variant="secondary"
              className="ml-2 text-[10px] px-1.5 py-0"
            >
              {activeModules.length} modules
            </Badge>
          </h5>
          {activeModules.length > 0 ? (
            <div className="space-y-4">
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
                  <div key={category} className="space-y-2">
                    <h6 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">{category}</h6>
                    {modulesInCategory.map(([moduleName, perms]: [string, any]) => (
                      <div
                        key={moduleName}
                        className="flex items-center gap-2.5 p-2.5 rounded-md bg-muted/40 border border-border/40"
                      >
                        <div className="h-7 w-7 rounded bg-background flex items-center justify-center border border-border/50 shrink-0">
                          <ModuleIcon name={moduleName} className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-semibold capitalize flex-1 truncate">
                          {moduleName.replace(/_/g, " ")}
                        </span>
                        <div className="flex gap-1">
                          {(["Read", "Create", "Edit", "Delete"] as const).map(
                            (type) => (
                              <span
                                key={type}
                                className={`text-[9px] w-5 h-5 rounded flex items-center justify-center ${
                                  perms[type]
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-muted text-muted-foreground/40"
                                }`}
                                title={type}
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
            <div className="flex items-center justify-center h-10 border-2 border-dashed rounded-md bg-muted/50">
              <p className="text-[11px] text-muted-foreground">
                No module permissions assigned
              </p>
            </div>
          )}
        </div>

        <p className="text-[10px] text-center text-muted-foreground italic pt-2">
          Preview version — Final role summary may vary
        </p>
      </CardContent>
    </Card>
  );
}
