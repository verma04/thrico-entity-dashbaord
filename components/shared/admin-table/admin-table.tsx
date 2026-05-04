"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, FileSearch } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminTableColumn<T = any> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  cell: (row: T, index: number) => React.ReactNode;
}

export interface AdminTableProps<T = any> {
  columns: AdminTableColumn<T>[];
  data: T[] | undefined;
  loading?: boolean;
  keyExtractor: (row: T, index: number) => string;
  pageSize?: number;
  emptyIcon?: React.ElementType;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingRows?: number;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Badge — shared across all entity tables
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50  text-amber-700  border-amber-200",
  DISABLED: "bg-orange-50 text-orange-700 border-orange-200",
  PAUSED: "bg-orange-50 text-orange-700 border-orange-200",
  REJECTED: "bg-red-50    text-red-700    border-red-200",
  BLOCKED: "bg-rose-50   text-rose-700   border-rose-200",
  EXPIRED: "bg-slate-50  text-slate-500  border-slate-200",
  CLOSED: "bg-slate-50  text-slate-500  border-slate-200",
  DRAFT: "bg-sky-50    text-sky-700    border-sky-200",
};

export function AdminStatusBadge({
  status,
  className,
  children,
}: {
  status: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const color =
    STATUS_COLORS[status?.toUpperCase()] ??
    "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px]  uppercase tracking-wide",
        color,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          status?.toUpperCase() === "APPROVED" ||
            status?.toUpperCase() === "ACTIVE"
            ? "bg-emerald-500"
            : status?.toUpperCase() === "PENDING"
              ? "bg-amber-500"
              : status?.toUpperCase() === "REJECTED" ||
                  status?.toUpperCase() === "BLOCKED"
                ? "bg-red-500"
                : "bg-slate-400",
        )}
      />
      {children || status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Verification Badge
// ─────────────────────────────────────────────────────────────────────────────

export function AdminVerifiedBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px]  uppercase tracking-wide",
        verified
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-slate-50 text-slate-400 border-slate-200",
      )}
    >
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton Loading State
// ─────────────────────────────────────────────────────────────────────────────

function TableSkeleton({
  rows = 8,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border/60">
            {Array.from({ length: cols }).map((_, i) => (
              <TableHead key={i} className="h-11 px-5">
                <Skeleton className="h-3 w-20 rounded" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx} className="border-b border-border/40">
              <TableCell className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-28 rounded" />
                    <Skeleton className="h-2.5 w-20 rounded" />
                  </div>
                </div>
              </TableCell>
              {Array.from({ length: cols - 1 }).map((_, colIdx) => (
                <TableCell key={colIdx} className="px-5 py-3">
                  <Skeleton className="h-3 w-24 rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon = FileSearch,
  title = "No records found",
  description = "Try adjusting your search or filter criteria.",
  colSpan = 6,
}: {
  icon?: React.ElementType;
  title?: string;
  description?: string;
  colSpan?: number;
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-56 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground/40">
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm  text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  compact = false,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  compact?: boolean;
}) {
  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  // Build page numbers — show at most 5 pages
  const pages: number[] = [];
  const delta = 2;
  for (
    let i = Math.max(1, currentPage - delta);
    i <= Math.min(totalPages, currentPage + delta);
    i++
  ) {
    pages.push(i);
  }

  const nav = (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-7 w-7 p-0 rounded-lg border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </Button>

      {pages[0] > 1 && (
        <>
          <PageButton
            page={1}
            active={currentPage === 1}
            onClick={() => onPageChange(1)}
          />
          {pages[0] > 2 && (
            <span className="px-1 text-[11px] text-muted-foreground">…</span>
          )}
        </>
      )}

      {pages.map((p) => (
        <PageButton
          key={p}
          page={p}
          active={currentPage === p}
          onClick={() => onPageChange(p)}
        />
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-[11px] text-muted-foreground">…</span>
          )}
          <PageButton
            page={totalPages}
            active={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          />
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-7 w-7 p-0 rounded-lg border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );

  if (compact) {
    // Top bar: compact — just count label + nav, inside the table border
    return (
      <div className="flex items-center justify-between px-5 py-2 border-b border-border bg-muted/20">
        <p className="text-[11px]  text-muted-foreground">
          <span className=" text-foreground">{totalItems}</span> records
          {" · "}
          Page <span className=" text-foreground">{currentPage}</span>
          {" of "}
          <span className=" text-foreground">{totalPages}</span>
        </p>
        {nav}
      </div>
    );
  }

  // Bottom bar: full — showing x–y of z
  return (
    <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/10">
      <p className="text-[11px]  text-muted-foreground">
        Showing <span className=" text-foreground">{from}</span>
        {" – "}
        <span className=" text-foreground">{to}</span>
        {" of "}
        <span className=" text-foreground">{totalItems}</span>
      </p>
      {nav}
    </div>
  );
}

function PageButton({
  page,
  active,
  onClick,
}: {
  page: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 min-w-[28px] px-2 rounded-lg text-[11px]  transition-all",
        active
          ? "bg-foreground text-background shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {page}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AdminTable Component
// ─────────────────────────────────────────────────────────────────────────────

export function AdminTable<T = any>({
  columns,
  data,
  loading = false,
  keyExtractor,
  pageSize = 10,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  loadingRows = 8,
  className,
}: AdminTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData =
    data?.slice((safePage - 1) * pageSize, safePage * pageSize) ?? [];

  if (loading) {
    return <TableSkeleton rows={loadingRows} cols={columns.length} />;
  }

  return (
    <div className={cn(className)}>
      {/* Table Shell — pagination lives inside the border for visual unity */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Top pagination bar */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          compact
        />

        <Table>
          {/* Header */}
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border bg-muted/30">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "h-10 px-5 text-[10px]  uppercase tracking-widest text-muted-foreground/70 whitespace-nowrap",
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody>
            <AnimatePresence mode="wait">
              {paginatedData.length === 0 ? (
                <EmptyState
                  icon={emptyIcon}
                  title={emptyTitle}
                  description={emptyDescription}
                  colSpan={columns.length}
                />
              ) : (
                paginatedData.map((row, idx) => (
                  <motion.tr
                    key={keyExtractor(row, idx)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: idx * 0.025 }}
                    className="group border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors duration-150"
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn("px-5 py-3", col.className)}
                      >
                        {col.cell(row, idx)}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>

        {/* Bottom pagination bar */}
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
