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
  const columns = useMemo<ColumnDef<MatchWinSymbol>[]>(() => [
    {
      accessorKey: "key",
      header: "Key",
      cell: ({ row }) => (
        <code className="font-mono text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-700 font-bold uppercase tracking-wider">
          {row.original.key}
        </code>
      ),
    },
    {
      accessorKey: "icon",
      header: "Visual",
      cell: ({ row }) => (
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 w-fit shadow-sm">
          <PrizeIcon iconName={row.original.icon} color={row.original.color} />
        </div>
      ),
    },
    {
      accessorKey: "label",
      header: "Label",
      cell: ({ row }) => <span className="font-semibold text-slate-900">{row.original.label}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl hover:bg-white hover:shadow-sm"
            onClick={() => onEdit(row.original)}
          >
            <Edit2 className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </div>
      ),
    },
  ], [onEdit]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest pl-1">Game Reel Icons</h3>
      </div>
      <div className="p-1 rounded-[2.5rem] bg-slate-50 shadow-inner ring-1 ring-slate-100 overflow-hidden">
        <AppDataTable
          columns={columns}
          data={symbols}
          showFilter={false}
          showPagination={false}
          isShowExportButtons={false}
        />
      </div>
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
}

export const CombinationsTable = ({
  combinations,
  totalProbability,
  onEdit,
  onDelete,
  onAdd,
}: CombinationsTableProps) => {
  const columns = useMemo<ColumnDef<MatchWinCombination>[]>(() => [
    {
      accessorKey: "key",
      header: "Key",
      cell: ({ row }) => (
        <code className="font-mono text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-700 font-bold uppercase tracking-wider">
          {row.original.key}
        </code>
      ),
    },
    {
      id: "reward",
      header: "Reward",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">
            {row.original.value} {row.original.type}
          </span>
          <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
            Jackpot Multiplier
          </span>
        </div>
      ),
    },
    {
      accessorKey: "probability",
      header: "Win Rate",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono font-bold text-indigo-600 bg-white shadow-sm border-indigo-100 rounded-lg">
          {(row.original.probability * 100).toFixed(1)}%
        </Badge>
      ),
    },
    {
      accessorKey: "maxWins",
      header: "Limit (Cap)",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-slate-500">
          {row.original.maxWins || "∞"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl hover:bg-white hover:shadow-sm"
            onClick={() => onEdit(row.original)}
          >
            <Edit2 className="h-3.5 w-3.5 opacity-70" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl text-rose-500 hover:bg-rose-50"
            onClick={() => onDelete(row.original.id || "")}
          >
            <Trash2 className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </div>
      ),
    },
  ], [onEdit, onDelete]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2 pt-4">
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest pl-1">Win Logic Configuration</h3>
           <Button variant="outline" size="sm" onClick={onAdd} className="h-9 px-4 rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-wider text-slate-600 gap-2 hover:bg-white transition-all shadow-sm">
             <Plus className="h-3.5 w-3.5" />
             New Selection
           </Button>
      </div>
      <div className="p-1 rounded-[2.5rem] bg-slate-50 shadow-inner ring-1 ring-slate-100 overflow-hidden">
        <AppDataTable
          columns={columns}
          data={combinations}
          showFilter={false}
          showPagination={false}
          isShowExportButtons={false}
        />
        <div className="p-6 bg-white/50 border-t border-slate-100 flex items-center justify-between">
           <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-2">Accumulated Rate Pool</span>
           <div className={cn(
             "px-4 py-1.5 rounded-xl font-mono font-bold text-xs ring-1 ring-inset transition-all",
             totalProbability > 1 ? "bg-rose-50 text-rose-600 ring-rose-200/50" : "bg-emerald-50 text-emerald-600 ring-emerald-200/50 shadow-sm shadow-emerald-500/5"
           )}>
             {(totalProbability * 100).toFixed(1)}% / 100%
           </div>
        </div>
      </div>
    </div>
  );
};
