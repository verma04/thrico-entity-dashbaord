"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Eye } from "lucide-react"

interface AuditLog {
  id: string
  entity: { name: string; type: string }
  action: string
  status: string
  performedBy: { name: string; role: string }
  reason: string | null
  createdAt: string
}

const getActionColor = (action: string) => {
  switch (action) {
    case "ADD":
      return "bg-green-100 text-green-800"
    case "REMOVE":
      return "bg-red-100 text-red-800"
    case "UPDATE":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800"
    case "REJECTED":
      return "bg-red-100 text-red-800"
    case "REQUESTED":
      return "bg-yellow-100 text-yellow-800"
    case "STATUS":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function AuditLogTable({
  data,
  onViewDetails,
}: {
  data: AuditLog[]
  onViewDetails?: (log: AuditLog) => void
}) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }])
  const [search, setSearch] = useState("")

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "createdAt",
      header: "Date & Time",
      cell: ({ row }) => (
        <span className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString()}{" "}
          {new Date(row.original.createdAt).toLocaleTimeString()}
        </span>
      ),
    },
    {
      accessorKey: "entity.name",
      header: "Entity",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{row.original.entity.type}</Badge>
          <span className="text-sm">{row.original.entity.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => <Badge className={getActionColor(row.original.action)}>{row.original.action}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge className={getStatusColor(row.original.status)}>{row.original.status}</Badge>,
    },
    {
      accessorKey: "performedBy.name",
      header: "Performed By",
      cell: ({ row }) => (
        <div className="text-sm">
          <p className="font-medium">{row.original.performedBy.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.performedBy.role}</p>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
  })

  return (
    <div className="space-y-4">
      <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
