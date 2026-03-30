"use client";

/**
 * AppDataTable — reusable wrapper around react-table-craft's DataTable.
 *
 * Drop-in replacement for the custom DataTable component.
 * All other pages can import this component and get built-in search,
 * filter, pagination, CSV export, column visibility, and row selection.
 *
 * Usage:
 *   import { AppDataTable } from "@/components/ui/app-data-table";
 *   <AppDataTable columns={columns} data={data} />
 */

import { DataTable } from "react-table-craft";
import type {
  DataTableProps,
} from "./app-data-table.types";

export function AppDataTable<TData, TValue>({
  columns,
  data,
  searchableColumns,
  filterableColumns,
  showFilter = true,
  showPagination = true,
  isLoading = false,
  isShowExportButtons,
  customButtons,
  addItemPagePath,
  deleteRowsAction,
  floatingBar = false,
  config,
  ...rest
}: DataTableProps<TData, TValue>) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={searchableColumns}
      filterableColumns={filterableColumns}
      showFilter={showFilter}
      showPagination={showPagination}
      isLoading={isLoading}
      isShowExportButtons={isShowExportButtons}
      customButtons={customButtons}
      addItemPagePath={addItemPagePath}
      deleteRowsAction={deleteRowsAction}
      floatingBar={floatingBar}
      config={config}
      {...(rest as any)}
    />
  );
}

export type { DataTableProps as AppDataTableProps };
