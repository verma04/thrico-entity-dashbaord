"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronsUpDown, ShieldAlert } from "lucide-react";

import moment from "moment";
import { Report } from "./types";
import Actions from "./Actions";

export default function ReportsList({ data }: { data: Report[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Report>[] = [
    {
      accessorKey: "module",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-2 cursor-pointer select-none py-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Module
            {column.getCanSort() && (
              <div className="flex flex-col">
                {{
                  asc: <ChevronUp className="w-3 h-3 text-primary" />,
                  desc: <ChevronDown className="w-3 h-3 text-primary" />,
                }[column.getIsSorted() as string] ?? (
                  <ChevronsUpDown className="w-3 h-3 opacity-50" />
                )}
              </div>
            )}
          </div>
        );
      },
      cell: ({ row }) => {
        const moduleVal = row.getValue("module") as string;
        return (
          <div className="font-semibold px-2 py-0.5 rounded-sm bg-muted inline-flex border border-border/50 text-xs text-foreground uppercase">
            {moduleVal}
          </div>
        );
      },
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-orange-500" />
          <span className="font-medium text-foreground">{row.getValue("reason") || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground line-clamp-2 max-w-[250px] leading-snug">
          {row.getValue("description") || "No description provided"}
        </div>
      ),
    },
    {
      id: "reporter_name",
      header: "Reported By",
      cell: ({ row }) => {
        const reporter = row.original.reporter;
        return (
          <div className="text-sm font-medium">
            {reporter ? `${reporter.firstName} ${reporter.lastName}` : "Unknown User"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className={`text-xs px-2 py-1 rounded inline-flex font-medium ${status === "RESOLVED" ? "bg-green-100/50 text-green-700" : "bg-red-100/50 text-red-700"}`}>
            {status}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Reported At",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {moment(row.getValue("createdAt")).format("MMM DD, YYYY")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-4">
          <Actions report={row.original} />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex flex-col gap-5 p-2 sm:p-6 bg-background/50 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md group">
          <Input
            placeholder="Search reports by reason, exact module, or description..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full bg-background border-muted-foreground/20 focus-visible:ring-primary shadow-sm h-10 pl-4"
          />
          {globalFilter && (
            <button
              onClick={() => setGlobalFilter("")}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Clear search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            {table.getFilteredRowModel().rows.length} Total Reports
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card shadow-lg shadow-black/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 font-bold text-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 transition-all border-b border-border/40 last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="p-3 bg-muted rounded-full">
                      <ShieldAlert className="w-6 h-6 text-muted-foreground/60" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        No matching reports
                      </p>
                      <p className="text-sm">
                        Everything looks clean here.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-t border-border pt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Viewing page</span>
          <span className="font-medium text-foreground px-2 py-0.5 bg-muted rounded border border-border/50">
            {table.getState().pagination.pageIndex + 1}
          </span>
          <span>of</span>
          <span className="font-medium text-foreground px-2 py-0.5 bg-muted rounded border border-border/50">
            {table.getPageCount() || 1}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-xs text-muted-foreground">
              Rows per page:
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="bg-transparent text-xs font-medium border-b border-muted-foreground/30 focus:outline-none"
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-9 px-3 border-border/60 shadow-sm"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-9 px-3 border-border/60 shadow-sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
