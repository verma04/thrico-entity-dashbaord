"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
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
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronsUpDown, Calendar, Globe, MapPin, ExternalLink } from "lucide-react";

import moment from "moment";

import { communityEntity } from "./ts-types";
import Actions from "./Actions";
import { getStatusTag, getVerificationTag } from "../discussion-forum/utils";
import { cn } from "@/lib/utils";

export default function List({ data }: { data: communityEntity[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<communityEntity>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="font-semibold uppercase text-[11px] tracking-wider text-slate-400 group-hover:text-indigo-600 transition-colors">Community Space</span>
          {column.getCanSort() && (
            <ChevronsUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      ),
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex items-center gap-4 py-1">
            <div className="relative group/avatar">
              <Avatar className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <AvatarImage
                  src={`https://cdn.thrico.network/${record?.cover}`}
                  alt={record?.title}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg bg-slate-100 text-slate-600 font-semibold text-xs">
                  {record?.title?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-semibold text-slate-900 leading-tight text-sm group-hover:text-indigo-600 transition-colors">
                {record?.title}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                <Globe className="h-3 w-3 text-slate-400" />
                <span className="line-clamp-1 max-w-[150px]">{record?.tagline || "Global ecosystem"}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => <span className="font-semibold uppercase text-[11px] tracking-wider text-slate-400">Context</span>,
      cell: ({ row }) => (
        <p className="text-xs text-slate-500 font-normal line-clamp-2 max-w-[300px] leading-relaxed">
          {row.getValue("description") || "No contextual information provided."}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: () => <span className="font-semibold uppercase text-[11px] tracking-wider text-slate-400">Status</span>,
      cell: ({ row }) => (
        <div className="scale-90 origin-left">
          {getStatusTag(row.getValue("status"))}
        </div>
      ),
    },
    {
      id: "verification",
      header: () => <span className="font-semibold uppercase text-[11px] tracking-wider text-slate-400">Verified</span>,
      cell: ({ row }) => (
        <div className="scale-90 origin-left">
          {getVerificationTag(row.original.verification?.isVerified || false)}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <span className="font-semibold uppercase text-[11px] tracking-wider text-slate-400">Registry Date</span>,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
             <Calendar className="h-3.5 w-3.5 text-slate-400" />
             <span>{moment(row.getValue("createdAt")).format("MMM DD, YYYY")}</span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tight pl-5">
            Initial Launch
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
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
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-slate-100">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-14 px-6"
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
                  className="group hover:bg-slate-50/80 transition-all duration-300 border-b-slate-50 last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
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
                  className="h-60 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                       <MapPin className="h-6 w-6 text-slate-300" />
                    </div>
                    <div>
                      <p className="font-semibold uppercase text-[11px] tracking-wider text-slate-600">
                        No Ecosystem Data
                      </p>
                      <p className="text-xs font-medium mt-1">
                        Try expanding your search parameters.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Premium Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-2">
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Page <span className="text-slate-900 font-semibold">{table.getState().pagination.pageIndex + 1}</span> of {table.getPageCount() || 1}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Rows:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none appearance-none cursor-pointer"
            >
              {[5, 10, 20, 50].map((pageSize) => (
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
              className="h-9 px-4 rounded-lg border-slate-200 hover:bg-slate-50 font-semibold shadow-none text-xs disabled:opacity-30"
            >
              Previous
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-black font-semibold shadow-none text-xs disabled:opacity-30"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function filteredDataCount(data: any[]) {
  return data?.length || 0;
}
