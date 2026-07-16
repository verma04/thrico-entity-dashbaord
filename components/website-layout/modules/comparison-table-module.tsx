"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";

import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface ComparisonTableModuleProps {
  module: ModuleData;
  previewDevice: string;
}

// --- Sub-Components ---
import { Check, Minus, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  content: {
    title?: string;
    description?: string;
    columns: string[];
    rows: {
      label: string;
      cells: (string | boolean)[];
    }[];
  };
}

const StandardTable = ({ content }: ComparisonTableProps) => {
  const { columns, rows } = content;

  return (
    <div className="mt-16 max-w-7xl mx-auto overflow-hidden border border-slate-200 rounded-4xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-6 text-left text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 sticky left-0 bg-slate-50 z-10 w-1/4">
                Feature
              </th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="p-6 text-center text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 min-w-[200px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-6 text-sm font-bold text-slate-700 border-b border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10">
                  {row.label}
                </td>
                {row.cells.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="p-6 text-center text-sm text-slate-600 border-b border-slate-100"
                  >
                    {typeof cell === "boolean" ? (
                      cell ? (
                        <Check
                          className="w-5 h-5 text-blue-600 mx-auto"
                          strokeWidth={3}
                        />
                      ) : (
                        <Minus className="w-5 h-5 text-slate-200 mx-auto" />
                      )
                    ) : (
                      <span className="font-medium">{cell || "-"}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FeatureGrid = ({ content }: ComparisonTableProps) => {
  const { columns, rows } = content;

  return (
    <div className="mt-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="relative group">
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-3">
                {col}
                {colIdx === 1 && (
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                )}
              </h3>
              <div className="mt-2 h-1 w-12 bg-blue-600 mx-auto rounded-full group-hover:w-20 transition-all duration-500" />
            </div>

            <div className="space-y-6">
              {rows.map((row, rowIdx) => {
                const cell = row.cells[colIdx];
                return (
                  <div
                    key={rowIdx}
                    className="flex items-start justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300"
                  >
                    <div className="flex-1 pr-4">
                      <div className="text-sm font-bold text-slate-900 mb-1">
                        {row.label}
                      </div>
                      {typeof cell === "string" && cell && (
                        <div className="text-xs text-slate-500 font-medium">
                          {cell}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {typeof cell === "boolean" ? (
                        cell ? (
                          <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                            <Check size={18} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <X size={18} strokeWidth={3} />
                          </div>
                        )
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                          ...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ComparisonTableModule = ({
  module,
  previewDevice,
}: ComparisonTableModuleProps) => {
  const { content, layout } = module;
  const rows = content.rows || [];
  const columns = content.columns || ["Basic", "Pro", "Enterprise"];

  // Normalize content for sub-components
  const normalizedContent = {
    ...content,
    columns,
    rows: rows.map((r: any) => ({
      label: r.label || r.feature || "Feature",
      cells: r.cells || [],
    })),
  };

  const Header = () => (
    <ModuleHeader
      title={content.title}
      description={content.description}
      layoutSettings={content.layoutSettings}
      alignment="center"
      titleColor={content.titleColor}
      descriptionColor={content.descriptionColor}
      hideTitle={content.hideTitle}
      hideDescription={content.hideDescription}
    />
  );

  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-white border-y"
    >
      <Header />

      {rows.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border mx-4 mt-8">
          <p className="text-muted-foreground">
            No comparison data added yet. Add rows in the settings panel.
          </p>
        </div>
      ) : (
        <>
          {layout === "feature-grid" ? (
            <FeatureGrid content={normalizedContent} />
          ) : (
            <StandardTable content={normalizedContent} />
          )}
        </>
      )}
    </ModuleContainer>
  );
};
