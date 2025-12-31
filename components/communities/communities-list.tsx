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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

import moment from "moment";

import { communityEntity } from "./ts-types";
import Actions from "./Actions";
import { getStatusTag, getVerificationTag } from "../discussion-forum/utils";

export default function List({ data }: { data: communityEntity[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<communityEntity>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-2 cursor-pointer select-none py-2"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Community
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
        const record = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-[50px] w-[100px] rounded-lg object-contain shadow-sm">
              <AvatarImage
                src={`https://cdn.thrico.network/${record?.cover}`}
                alt={record?.title}
              />
              <AvatarFallback className="rounded-lg bg-primary/5 text-primary font-bold">
                {record?.title?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="font-semibold text-foreground leading-tight">
                {record?.title}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                {record?.tagline || "No tagline provided"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground line-clamp-2 max-w-[250px] leading-snug">
          {row.getValue("description") || "No description available"}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex justify-start">
          {getStatusTag(row.getValue("status"))}
        </div>
      ),
    },
    {
      id: "verification",
      header: "Verification",
      cell: ({ row }) => (
        <div className="flex justify-start">
          {getVerificationTag(row.original.verification?.isVerified || false)}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-sm whitespace-nowrap">
          {moment(row.getValue("createdAt")).format("MMM DD, YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Update",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {moment(row.getValue("updatedAt")).fromNow()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-4">
          <Actions {...row.original} />
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
            placeholder="Search communities by name or description..."
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
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            {table.getFilteredRowModel().rows.length} Total Communities
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-search-x"
                      >
                        <path d="m21 21-4.3-4.3" />
                        <circle cx="10" cy="10" r="7" />
                        <path d="m8 8 4 4" />
                        <path d="m12 8-4 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        No matching communities
                      </p>
                      <p className="text-sm">
                        Try adjusting your search criteria
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
