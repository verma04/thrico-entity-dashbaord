"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, MessageSquare, Filter, List as ListIcon, CheckCircle, Clock, PauseCircle, XCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import TableLoading from "@/components/layout/table-loading";
import Post from "@/components/discussion-forum/post/forum-post";

import moment from "moment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVerificationTag } from "../utils";
import { discussionForm } from "../ts-types";
import Actions from "./forum-actions";
import { getStatusTag } from "../utils";
import Vote from "./votes/forum-vote";

export default function List({
  data,
  loading,
}: {
  data: discussionForm[];
  loading?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeStatus = pathname.replace("/forums/", "") || "all";

  const handleStatusChange = (val: string) => {
    if (val === "all") router.push(`/forums/all`);
    else router.push(`/forums/${val}`);
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");

  const columns: ColumnDef<discussionForm>[] = [
    {
      accessorKey: "verification",
      header: "Verification",
      cell: ({ row }) => {
        return getVerificationTag(
          row.original.verification?.isVerified || false
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        const isVerified = row.original.verification?.isVerified || false;
        return value === "verified" ? isVerified : !isVerified;
      },
    },
    {
      accessorKey: "vote",
      header: "Vote",
      cell: ({ row }) => <Vote id={row.original.id} />,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className="font-medium max-w-xs truncate"
          title={row.original.title}
        >
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusTag(row.original?.status),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="text-sm">{row.original?.category?.name || "—"}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {moment(row.original?.createdAt).format("MMM D, YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Update",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {moment(row.original?.updatedAt).fromNow()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <Actions {...row.original} />,
    },
  ];

  const filteredData = data.filter((item) => {
    if (verificationFilter === "all") return true;
    const isVerified = item.verification?.isVerified || false;
    return verificationFilter === "verified" ? isVerified : !isVerified;
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Discussion Forums"
        badgeText="Community Dialogues"
        description="Monitor, moderate, and engage with community conversations."
        icon={MessageSquare}
        actions={
          <div className="flex items-center gap-3 relative ml-auto pr-2">
            <Post />
            <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap shadow-inner">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {filteredData.length} Topics
            </div>
          </div>
        }
      />

      <EcosystemActionBar>
        <div className="relative w-full md:max-w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search posts..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400 border shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4 pr-4 ml-auto">
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 shadow-sm md:hidden">
            <Filter className="h-4 w-4" />
          </Button>
          <Select
            value={activeStatus}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px] h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-600 focus:ring-4 focus:ring-indigo-500/5 hidden md:flex">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
              <SelectItem value="all" className="font-semibold rounded-lg py-2.5"><div className="flex items-center gap-2"><ListIcon className="h-4 w-4"/>All</div></SelectItem>
              <SelectItem value="approved" className="font-semibold rounded-lg py-2.5"><div className="flex items-center gap-2"><CheckCircle className="h-4 w-4"/>Approved</div></SelectItem>
              <SelectItem value="pending" className="font-semibold rounded-lg py-2.5"><div className="flex items-center gap-2"><Clock className="h-4 w-4"/>Pending</div></SelectItem>
              <SelectItem value="disabled" className="font-semibold rounded-lg py-2.5"><div className="flex items-center gap-2"><PauseCircle className="h-4 w-4"/>Disabled</div></SelectItem>
              <SelectItem value="rejected" className="font-semibold rounded-lg py-2.5"><div className="flex items-center gap-2"><XCircle className="h-4 w-4"/>Rejected</div></SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={verificationFilter}
            onValueChange={setVerificationFilter}
          >
            <SelectTrigger className="w-[180px] h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-600 focus:ring-4 focus:ring-indigo-500/5 hidden md:flex">
              <SelectValue placeholder="Verification Filter" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
              <SelectItem value="all" className="font-semibold rounded-lg py-2.5">All Posts</SelectItem>
              <SelectItem value="verified" className="font-semibold rounded-lg py-2.5">Verified</SelectItem>
              <SelectItem value="unverified" className="font-semibold rounded-lg py-2.5">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="rounded-xl border border-border/50 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <TableLoading />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-border/50 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold text-slate-600 h-11">
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
                      data-state={row.getIsSelected() && "selected"}
                      className="border-border/50 hover:bg-slate-50/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 px-4">
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
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <MessageSquare className="h-8 w-8 text-slate-300 mb-2" />
                        <p className="text-sm font-medium">
                          No forum posts found matching your criteria.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <div className="flex items-center justify-between space-x-2 py-6 px-2">
            <div className="flex-1 text-sm font-medium text-slate-500">
              Showing{" "}
              <span className="text-slate-900">{table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}</span>{" "}
              to{" "}
              <span className="text-slate-900">{Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                filteredData.length
              )}</span>{" "}
              of <span className="text-slate-900">{filteredData.length}</span> posts
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-9 px-4 rounded-lg font-semibold text-xs border-slate-200 text-slate-600 shadow-sm"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 mx-2">
                <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount() || 1}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-9 px-4 rounded-lg font-semibold text-xs border-slate-200 text-slate-600 shadow-sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
