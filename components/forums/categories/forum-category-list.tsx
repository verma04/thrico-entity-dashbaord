"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Tags,
  List as ListIcon,
  StopCircle,
} from "lucide-react";
import moment from "moment";
import { usePathname, useRouter } from "next/navigation";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import TableLoading from "@/components/layout/table-loading";
import Add from "./forum-category-add";

import { discussionCategory } from "../ts-types";
import Actions from "./forum-category-actions";

export default function List({
  data,
  loading,
}: {
  data: discussionCategory[];
  loading?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeStatus = pathname.replace("/forums/categories", "").replace("/", "") || "all";

  const handleStatusChange = (val: string) => {
    if (val === "all") router.push(`/forums/categories`);
    else router.push(`/forums/categories/${val}`);
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<discussionCategory>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-md truncate text-muted-foreground">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return (
          <Badge variant={isActive ? "default" : "secondary"} className="gap-1">
            {isActive ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Inactive
              </>
            )}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {moment(row.getValue("createdAt")).format("MMM DD, YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => {
        const updatedAt = row.getValue("updatedAt");
        return updatedAt ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            {moment(updatedAt as string).fromNow()}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Actions {...row.original} />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data || [],
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
        title="Discussion Categories"
        badgeText="Organization"
        description="Manage and organize your discussion forum categories."
        icon={Tags}
        actions={
          <div className="flex items-center gap-3 relative ml-auto pr-2">
            <Add />
            <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap shadow-inner">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {data?.length || 0} Categories
            </div>
          </div>
        }
      />

      <EcosystemActionBar>
        <div className="relative w-full md:max-w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search categories..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-12 h-12 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-medium text-slate-700 placeholder:text-slate-400 border shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4 pr-4 ml-auto">
          <Select
            value={activeStatus}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px] h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm font-semibold text-slate-600 focus:ring-4 focus:ring-indigo-500/5 hidden md:flex">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 shadow-xl p-1">
              <SelectItem value="all" className="font-semibold rounded-lg py-2.5"><div className="flex items-center gap-2"><ListIcon className="h-4 w-4"/>All</div></SelectItem>
              <SelectItem value="active" className="font-semibold rounded-lg py-2.5"><div className="flex items-center gap-2"><CheckCircle className="h-4 w-4"/>Active</div></SelectItem>
              <SelectItem value="in-active" className="font-semibold rounded-lg py-2.5"><div className="flex items-center gap-2"><StopCircle className="h-4 w-4"/>Inactive</div></SelectItem>
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
                {table.getRowModel().rows &&
                table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow 
                      key={row.id}
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
                        <Tags className="h-8 w-8 text-slate-300 mb-2" />
                        <p className="text-sm font-medium">
                          No categories found matching your criteria.
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
        {!loading && (data || []).length > 0 && (
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
                table.getFilteredRowModel().rows.length
              )}</span>{" "}
              of <span className="text-slate-900">{table.getFilteredRowModel().rows.length}</span> results
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
