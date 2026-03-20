"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="text-lg">Game Symbols</CardTitle>
          <CardDescription>Visual reel items.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Key</TableHead>
              <TableHead>Visual</TableHead>
              <TableHead>Label</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {symbols.map((s: any) => (
              <TableRow key={s.key}>
                <TableCell className="pl-6 font-mono text-xs">
                  {s.key}
                </TableCell>
                <TableCell>
                  <div className="p-2 rounded bg-slate-50 border w-fit">
                    <PrizeIcon iconName={s.icon} color={s.color} />
                  </div>
                </TableCell>
                <TableCell>{s.label}</TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(s)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="text-lg">Prize Combinations</CardTitle>
          <CardDescription>Winning rules.</CardDescription>
        </div>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Selection
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Key</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Cap</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combinations.map((c: any) => (
              <TableRow key={c.key}>
                <TableCell className="pl-6 font-mono text-xs">
                  {c.key}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {c.value} {c.type}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {(c.probability * 100).toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{c.maxWins || "∞"}</TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(c)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(c.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-slate-50 font-bold">
              <TableCell colSpan={2} className="pl-6">
                Total Probability
              </TableCell>
              <TableCell
                colSpan={3}
                className={cn(
                  totalProbability > 1 ? "text-red-600" : "text-green-600",
                )}
              >
                {(totalProbability * 100).toFixed(1)}% / 100%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
