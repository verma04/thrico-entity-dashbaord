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
import {
  ChevronLeft,
  ChevronRight,
  FileSearch,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { safeFormat } from "@/lib/date-utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminTableColumn<T = any> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  isFixedRight?: boolean;
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
  enableColumnToggle?: boolean;
  size?: "sm" | "md";
  baseIndex?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Table Components
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminTableItemProps {
  avatar?: string | null;
  icon?: React.ElementType | React.ReactNode;
  fallbackText?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  shape?: "square" | "circle";
  maxTitleWidth?: string;
  onClick?: () => void;
}

export function AdminTableItem({
  avatar,
  icon: Icon,
  fallbackText,
  title,
  subtitle,
  badge,
  className,
  shape = "square",
  maxTitleWidth = "max-w-[220px]",
  onClick,
}: AdminTableItemProps) {
  const isCircle = shape === "circle";
  const roundedClass = isCircle ? "rounded-full" : "rounded-md";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 min-w-0",
        onClick && "cursor-pointer group",
        className,
      )}
    >
      {avatar !== undefined ? (
        <Avatar
          className={cn(
            "h-7 w-7 border border-border/60 shrink-0",
            roundedClass,
          )}
        >
          <AvatarImage
            src={
              avatar
                ? avatar.startsWith("http")
                  ? avatar
                  : `https://cdn.thrico.network/${avatar}`
                : ""
            }
            alt={typeof title === "string" ? title : ""}
            className="object-cover"
          />
          <AvatarFallback
            className={cn(
              "bg-muted text-muted-foreground text-[10px] font-semibold",
              roundedClass,
            )}
          >
            {fallbackText ||
              (typeof title === "string"
                ? title.slice(0, 2).toUpperCase()
                : "—")}
          </AvatarFallback>
        </Avatar>
      ) : Icon ? (
        <div
          className={cn(
            "h-7 w-7 border border-border/60 bg-muted/60 flex items-center justify-center shrink-0 text-muted-foreground",
            roundedClass,
          )}
        >
          {React.isValidElement(Icon) ? (
            Icon
          ) : typeof Icon === "function" ? (
            // @ts-ignore
            <Icon className="h-3.5 w-3.5" />
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <p
            className={cn(
              "text-[12px] font-semibold text-foreground leading-tight truncate",
              maxTitleWidth,
              onClick && "group-hover:text-primary transition-colors",
            )}
          >
            {title}
          </p>
          {badge}
        </div>
        {subtitle && (
          <p
            className={cn(
              "text-[10px] text-muted-foreground leading-tight mt-0.5 truncate",
              maxTitleWidth,
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function AdminTableTag({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?:
    | "default"
    | "indigo"
    | "purple"
    | "emerald"
    | "amber"
    | "rose"
    | "sky"
    | "muted";
  className?: string;
}) {
  const variants: Record<string, string> = {
    default: "bg-muted text-muted-foreground border-border/60",
    indigo:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    purple:
      "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    emerald:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    amber:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    sky: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    muted: "bg-muted/60 text-muted-foreground border-border/40",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
        variants[variant] || variants.default,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function AdminTableText({
  primary,
  secondary,
  icon: Icon,
  className,
}: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5 min-w-0", className)}>
      <div className="flex items-center gap-1 text-[12px] text-foreground/90 font-medium">
        {Icon && <Icon className="h-3 w-3 text-muted-foreground/60 shrink-0" />}
        <span className="truncate max-w-[200px]">{primary}</span>
      </div>
      {secondary && (
        <span
          className={cn(
            "text-[10px] text-muted-foreground leading-tight truncate max-w-[200px]",
            Icon && "pl-4",
          )}
        >
          {secondary}
        </span>
      )}
    </div>
  );
}

export function AdminTableMetric({
  value,
  unit,
  icon: Icon,
  variant = "default",
  className,
}: {
  value: React.ReactNode;
  unit?: string;
  icon?: React.ElementType;
  variant?: "default" | "indigo" | "amber" | "rose" | "emerald" | "mono";
  className?: string;
}) {
  const colorMap: Record<string, string> = {
    default: "text-foreground font-medium",
    indigo: "text-indigo-600 dark:text-indigo-400 font-semibold",
    amber: "text-amber-600 dark:text-amber-500 font-semibold",
    rose: "text-rose-600 dark:text-rose-400 font-semibold",
    emerald: "text-emerald-600 dark:text-emerald-400 font-semibold",
    mono: "font-mono font-semibold text-foreground",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-[12px]",
        colorMap[variant] || colorMap.default,
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />}
      <span>{value}</span>
      {unit && (
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-normal">
          {unit}
        </span>
      )}
    </div>
  );
}

export function AdminTableDate({
  date,
  format = "MMM d, yyyy",
  time,
  icon: Icon,
  className,
}: {
  date: string | number | Date | null | undefined;
  format?: string;
  time?: string | null;
  icon?: boolean | React.ElementType;
  className?: string;
}) {
  if (!date)
    return <span className="text-[10px] text-muted-foreground/50">—</span>;

  const IconComp =
    Icon === true ? Clock : typeof Icon === "boolean" ? null : Icon;

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="flex items-center gap-1 text-[12px] text-muted-foreground whitespace-nowrap">
        {IconComp && (
          <IconComp className="h-3 w-3 shrink-0 text-muted-foreground/50" />
        )}
        <span>{safeFormat(date, format, "—")}</span>
      </div>
      {time && (
        <span className="text-[10px] text-muted-foreground/70">{time}</span>
      )}
    </div>
  );
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
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wide",
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
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wide",
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
              <TableHead key={i} className="h-8 px-3">
                <Skeleton className="h-2.5 w-16 rounded" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx} className="border-b border-border/40">
              <TableCell className="px-3 py-1.5">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-7 w-7 rounded-md shrink-0" />
                  <div className="space-y-1">
                    <Skeleton className="h-2.5 w-24 rounded" />
                    <Skeleton className="h-2 w-16 rounded" />
                  </div>
                </div>
              </TableCell>
              {Array.from({ length: cols - 1 }).map((_, colIdx) => (
                <TableCell key={colIdx} className="px-3 py-1.5">
                  <Skeleton className="h-2.5 w-16 rounded" />
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

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  compact = false,
  extraTopRight,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  compact?: boolean;
  extraTopRight?: React.ReactNode;
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
        <div className="flex items-center gap-3">
          {nav}
          {extraTopRight && (
            <>
              <div className="h-4 w-px bg-border" />
              {extraTopRight}
            </>
          )}
        </div>
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
  enableColumnToggle = false,
  size = "sm",
  baseIndex,
}: AdminTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {},
  );

  const totalItems = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData =
    data?.slice((safePage - 1) * pageSize, safePage * pageSize) ?? [];

  const absoluteIndexBase = (baseIndex ?? 0) + (safePage - 1) * pageSize;

  const activeColumns = enableColumnToggle
    ? columns.filter((col) => visibleColumns[col.key] !== false)
    : columns;

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
          extraTopRight={
            enableColumnToggle && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                    Toggle Columns
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns
                    .filter((c) => !c.isFixedRight && c.header)
                    .map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.key}
                        checked={visibleColumns[col.key] !== false}
                        onCheckedChange={() => toggleColumn(col.key)}
                        className="text-xs font-medium cursor-pointer"
                      >
                        {col.header || col.key}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
        />

        <Table>
          {/* Header */}
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border bg-muted/30">
              {activeColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    size === "sm" ? "h-8 px-3" : "h-9 px-4",
                    "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap",
                    col.isFixedRight &&
                      "sticky right-0 bg-muted z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]",
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
                  colSpan={activeColumns.length}
                />
              ) : (
                paginatedData.map((row, idx) => {
                  const absoluteIdx = absoluteIndexBase + idx;
                  return (
                    <motion.tr
                      key={keyExtractor(row, idx)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: idx * 0.025 }}
                      className="group border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors duration-150"
                    >
                      {activeColumns.map((col) => (
                        <TableCell
                          key={col.key}
                          className={cn(
                            size === "sm"
                              ? "px-3 py-1.5 text-[12px]"
                              : "px-4 py-2 text-[12px]",
                            col.isFixedRight &&
                              "sticky right-0 bg-card group-hover:bg-muted/50 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]",
                            col.className,
                          )}
                        >
                          {col.cell(row, absoluteIdx)}
                        </TableCell>
                      ))}
                    </motion.tr>
                  );
                })
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
