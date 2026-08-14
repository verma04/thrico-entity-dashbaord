"use client";

import React, { useMemo } from "react";
import { AppDataTable } from "@/components/ui/app-data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrizeIcon } from "./prize-icon";
import { MatchWinCombination, MatchWinSymbol } from "./types";

// ── Symbols Table ─────────────────────────────────────

interface SymbolsTableProps {
  symbols: MatchWinSymbol[];
  onEdit: (s: MatchWinSymbol) => void;
}

export const SymbolsTable = ({ symbols, onEdit }: SymbolsTableProps) => {
  const columns = useMemo<ColumnDef<MatchWinSymbol>[]>(
    () => [
      {
        accessorKey: "key",
        header: "Key",
        cell: ({ row }) => (
          <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded-md text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wider">
            {row.original.key}
          </code>
        ),
      },
      {
        accessorKey: "icon",
        header: "Visual Icon",
        cell: ({ row }) => (
          <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 w-fit shadow-xs">
            <PrizeIcon
              iconName={row.original.icon}
              color={row.original.color}
            />
          </div>
        ),
      },
      {
        accessorKey: "label",
        header: "Display Label",
        cell: ({ row }) => (
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
            {row.original.label}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => onEdit(row.original)}
            >
              <Edit2 className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit],
  );

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
      <AppDataTable
        columns={columns}
        data={symbols}
        showFilter={false}
        showPagination={false}
        isShowExportButtons={false}
      />
    </div>
  );
};

// ── Combinations Table ────────────────────────────────

interface CombinationsTableProps {
  combinations: MatchWinCombination[];
  totalProbability: number;
  onEdit: (c: MatchWinCombination) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  currencyName?: string;
}

export const CombinationsTable = ({
  combinations,
  totalProbability,
  onEdit,
  onDelete,
  onAdd,
  currencyName = "Points",
}: CombinationsTableProps) => {
  const columns = useMemo<ColumnDef<MatchWinCombination>[]>(
    () => [
      {
        accessorKey: "key",
        header: "Key",
        cell: ({ row }) => (
          <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded-md text-zinc-700 dark:text-zinc-300 font-bold uppercase tracking-wider">
            {row.original.key}
          </code>
        ),
      },
      {
        id: "pattern",
        header: "Reel Pattern",
        cell: ({ row }) => {
          const { symbol1, symbol2, symbol3, type } = row.original;
          if (type === "NO_REWARDS" || (!symbol1 && !symbol2 && !symbol3)) {
            return (
              <Badge
                variant="secondary"
                className="font-semibold text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-none rounded-lg py-0.5 px-2"
              >
                Fallback Loss
              </Badge>
            );
          }
          return (
            <div className="flex items-center gap-1.5 p-1 px-1.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl w-fit">
              {[symbol1, symbol2, symbol3].map((sym, idx) => {
                if (!sym) return null;
                return (
                  <div
                    key={idx}
                    className="p-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center w-7 h-7"
                    title={sym.label}
                  >
                    <PrizeIcon
                      iconName={sym.icon}
                      color={sym.color}
                      className="h-4 w-4"
                    />
                  </div>
                );
              })}
            </div>
          );
        },
      },
      {
        id: "reward",
        header: "Reward",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
              {row.original.type === "NO_REWARDS"
                ? "—"
                : `${row.original.value} ${
                    row.original.type === "COINS" || row.original.type === "TC"
                      ? currencyName
                      : row.original.type
                  }`}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "probability",
        header: "Odds Rate",
        cell: ({ row }) => (
          <span className="font-mono font-bold text-[11px] text-[#008060] bg-[#008060]/5 border border-[#008060]/20 rounded-md px-2 py-0.5">
            {Number(row.original.probability).toFixed(1)}%
          </span>
        ),
      },
      {
        accessorKey: "maxWins",
        header: "Limit (Cap)",
        cell: ({ row }) => (
          <span className="text-xs font-semibold text-zinc-500">
            {row.original.maxWins ? `${row.original.maxWins} wins` : "Unlimited"}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => onEdit(row.original)}
            >
              <Edit2 className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              onClick={() => onDelete(row.original.id || "")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete, currencyName],
  );

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
        <AppDataTable
          columns={columns}
          data={combinations}
          showFilter={false}
          showPagination={false}
          isShowExportButtons={false}
        />
        <div className="p-4 bg-zinc-50/50 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            Total Allocated Win Odds
          </span>
          <div
            className={cn(
              "px-3 py-1 rounded-lg font-mono font-bold text-xs ring-1 ring-inset transition-all",
              totalProbability > 100
                ? "bg-rose-50 text-rose-600 ring-rose-200"
                : "bg-[#008060]/10 text-[#008060] ring-[#008060]/20",
            )}
          >
            {totalProbability.toFixed(1)}% / 100%
          </div>
        </div>
      </div>
    </div>
  );
};
