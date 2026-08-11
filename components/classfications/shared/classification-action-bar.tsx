import React from "react";
import { LayoutGrid, Network } from "lucide-react";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";

export interface ClassificationActionBarProps {
  title?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  actions?: React.ReactNode;
  statusText?: string;
  statusActive?: boolean;
}

export function ClassificationActionBar({
  title,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  activeTab,
  onTabChange,
  actions,
  statusText,
  statusActive,
}: ClassificationActionBarProps) {
  return (
    <EcosystemActionBar shadow="none" className=" mt-4">
      <EcosystemActionBar.Group>
        {onSearchChange && (
          <EcosystemActionBar.Item
            grow
            className={`max-w-[360px] ${title ? "pl-4" : ""}`}
          >
            <EcosystemActionBar.Search
              value={search || ""}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          </EcosystemActionBar.Item>
        )}
      </EcosystemActionBar.Group>

      {(activeTab || actions || statusText) && <EcosystemActionBar.Separator />}

      <EcosystemActionBar.Group align="right">
        {actions && <div className="flex gap-2">{actions}</div>}

        {activeTab && onTabChange && (
          <EcosystemActionBar.ViewToggle
            value={activeTab}
            onChange={onTabChange}
            options={[
              { id: "list", label: "List", icon: LayoutGrid },
              { id: "graph", label: "Graph", icon: Network },
            ]}
          />
        )}

        {statusText && (
          <EcosystemActionBar.Status active={!!statusActive}>
            {statusText}
          </EcosystemActionBar.Status>
        )}
      </EcosystemActionBar.Group>
    </EcosystemActionBar>
  );
}
