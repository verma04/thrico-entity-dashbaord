import React from "react";
import { Button } from "@/components/ui/button";
import { renderModuleIcon } from "@/components/subscription/utils";

interface ModuleFilterProps {
  selectedModule: string | "ALL";
  setSelectedModule: (module: string | "ALL") => void;
  modules: { id: string; name: string; icon: string }[];
}

export function ModuleFilter({
  selectedModule,
  setSelectedModule,
  modules,
}: ModuleFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={selectedModule === "ALL" ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedModule("ALL")}
      >
        All Modules
      </Button>
      {modules.map((mod) => (
        <Button
          key={mod.id}
          variant={selectedModule === mod.id ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedModule(mod.id)}
          className="flex items-center gap-1.5"
        >
          {renderModuleIcon(mod.icon)} {mod.name}
        </Button>
      ))}
    </div>
  );
}
