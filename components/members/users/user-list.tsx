"use client";

import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import UserActions from "./user-actions";
import type { userStatus } from "@/types/user-types";

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "BLOCKED":
      return "bg-red-100 text-red-800";
    case "REJECTED":
      return "bg-purple-100 text-purple-800";
    case "DISABLED":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getVerificationBadge = (verified: boolean) => {
  return (
    <Badge variant={verified ? "default" : "secondary"}>
      {verified ? "Verified" : "Unverified"}
    </Badge>
  );
};

export function UserList({ users }: { users: userStatus[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchValue, setSearchValue] = useState("");

  const columns: ColumnDef<userStatus>[] = [
    {
      accessorKey: "verification",
      header: "Verification",
      cell: ({ row }) =>
        getVerificationBadge(row.original.verification?.isVerified || false),
    },
    {
      accessorKey: "user.firstName",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://cdn.thrico.network/${row.original.user?.avatar}`}
              alt={row.original.user?.firstName}
            />
            <AvatarFallback>
              {row.original.user?.firstName?.[0]}
              {row.original.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {row.original.user?.firstName} {row.original.user?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {row.original.user?.about?.currentPosition}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "user.email",
      header: "Contact",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm">{row.original.user?.email}</p>
          <p className="text-xs text-muted-foreground">
            +{row.original.user?.profile?.phone?.countryCode}-
            {row.original.user?.profile?.phone?.phoneNumber}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "user.location.name",
      header: "Location",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.user?.location?.name}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.user?.createdAt
            ? new Date(row.original.user.createdAt).toLocaleDateString()
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.lastActive
            ? new Date(row.original.lastActive).toLocaleDateString()
            : "-"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <UserActions user={row.original} />,
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter: searchValue,
    },
    onGlobalFilterChange: setSearchValue,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table?.getRowModel().rows &&
            table.getRowModel().rows.length > 0 ? (
              table?.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
