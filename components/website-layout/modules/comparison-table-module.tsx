"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";

import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface ComparisonTableModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const ComparisonTableModule = ({
  module,
  previewDevice,
}: ComparisonTableModuleProps) => {
  const { content, layout } = module;
  const rows = content.rows || [];
  const columns = content.columns || ["Basic", "Pro", "Enterprise"];

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white border-y"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

      {rows.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-muted-foreground">
            No comparison data added yet. Add rows in the settings panel.
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col: string, idx: number) => (
                  <th
                    key={idx}
                    className="p-4 text-left font-semibold border-b"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, rowIdx: number) => (
                <tr key={rowIdx} className="border-t hover:bg-gray-50">
                  {(row.cells || []).map((cell: string, cellIdx: number) => (
                    <td key={cellIdx} className="p-4 border-r last:border-r-0">
                      {cell || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ModuleContainer>
  );
};
